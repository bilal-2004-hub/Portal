const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getQuizByCourse, submitQuiz, getQuizAttempts, getQuizAttemptReview } = require('../controllers/quizController');

const router = express.Router();

router.use(protect);
router.get('/:courseId', getQuizByCourse);
router.post('/:courseId/submit', submitQuiz);
router.get('/:courseId/attempts', getQuizAttempts);
router.get('/:courseId/attempts/:attemptId/review', getQuizAttemptReview);

module.exports = router;
