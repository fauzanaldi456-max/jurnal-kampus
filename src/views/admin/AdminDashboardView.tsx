import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { MiniCalendar } from '../../components/dashboard/MiniCalendar';
import {
  Users,
  BookOpen,
  FileText,
  FileCheck2,
  ShieldCheck,
  History,
  TrendingUp,
  ArrowRight,
  Server,
  Building,
  PlusCircle,
  Calendar,
  Sparkles,
  Lock,
  Database,
  Activity,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    usersCount: 0,
    journalsCount: 0,
    submissionsCount: 0,
    reviewsCount: 0,
    publishedCount: 0,
    auditLogsCount: 0,
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, logsRes] = await Promise.all([
          fetch('/api/v1/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/v1/admin/audit-logs?limit=6', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (statsRes.ok) {
          const s = await statsRes.json();
          if (s.success) setStats(s.stats);
        }

        if (logsRes.ok) {
          const l = await logsRes.json();
          if (l.success) setRecentLogs(l.logs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [token]);

  return (
    <DashboardLayout hideHeaderCard>
      {/* Metric Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {/* Total Users */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-blue-200 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Pengguna Terdaftar</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
              4 Role
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-slate-900 block">
            {stats.usersCount}
          </span>
        </div>

        {/* Journals Count */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-emerald-200 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Jurnal Terbitan</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              Konsorsium
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-emerald-700 block">
            {stats.journalsCount}
          </span>
        </div>

        {/* Submissions Count */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-amber-200 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Total Naskah Riset</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
              Naskah
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-amber-700 block">
            {stats.submissionsCount}
          </span>
        </div>

        {/* Reviews Count */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-indigo-200 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Penugasan Review</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              Peer Review
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-indigo-700 block">
            {stats.reviewsCount}
          </span>
        </div>

        {/* Audit Logs Count */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-rose-200 transition col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Catatan Audit Log</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">
              Keamanan
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-rose-600 block">
            {stats.auditLogsCount}
          </span>
        </div>
      </div>

      {/* 3. Main Split Grid (8 cols left + 4 cols right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Quick Actions, Core Management Cards, Live Audit Stream */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Actions Row */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Space_Grotesk'] text-sm sm:text-base font-bold text-slate-900">
                Menu Cepat Super Admin (System Actions)
              </h2>
              <span className="text-xs text-slate-400 font-medium">Kendali Master</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Link
                to="/admin/users"
                className="p-4 rounded-2xl bg-blue-50/50 hover:bg-blue-50 border border-blue-100 transition text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  Manajemen Pengguna
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Kelola 4 Role</span>
              </Link>

              <Link
                to="/admin/journals"
                className="p-4 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 transition text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                  Direktori Jurnal
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">ISSN & Editor</span>
              </Link>

              <Link
                to="/admin/audit-logs"
                className="p-4 rounded-2xl bg-rose-50/50 hover:bg-rose-50 border border-rose-100 transition text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <History className="w-5 h-5" />
                </div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-rose-600">
                  Jejak Audit Keamanan
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Log aktivitas</span>
              </Link>
            </div>
          </div>

          {/* Live Security Audit Stream */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <h2 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-slate-900">
                  Jejak Audit Aktivitas & Keamanan Terkini
                </h2>
              </div>
              <Link
                to="/admin/audit-logs"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Lihat Seluruh Log</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-slate-400 text-xs">Memuat jejak audit...</div>
            ) : recentLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">Belum ada rekaman audit log.</div>
            ) : (
              <div className="space-y-2.5">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 sm:p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100/70 transition flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                          {log.action}
                        </span>
                        <span className="font-semibold text-slate-800">{log.user_email || 'Sistem'}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(log.created_at).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] truncate">
                        {log.details || log.entity_type} {log.ip_address ? `• IP: ${log.ip_address}` : ''}
                      </p>
                    </div>

                    <span className="shrink-0 text-[10px] font-mono px-2 py-1 rounded bg-white border border-slate-200 text-slate-600">
                      ID #{log.id}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Mini Calendar, System Diagnostics, Roles Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mini Calendar Widget */}
          <MiniCalendar />

          {/* Infrastructure Health Widget */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <h3 className="font-['Space_Grotesk'] text-sm font-bold text-slate-900 mb-3">
              Status Infrastruktur Portal
            </h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Database SQLite (WAL)</span>
                </span>
                <span className="font-bold text-emerald-600 font-mono">Terhubung</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>REST API Server</span>
                </span>
                <span className="font-bold text-emerald-600 font-mono">Port 5000</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Vite Frontend Client</span>
                </span>
                <span className="font-bold text-emerald-600 font-mono">Port 8949</span>
              </div>
            </div>
          </div>

          {/* Security & Access Enforcement */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <h3 className="font-['Space_Grotesk'] text-sm font-bold text-slate-900">
                Keamanan & Akses Terproteksi
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sistem menggunakan token otentikasi JWT dengan enkripsi SHA-256 dan pembatasan hak akses berbasis peran (RBAC) pada setiap endpoint API backend.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
