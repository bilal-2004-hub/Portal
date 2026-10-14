const Course = require('../models/Course');

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: courses });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch courses.' });
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
    return res.status(500).json({ success: false, message: 'Unable to fetch course.' });
  }
};

module.exports = { getCourses, getCourseById };
