import express from 'express';
import Event from '../models/Event.js';
import User from '../models/User.js';

const router = express.Router();

// @route   POST /api/events
// @desc    Post a new event (Student/Faculty) - default status 'pending'
router.post('/', async (req, res) => {
  const { title, description, event_date, location, user_id } = req.body;

  try {
    const event = await Event.create({
      title,
      description,
      event_date,
      location,
      posted_by: user_id,
      status: 'pending'
    });
    res.status(201).json({ success: true, event });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error during event creation' });
  }
});

// @route   GET /api/events
// @desc    Get all verified events
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { status: 'verified' },
      include: [{ model: User, as: 'author', attributes: ['full_name'] }],
      order: [['event_date', 'ASC']]
    });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error fetching verified events' });
  }
});

// @route   GET /api/events/pending
// @desc    Get all pending events (for Admin verification)
router.get('/pending', async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { status: 'pending' },
      include: [{ model: User, as: 'author', attributes: ['full_name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error fetching pending events' });
  }
});

// @route   PUT /api/events/:id/verify
// @desc    Verify or Reject an event (Admin only)
router.put('/:id/verify', async (req, res) => {
  const { status } = req.body; // status: 'verified' or 'rejected'
  const { id } = req.params;

  try {
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    event.status = status;
    await event.save();
    res.json({ success: true, event });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error verifying event' });
  }
});

export default router;
