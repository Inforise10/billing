const mongoose = require('mongoose');

const quotationItemSchema = new mongoose.Schema({
  item: String,
  itemCode: String,
  qty: Number,
  price: Number,
  disc: Number,
  gst: Number,
  amount: Number
});

const quotationSchema = new mongoose.Schema({
  quotationNumber: { type: String, required: true, unique: true },
  quotationDate: { type: Date, default: Date.now },
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
  items: [quotationItemSchema],
  paymentMode: String,
  taxable: Number,
  cgst: Number,
  sgst: Number,
  roundOff: Number,
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  clientName: String,
  clientEmail: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quotation', quotationSchema);