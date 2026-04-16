const express = require('express');
const Asset = require('../models/Asset');
const logger = require('../config/logger');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get dashboard data
router.get('/summary', auth, async (req, res) => {
  try {
    const { base, startDate, endDate } = req.query;
    
    let query = {};
    if (base) query.base = base;

    const assets = await Asset.find(query);

    const summary = assets.map(asset => ({
      id: asset._id,
      name: asset.name,
      type: asset.type,
      openingBalance: asset.openingBalance,
      closingBalance: asset.closingBalance,
      netMovement: asset.closingBalance - asset.openingBalance,
      assigned: asset.assigned,
      expended: asset.expended,
      available: asset.closingBalance - asset.assigned,
    }));

    logger.debug('Dashboard summary retrieved', { assetCount: summary.length });
    res.json({
      summary,
      totals: {
        totalAssets: summary.length,
        totalOpeningBalance: summary.reduce((sum, a) => sum + a.openingBalance, 0),
        totalClosingBalance: summary.reduce((sum, a) => sum + a.closingBalance, 0),
        totalNetMovement: summary.reduce((sum, a) => sum + a.netMovement, 0),
        totalAssigned: summary.reduce((sum, a) => sum + a.assigned, 0),
        totalExpended: summary.reduce((sum, a) => sum + a.expended, 0),
      },
    });
  } catch (error) {
    logger.error('Error retrieving dashboard data', { error: error.message });
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
