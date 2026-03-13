const express = require('express');
const router = express.Router();
const Quotation = require('../models/Quotation');

// Generate human-readable quotation number in format QT/YY-YY/NNN
// Generate human-readable quotation number in format QT/YY-YY/NNN
async function generateQuotationNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  let fy;
  if (month >= 4) {
    fy = `${year % 100}-${(year + 1) % 100}`;
  } else {
    fy = `${(year - 1) % 100}-${year % 100}`;
  }
  
  // Find the highest existing number for this financial year
  const regex = new RegExp(`^QT/${fy}/`);
  const lastQuotation = await Quotation.findOne({ 
    quotationNumber: regex 
  }).sort({ quotationNumber: -1 });
  
  let nextNumber = 1;
  if (lastQuotation) {
    // Extract the number part and increment
    const lastNum = parseInt(lastQuotation.quotationNumber.split('/').pop());
    nextNumber = lastNum + 1;
  }
  
  // Pad with zeros to ensure 3 digits
  const paddedNumber = String(nextNumber).padStart(3, '0');
  return `QT/${fy}/${paddedNumber}`;
}

// GET all quotations
router.get('/', async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE quotation
router.post('/', async (req, res) => {
  try {
    const quotationData = req.body;

    // Ensure totalAmount is calculated
    const taxable = parseFloat(quotationData.taxable) || 0;
    const cgst = parseFloat(quotationData.cgst) || 0;
    const sgst = parseFloat(quotationData.sgst) || 0;
    const roundOff = parseFloat(quotationData.roundOff) || 0;
    quotationData.totalAmount = taxable + cgst + sgst + roundOff;

    // Generate quotation number
    quotationData.quotationNumber = await generateQuotationNumber();

    const quotation = new Quotation(quotationData);
    await quotation.save();
    res.status(201).json(quotation);
  } catch (error) {
    console.error('Create quotation error:', error);
    res.status(400).json({ message: error.message });
  }
});

// UPDATE quotation
router.put('/:id', async (req, res) => {
  try {
    const quotationData = req.body;

    // Recalculate totalAmount
    const taxable = parseFloat(quotationData.taxable) || 0;
    const cgst = parseFloat(quotationData.cgst) || 0;
    const sgst = parseFloat(quotationData.sgst) || 0;
    const roundOff = parseFloat(quotationData.roundOff) || 0;
    quotationData.totalAmount = taxable + cgst + sgst + roundOff;

    const quotation = await Quotation.findByIdAndUpdate(req.params.id, quotationData, { new: true });
    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });
    res.json(quotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE quotation
router.delete('/:id', async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });
    res.json({ message: 'Quotation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;