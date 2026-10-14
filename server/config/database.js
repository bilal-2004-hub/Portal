const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required');
  }

  connectionPromise = mongoose.connect(mongoUri, {
    dbName: 'student_portal',
    serverSelectionTimeoutMS: 10000,
  });

  try {
    return await connectionPromise;
  } finally {
    connectionPromise = null;
  }
};

module.exports = connectDB;
