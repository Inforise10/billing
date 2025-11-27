const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');

// Get all purchases
router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ purchaseDate: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create purchase
router.post('/', async (req, res) => {
  try {
    const purchaseData = req.body;
    purchaseData.totalAmount = purchaseData.quantity * purchaseData.price;
    
    const purchase = new Purchase(purchaseData);
    await purchase.save();
    
    res.status(201).json(purchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update purchase
router.put('/:id', async (req, res) => {
  try {
    if (req.body.quantity && req.body.price) {
      req.body.totalAmount = req.body.quantity * req.body.price;
    }
    
    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(purchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete purchase
router.delete('/:id', async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;