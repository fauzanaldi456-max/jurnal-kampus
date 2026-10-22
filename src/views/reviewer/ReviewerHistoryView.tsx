import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { History, CheckCircle2, ArrowRight } from 'lucide-react';

export const ReviewerHistoryView: React.FC = () => {
  const { token } = useAuth();
  const [completed, setCompleted] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/v1/reviewer/assignments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            const finished = (data.assignments || []).filter((a: any) => a.status === 'COMPLETED');
            setCompleted(finished);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  return (
    <DashboardLayout
      title="Riwayat Portofolio Telaah Mitra Bestari"
      subtitle="Arsip seluruh naskah ilmiah yang telah berhasil Anda telaah dalam konsorsium Cendraloka."
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400">Memuat riwayat telaah...</div>
        ) : completed.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-800 text-sm">Belum ada riwayat telaah yang selesai.</p>
            <p className="text-xs text-slate-400 mt-1">Laporan telaah yang telah Anda kirimkan akan diarsipkan di sini.</p>
          </div>
        ) : (
          completed.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                    {a.submission_number}
                  </span>
                  <span className="text-xs font-bold text-blue-700">{a.journal_title}</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Rekomendasi: {a.recommendation || 'Accepted'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base leading-snug mb-1">{a.title}</h3>
                <span className="text-xs text-slate-400">
                  Selesai Ditelaah: {a.completed_at ? new Date(a.completed_at).toLocaleDateString('id-ID') : '-'}
                </span>
              </div>

              <div className="shrink-0">
                <Link
                  to={`/reviewer/assignments/${a.id}`}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition inline-flex items-center gap-1.5"
                >
                  <span>Lihat Lembar Telaah</span>
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
