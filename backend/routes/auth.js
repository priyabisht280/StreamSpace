const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Login endpoint
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Verify user credentials (check database)
    // ... authentication logic ...
    
    // ✅ Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    res.json({ 
      message: 'Login successful',
      token: token,
      user: {
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;