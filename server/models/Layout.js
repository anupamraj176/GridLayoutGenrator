const mongoose = require('mongoose');

const LayoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  config: { type: Object, required: true }, // Stores rows, cols, gaps, areas
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Layout', LayoutSchema);