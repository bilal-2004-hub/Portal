const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [enrolledCount, completedCount, certificateCount] = await Promise.all([
      Enrollment.countDocuments({ studentId: user._id }),
      Enrollment.countDocuments({ studentId: user._id, status: 'completed' }),
      Certificate.countDocuments({ studentId: user._id }),
    ]);

    return res.json({
      success: true,
      data: {
        ...user.toObject(),
        enrolledCourses: enrolledCount,
        completedCourses: completedCount,
        certificates: certificateCount,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch profile.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, profileImage } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    const profile = user.toObject();
    delete profile.passwordHash;

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to update profile.' });
  }
};

module.exports = { getProfile, updateProfile };
