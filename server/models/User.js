const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['student'],
      default: 'student',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
