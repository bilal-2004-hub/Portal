const express = require('express');
const protect = require('../middleware/authMiddleware');
const { enrollInCourse, getMyCourses, getEnrollmentByCourse } = require('../controllers/enrollmentController');

const router = express.Router();

router.use(protect);
router.post('/', enrollInCourse);
router.get('/my-courses', getMyCourses);
router.get('/:courseId', getEnrollmentByCourse);

module.exports = router;
