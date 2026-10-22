import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Users, Mail, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const EditorReviewersView: React.FC = () => {
  const { token } = useAuth();
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchReviewers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/v1/editor/reviewers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setReviewers(data.reviewers || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviewers();
  }, [token]);

  return (
    <DashboardLayout
      title="Direktori Mitra Bestari (Peer Reviewers)"
      subtitle="Daftar pakar dan reviewer independen terverifikasi yang tersedia untuk penugasan telaah sejawat."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-400">
            Memuat direktori mitra bestari...
          </div>
        ) : (
          reviewers.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-blue-200 transition"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
                    {rev.full_name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{rev.full_name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Building className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{rev.institution}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {rev.bio || 'Pakar independen terverifikasi di bidang keilmuan terkait.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px] truncate">{rev.email}</span>
                <span className="font-bold text-blue-700 px-2 py-0.5 rounded-full bg-blue-50 text-[10px]">
                  {rev.active_assignments || 0} Tugas Aktif
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};
