import { Router, Response } from 'express';
import { query, queryOne, run } from '../db/database.js';
import { requireAuth, requireRole, logAudit, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Editor and Admin roles can access editorial endpoints
router.use(requireAuth, requireRole(['editor', 'admin']));

// GET /api/v1/editor/stats
router.get('/stats', (req: AuthenticatedRequest, res: Response): void => {
  const total = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM submissions;')?.count || 0;
  const technicalCheck = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM submissions WHERE status IN ('SUBMITTED', 'TECHNICAL_CHECK');")?.count || 0;
  const inReview = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM submissions WHERE status = 'IN_REVIEW';")?.count || 0;
  const revision = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM submissions WHERE status = 'REVISION_REQUIRED';")?.count || 0;
  const accepted = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM submissions WHERE status = 'ACCEPTED';")?.count || 0;
  const published = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM submissions WHERE status = 'PUBLISHED';")?.count || 0;

  res.json({
    success: true,
    stats: {
      total,
      technicalCheck,
      inReview,
      revision,
      accepted,
      published,
    },
  });
});

// GET /api/v1/editor/submissions
router.get('/submissions', (req: AuthenticatedRequest, res: Response): void => {
  const { status, journalId } = req.query;

  let sql = `
    SELECT s.*, j.title as journal_title, j.abbreviation as journal_abbr, u.full_name as author_name, u.email as author_email
    FROM submissions s
    LEFT JOIN journals j ON s.journal_id = j.id
    LEFT JOIN users u ON s.author_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (status && status !== 'all') {
    sql += ' AND s.status = ?';
    params.push(status);
  }

  if (journalId) {
    sql += ' AND s.journal_id = ?';
    params.push(journalId);
  }

  sql += ' ORDER BY s.created_at DESC;';

  const submissions = query(sql, params);

  // Attach reviewer count and assignment info
  const enriched = submissions.map((sub: any) => {
    const reviewers = query(
      `SELECT ra.id, ra.status, ra.recommendation, u.full_name as reviewer_name
       FROM review_assignments ra
       LEFT JOIN users u ON ra.reviewer_id = u.id
       WHERE ra.submission_id = ?;`,
      [sub.id]
    );
    return { ...sub, reviewers };
  });

  res.json({ success: true, submissions: enriched });
});

// GET /api/v1/editor/submissions/:id
router.get('/submissions/:id', (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;

  const submission = queryOne(
    `SELECT s.*, j.title as journal_title, j.slug as journal_slug, u.full_name as author_name, u.email as author_email, u.institution as author_institution
     FROM submissions s
     LEFT JOIN journals j ON s.journal_id = j.id
     LEFT JOIN users u ON s.author_id = u.id
     WHERE s.id = ?;`,
    [id]
  );

  if (!submission) {
    res.status(404).json({ success: false, message: 'Naskah tidak ditemukan.' });
    return;
  }

  const authors = query('SELECT * FROM submission_authors WHERE submission_id = ? ORDER BY order_num ASC;', [id]);
  const files = query('SELECT * FROM submission_files WHERE submission_id = ? ORDER BY uploaded_at DESC;', [id]);
  const history = query(
    `SELECT h.*, u.full_name as changed_by_name
     FROM submission_status_history h
     LEFT JOIN users u ON h.changed_by = u.id
     WHERE h.submission_id = ?
     ORDER BY h.created_at DESC;`,
    [id]
  );

  const reviewAssignments = query(
    `SELECT ra.*, u.full_name as reviewer_name, u.email as reviewer_email, u.institution as reviewer_institution,
            rr.score, rr.evaluation_rubric
     FROM review_assignments ra
     LEFT JOIN users u ON ra.reviewer_id = u.id
     LEFT JOIN review_reports rr ON ra.id = rr.assignment_id
     WHERE ra.submission_id = ?
     ORDER BY ra.created_at DESC;`,
    [id]
  );

  const decisions = query(
    `SELECT d.*, u.full_name as editor_name
     FROM editorial_decisions d
     LEFT JOIN users u ON d.editor_id = u.id
     WHERE d.submission_id = ?
     ORDER BY d.created_at DESC;`,
    [id]
  );

  const revisions = query(
    'SELECT * FROM revision_responses WHERE submission_id = ? ORDER BY round DESC;',
    [id]
  );

  res.json({
    success: true,
    submission: {
      ...submission,
      authors,
      files,
      history,
      reviewAssignments,
      decisions,
      revisions,
    },
  });
});

// POST /api/v1/editor/submissions/:id/technical-check
router.post('/submissions/:id/technical-check', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const editorId = req.user!.id;
    const { id } = req.params;
    const { passed, notes } = req.body;

    const submission = queryOne('SELECT id, status, author_id, submission_number FROM submissions WHERE id = ?;', [id]);
    if (!submission) {
      res.status(404).json({ success: false, message: 'Naskah tidak ditemukan.' });
      return;
    }

    const now = new Date().toISOString();
    const newStatus = passed ? 'IN_REVIEW' : 'REVISION_REQUIRED';
    const comment = passed
      ? (notes || 'Pemeriksaan teknis (desk check) lolos. Naskah siap dilanjutkan ke tahap peer review.')
      : (notes || 'Pemeriksaan teknis memerlukan revisi format, template naskah, atau kesesuaian ruang lingkup.');

    run('UPDATE submissions SET status = ?, updated_at = ? WHERE id = ?;', [newStatus, now, id]);

    run(
      `INSERT INTO submission_status_history (id, submission_id, previous_status, new_status, comment, changed_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [`hist-${id}-tc-${Date.now()}`, id, submission.status, newStatus, comment, editorId, now]
    );

    // Notify author
    run(
      `INSERT INTO notifications (id, user_id, title, message, link, is_read, created_at)
       VALUES (?, ?, ?, ?, ?, 0, ?)`,
      [
        `notif-${Date.now()}`,
        submission.author_id,
        passed ? 'Naskah Lolos Evaluasi Teknis' : 'Revisi Teknis Naskah Diperlukan',
        `Naskah ${submission.submission_number}: ${comment}`,
        `/author/submissions/${id}`,
        now,
      ]
    );

    logAudit(editorId, 'EDITORIAL_TECHNICAL_CHECK', 'SUBMISSION', id, `Desk check naskah: ${newStatus}`, req);

    res.json({ success: true, message: 'Hasil pemeriksaan teknis berhasil disimpan.', newStatus });
  } catch (err) {
    console.error('Technical check error:', err);
    res.status(500).json({ success: false, message: 'Gagal memproses pemeriksaan teknis.' });
  }
});

// POST /api/v1/editor/submissions/:id/assign-reviewer
router.post('/submissions/:id/assign-reviewer', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const editorId = req.user!.id;
    const { id } = req.params;
    const { reviewer_id, due_days } = req.body;

    if (!reviewer_id) {
      res.status(400).json({ success: false, message: 'Mitra bestari wajib dipilih.' });
      return;
    }

    const reviewer = queryOne("SELECT id, full_name, email FROM users WHERE id = ? AND role = 'reviewer';", [reviewer_id]);
    if (!reviewer) {
      res.status(404).json({ success: false, message: 'Data reviewer tidak valid atau tidak ditemukan.' });
      return;
    }

    const submission = queryOne('SELECT id, submission_number, title FROM submissions WHERE id = ?;', [id]);
    if (!submission) {
      res.status(404).json({ success: false, message: 'Naskah tidak ditemukan.' });
      return;
    }

    const assignmentId = `rev-assign-${Date.now()}`;
    const days = parseInt(due_days || '14', 10);
    const dueDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const now = new Date().toISOString();

    run(
      `INSERT INTO review_assignments (id, submission_id, reviewer_id, assigned_by, status, due_date, created_at)
       VALUES (?, ?, ?, ?, 'ACCEPTED', ?, ?)`,
      [assignmentId, id, reviewer_id, editorId, dueDate, now]
    );

    // Ensure status is IN_REVIEW
    run("UPDATE submissions SET status = 'IN_REVIEW', updated_at = ? WHERE id = ?;", [now, id]);

    run(
      `INSERT INTO submission_status_history (id, submission_id, previous_status, new_status, comment, changed_by, created_at)
       VALUES (?, ?, 'TECHNICAL_CHECK', 'IN_REVIEW', ?, ?, ?)`,
      [
        `hist-${id}-assign-${Date.now()}`,
        id,
        `Ditugaskan kepada Mitra Bestari independen: ${reviewer.full_name} (Tenggat: ${dueDate}).`,
        editorId,
        now,
      ]
    );

    // Notify Reviewer
    run(
      `INSERT INTO notifications (id, user_id, title, message, link, is_read, created_at)
       VALUES (?, ?, 'Tugas Telaah Naskah Baru', ?, ?, 0, ?)`,
      [
        `notif-${Date.now()}`,
        reviewer_id,
        `Anda ditugaskan menelaah naskah "${submission.title.substring(0, 50)}..." dengan tenggat waktu ${dueDate}.`,
        `/reviewer/assignments/${assignmentId}`,
        now,
      ]
    );

    logAudit(editorId, 'EDITOR_ASSIGN_REVIEWER', 'REVIEW_ASSIGNMENT', assignmentId, `Menugaskan reviewer ${reviewer.email} untuk naskah ${submission.submission_number}`, req);

    res.json({ success: true, message: `Mitra Bestari ${reviewer.full_name} berhasil ditugaskan.` });
  } catch (err) {
    console.error('Assign reviewer error:', err);
    res.status(500).json({ success: false, message: 'Gagal menugaskan reviewer.' });
  }
});

// POST /api/v1/editor/submissions/:id/decision
router.post('/submissions/:id/decision', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const editorId = req.user!.id;
    const { id } = req.params;
    const { decision, notes, notify_author } = req.body;

    if (!decision || !['ACCEPT', 'REVISION', 'DECLINE'].includes(decision)) {
      res.status(400).json({ success: false, message: 'Keputusan editorial tidak valid. Pilihan: ACCEPT, REVISION, DECLINE.' });
      return;
    }

    const submission = queryOne('SELECT id, status, author_id, submission_number FROM submissions WHERE id = ?;', [id]);
    if (!submission) {
      res.status(404).json({ success: false, message: 'Naskah tidak ditemukan.' });
      return;
    }

    const now = new Date().toISOString();
    let newStatus = 'IN_REVIEW';
    if (decision === 'ACCEPT') newStatus = 'ACCEPTED';
    else if (decision === 'REVISION') newStatus = 'REVISION_REQUIRED';
    else if (decision === 'DECLINE') newStatus = 'DECLINED';

    // Insert editorial decision
    const decisionId = `dec-${Date.now()}`;
    run(
      `INSERT INTO editorial_decisions (id, submission_id, editor_id, decision, decision_notes, notify_author, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [decisionId, id, editorId, decision, notes || '', notify_author ? 1 : 0, now]
    );

    // Update submission status
    run('UPDATE submissions SET status = ?, updated_at = ? WHERE id = ?;', [newStatus, now, id]);

    // Record history
    run(
      `INSERT INTO submission_status_history (id, submission_id, previous_status, new_status, comment, changed_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [`hist-${id}-dec-${Date.now()}`, id, submission.status, newStatus, `Keputusan Dewan Editor: [${decision}]. Catatan: ${notes || '-'}`, editorId, now]
    );

    // Notify author if checked
    if (notify_author) {
      const decisionLabels: Record<string, string> = {
        ACCEPT: 'Naskah Diterima (Accepted)',
        REVISION: 'Permintaan Revisi Naskah (Revision Required)',
        DECLINE: 'Naskah Ditolak (Declined)',
      };

      run(
        `INSERT INTO notifications (id, user_id, title, message, link, is_read, created_at)
         VALUES (?, ?, ?, ?, ?, 0, ?)`,
        [
          `notif-${Date.now()}`,
          submission.author_id,
          `Keputusan Editorial: ${decisionLabels[decision]}`,
          `Naskah ${submission.submission_number}: ${notes || 'Keputusan telah ditetapkan oleh dewan editor.'}`,
          `/author/submissions/${id}`,
          now,
        ]
      );
    }

    logAudit(editorId, 'EDITOR_DECISION', 'SUBMISSION', id, `Keputusan editorial: ${decision} untuk ${submission.submission_number}`, req);

    res.json({ success: true, message: `Keputusan editorial [${decision}] berhasil diterbitkan.`, newStatus });
  } catch (err) {
    console.error('Decision error:', err);
    res.status(500).json({ success: false, message: 'Gagal menerbitkan keputusan editorial.' });
  }
});

// GET /api/v1/editor/reviewers
router.get('/reviewers', (_req: AuthenticatedRequest, res: Response): void => {
  const reviewers = query(
    `SELECT u.id, u.full_name, u.email, u.institution, u.bio,
            (SELECT COUNT(*) FROM review_assignments ra WHERE ra.reviewer_id = u.id AND ra.status = 'ACCEPTED') as active_assignments
     FROM users u
     WHERE u.role = 'reviewer' AND u.is_active = 1
     ORDER BY u.full_name ASC;`
  );

  res.json({ success: true, reviewers });
});

export default router;
