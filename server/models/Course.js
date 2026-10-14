const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    instructor: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Core', 'Elective'],
      default: 'Core',
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    lessons: {
      type: Number,
      default: 0,
    },
    learningOutcomes: [String],
    requirements: [String],
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
