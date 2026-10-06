import express from 'express';
import { User } from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// GET /api/users - List all users (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/users/:id/role - Update user role (Admin only)
router.put('/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
