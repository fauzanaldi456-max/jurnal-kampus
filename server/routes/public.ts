import { Router, Request, Response } from 'express';
import { query, queryOne } from '../db/database.js';

const router = Router();

// GET /api/v1/public/journals
router.get('/journals', (_req: Request, res: Response): void => {
  const journals = query(`
    SELECT j.*, i.name as institution_name
    FROM journals j
    LEFT JOIN institutions i ON j.institution_id = i.id
    WHERE j.status = 'active'
    ORDER BY j.title ASC;
  `);

  res.json({ success: true, journals });
});

// GET /api/v1/public/journals/:slug
router.get('/journals/:slug', (req: Request, res: Response): void => {
  const { slug } = req.params;

  const journal = queryOne(
    `SELECT j.*, i.name as institution_name
     FROM journals j
     LEFT JOIN institutions i ON j.institution_id = i.id
     WHERE j.slug = ? OR j.id = ?;`,
    [slug, slug]
  );

  if (!journal) {
    res.status(404).json({ success: false, message: 'Jurnal tidak ditemukan.' });
    return;
  }

  res.json({ success: true, journal });
});

// GET /api/v1/public/stats
router.get('/stats', (_req: Request, res: Response): void => {
  const totalJournals = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM journals WHERE status = 'active';")?.count || 0;
  const totalArticles = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM published_articles;')?.count || 0;
  const totalSubmissions = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM submissions;')?.count || 0;

  res.json({
    success: true,
    stats: {
      totalJournals,
      totalArticles,
      totalSubmissions,
    },
  });
});

export default router;
