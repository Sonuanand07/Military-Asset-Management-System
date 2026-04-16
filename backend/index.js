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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
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

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`, { environment: process.env.NODE_ENV });
      console.log(`✓ Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

