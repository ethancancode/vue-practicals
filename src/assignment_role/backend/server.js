import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import userRoutes from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'Role-Based Access Control API running on port ' + PORT });
});

app.listen(PORT, () => {
  console.log(`Role-based backend server listening on http://localhost:${PORT}`);
});
