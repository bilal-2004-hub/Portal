const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getCourses, getCourseById } = require('../controllers/courseController');

const router = express.Router();

router.get('/', protect, getCourses);
router.get('/:id', protect, getCourseById);

module.exports = router;
