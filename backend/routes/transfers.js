const express = require('express');
const Transfer = require('../models/Transfer');
const Asset = require('../models/Asset');
const logger = require('../config/logger');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all transfers
router.get('/', auth, async (req, res) => {
  try {
    const { fromBase, toBase, status, startDate, endDate } = req.query;
    
    let query = {};
    if (fromBase) query.fromBase = fromBase;
    if (toBase) query.toBase = toBase;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.transferDate = {};
      if (startDate) query.transferDate.$gte = new Date(startDate);
      if (endDate) query.transferDate.$lte = new Date(endDate);
    }

    const transfers = await Transfer.find(query)
      .populate('asset')
      .populate('fromBase')
      .populate('toBase')
      .populate('transferredBy', 'name email');

    logger.debug('Transfers retrieved', { count: transfers.length });
    res.json(transfers);
  } catch (error) {
    logger.error('Error retrieving transfers', { error: error.message });
    res.status(500).json({ message: error.message });
  }
});

// Create a new transfer
router.post('/', auth, authorize('Admin', 'Logistics Officer'), async (req, res) => {
  try {
    const { asset, fromBase, toBase, quantity, reason } = req.body;

    // Validate sufficient balance
    const assetDoc = await Asset.findById(asset);
    if (assetDoc.closingBalance < quantity) {
      logger.warn('Transfer attempted with insufficient balance', {
        assetId: asset,
        available: assetDoc.closingBalance,
        requested: quantity,
      });
      return res.status(400).json({ message: 'Insufficient asset balance' });
    }

    const transfer = new Transfer({
      asset,
      fromBase,
      toBase,
      quantity,
      reason,
      transferredBy: req.user.id,
      status: 'Pending',
    });

    await transfer.save();

    logger.audit('Transfer initiated', {
      transferId: transfer._id,
      assetId: asset,
      quantity,
      fromBase,
      toBase,
    });

    res.status(201).json(transfer);
  } catch (error) {
    logger.error('Error creating transfer', { error: error.message });
    res.status(500).json({ message: error.message });
  }
});

// Update transfer status
router.put('/:id', auth, authorize('Admin', 'Logistics Officer'), async (req, res) => {
  try {
    const { status } = req.body;
    const transfer = await Transfer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    logger.audit('Transfer status updated', {
      transferId: req.params.id,
      newStatus: status,
    });

    res.json(transfer);
  } catch (error) {
    logger.error('Error updating transfer', { error: error.message });
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
