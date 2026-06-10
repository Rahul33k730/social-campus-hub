import express from 'express';
import HelpdeskTicket from '../models/HelpdeskTicket.js';
import User from '../models/User.js';

const router = express.Router();

// @route   POST /api/helpdesk
// @desc    Submit a new helpdesk ticket (Any logged-in user)
router.post('/', async (req, res) => {
  const { subject, description, category, priority, user_id } = req.body;

  try {
    const ticket = await HelpdeskTicket.create({
      subject,
      description,
      category: category || 'Other',
      priority: priority || 'medium',
      user_id,
      status: 'open'
    });
    res.status(201).json({ success: true, ticket });
  } catch (err) {
    console.error('Error submitting helpdesk ticket:', err.message);
    res.status(500).json({ success: false, message: 'Server error during ticket submission' });
  }
});

// @route   GET /api/helpdesk/my/:user_id
// @desc    Get all tickets submitted by a specific user
router.get('/my/:user_id', async (req, res) => {
  try {
    const tickets = await HelpdeskTicket.findAll({
      where: { user_id: req.params.user_id },
      order: [['createdAt', 'DESC']]
    });
    res.json(tickets);
  } catch (err) {
    console.error('Error fetching user tickets:', err.message);
    res.status(500).json({ success: false, message: 'Server error fetching your tickets' });
  }
});

// @route   GET /api/helpdesk
// @desc    Get all helpdesk tickets (Admin/Shopkeeper)
router.get('/', async (req, res) => {
  try {
    const tickets = await HelpdeskTicket.findAll({
      include: [{ 
        model: User, 
        attributes: ['full_name', 'username', 'role'] 
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(tickets);
  } catch (err) {
    console.error('Error fetching all helpdesk tickets:', err.message);
    res.status(500).json({ success: false, message: 'Server error fetching all tickets' });
  }
});

// @route   PUT /api/helpdesk/:id
// @desc    Update ticket status or add response (Admin/Shopkeeper)
router.put('/:id', async (req, res) => {
  const { status, response, priority } = req.body;
  const { id } = req.params;

  try {
    const ticket = await HelpdeskTicket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    if (status) ticket.status = status;
    if (response) ticket.response = response;
    if (priority) ticket.priority = priority;
    
    await ticket.save();
    res.json({ success: true, ticket });
  } catch (err) {
    console.error('Error updating helpdesk ticket:', err.message);
    res.status(500).json({ success: false, message: 'Server error updating ticket' });
  }
});

export default router;
