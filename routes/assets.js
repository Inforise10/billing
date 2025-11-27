const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');

// Get all assets
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find().sort({ purchaseDate: -1 });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create asset
router.post('/', async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    
    res.status(201).json(asset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update asset
router.put('/:id', async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(asset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete asset
router.delete('/:id', async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;