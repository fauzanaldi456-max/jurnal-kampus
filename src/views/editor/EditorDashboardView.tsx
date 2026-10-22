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
  Users,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Inbox,
  Send,
  Calendar,
  Building,
  Sparkles,
  UserCheck,
  Award,
  BookOpen,
} from 'lucide-react';

export const EditorDashboardView: React.FC = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    technicalCheck: 0,
    inReview: 0,
    revision: 0,
    accepted: 0,
    published: 0,
  });
  const [submissions, setSubmissions] = useState<any[]>([]);
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
        const [statsRes, subsRes] = await Promise.all([
          fetch('/api/v1/editor/stats', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/v1/editor/submissions', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (statsRes.ok) {
          const s = await statsRes.json();
          if (s.success) setStats(s.stats);
        }

        if (subsRes.ok) {
          const subData = await subsRes.json();
          if (subData.success) setSubmissions(subData.submissions || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [token]);

  const pendingTechnicalCheck = submissions.filter(
    (s) => s.status === 'SUBMITTED' || s.status === 'TECHNICAL_CHECK'
  );
  const readyForDecision = submissions.filter(
    (s) => s.status === 'IN_REVIEW' && s.reviewers && s.reviewers.some((r: any) => r.recommendation)
  );

  return (
    <DashboardLayout hideHeaderCard>
      {/* Metric Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {/* Desk Check */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-amber-200 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Evaluasi Awal</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
              Desk Check
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-amber-700 block">
            {stats.technicalCheck}
          </span>
        </div>

        {/* In Review */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-blue-200 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Dalam Telaah</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
              Mitra Bestari
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-blue-700 block">
            {stats.inReview}
          </span>
        </div>

        {/* In Revision */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-rose-200 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Di Meja Penulis</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">
              Revisi
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-rose-600 block">
            {stats.revision}
          </span>
        </div>

        {/* Accepted */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-emerald-200 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Siap Terbit</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
              Diterima
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-emerald-700 block">
            {stats.accepted}
          </span>
        </div>

        {/* Total Submissions */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Seluruh Naskah</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Total
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-slate-900 block">
            {stats.total}
          </span>
        </div>
      </div>

      {/* 3. Main Split Grid (8 cols left + 4 cols right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Quick Actions, Priority Desk Check, Decision Queue */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Actions Row */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Space_Grotesk'] text-sm sm:text-base font-bold text-slate-900">
                Menu Cepat Editorial (Editorial Actions)
              </h2>
              <span className="text-xs text-slate-400 font-medium">Alur Kerja OJS</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                to="/editor/submissions"
                className="p-4 rounded-2xl bg-amber-50/60 hover:bg-amber-50 border border-amber-100 transition text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <Inbox className="w-5 h-5" />
                </div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-amber-700">
                  Desk Check
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Evaluasi teknis</span>
              </Link>

              <Link
                to="/editor/reviewers"
                className="p-4 rounded-2xl bg-blue-50/60 hover:bg-blue-50 border border-blue-100 transition text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  Tugaskan Reviewer
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Mitra bestari</span>
              </Link>

              <Link
                to="/editor/decisions"
                className="p-4 rounded-2xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-100 transition text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                  Keputusan Redaksi
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Accept / Reject</span>
              </Link>

              <Link
                to="/editor/submissions"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-white text-slate-700 flex items-center justify-center mx-auto mb-2 border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  Katalog Naskah
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Arsip & issue</span>
              </Link>
            </div>
          </div>

          {/* Priority Desk Check Submissions */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <h2 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-slate-900">
                  Perlu Pemeriksaan Teknis Segera (Desk Check)
                </h2>
              </div>
              <Link
                to="/editor/submissions"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Semua Naskah</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingTechnicalCheck.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200 text-center text-xs text-slate-500">
                Tidak ada antrean naskah yang menunggu pemeriksaan teknis saat ini.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTechnicalCheck.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">
                          {sub.submission_number}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium truncate">
                          {sub.journal_abbr || sub.journal_title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          Penulis: {sub.author_name}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 mb-1">
                        {sub.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{sub.abstract}</p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <Link
                        to={`/editor/submissions/${sub.id}`}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <span>Evaluasi Naskah</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Mini Calendar, Editorial Agenda, Reviewer Activity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mini Calendar Widget */}
          <MiniCalendar />

          {/* Editorial Schedule & Deadlines */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Space_Grotesk'] text-sm font-bold text-slate-900">
                Agenda Redaksi & Target Terbit
              </h3>
              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">
                OJS 2026
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800">Deadline Review Ronde 1</span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Aktif
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  21 hari masa telaah mandiri mitra bestari sebelum rekapitulasi.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800">Penerbitan Vol. 12 No. 1</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Terjadwal
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Target terbit 10 artikel ber-DOI Crossref & indeksasi Garuda.
                </p>
              </div>
            </div>
          </div>

          {/* Ethics & Standards Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-['Space_Grotesk'] text-sm font-bold text-slate-900">
                Integritas & Etika Publikasi
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dewan editor mematuhi kode etik penerbitan ilmiah COPE (Committee on Publication Ethics) dan standar akreditasi ARJUNA / SINTA Kemenristekdikti.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
