const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getCertificates, getCertificateById, verifyCertificate } = require('../controllers/certificateController');

const router = express.Router();

router.get('/verify/:certificateId', verifyCertificate);
router.use(protect);
router.get('/', getCertificates);
router.get('/:id', getCertificateById);

module.exports = router;
