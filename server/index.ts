import app from './app.js';
import { initAndSeed } from './db/seed.js';

const PORT = process.env.PORT || 5000;

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
