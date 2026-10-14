const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const generateCertificateId = require('../utils/generateCertificateId');
const handleControllerError = require('../utils/handleControllerError');

const getQuizByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({ studentId: req.user._id, courseId });

    if (!enrollment) {
      return res.status(403).json({ success: false, message: 'Only enrolled students can access the quiz.' });
    }

    const quiz = await Quiz.findOne({ courseId });
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found for this course.' });
    }

    const safeQuiz = {
      _id: quiz._id,
      courseId: quiz.courseId,
      title: quiz.title,
      passingPercentage: quiz.passingPercentage,
      questions: quiz.questions.map((question) => ({
        _id: question._id,
        question: question.question,
        options: question.options,
      })),
    };

    return res.json({ success: true, data: safeQuiz });
  } catch (error) {
    return handleControllerError(res, error, 'Unable to fetch quiz.');
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { answers } = req.body;
    const studentId = req.user._id;

    const enrollment = await Enrollment.findOne({ studentId, courseId });
    if (!enrollment) {
      return res.status(403).json({ success: false, message: 'Only enrolled students can submit the quiz.' });
    }

    const quiz = await Quiz.findOne({ courseId });
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found for this course.' });
    }

    let score = 0;
    const totalQuestions = quiz.questions.length;

    for (const question of quiz.questions) {
      const studentAnswer = answers[question._id.toString()];
      if (studentAnswer === question.correctAnswer) {
        score += 1;
      }
    }

    const percentage = Number(((score / totalQuestions) * 100).toFixed(2));
    const passed = percentage >= (quiz.passingPercentage || 70);

    const attempt = await QuizAttempt.create({
      studentId,
      courseId,
      quizId: quiz._id,
      answers,
      score,
      percentage,
      passed,
      attemptedAt: new Date(),
    });

    if (passed) {
      const existingCertificate = await Certificate.findOne({ studentId, courseId });
      if (!existingCertificate) {
        const course = await Course.findById(courseId);
        const user = await require('../models/User').findById(studentId);

        await Certificate.create({
          studentId,
          courseId,
          certificateId: generateCertificateId(),
          studentName: user.name,
          courseName: course.title,
          score: percentage,
        });
      }
    }

    const enrollmentUpdate = await Enrollment.findOne({ studentId, courseId });
    if (enrollmentUpdate) {
      enrollmentUpdate.status = passed ? 'completed' : 'in-progress';
      enrollmentUpdate.progress = passed ? 100 : Math.max(enrollmentUpdate.progress, Math.min(100, Math.round(percentage))); 
      if (passed) enrollmentUpdate.completedAt = new Date();
      await enrollmentUpdate.save();
    }

    return res.json({
      success: true,
      message: passed ? 'Congratulations! You passed the quiz.' : 'You did not pass the quiz. Please try again.',
      data: {
        attempt,
        score,
        totalQuestions,
        percentage,
        passed,
      },
    });
  } catch (error) {
    return handleControllerError(res, error, 'Unable to submit quiz.');
  }
};

const getQuizAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ studentId: req.user._id, courseId: req.params.courseId }).sort({ attemptedAt: -1 });
    return res.json({ success: true, data: attempts });
  } catch (error) {
    return handleControllerError(res, error, 'Unable to fetch quiz attempts.');
  }
};

const getQuizAttemptReview = async (req, res) => {
  try {
    const { courseId, attemptId } = req.params;
    const attempt = await QuizAttempt.findOne({
      _id: attemptId,
      courseId,
      studentId: req.user._id,
    });

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Quiz attempt not found.' });
    }

    const quiz = await Quiz.findById(attempt.quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    const incorrectQuestions = quiz.questions
      .map((question) => {
        const questionId = question._id.toString();
        const selectedAnswer = attempt.answers.get(questionId) || null;

        if (selectedAnswer === question.correctAnswer) return null;

        return {
          _id: questionId,
          question: question.question,
          options: question.options,
          selectedAnswer,
          correctAnswer: question.correctAnswer,
        };
      })
      .filter(Boolean);

    return res.json({
      success: true,
      data: {
        title: quiz.title,
        incorrectQuestions,
      },
    });
  } catch (error) {
    return handleControllerError(res, error, 'Unable to load quiz review.');
  }
};

module.exports = { getQuizByCourse, submitQuiz, getQuizAttempts, getQuizAttemptReview };
