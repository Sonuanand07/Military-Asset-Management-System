const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Vehicle', 'Weapon', 'Ammunition', 'Equipment', 'Other'],
    required: true,
  },
  base: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: true,
  },
  openingBalance: {
    type: Number,
    default: 0,
    min: 0,
  },
  closingBalance: {
    type: Number,
    default: 0,
    min: 0,
  },
  assigned: {
    type: Number,
    default: 0,
    min: 0,
  },
  expended: {
    type: Number,
    default: 0,
    min: 0,
  },
  unitCost: {
    type: Number,
    default: 0,
  },
  description: String,
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Calculate net movement
assetSchema.methods.getNetMovement = function() {
  return this.closingBalance - this.openingBalance;
};

module.exports = mongoose.model('Asset', assetSchema);
