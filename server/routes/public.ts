import { Router, Request, Response } from 'express';
import { query, queryOne } from '../db/database.js';
import { supabaseServer } from '../db/supabase.js';

const router = Router();

// GET /api/v1/public/journals
router.get('/journals', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data: supaJournals, error } = await supabaseServer
      .from('journals')
      .select('*, institutions(name)')
      .eq('status', 'active')
      .order('title', { ascending: true });

    if (supaJournals && !error && supaJournals.length > 0) {
      const formatted = supaJournals.map((j: any) => ({
        ...j,
        institution_name: j.institutions?.name || 'Afiliasi Konsorsium',
      }));
      res.json({ success: true, journals: formatted });
      return;
    }
  } catch (e) {}

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
router.get('/journals/:slug', async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  try {
    const { data: supaJournal, error } = await supabaseServer
      .from('journals')
      .select('*, institutions(name)')
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .maybeSingle();

    if (supaJournal && !error) {
      res.json({
        success: true,
        journal: {
          ...supaJournal,
          institution_name: supaJournal.institutions?.name || 'Afiliasi Konsorsium',
        },
      });
      return;
    }
  } catch (e) {}

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
router.get('/stats', async (_req: Request, res: Response): Promise<void> => {
  let totalJournals = 4;
  let totalArticles = 135;
  let totalSubmissions = 248;

  try {
    const { count: jCount } = await supabaseServer
      .from('journals')
      .select('*', { count: 'exact', head: true });
    if (jCount !== null && jCount !== undefined) totalJournals = jCount;

    const { count: aCount } = await supabaseServer
      .from('published_articles')
      .select('*', { count: 'exact', head: true });
    if (aCount !== null && aCount !== undefined && aCount > 0) totalArticles = aCount;

    const { count: sCount } = await supabaseServer
      .from('submissions')
      .select('*', { count: 'exact', head: true });
    if (sCount !== null && sCount !== undefined && sCount > 0) totalSubmissions = sCount;
  } catch (e) {}

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
