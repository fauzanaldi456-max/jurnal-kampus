import app from '../server/app.js';
import { initAndSeed } from '../server/db/seed.js';

let isReady = false;
let initPromise: Promise<void> | null = null;

async function ensureDb() {
  if (isReady) return;
  if (!initPromise) {
    initPromise = initAndSeed()
      .then(() => {
        isReady = true;
      })
      .catch((err) => {
        console.error('Failed to initialize database in serverless function:', err);
      });
  }
  await initPromise;
}

export default async function handler(req: any, res: any) {
  await ensureDb();
  return app(req, res);
}
