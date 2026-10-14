require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Certificate = require('../models/Certificate');

const models = [User, Course, Enrollment, Quiz, QuizAttempt, Certificate];

const initializeDatabase = async () => {
  await connectDB();
  for (const model of models) {
    await model.init();
  }
  console.log(`MongoDB indexes ready for: ${models.map((model) => model.collection.name).join(', ')}`);
};

initializeDatabase()
  .catch((error) => {
    console.error('Database initialization failed:', error.name);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());