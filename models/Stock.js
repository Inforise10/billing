const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  productName: String,
  productCode: String,
  category: String,
  quantity: Number,
  price: Number,
  description: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Stock', stockSchema);