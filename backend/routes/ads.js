import express from 'express';
import Ad from '../models/Ad.js';

const router = express.Router();

// @route   POST /api/ads
// @desc    Create a new ad (Admin only)
router.post('/', async (req, res) => {
  const { title, type, content_url } = req.body;

  try {
    const ad = await Ad.create({
      title,
      type,
      content_url,
      is_active: true
    });
    res.status(201).json({ success: true, ad });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error during ad creation' });
  }
});

// @route   GET /api/ads/active
// @desc    Get all active ads for display
router.get('/active', async (req, res) => {
  try {
    const ads = await Ad.findAll({
      where: { is_active: true },
      order: [['createdAt', 'DESC']]
    });
    res.json(ads);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error fetching active ads' });
  }
});

// @route   GET /api/ads
// @desc    Get all ads (for Admin management)
router.get('/', async (req, res) => {
  try {
    const ads = await Ad.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(ads);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error fetching ads' });
  }
});

// @route   DELETE /api/ads/:id
// @desc    Delete an ad (Admin only)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const ad = await Ad.findByPk(id);
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Ad not found' });
    }
    await ad.destroy();
    res.json({ success: true, message: 'Ad deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error during ad deletion' });
  }
});

// @route   PUT /api/ads/:id/toggle
// @desc    Toggle ad active status
router.put('/:id/toggle', async (req, res) => {
  const { id } = req.params;
  try {
    const ad = await Ad.findByPk(id);
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Ad not found' });
    }
    ad.is_active = !ad.is_active;
    await ad.save();
    res.json({ success: true, ad });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error toggling ad status' });
  }
});

export default router;
