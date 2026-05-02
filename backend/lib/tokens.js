const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      email: user.email,
      username: user.username
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Short-lived access token
  );
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

module.exports = { generateAccessToken, verifyRefreshToken };