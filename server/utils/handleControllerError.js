const handleControllerError = (res, error, fallbackMessage) => {
  if (error.message === 'JWT_SECRET is required') {
    return res.status(503).json({ success: false, message: 'Authentication is not configured.' });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'A record with this unique value already exists.',
    });
  }

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'The supplied data is invalid.' });
  }

  if (['MongoServerSelectionError', 'MongooseServerSelectionError', 'MongoNetworkError'].includes(error.name)) {
    return res.status(503).json({ success: false, message: 'Database is unavailable.' });
  }

  return res.status(500).json({ success: false, message: fallbackMessage });
};

module.exports = handleControllerError;