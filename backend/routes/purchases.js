const express = require('express');
const Purchase = require('../models/Purchase');
const Asset = require('../models/Asset');
const logger = require('../config/logger');
const { auth, authorize, baseAccess } = require('../middleware/auth');

const router = express.Router();

// Get all purchases with filters
router.get('/', auth, async (req, res) => {
  try {
    const { base, startDate, endDate, assetType } = req.query;
    
    let query = {};
    
    if (base) query.base = base;
    if (startDate || endDate) {
      query.purchaseDate = {};
      if (startDate) query.purchaseDate.$gte = new Date(startDate);
      if (endDate) query.purchaseDate.$lte = new Date(endDate);
    }

    let purchases = await Purchase.find(query)
      .populate('asset')
      .populate('base')
      .populate('recordedBy', 'name email');

    if (assetType) {
      purchases = purchases.filter(p => p.asset.type === assetType);
    }

    logger.debug('Purchases retrieved', { count: purchases.length, userId: req.user.id });
    res.json(purchases);
  } catch (error) {
    logger.error('Error retrieving purchases', { error: error.message });
    res.status(500).json({ message: error.message });
  }
});

// Record a new purchase
router.post('/', auth, authorize('Admin', 'Logistics Officer'), async (req, res) => {
  try {
    const { asset, base, quantity, unitCost, vendor, reference } = req.body;

    const purchase = new Purchase({
      asset,
      base,
      quantity,
      unitCost,
      vendor,
      reference,
      recordedBy: req.user.id,
    });

    await purchase.save();

    // Update asset closing balance
    const assetDoc = await Asset.findById(asset);
    assetDoc.closingBalance += quantity;
    await assetDoc.save();

    logger.audit('Purchase recorded', {
      purchaseId: purchase._id,
      assetId: asset,
      quantity,
      userId: req.user.id,
    });

    res.status(201).json(purchase);
  } catch (error) {
    logger.error('Error recording purchase', { error: error.message });
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
