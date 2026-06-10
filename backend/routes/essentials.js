import express from 'express';
import EssentialService from '../models/EssentialService.js';
import ServiceFeedback from '../models/ServiceFeedback.js';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await EssentialService.findAll();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Admin: Add new service
router.post('/', async (req, res) => {
  const { name, category, description, phone, location, timing, deliveryTime } = req.body;
  try {
    const newService = await EssentialService.create({
      name, category, description, phone, location, timing, deliveryTime
    });
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ message: 'Error creating service' });
  }
});

// Admin: Delete service
router.delete('/:id', async (req, res) => {
  try {
    await EssentialService.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting service' });
  }
});

// Submit feedback
router.post('/feedback', async (req, res) => {
  const { user_id, user_name, service_name, rating, comment } = req.body;
  try {
    const feedback = await ServiceFeedback.create({
      user_id, user_name, service_name, rating, comment
    });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Error submitting feedback' });
  }
});

// Get all feedbacks (Admin)
router.get('/feedback', async (req, res) => {
  try {
    const feedbacks = await ServiceFeedback.findAll({ order: [['createdAt', 'DESC']] });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
