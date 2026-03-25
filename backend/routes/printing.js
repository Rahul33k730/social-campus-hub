import express from 'express';
import PrintOrder from '../models/PrintOrder.js';
import User from '../models/User.js';

const router = express.Router();

// @route   POST /api/printing
// @desc    Create a new print order (Student)
router.post('/', async (req, res) => {
  const { file_url, copies, color_type, pages, user_id } = req.body;

  try {
    // Price Calculation: ₹2 B/W, ₹10 color per page per copy
    const pricePerPage = color_type === 'Color' ? 10 : 2;
    const totalPrice = pricePerPage * pages * copies;

    const order = await PrintOrder.create({
      file_url,
      copies,
      color_type,
      pages,
      price: totalPrice,
      user_id,
      status: 'pending'
    });
    
    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error during print order' });
  }
});

// @route   GET /api/printing
// @desc    Get all print orders (Admin)
router.get('/', async (req, res) => {
  try {
    const orders = await PrintOrder.findAll({
      include: [{ model: User, as: 'user', attributes: ['full_name', 'username'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error fetching orders' });
  }
});

// @route   GET /api/printing/my/:user_id
// @desc    Get current user's print orders
router.get('/my/:user_id', async (req, res) => {
  try {
    const orders = await PrintOrder.findAll({
      where: { user_id: req.params.user_id },
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error fetching my orders' });
  }
});

// @route   PUT /api/printing/:id/status
// @desc    Update order status (Admin)
router.put('/:id/status', async (req, res) => {
  const { status } = req.body; // pending, printing, completed
  const { id } = req.params;

  try {
    const order = await PrintOrder.findByPk(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    order.status = status;
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error updating status' });
  }
});

export default router;
