import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query, queryOne, run } from '../db/database.js';
import { requireAuth, requireRole, logAudit, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Only Super Admin can access admin routes
router.use(requireAuth, requireRole(['admin']));

// GET /api/v1/admin/stats
router.get('/stats', (_req: AuthenticatedRequest, res: Response): void => {
  const usersCount = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM users;')?.count || 0;
  const journalsCount = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM journals;')?.count || 0;
  const submissionsCount = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM submissions;')?.count || 0;
  const reviewsCount = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM review_assignments;')?.count || 0;
  const publishedCount = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM submissions WHERE status = 'PUBLISHED';")?.count || 0;
  const auditLogsCount = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM audit_logs;')?.count || 0;

  res.json({
    success: true,
    stats: {
      usersCount,
      journalsCount,
      submissionsCount,
      reviewsCount,
      publishedCount,
      auditLogsCount,
    },
  });
});

// GET /api/v1/admin/users
router.get('/users', (req: AuthenticatedRequest, res: Response): void => {
  const { role, search } = req.query;

  let sql = 'SELECT id, email, full_name, role, institution, orcid, phone, is_active, created_at FROM users WHERE 1=1';
  const params: any[] = [];

  if (role && role !== 'all') {
    sql += ' AND role = ?';
    params.push(role);
  }

  if (search) {
    sql += ' AND (full_name LIKE ? OR email LIKE ? OR institution LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  sql += ' ORDER BY created_at DESC;';

  const users = query(sql, params);
  res.json({ success: true, users });
});

// POST /api/v1/admin/users
router.post('/users', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const adminId = req.user!.id;
    const { email, password, full_name, role, institution, orcid, phone } = req.body;

    if (!email || !password || !full_name || !role) {
      res.status(400).json({ success: false, message: 'Semua bidang wajib (email, password, nama, role) harus diisi.' });
      return;
    }

    const existing = queryOne('SELECT id FROM users WHERE LOWER(email) = LOWER(?);', [email.trim()]);
    if (existing) {
      res.status(400).json({ success: false, message: 'Email sudah terdaftar.' });
      return;
    }

    const userId = `usr-${role}-${Date.now()}`;
    const passwordHash = bcrypt.hashSync(password, 10);
    const now = new Date().toISOString();

    run(
      `INSERT INTO users (id, email, password_hash, full_name, role, institution, orcid, phone, bio, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', 1, ?, ?);`,
      [userId, email.trim(), passwordHash, full_name.trim(), role, institution || '', orcid || '', phone || '', now, now]
    );

    run('INSERT INTO user_roles (id, user_id, role, created_at) VALUES (?, ?, ?, ?);', [
      `role-${userId}`,
      userId,
      role,
      now,
    ]);

    logAudit(adminId, 'ADMIN_CREATE_USER', 'USER', userId, `Admin membuat akun baru: ${email} (${role})`, req);

    res.status(201).json({ success: true, message: 'Pengguna berhasil ditambahkan.', userId });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ success: false, message: 'Gagal membuat pengguna.' });
  }
});

// PATCH /api/v1/admin/users/:id
router.patch('/users/:id', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const adminId = req.user!.id;
    const { id } = req.params;
    const { full_name, role, institution, is_active, password } = req.body;

    const user = queryOne('SELECT id, email FROM users WHERE id = ?;', [id]);
    if (!user) {
      res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
      return;
    }

    const now = new Date().toISOString();

    if (password) {
      const passwordHash = bcrypt.hashSync(password, 10);
      run('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?;', [passwordHash, now, id]);
    }

    if (full_name !== undefined || role !== undefined || institution !== undefined || is_active !== undefined) {
      run(
        `UPDATE users
         SET full_name = COALESCE(?, full_name),
             role = COALESCE(?, role),
             institution = COALESCE(?, institution),
             is_active = COALESCE(?, is_active),
             updated_at = ?
         WHERE id = ?;`,
        [full_name, role, institution, is_active, now, id]
      );
    }

    logAudit(adminId, 'ADMIN_UPDATE_USER', 'USER', id, `Admin memperbarui data akun: ${user.email}`, req);

    res.json({ success: true, message: 'Data pengguna berhasil diperbarui.' });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui pengguna.' });
  }
});

// GET /api/v1/admin/journals
router.get('/journals', (_req: AuthenticatedRequest, res: Response): void => {
  const journals = query(`
    SELECT j.*, i.name as institution_name,
           (SELECT COUNT(*) FROM submissions s WHERE s.journal_id = j.id) as real_submission_count,
           (SELECT COUNT(*) FROM submissions s WHERE s.journal_id = j.id AND s.status = 'PUBLISHED') as real_published_count
    FROM journals j
    LEFT JOIN institutions i ON j.institution_id = i.id
    ORDER BY j.created_at DESC;
  `);

  res.json({ success: true, journals });
});

// POST /api/v1/admin/journals
router.post('/journals', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const adminId = req.user!.id;
    const {
      title,
      abbreviation,
      issn_online,
      issn_print,
      description,
      scope,
      publisher,
      institution_id,
      contact_email,
      sinta_accreditation,
    } = req.body;

    if (!title) {
      res.status(400).json({ success: false, message: 'Judul jurnal wajib diisi.' });
      return;
    }

    const id = `jrn-${Date.now()}`;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const now = new Date().toISOString();

    run(
      `INSERT INTO journals (id, slug, title, abbreviation, issn_online, issn_print, description, scope, publisher, institution_id, contact_email, sinta_accreditation, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?);`,
      [
        id,
        slug,
        title,
        abbreviation || '',
        issn_online || '',
        issn_print || '',
        description || '',
        scope || '',
        publisher || 'Konsorsium Cendraloka',
        institution_id || null,
        contact_email || '',
        sinta_accreditation || 'Terakreditasi Nasional',
        now,
        now,
      ]
    );

    logAudit(adminId, 'ADMIN_CREATE_JOURNAL', 'JOURNAL', id, `Admin membuat jurnal baru: ${title}`, req);

    res.status(201).json({ success: true, message: 'Jurnal baru berhasil ditambahkan.', journalId: id });
  } catch (err) {
    console.error('Create journal error:', err);
    res.status(500).json({ success: false, message: 'Gagal membuat jurnal.' });
  }
});

// GET /api/v1/admin/audit-logs
router.get('/audit-logs', (req: AuthenticatedRequest, res: Response): void => {
  const { limit = '50', entityType } = req.query;

  let sql = `
    SELECT a.*, u.full_name as user_name, u.email as user_email, u.role as user_role
    FROM audit_logs a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (entityType) {
    sql += ' AND a.entity_type = ?';
    params.push(entityType);
  }

  sql += ' ORDER BY a.created_at DESC LIMIT ?;';
  params.push(parseInt(limit as string, 10));

  const logs = query(sql, params);
  res.json({ success: true, logs });
});

export default router;
