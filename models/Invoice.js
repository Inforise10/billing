const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  item: String,
  itemCode: String,
  qty: Number,
  price: Number,
  disc: Number,
  gst: Number,
  amount: Number
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  invoiceDate: { type: Date, default: Date.now },
  companyInfo: {
    name: String,
    address: String,
    contact: String,
    logo: String,
    gstin: String,
    bankDetails: String
  },
  billTo: String,
  billToGSTIN: String,
  shipTo: String,
  shipToGSTIN: String,
  poNo: String,
  modeOfTransport: String,
  items: [invoiceItemSchema],
  paymentMode: String,
  taxable: Number,
  cgst: Number,
  sgst: Number,
  roundOff: Number,
  totalAmount: { type: Number, required: true },   // <-- THIS IS THE KEY
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', invoiceSchema);