import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { queryOne, run } from '../db/database.js';
import { supabaseServer } from '../db/supabase.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'cendraloka-scientific-publishing-secret-2025';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  full_name: string;
  institution?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      institution: user.institution,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.cendraloka_token) {
    token = req.cookies.cendraloka_token;
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Autentikasi diperlukan. Silakan login kembali.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;

    let userInDb: any = null;
    try {
      const { data: supaUser } = await supabaseServer
        .from('users')
        .select('id, email, role, full_name, institution, is_active')
        .eq('id', decoded.id)
        .maybeSingle();
      if (supaUser) userInDb = supaUser;
    } catch (e) {}

    if (!userInDb) {
      try {
        userInDb = queryOne('SELECT id, email, role, full_name, institution, is_active FROM users WHERE id = ?;', [decoded.id]);
      } catch (e) {}
    }

    if (userInDb && userInDb.is_active === false) {
      res.status(401).json({ success: false, message: 'Akun tidak aktif atau dinonaktifkan.' });
      return;
    }

    req.user = {
      id: userInDb ? userInDb.id : decoded.id,
      email: userInDb ? userInDb.email : decoded.email,
      role: userInDb ? userInDb.role : decoded.role,
      full_name: userInDb ? userInDb.full_name : decoded.full_name,
      institution: userInDb ? userInDb.institution : decoded.institution,
    };
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Sesi kedaluwarsa atau token tidak valid.' });
  }
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Autentikasi diperlukan.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Akses ditolak. Endpoint ini memerlukan salah satu peran: [${allowedRoles.join(', ')}]. Peran Anda saat ini: ${req.user.role}.`,
      });
      return;
    }

    next();
  };
}

export function logAudit(
  userId: string | null,
  action: string,
  entityType: string,
  entityId: string | null,
  details: string,
  req?: Request
): void {
  try {
    const id = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const ip = req ? (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1' : '127.0.0.1';
    const now = new Date().toISOString();

    // Async log to Supabase
    supabaseServer
      .from('audit_logs')
      .insert({
        id,
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details,
        ip_address: ip,
        created_at: now,
      })
      .then(() => {})
      .catch(() => {});

    try {
      run(
        'INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, userId, action, entityType, entityId, details, ip, now]
      );
    } catch (err) {}
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
