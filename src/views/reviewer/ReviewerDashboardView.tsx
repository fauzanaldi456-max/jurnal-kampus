import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { MiniCalendar } from '../../components/dashboard/MiniCalendar';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  FileText,
  Calendar,
  Building,
  Sparkles,
  Award,
  BookOpen,
  HelpCircle,
} from 'lucide-react';

export const ReviewerDashboardView: React.FC = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });
  const [assignments, setAssignments] = useState<any[]>([]);
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
        const [statsRes, assignRes] = await Promise.all([
          fetch('/api/v1/reviewer/stats', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/v1/reviewer/assignments', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (statsRes.ok) {
          const s = await statsRes.json();
          if (s.success) setStats(s.stats);
        }

        if (assignRes.ok) {
          const a = await assignRes.json();
          if (a.success) setAssignments(a.assignments || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [token]);

  const activeAssignments = assignments.filter((a) => a.status === 'INVITED' || a.status === 'ACCEPTED');

  return (
    <DashboardLayout hideHeaderCard>
      {/* Metric Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Active Assignments */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-blue-200 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Naskah Dalam Telaah</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
              Perlu Dikerjakan
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-blue-700 block">
            {stats.active}
          </span>
        </div>

        {/* Completed Reviews */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-emerald-200 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Laporan Telaah Dikirim</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              Selesai
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-emerald-700 block">
            {stats.completed}
          </span>
        </div>

        {/* Total Lifetime Assignments */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Semua Penugasan</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Total Kontribusi
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-slate-900 block">
            {stats.total}
          </span>
        </div>
      </div>

      {/* 3. Main Split Grid (8 cols left + 4 cols right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Quick Actions, Active Review Queue */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Actions Row */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Space_Grotesk'] text-sm sm:text-base font-bold text-slate-900">
                Menu Cepat Mitra Bestari (Reviewer Actions)
              </h2>
              <span className="text-xs text-slate-400 font-medium">Instrumen Telaah</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Link
                to="/reviewer/assignments"
                className="p-4 rounded-2xl bg-blue-50/50 hover:bg-blue-50 border border-blue-100 transition text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  Tugas Telaah Aktif
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Lembar evaluasi</span>
              </Link>

              <Link
                to="/reviewer/history"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-white text-slate-700 flex items-center justify-center mx-auto mb-2 border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  Riwayat Telaah
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Arsip rekomendasi</span>
              </Link>

              <Link
                to="/pedoman-penulis"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-white text-slate-700 flex items-center justify-center mx-auto mb-2 border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  Pedoman COPE
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Etika reviewer</span>
              </Link>
            </div>
          </div>

          {/* Active Review Assignments List */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h2 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-slate-900">
                  Tugas Telaah Sejawat Aktif (Double-Blind)
                </h2>
              </div>
              <Link
                to="/reviewer/assignments"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Semua Tugas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-slate-400 text-xs">Memuat daftar tugas telaah...</div>
            ) : activeAssignments.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50/70 border border-slate-200 text-center text-xs text-slate-500">
                Saat ini tidak ada tugas telaah naskah yang menunggu. Anda akan menerima notifikasi jika dewan redaksi menugaskan naskah baru.
              </div>
            ) : (
              <div className="space-y-3">
                {activeAssignments.map((a) => (
                  <div
                    key={a.id}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                          {a.submission_number}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">{a.journal_title}</span>
                        <span className="text-xs text-rose-600 font-bold flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Tenggat: {a.due_date}</span>
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug mb-1">
                        {a.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-1 mb-2">{a.abstract}</p>

                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Identitas Penulis Disamarkan (Double-Blind Standard)
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <Link
                        to={`/reviewer/assignments/${a.id}`}
                        className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <span>Buka Lembar Telaah</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Mini Calendar, Evaluation Rubric Info, Ethics Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mini Calendar Widget */}
          <MiniCalendar />

          {/* Evaluation Rubrics Summary */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <h3 className="font-['Space_Grotesk'] text-sm font-bold text-slate-900 mb-3">
              Indikator Rubrik Telaah
            </h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span>1. Orisinalitas & Kebaruan</span>
                <span className="font-bold text-blue-600">Bobot 25%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span>2. Metodologi Penelitian</span>
                <span className="font-bold text-blue-600">Bobot 30%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span>3. Analisis & Pembahasan</span>
                <span className="font-bold text-blue-600">Bobot 25%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span>4. Referensi Primer (10 Thn)</span>
                <span className="font-bold text-blue-600">Bobot 20%</span>
              </div>
            </div>
          </div>

          {/* Ethics Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <h3 className="font-['Space_Grotesk'] text-sm font-bold text-slate-900">
                Sertifikat & Kredit Reviewer
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Setiap telaah yang selesai tercatat otomatis dalam profil akademik Anda dan dapat diklaim sebagai bukti kinerja mitra bestari (Bercap digital OJS).
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
