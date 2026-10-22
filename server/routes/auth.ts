import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { queryOne, run } from '../db/database.js';
import { generateToken, requireAuth, logAudit, AuthenticatedRequest } from '../middleware/auth.js';
import { supabaseServer } from '../db/supabase.js';

const router = Router();

// POST /api/v1/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role: selectedRole } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    let user: any = null;

    // 1. Check Supabase first
    try {
      const { data: supaUser } = await supabaseServer
        .from('users')
        .select('id, email, password_hash, full_name, role, institution, orcid, phone, bio, is_active')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (supaUser) {
        user = supaUser;
      }
    } catch (supaErr) {
      console.warn('Supabase query error in login:', supaErr);
    }

    // 2. Fallback to local SQLite if not found in Supabase
    if (!user) {
      try {
        user = queryOne(
          'SELECT id, email, password_hash, full_name, role, institution, orcid, phone, bio, is_active FROM users WHERE LOWER(email) = LOWER(?);',
          [cleanEmail]
        );
      } catch (sqlErr) {
        console.warn('Local SQLite query error in login:', sqlErr);
      }
    }

    if (!user) {
      res.status(401).json({ success: false, message: 'Kombinasi email dan kata sandi tidak ditemukan.' });
      return;
    }

    if (user.is_active === false || user.is_active === 0) {
      res.status(403).json({ success: false, message: 'Akun Anda dinonaktifkan. Hubungi administrator jurnal.' });
      return;
    }

    // Password verification: accept demo password or bcrypt compare
    let isValidPassword = false;
    if (password === 'Password123!') {
      isValidPassword = true;
    } else if (user.password_hash) {
      try {
        isValidPassword = bcrypt.compareSync(password, user.password_hash);
      } catch (e) {
        isValidPassword = false;
      }
    }

    if (!isValidPassword) {
      res.status(401).json({ success: false, message: 'Kombinasi email dan kata sandi tidak valid.' });
      return;
    }

    // Role verification
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

    try {
      logAudit(user.id, 'AUTH_LOGIN', 'USER', user.id, `Pengguna ${user.email} berhasil login sebagai [${user.role}].`, req);
    } catch (e) {}

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
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: err?.message || 'Terjadi kesalahan sistem internal.' });
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
    let user: any = null;

    // Check Supabase
    try {
      const { data: supaUser } = await supabaseServer
        .from('users')
        .select('*')
        .ilike('email', cleanEmail)
        .maybeSingle();
      if (supaUser) user = supaUser;
    } catch (e) {}

    // Check SQLite
    if (!user) {
      try {
        user = queryOne('SELECT * FROM users WHERE LOWER(email) = LOWER(?);', [cleanEmail]);
      } catch (e) {}
    }

    if (!user) {
      // Auto-register via Google
      const userId = `usr-goog-${Date.now()}`;
      const now = new Date().toISOString();
      const defaultName = full_name || cleanEmail.split('@')[0];
      const assignedRole = role || 'author';

      const newUserObj = {
        id: userId,
        email: cleanEmail,
        password_hash: 'GOOGLE_AUTH_SECURED',
        full_name: defaultName,
        role: assignedRole,
        institution: 'Afiliasi Google User',
        is_active: true,
        created_at: now,
        updated_at: now,
      };

      try {
        await supabaseServer.from('users').insert(newUserObj);
      } catch (e) {}

      try {
        run(
          `INSERT INTO users (id, email, password_hash, full_name, role, institution, orcid, phone, bio, is_active, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, null, null, 'Terdaftar via Google Sign-In', 1, ?, ?)`,
          [userId, cleanEmail, 'GOOGLE_AUTH_SECURED', defaultName, assignedRole, 'Afiliasi Google User', now, now]
        );
      } catch (e) {}

      user = newUserObj;
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

    try {
      logAudit(user.id, 'AUTH_GOOGLE', 'USER', user.id, `Pengguna ${user.email} berhasil login via Google Sign-In [${user.role}].`, req);
    } catch (e) {}

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
  } catch (err: any) {
    console.error('Google auth error:', err);
    res.status(500).json({ success: false, message: err?.message || 'Gagal memproses autentikasi Google.' });
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

    const cleanEmail = email.trim().toLowerCase();

    // Check existing in Supabase
    try {
      const { data: supaExisting } = await supabaseServer
        .from('users')
        .select('id')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (supaExisting) {
        res.status(400).json({ success: false, message: 'Alamat email sudah terdaftar dalam sistem.' });
        return;
      }
    } catch (e) {}

    const passwordHash = bcrypt.hashSync(password, 10);
    const userId = `usr-aut-${Date.now()}`;
    const now = new Date().toISOString();

    const newUser = {
      id: userId,
      email: cleanEmail,
      password_hash: passwordHash,
      full_name: full_name.trim(),
      role: 'author',
      institution: institution || 'Afiliasi Mandiri',
      orcid: orcid || null,
      phone: phone || null,
      bio: '',
      is_active: true,
      created_at: now,
      updated_at: now,
    };

    try {
      await supabaseServer.from('users').insert(newUser);
    } catch (e) {}

    try {
      run(
        `INSERT INTO users (id, email, password_hash, full_name, role, institution, orcid, phone, bio, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'author', ?, ?, ?, '', 1, ?, ?)`,
        [userId, cleanEmail, passwordHash, full_name.trim(), institution || 'Afiliasi Mandiri', orcid || null, phone || null, now, now]
      );
    } catch (e) {}

    try {
      logAudit(userId, 'AUTH_REGISTER', 'USER', userId, `Registrasi akun penulis baru: ${cleanEmail}`, req);
    } catch (e) {}

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Anda sekarang dapat masuk menggunakan akun Penulis.',
    });
  } catch (err: any) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: err?.message || 'Gagal memproses pendaftaran.' });
  }
});

// GET /api/v1/auth/me
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    let user: any = null;

    try {
      const { data: supaUser } = await supabaseServer
        .from('users')
        .select('id, email, full_name, role, institution, orcid, phone, bio, created_at')
        .eq('id', userId)
        .maybeSingle();
      if (supaUser) user = supaUser;
    } catch (e) {}

    if (!user) {
      try {
        user = queryOne(
          'SELECT id, email, full_name, role, institution, orcid, phone, bio, created_at FROM users WHERE id = ?;',
          [userId]
        );
      } catch (e) {}
    }

    if (!user) {
      user = req.user;
    }

    res.json({ success: true, user });
  } catch (err: any) {
    res.json({ success: true, user: req.user });
  }
});

// POST /api/v1/auth/logout
router.post('/logout', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    logAudit(req.user!.id, 'AUTH_LOGOUT', 'USER', req.user!.id, `Pengguna ${req.user!.email} melakukan logout.`, req);
  } catch (e) {}
  res.clearCookie('cendraloka_token');
  res.json({ success: true, message: 'Berhasil keluar dari sistem.' });
});

export default router;
