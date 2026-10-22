import { Router, Response } from 'express';
import { query, run } from '../db/database.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

// GET /api/v1/notifications
router.get('/', (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.user!.id;
  const notifications = query(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30;',
    [userId]
  );
  res.json({ success: true, notifications });
});

// PATCH /api/v1/notifications/:id/read
router.patch('/:id/read', (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.user!.id;
  const { id } = req.params;
  run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?;', [id, userId]);
  res.json({ success: true, message: 'Notifikasi ditandai dibaca.' });
});

// POST /api/v1/notifications/read-all
router.post('/read-all', (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.user!.id;
  run('UPDATE notifications SET is_read = 1 WHERE user_id = ?;', [userId]);
  res.json({ success: true, message: 'Semua notifikasi ditandai dibaca.' });
});

export default router;
