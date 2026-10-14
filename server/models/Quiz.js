const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

const quizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    passingPercentage: {
      type: Number,
      default: 70,
    },
    questions: [questionSchema],
  },
  { timestamps: true }
);

quizSchema.index({ courseId: 1 }, { unique: true });

module.exports = mongoose.model('Quiz', quizSchema);
