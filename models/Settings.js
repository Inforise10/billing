const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  companyName: { type: String, default: 'E I O Digital Solutions Private Limited' },
  address: { type: String, default: '1A/1-G9 Wavoo Centre, Madurai Road, Tirunelveli-627001' },
  contact: { type: String, default: 'Phone: +91 9840624407, +91 9444224407\nEmail: myeiokln@gmail.com\nWebsite: https.myeio.in' },
  gstin: { type: String, default: '33AAICE8622R1Z2' },
  // bankDetails: { type: String, default: 'Axis Bank\nBranch: Thodupuzha\nA/C No: 912020047678945\nIFSC Code: UTIB0000854' },
  logo: { type: String, default: '' }   // <-- will hold base64 string
});

module.exports = mongoose.model('Settings', settingsSchema);