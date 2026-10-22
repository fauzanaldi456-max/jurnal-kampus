import { Router, Response } from 'express';
import { query, queryOne, run } from '../db/database.js';
import { requireAuth, requireRole, logAudit, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Apply author role requirement to all author routes
router.use(requireAuth, requireRole(['author', 'admin']));

// GET /api/v1/author/stats
router.get('/stats', (req: AuthenticatedRequest, res: Response): void => {
  const authorId = req.user!.id;

  const total = queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM submissions WHERE author_id = ?;',
    [authorId]
  )?.count || 0;

  const submitted = queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM submissions WHERE author_id = ? AND status IN ('SUBMITTED', 'TECHNICAL_CHECK');",
    [authorId]
  )?.count || 0;

  const inReview = queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM submissions WHERE author_id = ? AND status = 'IN_REVIEW';",
    [authorId]
  )?.count || 0;

  const revision = queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM submissions WHERE author_id = ? AND status = 'REVISION_REQUIRED';",
    [authorId]
  )?.count || 0;

  const accepted = queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM submissions WHERE author_id = ? AND status = 'ACCEPTED';",
    [authorId]
  )?.count || 0;

  const published = queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM submissions WHERE author_id = ? AND status = 'PUBLISHED';",
    [authorId]
  )?.count || 0;

  res.json({
    success: true,
    stats: {
      total,
      submitted,
      inReview,
      revision,
      accepted,
      published,
    },
  });
});

// GET /api/v1/author/submissions
router.get('/submissions', (req: AuthenticatedRequest, res: Response): void => {
  const authorId = req.user!.id;

  const submissions = query(
    `SELECT s.*, j.title as journal_title, j.slug as journal_slug, j.abbreviation as journal_abbr
     FROM submissions s
     LEFT JOIN journals j ON s.journal_id = j.id
     WHERE s.author_id = ?
     ORDER BY s.created_at DESC;`,
    [authorId]
  );

  // Attach co-authors to each submission
  const submissionsWithAuthors = submissions.map((sub: any) => {
    const authors = query(
      'SELECT full_name, email, institution, orcid, is_corresponding FROM submission_authors WHERE submission_id = ? ORDER BY order_num ASC;',
      [sub.id]
    );
    return { ...sub, authors };
  });

  res.json({ success: true, submissions: submissionsWithAuthors });
});

// GET /api/v1/author/submissions/:id
router.get('/submissions/:id', (req: AuthenticatedRequest, res: Response): void => {
  const authorId = req.user!.id;
  const { id } = req.params;

  const submission = queryOne(
    `SELECT s.*, j.title as journal_title, j.slug as journal_slug, j.contact_email as journal_email
     FROM submissions s
     LEFT JOIN journals j ON s.journal_id = j.id
     WHERE s.id = ? AND (s.author_id = ? OR ? = 'admin');`,
    [id, authorId, req.user!.role]
  );

  if (!submission) {
    res.status(404).json({ success: false, message: 'Naskah tidak ditemukan atau Anda tidak memiliki akses.' });
    return;
  }

  const authors = query(
    'SELECT * FROM submission_authors WHERE submission_id = ? ORDER BY order_num ASC;',
    [id]
  );

  const files = query(
    'SELECT * FROM submission_files WHERE submission_id = ? ORDER BY uploaded_at DESC;',
    [id]
  );

  const history = query(
    `SELECT h.*, u.full_name as changed_by_name, u.role as changed_by_role
     FROM submission_status_history h
     LEFT JOIN users u ON h.changed_by = u.id
     WHERE h.submission_id = ?
     ORDER BY h.created_at DESC;`,
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
      decisions,
      revisions,
    },
  });
});

// POST /api/v1/author/submissions
router.post('/submissions', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const authorId = req.user!.id;
    const {
      journal_id,
      title,
      abstract,
      keywords,
      category,
      co_authors,
      file_name,
      file_path,
      file_size,
    } = req.body;

    if (!journal_id || !title || !abstract) {
      res.status(400).json({ success: false, message: 'Jurnal tujuan, judul naskah, dan abstrak wajib diisi.' });
      return;
    }

    const journal = queryOne('SELECT id, title FROM journals WHERE id = ?;', [journal_id]);
    if (!journal) {
      res.status(404).json({ success: false, message: 'Jurnal tujuan tidak ditemukan.' });
      return;
    }

    const submissionId = `sub-${Date.now()}`;
    const submissionNumber = `SUB-2025-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    run(
      `INSERT INTO submissions (id, submission_number, journal_id, author_id, title, abstract, keywords, category, file_path, file_name, file_size, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED', ?, ?)`,
      [
        submissionId,
        submissionNumber,
        journal_id,
        authorId,
        title.trim(),
        abstract.trim(),
        keywords || '',
        category || 'Original Research',
        file_path || '/uploads/sample_manuscript.pdf',
        file_name || 'Manuscript_Document.pdf',
        file_size || 1024000,
        now,
        now,
      ]
    );

    // Primary author
    run(
      `INSERT INTO submission_authors (id, submission_id, full_name, email, institution, orcid, is_corresponding, order_num)
       VALUES (?, ?, ?, ?, ?, ?, 1, 1)`,
      [
        `aut-${submissionId}-primary`,
        submissionId,
        req.user!.full_name,
        req.user!.email,
        req.user!.institution || '',
        '',
      ]
    );

    // Additional co-authors
    if (Array.isArray(co_authors)) {
      co_authors.forEach((ca: any, idx: number) => {
        if (ca.full_name && ca.email) {
          run(
            `INSERT INTO submission_authors (id, submission_id, full_name, email, institution, orcid, is_corresponding, order_num)
             VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
            [
              `aut-${submissionId}-${idx + 2}`,
              submissionId,
              ca.full_name,
              ca.email,
              ca.institution || '',
              ca.orcid || '',
              idx + 2,
            ]
          );
        }
      });
    }

    // Insert file record
    run(
      `INSERT INTO submission_files (id, submission_id, file_type, file_name, file_path, file_size, uploaded_by, version, uploaded_at)
       VALUES (?, ?, 'manuscript', ?, ?, ?, ?, 1, ?)`,
      [
        `file-${submissionId}-1`,
        submissionId,
        file_name || 'Manuscript_Document.pdf',
        file_path || '/uploads/sample_manuscript.pdf',
        file_size || 1024000,
        authorId,
        now,
      ]
    );

    // Initial status history
    run(
      `INSERT INTO submission_status_history (id, submission_id, previous_status, new_status, comment, changed_by, created_at)
       VALUES (?, ?, NULL, 'SUBMITTED', 'Naskah berhasil diajukan oleh penulis dan menunggu verifikasi administrasi.', ?, ?)`,
      [`hist-${submissionId}-1`, submissionId, authorId, now]
    );

    logAudit(authorId, 'SUBMISSION_CREATE', 'SUBMISSION', submissionId, `Penulis mengajukan naskah ${submissionNumber} ke ${journal.title}`, req);

    res.status(201).json({
      success: true,
      message: 'Naskah berhasil diajukan!',
      submissionId,
      submissionNumber,
    });
  } catch (err) {
    console.error('Submission create error:', err);
    res.status(500).json({ success: false, message: 'Gagal mengajukan naskah.' });
  }
});

// POST /api/v1/author/submissions/:id/revisions
router.post('/submissions/:id/revisions', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const authorId = req.user!.id;
    const { id } = req.params;
    const { response_letter, file_name, file_path } = req.body;

    const submission = queryOne('SELECT id, status FROM submissions WHERE id = ? AND author_id = ?;', [id, authorId]);
    if (!submission) {
      res.status(404).json({ success: false, message: 'Naskah tidak ditemukan.' });
      return;
    }

    const now = new Date().toISOString();
    const roundCount = queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM revision_responses WHERE submission_id = ?;',
      [id]
    )?.count || 0;
    const currentRound = roundCount + 1;

    // Insert revision response
    run(
      `INSERT INTO revision_responses (id, submission_id, author_id, round, response_letter, file_path, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [`rev-${id}-${currentRound}`, id, authorId, currentRound, response_letter || 'Tanggapan revisi penulis terlampir.', file_path || '', now]
    );

    // Update submission status back to IN_REVIEW or TECHNICAL_CHECK
    run(
      "UPDATE submissions SET status = 'IN_REVIEW', updated_at = ? WHERE id = ?;",
      [now, id]
    );

    run(
      `INSERT INTO submission_status_history (id, submission_id, previous_status, new_status, comment, changed_by, created_at)
       VALUES (?, ?, 'REVISION_REQUIRED', 'IN_REVIEW', 'Penulis telah mengunggah berkas revisi dan surat tanggapan reviewer (Putaran ${currentRound}).', ?, ?)`,
      [`hist-${id}-rev-${currentRound}`, id, authorId, now]
    );

    logAudit(authorId, 'SUBMISSION_REVISION', 'SUBMISSION', id, `Penulis mengunggah berkas revisi putaran ${currentRound}.`, req);

    res.json({ success: true, message: 'Berkas revisi berhasil dikirim ke dewan editor.' });
  } catch (err) {
    console.error('Revision error:', err);
    res.status(500).json({ success: false, message: 'Gagal mengirim revisi.' });
  }
});

// PUT /api/v1/author/profile
router.put('/profile', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const authorId = req.user!.id;
    const { full_name, institution, orcid, phone, bio } = req.body;

    const now = new Date().toISOString();
    run(
      `UPDATE users SET full_name = ?, institution = ?, orcid = ?, phone = ?, bio = ?, updated_at = ? WHERE id = ?;`,
      [full_name, institution, orcid, phone, bio, now, authorId]
    );

    logAudit(authorId, 'USER_UPDATE_PROFILE', 'USER', authorId, 'Pembaruan informasi profil penulis.', req);

    res.json({ success: true, message: 'Profil berhasil diperbarui.' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui profil.' });
  }
});

export default router;
