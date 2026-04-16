const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true,
  },
  fromBase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: true,
  },
  toBase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  transferDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Transit', 'Delivered'],
    default: 'Pending',
  },
  reason: String,
  transferredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Transfer', transferSchema);
