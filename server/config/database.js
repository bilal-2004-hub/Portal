const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const os = require('os');
const path = require('path');

let memoryServer = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log(`MongoDB already connected: ${mongoose.connection.host}`);
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_portal';

  try {
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    try {
      if (!memoryServer) {
        const dbPath = path.join(os.homedir(), '.student-portal', 'mongo-data');
        fs.mkdirSync(dbPath, { recursive: true });
        memoryServer = await MongoMemoryServer.create({ instance: { dbPath } });
      }
      const memoryUri = memoryServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`MongoDB Connected (in-memory): ${conn.connection.host}`);
      return conn;
    } catch (memoryError) {
      console.error('MongoDB connection error:', error.message);
      console.error('Fallback memory database error:', memoryError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
