const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true,
  },
  assignedTo: {
    name: String,
    rank: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  assignmentDate: {
    type: Date,
    default: Date.now,
  },
  base: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: true,
  },
  status: {
    type: String,
    enum: ['Assigned', 'Expended', 'Returned'],
    default: 'Assigned',
  },
  expendedQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  expendedDate: Date,
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
