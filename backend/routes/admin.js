import express from 'express';
import User from '../models/User.js';
import Student from '../models/Student.js';

const router = express.Router();

// @route   GET /api/admin/students
// @desc    Get all students
router.get('/students', async (req, res) => {
  try {
    const students = await User.findAll({
      where: { role: 'student' },
      include: [Student],
      attributes: { exclude: ['password'] }
    });
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/students/:id
// @desc    Get specific student full data
router.get('/students/:id', async (req, res) => {
  try {
    const student = await User.findOne({
      where: { user_id: req.params.id, role: 'student' },
      include: [Student],
      attributes: { exclude: ['password'] }
    });
    
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
