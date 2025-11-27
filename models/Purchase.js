const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  purchaseDate: Date,
  productName: String,
  quantity: Number,
  price: Number,
  supplier: String,
  totalAmount: Number,
  category: String
});

module.exports = mongoose.model('Purchase', purchaseSchema);