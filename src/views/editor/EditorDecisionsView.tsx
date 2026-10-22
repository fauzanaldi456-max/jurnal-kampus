import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, FileText, Calendar } from 'lucide-react';

export const EditorDecisionsView: React.FC = () => {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchDecided = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/v1/editor/submissions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            // Filter submissions with decisions
            const decided = (data.submissions || []).filter(
              (s: any) => s.status === 'ACCEPTED' || s.status === 'REVISION_REQUIRED' || s.status === 'DECLINED' || s.status === 'PUBLISHED'
            );
            setSubmissions(decided);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDecided();
  }, [token]);

  return (
    <DashboardLayout
      title="Buku Registrasi Keputusan Editorial"
      subtitle="Arsip penetapan keputusan dewan redaksi (Diterima, Revisi, atau Ditolak) beserta catatan resmi."
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400">Memuat riwayat keputusan...</div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 font-semibold text-sm">Belum ada keputusan editorial yang diterbitkan.</p>
          </div>
        ) : (
          submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                    {sub.submission_number}
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-0.5 rounded-full border ${
                      sub.status === 'ACCEPTED' || sub.status === 'PUBLISHED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : sub.status === 'REVISION_REQUIRED'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    Keputusan: {sub.status}
                  </span>
                  <span className="text-xs text-blue-700 font-semibold">{sub.journal_title}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base leading-snug mb-1">{sub.title}</h3>
                <span className="text-xs text-slate-400">Penulis: {sub.author_name}</span>
              </div>

              <div className="shrink-0">
                <Link
                  to={`/editor/submissions/${sub.id}`}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition inline-flex items-center gap-1.5"
                >
                  <span>Lihat Riwayat Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};
