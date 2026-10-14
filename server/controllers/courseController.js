const Course = require('../models/Course');
const handleControllerError = require('../utils/handleControllerError');

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: courses });
  } catch (error) {
    return handleControllerError(res, error, 'Unable to fetch courses.');
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    return res.json({ success: true, data: course });
  } catch (error) {
    return handleControllerError(res, error, 'Unable to fetch course.');
  }
};

module.exports = { getCourses, getCourseById };
