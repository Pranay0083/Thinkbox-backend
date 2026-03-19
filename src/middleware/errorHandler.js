const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars -- Express requires 4 params for error middleware
const errorHandler = (err, req, res, next) => {
  logger.error({ err }, 'Unhandled error');

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation failed' });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  res.status(500).json({ message: 'Something went wrong on the server' });
};

module.exports = errorHandler;
