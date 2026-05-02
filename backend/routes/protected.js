const express = require('express');
const verifyToken = require('../middleware/auth');
const router = express.Router();

// ✅ Protected route - requires valid JWT token
router.get('/user-profile', verifyToken, async (req, res) => {
  try {
    // req.userId and req.userEmail are set by middleware
    const user = await User.findById(req.userId);
    
    res.json({ 
      message: 'Access granted',
      user: user 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;