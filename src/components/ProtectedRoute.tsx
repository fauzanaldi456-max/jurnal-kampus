import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-600">Memverifikasi hak akses portal ilmiah...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/masuk?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const roleLabels: Record<UserRole, string> = {
      author: 'Mahasiswa / Penulis',
      editor: 'Editorial / Dewan Editor',
      reviewer: 'Mitra Bestari / Peer Reviewer',
      admin: 'Super Admin',
    };

    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Akses Terbatas (403 Forbidden)</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Halaman ini membutuhkan hak akses peran{' '}
            <span className="font-semibold text-blue-700">
              {allowedRoles.map((r) => roleLabels[r]).join(' atau ')}
            </span>
            . Akun Anda saat ini terdaftar dengan peran{' '}
            <span className="font-semibold text-amber-700">{roleLabels[user.role]}</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={`/${user.role}/dashboard`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Buka Dashboard Saya</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Beranda</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
