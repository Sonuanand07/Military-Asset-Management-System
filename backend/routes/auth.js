const express = require('express');
const User = require('../models/User');
const logger = require('../config/logger');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, base } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      logger.warn('Registration attempt with existing email', { email });
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ name, email, password, role, base });
    await user.save();

    logger.audit('User registered', { userId: user._id, email, role });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    logger.error('Registration error', { error: error.message });
    res.status(500).json({ message: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      logger.warn('Login attempt with non-existent email', { email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      logger.warn('Login attempt with wrong password', { email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, base: user.base },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.audit('User logged in', { userId: user._id, email, role: user.role });
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        base: user.base,
      },
    });
  } catch (error) {
    logger.error('Login error', { error: error.message });
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

