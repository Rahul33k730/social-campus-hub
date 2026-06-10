import express from 'express';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// @route   POST /api/feedback
// @desc    Submit new feedback (Public)
router.post('/', async (req, res) => {
  const { name, email, message, rating } = req.body;

  try {
    const feedback = await Feedback.create({
      name,
      email,
      message,
      rating: rating || 5
    });
    res.status(201).json({ success: true, feedback });
  } catch (err) {
    console.error('Error submitting feedback:', err.message);
    res.status(500).json({ success: false, message: 'Server error during feedback submission' });
  }
});

// @route   GET /api/feedback
// @desc    Get all feedbacks (Admin only)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(feedbacks);
  } catch (err) {
    console.error('Error fetching feedbacks:', err.message);
    res.status(500).json({ success: false, message: 'Server error fetching feedbacks' });
  }
});

export default router;
