import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Search,
  Calendar,
} from 'lucide-react';

export const ReviewerAssignmentsView: React.FC = () => {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!token) return;
    const fetchAssignments = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/v1/reviewer/assignments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setAssignments(data.assignments || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, [token]);

  const filtered = assignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.submission_number.toLowerCase().includes(search.toLowerCase()) ||
      a.journal_title.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? a.status === 'INVITED' || a.status === 'ACCEPTED'
        : statusFilter === 'completed'
        ? a.status === 'COMPLETED'
        : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout
      title="Tugas Telaah Naskah Ilmiah"
      subtitle="Evaluasi naskah sejawat dengan perlindungan anonimitas ganda (Double-Blind Peer Review)."
    >
      {/* Search & Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari naskah atau nomor registrasi..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600 transition"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {[
            { id: 'all', label: 'Semua Tugas' },
            { id: 'active', label: 'Aktif Berjalan' },
            { id: 'completed', label: 'Selesai Ditelaah' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400">Memuat tugas reviewer...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 font-semibold text-sm">Tidak ada tugas telaah yang cocok.</p>
          </div>
        ) : (
          filtered.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-blue-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                    {a.submission_number}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      a.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}
                  >
                    {a.status === 'COMPLETED' ? 'Telaah Terkirim' : 'Menunggu Telaah'}
                  </span>
                  <span className="text-xs text-blue-700 font-semibold">{a.journal_title}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug mb-2">{a.title}</h3>

                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium flex-wrap">
                  <span className="flex items-center gap-1 text-rose-600 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Tenggat Telaah: {a.due_date}</span>
                  </span>
                  {a.recommendation && (
                    <span className="text-emerald-700 font-bold">Rekomendasi Anda: [{a.recommendation}]</span>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                <Link
                  to={`/reviewer/assignments/${a.id}`}
                  className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>{a.status === 'COMPLETED' ? 'Lihat Laporan' : 'Isi Lembar Telaah'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};
