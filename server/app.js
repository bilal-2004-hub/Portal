const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const quizRoutes = require('./routes/quizRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
app.set('trust proxy', 1);
const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

const allowedOrigins = [...new Set([...configuredOrigins, ...defaultOrigins])];

app.use(helmet());
app.use(express.json());
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.trim().replace(/\/+$/, '');

    if (
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(async (req, res, next) => {
  try {
    await connectDB();
    return next();
  } catch (error) {
    console.error('Database connection failed:', error.message || error);
    return res.status(503).json({
      success: false,
      message: 'Database is unavailable. Check the backend database configuration.',
    });
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/certificates', certificateRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Student Portal API is running.',
    health: '/api/health',
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Student Portal server is running.', database: 'connected' });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;