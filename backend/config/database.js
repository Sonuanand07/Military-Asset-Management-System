const mongoose = require('mongoose');
const logger = require('./logger');

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  const maxRetries = 5;
  const retryDelay = 5000; // 5 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
      });
      
      cachedConnection = conn;
      logger.info(`MongoDB Connected: ${conn.connection.host} (attempt ${attempt})`);
      console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      logger.error(`MongoDB connection attempt ${attempt} failed: ${error.message}`);
      console.error(`MongoDB attempt ${attempt}/${maxRetries} failed: ${error.message}`);
      
      if (attempt === maxRetries) {
        logger.error('Max retries reached. Exiting.');
        console.error('❌ MongoDB connection failed after all retries. Check MONGODB_URI and Atlas IP whitelist.');
        process.exit(1);
      }
      
      console.log(`Retrying in ${retryDelay/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};

module.exports = connectDB;
