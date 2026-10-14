const Certificate = require('../models/Certificate');

const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ studentId: req.user._id }).sort({ issuedAt: -1 });
    return res.json({ success: true, data: certificates });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch certificates.' });
  }
};

const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ _id: req.params.id, studentId: req.user._id });
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found.' });
    }

    return res.json({ success: true, data: certificate });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch certificate.' });
  }
};

const verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId });
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found.' });
    }

    return res.json({
      success: true,
      data: {
        certificateId: certificate.certificateId,
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        score: certificate.score,
        issuedAt: certificate.issuedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to verify certificate.' });
  }
};

module.exports = { getCertificates, getCertificateById, verifyCertificate };
