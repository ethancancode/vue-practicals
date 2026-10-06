import express from 'express';
import { Item } from '../models/Item.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// GET /api/items - List all items (All authenticated users)
router.get('/', protect, async (req, res) => {
  try {
    const items = await Item.find().populate('createdBy', 'username role').sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/items - Create item (Editor and Admin only)
router.post('/', protect, authorize('admin', 'editor'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const item = new Item({
      title,
      description,
      createdBy: req.user._id
    });
    await item.save();
    const populatedItem = await item.populate('createdBy', 'username role');
    res.status(201).json(populatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/items/:id - Get single item
router.get('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('createdBy', 'username role');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/items/:id - Update item (Creator or Admin only)
router.put('/:id', protect, authorize('admin', 'editor'), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user is admin OR creator of the item
    if (req.user.role !== 'admin' && item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update items created by others' });
    }

    item.title = req.body.title || item.title;
    item.description = req.body.description || item.description;

    const updatedItem = await item.save();
    const populatedItem = await updatedItem.populate('createdBy', 'username role');
    res.json(populatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/items/:id - Delete item (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    await item.deleteOne();
    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
