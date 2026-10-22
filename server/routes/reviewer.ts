import { Router, Response } from 'express';
import { query, queryOne, run } from '../db/database.js';
import { requireAuth, requireRole, logAudit, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Reviewer and Admin roles
router.use(requireAuth, requireRole(['reviewer', 'admin']));

// GET /api/v1/reviewer/stats
router.get('/stats', (req: AuthenticatedRequest, res: Response): void => {
  const reviewerId = req.user!.id;

  const total = queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM review_assignments WHERE reviewer_id = ?;',
    [reviewerId]
  )?.count || 0;

  const active = queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM review_assignments WHERE reviewer_id = ? AND status IN ('INVITED', 'ACCEPTED');",
    [reviewerId]
  )?.count || 0;

  const completed = queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM review_assignments WHERE reviewer_id = ? AND status = 'COMPLETED';",
    [reviewerId]
  )?.count || 0;

  res.json({
    success: true,
    stats: {
      total,
      active,
      completed,
    },
  });
});

// GET /api/v1/reviewer/assignments
router.get('/assignments', (req: AuthenticatedRequest, res: Response): void => {
  const reviewerId = req.user!.id;

  // Strict Double-Blind: Author names and institutions are strictly EXCLUDED from the query
  const assignments = query(
    `SELECT ra.id, ra.submission_id, ra.status, ra.due_date, ra.recommendation, ra.created_at, ra.completed_at,
            s.submission_number, s.title, s.abstract, s.keywords, s.category, s.file_path, s.file_name,
            j.title as journal_title, j.abbreviation as journal_abbr
     FROM review_assignments ra
     JOIN submissions s ON ra.submission_id = s.id
     JOIN journals j ON s.journal_id = j.id
     WHERE ra.reviewer_id = ?
     ORDER BY ra.created_at DESC;`,
    [reviewerId]
  );

  res.json({ success: true, assignments });
});

// GET /api/v1/reviewer/assignments/:id
router.get('/assignments/:id', (req: AuthenticatedRequest, res: Response): void => {
  const reviewerId = req.user!.id;
  const { id } = req.params;

  // Double-blind assignment query
  const assignment = queryOne(
    `SELECT ra.*, s.submission_number, s.title, s.abstract, s.keywords, s.category, s.file_path, s.file_name, s.file_size,
            j.title as journal_title, j.scope as journal_scope, rr.score, rr.evaluation_rubric
     FROM review_assignments ra
     JOIN submissions s ON ra.submission_id = s.id
     JOIN journals j ON s.journal_id = j.id
     LEFT JOIN review_reports rr ON ra.id = rr.assignment_id
     WHERE ra.id = ? AND (ra.reviewer_id = ? OR ? = 'admin');`,
    [id, reviewerId, req.user!.role]
  );

  if (!assignment) {
    res.status(404).json({ success: false, message: 'Tugas telaah tidak ditemukan atau Anda tidak memiliki akses.' });
    return;
  }

  // Supplementary blind files if any
  const files = query(
    "SELECT id, file_type, file_name, file_path, file_size FROM submission_files WHERE submission_id = ? AND file_type IN ('manuscript', 'blind_manuscript', 'supplementary');",
    [assignment.submission_id]
  );

  res.json({ success: true, assignment: { ...assignment, files } });
});

// POST /api/v1/reviewer/assignments/:id/accept
router.post('/assignments/:id/accept', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const reviewerId = req.user!.id;
    const { id } = req.params;

    const assignment = queryOne('SELECT id, status FROM review_assignments WHERE id = ? AND reviewer_id = ?;', [id, reviewerId]);
    if (!assignment) {
      res.status(404).json({ success: false, message: 'Tugas telaah tidak ditemukan.' });
      return;
    }

    run("UPDATE review_assignments SET status = 'ACCEPTED' WHERE id = ?;", [id]);
    logAudit(reviewerId, 'REVIEW_ACCEPT', 'REVIEW_ASSIGNMENT', id, 'Reviewer menyetujui undangan telaah naskah.', req);

    res.json({ success: true, message: 'Undangan telaah naskah berhasil diterima.' });
  } catch (err) {
    console.error('Accept review error:', err);
    res.status(500).json({ success: false, message: 'Gagal menerima tugas telaah.' });
  }
});

// POST /api/v1/reviewer/assignments/:id/decline
router.post('/assignments/:id/decline', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const reviewerId = req.user!.id;
    const { id } = req.params;
    const { reason } = req.body;

    const assignment = queryOne('SELECT id, status FROM review_assignments WHERE id = ? AND reviewer_id = ?;', [id, reviewerId]);
    if (!assignment) {
      res.status(404).json({ success: false, message: 'Tugas telaah tidak ditemukan.' });
      return;
    }

    run(
      "UPDATE review_assignments SET status = 'DECLINED', confidential_notes = ? WHERE id = ?;",
      [reason || 'Menolak penugasan review karena keterbatasan waktu atau konflik kepentingan.', id]
    );

    logAudit(reviewerId, 'REVIEW_DECLINE', 'REVIEW_ASSIGNMENT', id, `Reviewer menolak penugasan review: ${reason || '-'}`, req);

    res.json({ success: true, message: 'Penolakan undangan telaah telah dicatat.' });
  } catch (err) {
    console.error('Decline review error:', err);
    res.status(500).json({ success: false, message: 'Gagal menolak tugas telaah.' });
  }
});

// POST /api/v1/reviewer/assignments/:id/report
router.post('/assignments/:id/report', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const reviewerId = req.user!.id;
    const { id } = req.params;
    const { recommendation, review_notes, confidential_notes, score, evaluation_rubric } = req.body;

    if (!recommendation || !review_notes) {
      res.status(400).json({ success: false, message: 'Rekomendasi dan catatan telaah untuk penulis wajib diisi.' });
      return;
    }

    const assignment = queryOne(
      'SELECT id, submission_id, status FROM review_assignments WHERE id = ? AND reviewer_id = ?;',
      [id, reviewerId]
    );

    if (!assignment) {
      res.status(404).json({ success: false, message: 'Tugas telaah tidak ditemukan.' });
      return;
    }

    const now = new Date().toISOString();

    // Update assignment record
    run(
      `UPDATE review_assignments
       SET status = 'COMPLETED', recommendation = ?, review_notes = ?, confidential_notes = ?, completed_at = ?
       WHERE id = ?;`,
      [recommendation, review_notes, confidential_notes || '', now, id]
    );

    // Save or update review report rubric
    const numericScore = parseFloat(score || '85');
    const rubricJson = typeof evaluation_rubric === 'object' ? JSON.stringify(evaluation_rubric) : (evaluation_rubric || '{}');

    const existingReport = queryOne('SELECT id FROM review_reports WHERE assignment_id = ?;', [id]);
    if (existingReport) {
      run(
        'UPDATE review_reports SET score = ?, evaluation_rubric = ?, created_at = ? WHERE assignment_id = ?;',
        [numericScore, rubricJson, now, id]
      );
    } else {
      run(
        'INSERT INTO review_reports (id, assignment_id, score, evaluation_rubric, created_at) VALUES (?, ?, ?, ?, ?);',
        [`report-${id}`, id, numericScore, rubricJson, now]
      );
    }

    // Add status history to submission
    run(
      `INSERT INTO submission_status_history (id, submission_id, previous_status, new_status, comment, changed_by, created_at)
       VALUES (?, ?, 'IN_REVIEW', 'IN_REVIEW', ?, ?, ?)`,
      [
        `hist-${assignment.submission_id}-rev-done-${Date.now()}`,
        assignment.submission_id,
        `Mitra Bestari telah menyelesaikan telaah naskah dengan rekomendasi [${recommendation}].`,
        reviewerId,
        now,
      ]
    );

    logAudit(reviewerId, 'REVIEW_SUBMIT_REPORT', 'REVIEW_ASSIGNMENT', id, `Laporan telaah dikirim: rekomendasi ${recommendation}, skor ${numericScore}`, req);

    res.json({ success: true, message: 'Laporan telaah berhasil dikirim kepada dewan editor.' });
  } catch (err) {
    console.error('Submit review report error:', err);
    res.status(500).json({ success: false, message: 'Gagal mengirimkan laporan telaah.' });
  }
});

export default router;
