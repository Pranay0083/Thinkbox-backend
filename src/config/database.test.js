jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

const mongoose = require('mongoose');
const logger = require('../utils/logger');
const connectDB = require('./database');

describe('connectDB', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    delete process.env.MONGODB_URI;
    delete process.env.MONGO_URI;
    delete process.env.MONGODB_URL;
  });

  test('exits when Mongo URI is missing', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    await connectDB();

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(mongoose.connect).not.toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
  });

  test('connects using MONGODB_URI', async () => {
    process.env.MONGODB_URI = 'mongodb://example-uri';
    mongoose.connect.mockResolvedValueOnce({});

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://example-uri');
    expect(logger.info).toHaveBeenCalledWith('MongoDB connected');
  });

  test('connects using fallback MONGO_URI', async () => {
    process.env.MONGO_URI = 'mongodb://fallback-uri';
    mongoose.connect.mockResolvedValueOnce({});

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://fallback-uri');
    expect(logger.info).toHaveBeenCalledWith('MongoDB connected');
  });

  test('logs error and exits when mongoose.connect fails', async () => {
    process.env.MONGODB_URI = 'mongodb://example-uri';
    const testError = new Error('boom');
    mongoose.connect.mockRejectedValueOnce(testError);

    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    await connectDB();

    expect(logger.error).toHaveBeenCalledWith({ err: testError }, 'MongoDB connection error');
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
  });
});

