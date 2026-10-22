import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { initAndSeed } from './db/seed.js';

// Route imports
import authRoutes from './routes/auth.js';
import authorRoutes from './routes/author.js';
import editorRoutes from './routes/editor.js';
import reviewerRoutes from './routes/reviewer.js';
import adminRoutes from './routes/admin.js';
import publicRoutes from './routes/public.js';
import notificationRoutes from './routes/notifications.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure upload directory exists
const UPLOADS_DIR = path.resolve(process.cwd(), 'server', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Global Middlewares
app.use(
  cors({
    origin: ['http://localhost:8949', 'http://127.0.0.1:8949'],
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

// Server Initialization
async function startServer() {
  try {
    console.log('Initializing Cendraloka Database & Seeding...');
    await initAndSeed();

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 Cendraloka API Server running on port ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
}

startServer();
