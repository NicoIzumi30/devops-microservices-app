const express = require('express');
const router = express.Router();

// Mock user for demo purposes
const mockUser = {
  id: 1,
  username: 'admin',
  role: 'admin',
  email: 'admin@company.com'
};

// Login endpoint - always returns success (no authentication)
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ 
      error: 'Username and password required' 
    });
  }

  // Always return success with mock user data
  res.status(200).json({
    message: 'Login successful',
    user: mockUser
  });
});

// Profile endpoint - no authentication required
router.get('/profile', (req, res) => {
  res.status(200).json({
    message: 'Protected route accessed',
    user: mockUser
  });
});

// Logout endpoint - always success
router.post('/logout', (req, res) => {
  res.status(200).json({
    message: 'Logout successful'
  });
});

module.exports = router;