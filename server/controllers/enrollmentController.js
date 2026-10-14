const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    const studentEnrollments = await Enrollment.find({ studentId }).populate('courseId');
    const totalCourses = studentEnrollments.length;
    const coreCourses = studentEnrollments.filter((item) => item.courseId?.type === 'Core').length;
    const electiveCourses = studentEnrollments.filter((item) => item.courseId?.type === 'Elective').length;

    if (totalCourses >= 6) {
      return res.status(400).json({ success: false, message: 'You can enroll in a maximum of 6 courses total.' });
    }

    if (course.type === 'Core' && coreCourses >= 4) {
      return res.status(400).json({ success: false, message: 'You can enroll in a maximum of 4 core courses.' });
    }

    if (course.type === 'Elective' && electiveCourses >= 2) {
      return res.status(400).json({ success: false, message: 'You can enroll in a maximum of 2 elective courses.' });
    }

    const enrollment = await Enrollment.create({
      studentId,
      courseId,
      status: 'enrolled',
      progress: 0,
    });

    return res.status(201).json({
      success: true,
      message: 'Course enrolled successfully',
      data: enrollment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to enroll in course.' });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const studentId = req.user._id;
    const enrollments = await Enrollment.find({ studentId })
      .populate('courseId')
      .sort({ enrolledAt: -1 });

    return res.json({ success: true, data: enrollments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch your courses.' });
  }
};

const getEnrollmentByCourse = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId: req.params.courseId,
    }).populate('courseId');

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found.' });
    }

    return res.json({ success: true, data: enrollment });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch enrollment.' });
  }
};

module.exports = { enrollInCourse, getMyCourses, getEnrollmentByCourse };
