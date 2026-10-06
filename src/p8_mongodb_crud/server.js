const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crud_db';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✓ MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

// TODO 1: Import the Item model from models/Item.js
const Item = require('./models/Item');

// TODO 2: CREATE - POST /api/items - Add new item
app.post('/api/items', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Item name is required' });
    }
    const item = await Item.create({ name, description });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TODO 3: READ ALL - GET /api/items - Fetch all items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TODO 4: READ ONE - GET /api/items/:id - Fetch single item by ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TODO 5: UPDATE - PUT /api/items/:id - Update existing item
app.put('/api/items/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TODO 6: DELETE - DELETE /api/items/:id - Remove item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT}`));
