import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import errorHandler from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';

const app = express();

// Connect DB once per cold start
let dbPromise = null;
const ensureDB = () => {
  if (!dbPromise) dbPromise = connectDB().catch((e) => {
    console.error('DB connect failed:', e.message);
    dbPromise = null;
  });
  return dbPromise;
};

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10kb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Weatherly API is running', timestamp: new Date().toISOString() });
});

// Ensure DB before protected routes
app.use('/api/auth', async (req, res, next) => {
  await ensureDB();
  next();
}, authRoutes);

app.use('/api/weather', weatherRoutes);
app.use('/api/history', async (req, res, next) => {
  await ensureDB();
  next();
}, historyRoutes);
app.use('/api/favorites', async (req, res, next) => {
  await ensureDB();
  next();
}, favoriteRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

// Listen only when run directly (local dev)
const isDirectRun = process.argv[1] && process.argv[1].includes('server.js');
if (isDirectRun) {
  const PORT = process.env.PORT || 5001;
  ensureDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

export default app;