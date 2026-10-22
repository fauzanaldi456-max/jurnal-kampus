import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';

// Route imports
import authRoutes from './routes/auth.js';
import authorRoutes from './routes/author.js';
import editorRoutes from './routes/editor.js';
import reviewerRoutes from './routes/reviewer.js';
import adminRoutes from './routes/admin.js';
import publicRoutes from './routes/public.js';
import notificationRoutes from './routes/notifications.js';

const app = express();

// Ensure upload directory exists (fallback to /tmp in serverless/Vercel)
const UPLOADS_DIR = process.env.VERCEL
  ? path.resolve('/tmp', 'cendraloka_uploads')
  : path.resolve(process.cwd(), 'server', 'uploads');

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Could not create uploads directory:', e);
}

// Global Middlewares - Allow any origin dynamically for Vercel preview & production
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Static file serving for uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    system: 'Cendraloka Journal Management Core API',
    environment: process.env.VERCEL ? 'production-vercel' : 'development',
  });
});

// API Routes mounting
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/author', authorRoutes);
app.use('/api/v1/editor', editorRoutes);
app.use('/api/v1/reviewer', reviewerRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// 404 handler for unmatched API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint tidak ditemukan.' });
});

export default app;
