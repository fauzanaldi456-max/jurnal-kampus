import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { queryOne, run } from '../db/database.js';
import { generateToken, requireAuth, logAudit, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/v1/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role: selectedRole } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
      return;
    }

    const user = queryOne(
      'SELECT id, email, password_hash, full_name, role, institution, orcid, phone, bio, is_active FROM users WHERE LOWER(email) = LOWER(?);',
      [email.trim()]
    );

    if (!user) {
      res.status(401).json({ success: false, message: 'Kombinasi email dan kata sandi tidak ditemukan.' });
      return;
    }

    if (!user.is_active) {
      res.status(403).json({ success: false, message: 'Akun Anda dinonaktifkan. Hubungi administrator jurnal.' });
      return;
    }

    const isValidPassword = bcrypt.compareSync(password, user.password_hash);
    if (!isValidPassword) {
      res.status(401).json({ success: false, message: 'Kombinasi email dan kata sandi tidak valid.' });
      return;
    }

    // Role verification (Check if the requested/selected portal role matches the user's registered role)
    if (selectedRole && selectedRole !== user.role) {
      const roleDisplayNames: Record<string, string> = {
        author: 'Mahasiswa / Penulis',
        editor: 'Editorial / Dewan Editor',
        reviewer: 'Mitra Bestari / Peer Reviewer',
        admin: 'Super Admin / Pengelola Sistem',
      };

      res.status(403).json({
        success: false,
        message: `Role yang dipilih (${roleDisplayNames[selectedRole] || selectedRole}) tidak sesuai dengan hak akses akun Anda (${roleDisplayNames[user.role] || user.role}). Silakan pilih role yang sesuai.`,
      });
      return;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      institution: user.institution,
    });

    res.cookie('cendraloka_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logAudit(user.id, 'AUTH_LOGIN', 'USER', user.id, `Pengguna ${user.email} berhasil login sebagai [${user.role}].`, req);

    res.json({
      success: true,
      message: 'Login berhasil.',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        institution: user.institution,
        orcid: user.orcid,
        phone: user.phone,
        bio: user.bio,
      },
      dashboardUrl: `/${user.role}/dashboard`,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem internal.' });
  }
});

// POST /api/v1/auth/google
router.post('/google', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, full_name, role } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: 'Email akun Google wajib disertakan.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = queryOne('SELECT * FROM users WHERE LOWER(email) = LOWER(?);', [cleanEmail]);

    if (!user) {
      // Auto-register as author via Google
      const userId = `usr-goog-${Date.now()}`;
      const now = new Date().toISOString();
      const defaultName = full_name || cleanEmail.split('@')[0];
      const assignedRole = role || 'author';

      run(
        `INSERT INTO users (id, email, password_hash, full_name, role, institution, orcid, phone, bio, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, null, null, 'Terdaftar via Google Sign-In', 1, ?, ?)`,
        [userId, cleanEmail, 'GOOGLE_AUTH_SECURED', defaultName, assignedRole, 'Afiliasi Google User', now, now]
      );

      run('INSERT INTO user_roles (id, user_id, role, created_at) VALUES (?, ?, ?, ?)', [
        `role-${userId}`,
        userId,
        assignedRole,
        now,
      ]);

      user = queryOne('SELECT * FROM users WHERE id = ?;', [userId]);
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      institution: user.institution,
    });

    res.cookie('cendraloka_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logAudit(user.id, 'AUTH_GOOGLE', 'USER', user.id, `Pengguna ${user.email} berhasil login via Google Sign-In [${user.role}].`, req);

    res.json({
      success: true,
      message: 'Login Google berhasil.',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        institution: user.institution,
        orcid: user.orcid,
        phone: user.phone,
        bio: user.bio,
      },
      dashboardUrl: `/${user.role}/dashboard`,
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ success: false, message: 'Gagal memproses autentikasi Google.' });
  }
});

// POST /api/v1/auth/register (Author self-registration)
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, full_name, institution, orcid, phone } = req.body;

    if (!email || !password || !full_name) {
      res.status(400).json({ success: false, message: 'Nama lengkap, email, dan kata sandi wajib diisi.' });
      return;
    }

    const existing = queryOne('SELECT id FROM users WHERE LOWER(email) = LOWER(?);', [email.trim()]);
    if (existing) {
      res.status(400).json({ success: false, message: 'Alamat email sudah terdaftar dalam sistem.' });
      return;
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const userId = `usr-aut-${Date.now()}`;
    const now = new Date().toISOString();

    run(
      `INSERT INTO users (id, email, password_hash, full_name, role, institution, orcid, phone, bio, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'author', ?, ?, ?, '', 1, ?, ?)`,
      [userId, email.trim(), passwordHash, full_name.trim(), institution || 'Afiliasi Mandiri', orcid || null, phone || null, now, now]
    );

    run('INSERT INTO user_roles (id, user_id, role, created_at) VALUES (?, ?, ?, ?)', [
      `role-${userId}`,
      userId,
      'author',
      now,
    ]);

    logAudit(userId, 'AUTH_REGISTER', 'USER', userId, `Registrasi akun penulis baru: ${email}`, req);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Anda sekarang dapat masuk menggunakan akun Penulis.',
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Gagal memproses pendaftaran.' });
  }
});

// GET /api/v1/auth/me
router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const user = queryOne(
    'SELECT id, email, full_name, role, institution, orcid, phone, bio, created_at FROM users WHERE id = ?;',
    [req.user!.id]
  );

  if (!user) {
    res.status(404).json({ success: false, message: 'Profil pengguna tidak ditemukan.' });
    return;
  }

  res.json({ success: true, user });
});

// POST /api/v1/auth/logout
router.post('/logout', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  logAudit(req.user!.id, 'AUTH_LOGOUT', 'USER', req.user!.id, `Pengguna ${req.user!.email} melakukan logout.`, req);
  res.clearCookie('cendraloka_token');
  res.json({ success: true, message: 'Berhasil keluar dari sistem.' });
});

export default router;
