const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const router = express.Router();

// Auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// GET profile
router.get('/', authMiddleware, (req, res) => {
  const { password, verificationToken, ...userData } = req.user._doc;
  res.json(userData);
});

// PUT profile update (safe partial update)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const updates = {};
    const allowedFields = ['name', 'email', 'mobile', 'address'];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(req.user, updates);
    await req.user.save();

    res.json({ message: 'Profile updated successfully', user: updates });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
