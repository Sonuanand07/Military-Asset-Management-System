require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const logger = require('./config/logger');

// Import routes
const authRoutes = require('./routes/auth');
const purchasesRoutes = require('./routes/purchases');
const transfersRoutes = require('./routes/transfers');
const assignmentsRoutes = require('./routes/assignments');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true,
}));

// Body parser middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Logging middleware
app.use(morgan('combined'));

// Enhanced health check endpoint - checks MongoDB status
app.get('/api/health', async (req, res) => {
  try {
    const mongoose = await import('mongoose');
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({ 
      status: 'OK',
      mongodb: dbStatus,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR',
      mongodb: 'unavailable',
      error: error.message 
    });
  }
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/transfers', transfersRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  logger.warn('Route not found', { url: req.url, method: req.method });
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const startServer = () => {
  const PORT = process.env.PORT || 5000;
  
  // Start server first
  const server = app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`, { environment: process.env.NODE_ENV });
    console.log(`✓ Server is running on http://localhost:${PORT}`);
    console.log('🔄 Attempting MongoDB connection (background)...');
  });

  // Connect to MongoDB in background (non-blocking)
  connectDB().catch((error) => {
    logger.error(`Background MongoDB connection failed: ${error.message}`);
    console.error('⚠️ MongoDB connection failed - API endpoints requiring DB will fail');
    // Don't exit - server stays running for health checks
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, closing server');
    server.close(() => {
      process.exit(0);
    });
  });
};

startServer();

