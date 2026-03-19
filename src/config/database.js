const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    // Support common env var names.
    const uri =
      process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGODB_URL;
    if (!uri) {
      logger.error(
        'MongoDB connection error: missing Mongo URI. Set `MONGODB_URI` (preferred) or `MONGO_URI` in your .env.'
      );
      process.exit(1);
      return;
    }

    await mongoose.connect(uri);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error({ err: error }, 'MongoDB connection error');
    process.exit(1);
    return;
  }
};

module.exports = connectDB;