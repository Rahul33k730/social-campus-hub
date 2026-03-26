import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pcu_secret_key_2024';

// @route   POST /api/auth/register
// @desc    Register a new user (Student/Faculty/Admin)
router.post('/register', async (req, res) => {
  const { full_name, username, email, password, role, branch, student_code, year } = req.body;

  try {
    // Check if registration is allowed for this role
    if (role === 'admin' || role === 'shopkeeper') {
      return res.status(403).json({ success: false, message: `${role} registration is disabled` });
    }

    // Validate student email
    if (role === 'student' && !email.endsWith('@pcu.edu.in')) {
      return res.status(400).json({ success: false, message: 'Invalid email. Please use your official college email ending with @pcu.edu.in' });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    // Check if user already exists
    let user = await User.findOne({ where: { username } });
    if (user) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    user = await User.create({
      full_name,
      username,
      email,
      password: hashedPassword,
      role,
      branch: branch || 'CSE',
      status: 'active'
    });

    // If role is student, create student profile
    if (role === 'student') {
      await Student.create({
        user_id: user.user_id,
        student_code: student_code || `STU${Date.now()}`,
        year: year || 1,
        attendance_percent: 100
      });
    }

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Special check for Admin role
    if (role === 'admin') {
      const ADMIN_ID = 'radhaharekrishna33@gmail.com';
      const ADMIN_PASS = 'Rahul986718';

      if (username !== ADMIN_ID || password !== ADMIN_PASS) {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
      }

      // Find or create the admin user in the database to ensure we have a record
      let user = await User.findOne({ where: { username: ADMIN_ID, role: 'admin' } });
      
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_PASS, salt);
        user = await User.create({
          full_name: 'System Admin',
          username: ADMIN_ID,
          password: hashedPassword,
          role: 'admin',
          branch: 'Admin',
          status: 'active'
        });
      }

      // Create JWT for Admin
      const payload = {
        user: {
          id: user.user_id,
          role: user.role,
          username: user.username,
          full_name: user.full_name
        }
      };

      return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token,
          user: {
            id: user.user_id,
            username: user.username,
            role: user.role,
            name: user.full_name,
            student_details: null
          }
        });
      });
    }

    // Special check for Shopkeeper role
    if (role === 'shopkeeper') {
      const SHOPKEEPER_ID = 'shopkeeper@pcu.edu.in';
      const SHOPKEEPER_PASS = 'Shopkeeper123';

      if (username !== SHOPKEEPER_ID || password !== SHOPKEEPER_PASS) {
        return res.status(401).json({ success: false, message: 'Invalid shopkeeper credentials' });
      }

      // Find or create the shopkeeper user in the database
      let user = await User.findOne({ where: { username: SHOPKEEPER_ID, role: 'shopkeeper' } });
      
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(SHOPKEEPER_PASS, salt);
        user = await User.create({
          full_name: 'PCU Shopkeeper',
          username: SHOPKEEPER_ID,
          password: hashedPassword,
          role: 'shopkeeper',
          branch: 'Printing',
          status: 'active'
        });
      }

      // Create JWT for Shopkeeper
      const payload = {
        user: {
          id: user.user_id,
          role: user.role,
          username: user.username,
          full_name: user.full_name
        }
      };

      return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token,
          user: {
            id: user.user_id,
            username: user.username,
            role: user.role,
            name: user.full_name,
            student_details: null
          }
        });
      });
    }

    // Check user for other roles
    let user;
    if (role === 'student') {
      // For students, login by email (official ID)
      if (!username.endsWith('@pcu.edu.in')) {
        return res.status(400).json({ success: false, message: 'Students must login with their @pcu.edu.in email' });
      }
      user = await User.findOne({ where: { email: username, role: 'student' }, include: [Student] });
    } else {
      user = await User.findOne({ 
        where: { username, role }
      });
    }

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials or role' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Create JWT
    const payload = {
      user: {
        id: user.user_id,
        role: user.role,
        username: user.username,
        full_name: user.full_name
      }
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({
        success: true,
        token,
        user: {
          id: user.user_id,
          username: user.username,
          role: user.role,
          name: user.full_name,
          student_details: user.Student || null
        }
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Request a password reset link (mock)
router.post('/forgot-password', async (req, res) => {
  const { email, role } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email, role } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    // In a real application, you would send a reset token to the email
    // For now, we will return a success message
    res.json({ success: true, message: 'Password reset instructions have been sent to your email.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error during forgot password request' });
  }
});

export default router;
