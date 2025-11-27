const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Default admin credentials
    if (email === 'myeio@gmail.com' && password === 'myeio@123') {
      return res.json({
        success: true,
        user: {
          email: 'myeio@gmail.com',
          role: 'myeio@123'
        }
      });
    }

    // For other users
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Simple password check (in real app, use bcrypt)
    if (user.password !== password) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    res.json({
      success: true,
      user: {
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;