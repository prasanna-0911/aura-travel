const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    preferences: user.preferences || { favoriteDestinations: [], experientialPreferences: [] }
  };
}

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
  ],
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: publicUser(user),
      token: signToken(user)
    });
  })
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    return res.json({
      success: true,
      user: publicUser(user),
      token: signToken(user)
    });
  })
);

router.get('/profile', protect, (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
});

router.put(
  '/profile',
  protect,
  [
    body('name').optional().trim().isLength({ min: 2 }),
    body('preferences.favoriteDestinations').optional().isArray(),
    body('preferences.experientialPreferences').optional().isArray(),
    validate
  ],
  asyncHandler(async (req, res) => {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.preferences) updates.preferences = req.body.preferences;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json({ success: true, user: publicUser(user) });
  })
);

module.exports = router;
