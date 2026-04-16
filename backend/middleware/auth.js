const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      logger.warn('Unauthorized access attempt - No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    logger.debug('Token verified', { userId: decoded.id, role: decoded.role });
    next();
  } catch (error) {
    logger.error('Token verification failed', { error: error.message });
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Role-based access control middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn('Unauthorized access - Insufficient permissions', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: roles,
      });
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

// Base-specific access middleware
const baseAccess = (req, res, next) => {
  const requiredBaseId = req.params.baseId || req.body.base;
  
  if (req.user.role === 'Admin') {
    return next();
  }

  if (req.user.role === 'Base Commander' && req.user.base === requiredBaseId) {
    return next();
  }

  logger.warn('Base access denied', {
    userId: req.user.id,
    requestedBase: requiredBaseId,
    userBase: req.user.base,
  });
  
  res.status(403).json({ message: 'Access denied for this base' });
};

module.exports = {
  auth,
  authorize,
  baseAccess,
};
