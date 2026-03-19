const pino = require('pino');

// Keep logging consistent across the app.
// In non-production environments we pretty-print for readability.
const isProd = process.env.NODE_ENV === 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: isProd
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
        },
      },
});

module.exports = logger;

