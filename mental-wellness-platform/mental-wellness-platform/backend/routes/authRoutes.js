// backend/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct for your project

const router = express.Router();

/**
 * GET /api/auth/register
 * This responds with 405 because the route is meant for POST only.
 * Prevents "Cannot GET /api/auth/register" if someone visits in a browser.
 */
router.get('/register', (req, res) => {
  res.status(405).json({ msg: 'Please use POST to register a user' });
});

/**
 * POST /api/auth/register – User Registration
 */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create and save the new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

/**
 * GET /api/auth/login
 * Same logic as above—405 means "Method Not Allowed."
 * You only handle POST for login.
 */
router.get('/login', (req, res) => {
  res.status(405).json({ msg: 'Please use POST to login' });
});

/**
 * POST /api/auth/login – User Login
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Optional: Check if the user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ msg: 'This account is blocked' });
    }
    
    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Return a success message and the token
    res.json({ msg: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err });
  }
});

module.exports = router;
