const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true,
  },
  base: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitCost: {
    type: Number,
    required: true,
    min: 0,
  },
  totalCost: {
    type: Number,
    default: 0,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  vendor: String,
  reference: String,
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Calculate total cost before saving
purchaseSchema.pre('save', function(next) {
  this.totalCost = this.quantity * this.unitCost;
  next();
});

module.exports = mongoose.model('Purchase', purchaseSchema);
