const express = require('express');
const Assignment = require('../models/Assignment');
const Asset = require('../models/Asset');
const logger = require('../config/logger');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all assignments
router.get('/', auth, async (req, res) => {
  try {
    const { base, status } = req.query;
    
    let query = {};
    if (base) query.base = base;
    if (status) query.status = status;

    const assignments = await Assignment.find(query)
      .populate('asset')
      .populate('base')
      .populate('recordedBy', 'name email');

    logger.debug('Assignments retrieved', { count: assignments.length });
    res.json(assignments);
  } catch (error) {
    logger.error('Error retrieving assignments', { error: error.message });
    res.status(500).json({ message: error.message });
  }
});

// Create a new assignment
router.post('/', auth, authorize('Admin', 'Base Commander', 'Logistics Officer'), async (req, res) => {
  try {
    const { asset, base, assignedTo, quantity } = req.body;

    // Validate asset availability
    const assetDoc = await Asset.findById(asset);
    const available = assetDoc.closingBalance - assetDoc.assigned;
    
    if (available < quantity) {
      logger.warn('Assignment attempted with insufficient balance', {
        assetId: asset,
        available,
        requested: quantity,
      });
      return res.status(400).json({ message: 'Insufficient available assets' });
    }

    const assignment = new Assignment({
      asset,
      base,
      assignedTo,
      quantity,
      recordedBy: req.user.id,
      status: 'Assigned',
    });

    await assignment.save();

    // Update asset assigned count
    assetDoc.assigned += quantity;
    await assetDoc.save();

    logger.audit('Asset assigned', {
      assignmentId: assignment._id,
      assetId: asset,
      quantity,
      assignedTo: assignedTo.name,
    });

    res.status(201).json(assignment);
  } catch (error) {
    logger.error('Error creating assignment', { error: error.message });
    res.status(500).json({ message: error.message });
  }
});

// Record expenditure
router.put('/:id/expend', auth, authorize('Admin', 'Base Commander'), async (req, res) => {
  try {
    const { expendedQuantity } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (expendedQuantity > assignment.quantity) {
      logger.warn('Expenditure exceeds assigned quantity', {
        assignmentId: req.params.id,
        assigned: assignment.quantity,
        expenditure: expendedQuantity,
      });
      return res.status(400).json({ message: 'Expenditure exceeds assigned quantity' });
    }

    assignment.expendedQuantity = expendedQuantity;
    assignment.expendedDate = new Date();
    assignment.status = expendedQuantity === assignment.quantity ? 'Expended' : 'Assigned';
    await assignment.save();

    // Update asset expended count
    const asset = await Asset.findById(assignment.asset);
    asset.expended += expendedQuantity;
    await asset.save();

    logger.audit('Asset expenditure recorded', {
      assignmentId: req.params.id,
      expendedQuantity,
    });

    res.json(assignment);
  } catch (error) {
    logger.error('Error recording expenditure', { error: error.message });
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
