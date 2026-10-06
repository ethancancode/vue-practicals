import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { protect, JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/login - Login user & return token
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/me - Get current user profile
router.get('/me', protect, async (req, res) => {
  res.json({
    _id: req.user._id,
    username: req.user.username,
    role: req.user.role,
    createdAt: req.user.createdAt
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
