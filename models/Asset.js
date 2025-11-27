const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  assetName: String,
  assetType: String,
  category: String,
  quantity: Number,
  value: Number,
  purchaseDate: Date,
  description: String
});

module.exports = mongoose.model('Asset', assetSchema);