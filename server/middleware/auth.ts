import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { queryOne, run } from '../db/database.js';

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

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
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

    // Check if user still exists and is active in database
    const userInDb = queryOne('SELECT id, email, role, full_name, institution, is_active FROM users WHERE id = ?;', [decoded.id]);
    if (!userInDb || !userInDb.is_active) {
      res.status(401).json({ success: false, message: 'Akun tidak aktif atau tidak ditemukan.' });
      return;
    }

    req.user = {
      id: userInDb.id,
      email: userInDb.email,
      role: userInDb.role,
      full_name: userInDb.full_name,
      institution: userInDb.institution,
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
        message: `Akses ditolak. Endpoint ini memerlukan role [${allowedRoles.join(', ')}], akun Anda memiliki role [${req.user.role}].`,
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

    run(
      'INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, userId, action, entityType, entityId, details, ip, now]
    );
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
