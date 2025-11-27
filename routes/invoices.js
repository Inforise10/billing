const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// Generate human-readable invoice number in format FV/YY-YY/NNN
async function generateInvoiceNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  let fy;
  if (month >= 4) {
    fy = `${year % 100}-${(year + 1) % 100}`;
  } else {
    fy = `${(year - 1) % 100}-${year % 100}`;
  }
  const regex = new RegExp(`^FV/${fy}/`);
  const count = await Invoice.countDocuments({ invoiceNumber: regex });
  return `FV/${fy}/${String(count + 1).padStart(3, '0')}`;
}

// GET all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE invoice
router.post('/', async (req, res) => {
  try {
    const invoiceData = req.body;

    // Ensure totalAmount is calculated
    const taxable = parseFloat(invoiceData.taxable) || 0;
    const cgst = parseFloat(invoiceData.cgst) || 0;
    const sgst = parseFloat(invoiceData.sgst) || 0;
    const roundOff = parseFloat(invoiceData.roundOff) || 0;
    invoiceData.totalAmount = taxable + cgst + sgst + roundOff;

    // Generate invoice number
    invoiceData.invoiceNumber = await generateInvoiceNumber();

    const invoice = new Invoice(invoiceData);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(400).json({ message: error.message });
  }
});

// UPDATE invoice
router.put('/:id', async (req, res) => {
  try {
    const invoiceData = req.body;

    // Recalculate totalAmount
    const taxable = parseFloat(invoiceData.taxable) || 0;
    const cgst = parseFloat(invoiceData.cgst) || 0;
    const sgst = parseFloat(invoiceData.sgst) || 0;
    const roundOff = parseFloat(invoiceData.roundOff) || 0;
    invoiceData.totalAmount = taxable + cgst + sgst + roundOff;

    const invoice = await Invoice.findByIdAndUpdate(req.params.id, invoiceData, { new: true });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE invoice
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;