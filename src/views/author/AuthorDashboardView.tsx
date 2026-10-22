import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { MiniCalendar } from '../../components/dashboard/MiniCalendar';
import {
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Download,
  HelpCircle,
  ExternalLink,
  Calendar,
  Building,
  ChevronRight,
  TrendingUp,
  FileCheck,
} from 'lucide-react';

export const AuthorDashboardView: React.FC = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    inReview: 0,
    revision: 0,
    accepted: 0,
    published: 0,
  });
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Time-based Indonesian greeting
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
        const [statsRes, subsRes] = await Promise.all([
          fetch('/api/v1/author/stats', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/v1/author/submissions', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (statsRes.ok) {
          const sData = await statsRes.json();
          if (sData.success) setStats(sData.stats);
        }

        if (subsRes.ok) {
          const subsData = await subsRes.json();
          if (subsData.success) setSubmissions(subsData.submissions);
        }
      } catch (err) {
        console.error('Failed to load author dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [token]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
      case 'TECHNICAL_CHECK':
        return { label: 'Pemeriksaan Administrasi', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'IN_REVIEW':
        return { label: 'Sedang Ditelaah (Peer Review)', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'REVISION_REQUIRED':
        return { label: 'Perlu Revisi Penulis', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'ACCEPTED':
        return { label: 'Diterima (Accepted)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'PUBLISHED':
        return { label: 'Telah Diterbitkan', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'DECLINED':
        return { label: 'Ditolak', color: 'bg-slate-100 text-slate-700 border-slate-200' };
      default:
        return { label: status, color: 'bg-slate-50 text-slate-600 border-slate-200' };
    }
  };

  return (
    <DashboardLayout hideHeaderCard>
      {/* Metric Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {/* Total Submitted */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-blue-200 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Naskah Terdaftar</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Total
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-slate-900 block">
            {stats.total}
          </span>
        </div>

        {/* In Review */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-blue-200 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Dalam Telaah Mitra</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
              Proses
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-blue-600 block">
            {stats.inReview}
          </span>
        </div>

        {/* Needs Revision */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-rose-200 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Perlu Revisi Anda</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">
              Perlu Tindakan
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-rose-600 block">
            {stats.revision}
          </span>
        </div>

        {/* Accepted */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-emerald-200 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Tahap Produksi</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
              Diterima
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-emerald-600 block">
            {stats.accepted}
          </span>
        </div>

        {/* Published */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-indigo-200 transition col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Telah Ber-DOI</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
              Terbit
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-indigo-600 block">
            {stats.published}
          </span>
        </div>
      </div>

      {/* 3. Main Dashboard Grid: Wide Left (2/3) + Compact Right (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Quick Links, Active Submissions, Publication Pipeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Links Row (MediCore AI Style Quick Action Cards) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Space_Grotesk'] text-sm sm:text-base font-bold text-slate-900">
                Menu Cepat Penulis (Quick Actions)
              </h2>
              <span className="text-xs text-slate-400 font-medium">Bantuan & Dokumen</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                to="/author/submissions/new"
                className="p-4 rounded-2xl bg-blue-50/50 hover:bg-blue-50 border border-blue-100 transition text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  Ajukan Naskah
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Submit online</span>
              </Link>

              <Link
                to="/pedoman-penulis"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition text-center group"
              >
                <div className="w-10 h-10 rounded-2xl bg-white text-slate-700 flex items-center justify-center mx-auto mb-2 border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform">
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  Template MS Word
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Format standar</span>
              </Link>

              <Link
                to="/author/submissions"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition text-center group"
              >
                <div className="w-10 h-10 rounded-2xl bg-white text-slate-700 flex items-center justify-center mx-auto mb-2 border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  Status Naskah
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Lacak review</span>
              </Link>

              <Link
                to="/kontak"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition text-center group"
              >
                <div className="w-10 h-10 rounded-2xl bg-white text-slate-700 flex items-center justify-center mx-auto mb-2 border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform">
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  Tanya Redaksi
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Bantuan teknis</span>
              </Link>
            </div>
          </div>

          {/* Submissions List Section */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-slate-900">
                  Naskah Publikasi Anda
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pantau alur telaah peer-review berkala dan keputusan dewan redaksi jurnal
                </p>
              </div>
              <Link
                to="/author/submissions"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Semua Naskah</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-slate-400 text-xs">Memuat data naskah...</div>
            ) : submissions.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-200/80 rounded-2xl bg-slate-50/50">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">Belum ada naskah yang diajukan.</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Mulai publikasikan karya ilmiah Anda ke salah satu jurnal konsorsium Cendraloka.
                </p>
                <Link
                  to="/author/submissions/new"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Kirim Naskah Pertama</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.slice(0, 5).map((sub) => {
                  const badge = getStatusBadge(sub.status);
                  return (
                    <div
                      key={sub.id}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {sub.submission_number}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                            {badge.label}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium truncate">
                            {sub.journal_abbr || sub.journal_title}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 mb-1">
                          {sub.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{sub.abstract}</p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <Link
                          to={`/author/submissions/${sub.id}`}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Lacak Status</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Mini Calendar, Schedule & Deadlines, Editorial Contacts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mini Calendar Widget (MediCore AI Style) */}
          <MiniCalendar />

          {/* Today's Schedule & Deadlines */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Space_Grotesk'] text-sm font-bold text-slate-900">
                Jadwal & Agenda Penulis
              </h3>
              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">
                Agenda
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800">Batas Revisi Naskah</span>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    Prioritas
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  14 hari kalender sejak catatan telaah mitra bestari diterima.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800">Call for Papers Issue 2</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Terbuka
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Jurnal Teknologi, Pendidikan, dan Manajemen Periode 2026.
                </p>
              </div>
            </div>
          </div>

          {/* Secretariat Contact Box */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <h3 className="font-['Space_Grotesk'] text-sm font-bold text-slate-900 mb-2">
              Sekretariat Dewan Redaksi
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Mengalami kendala saat unggah naskah atau butuh surat keterangan accepted (LoA)? Hubungi dewan redaksi jurnal.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-slate-700">
                <span className="text-slate-500">Surel Redaksi:</span>
                <span className="font-mono font-semibold text-blue-600">editor@cendraloka.ac.id</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-slate-700">
                <span className="text-slate-500">Jam Layanan:</span>
                <span className="font-semibold text-slate-800">Senin - Jumat, 08.00-16.00 WIB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
