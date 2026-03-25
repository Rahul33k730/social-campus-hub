import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Routes
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import noticeRoutes from './routes/notices.js';
import adminRoutes from './routes/admin.js';
import eventRoutes from './routes/events.js';
import adRoutes from './routes/ads.js';
import printingRoutes from './routes/printing.js';
import helpdeskRoutes from './routes/helpdesk.js';
import feedbackRoutes from './routes/feedback.js';
import sequelize from './config/database.js';
import Visitor from './models/Visitor.js';
import Admin from './models/Admin.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Socket.io for Video Call Matching
let waitingUsers = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('find_match', (userData) => {
    console.log('User searching for match:', socket.id);
    
    // Remove if already in queue
    waitingUsers = waitingUsers.filter(u => u.id !== socket.id);

    if (waitingUsers.length > 0) {
      // Match found
      const partner = waitingUsers.shift();
      console.log(`Matching ${socket.id} with ${partner.id}`);

      // Notify both users
      io.to(socket.id).emit('match_found', { 
        partnerId: partner.id, 
        partnerData: partner.data,
        initiator: true 
      });
      io.to(partner.id).emit('match_found', { 
        partnerId: socket.id, 
        partnerData: userData,
        initiator: false 
      });
    } else {
      // Add to queue
      waitingUsers.push({ id: socket.id, data: userData });
    }
  });

  socket.on('signal', ({ to, signal }) => {
    io.to(to).emit('signal', { from: socket.id, signal });
  });

  socket.on('end_call', ({ to }) => {
    io.to(to).emit('call_ended');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    waitingUsers = waitingUsers.filter(u => u.id !== socket.id);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

const isProduction = process.env.NODE_ENV === 'production';

// Connect to database and sync
sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL Connected');
    return sequelize.sync({ alter: isProduction });
  })
  .then(async () => {
    console.log('✅ Database Synced');
    
    // Auto-create Admin for Production/First Run
    try {
      const adminCount = await Admin.count();
      if (adminCount === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await Admin.create({
          username: 'admin',
          password: hashedPassword,
          full_name: 'System Admin',
          email: 'admin@pcu.edu'
        });
        console.log('🎁 Initial Admin Account Created: username: admin, password: admin123');
      }
    } catch (adminErr) {
      console.error('Error creating initial admin:', adminErr);
    }
  })
  .catch(err => {
    console.error('❌ Database Connection Error:', err);
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/printing', printingRoutes);
app.use('/api/helpdesk', helpdeskRoutes);
app.use('/api/feedback', feedbackRoutes);

// Visitor Tracking Route
app.get('/api/visitor/increment', async (req, res) => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = await Visitor.create({ count: 1 });
    } else {
      visitor.count += 1;
      await visitor.save();
    }
    res.json({ success: true, count: visitor.count });
  } catch (err) {
    console.error('Error incrementing visitor count:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/visitor/count', async (req, res) => {
  try {
    const visitor = await Visitor.findOne();
    res.json({ success: true, count: visitor ? visitor.count : 0 });
  } catch (err) {
    console.error('Error getting visitor count:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('PCU Campus Hub API is Running...');
  });
}

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
