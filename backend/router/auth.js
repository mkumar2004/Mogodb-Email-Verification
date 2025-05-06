const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../model/user');
const sendVerificationEmail = require('../utils/sendEmail');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, name, email, password, mobile, address } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString('hex');

    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword,
      mobile,
      address,
      verificationToken,
    });

    await newUser.save();
    await sendVerificationEmail(email, verificationToken);

    res.json({ message: 'Registration successful, please verify your email.' });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Verify email
router.get('/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).send('Invalid verification link.');

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.send('Email verified successfully!');
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).send('Something went wrong.');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !user.isVerified)
      return res.status(401).json({ error: 'Invalid credentials or email not verified' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWTPRIVATEKEY);
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
