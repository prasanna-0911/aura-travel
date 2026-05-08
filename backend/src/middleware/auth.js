const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

function getToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return null;
}

const protect = asyncHandler(async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    const error = new Error('Authentication token required');
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      const error = new Error('User no longer exists');
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (err) {
    const error = new Error(err.message === 'User no longer exists' ? err.message : 'Invalid or expired token');
    error.statusCode = 401;
    throw error;
  }
});

const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = getToken(req);
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
  } catch {
    req.user = null;
  }

  next();
});

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    const error = new Error('Admin access required');
    error.statusCode = 403;
    return next(error);
  }

  return next();
}

module.exports = { protect, optionalAuth, requireAdmin };
