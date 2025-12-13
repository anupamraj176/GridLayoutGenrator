const router = require('express').Router();
const Layout = require('../models/Layout');

// Get all layouts
router.get('/', async (req, res) => {
  try {
    const layouts = await Layout.find().sort({ createdAt: -1 });
    res.json(layouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save a layout
router.post('/', async (req, res) => {
  const layout = new Layout({
    name: req.body.name,
    config: req.body.config,
  });

  try {
    const newLayout = await layout.save();
    res.status(201).json(newLayout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;