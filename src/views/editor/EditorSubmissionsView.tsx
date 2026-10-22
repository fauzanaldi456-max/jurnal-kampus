import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import {
  FileText,
  Search,
  Filter,
  ArrowRight,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';

export const EditorSubmissionsView: React.FC = () => {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    if (!token) return;

    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/v1/editor/submissions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setSubmissions(data.submissions || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [token]);

  const filtered = submissions.filter((sub) => {
    const matchesSearch =
      sub.title.toLowerCase().includes(search.toLowerCase()) ||
      sub.submission_number.toLowerCase().includes(search.toLowerCase()) ||
      (sub.author_name && sub.author_name.toLowerCase().includes(search.toLowerCase())) ||
      (sub.journal_title && sub.journal_title.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      selectedStatus === 'all'
        ? true
        : selectedStatus === 'technical'
        ? sub.status === 'SUBMITTED' || sub.status === 'TECHNICAL_CHECK'
        : selectedStatus === 'review'
        ? sub.status === 'IN_REVIEW'
        : selectedStatus === 'revision'
        ? sub.status === 'REVISION_REQUIRED'
        : selectedStatus === 'accepted'
        ? sub.status === 'ACCEPTED'
        : selectedStatus === 'published'
        ? sub.status === 'PUBLISHED'
        : true;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
      case 'TECHNICAL_CHECK':
        return { label: 'Perlu Desk Check', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'IN_REVIEW':
        return { label: 'Peer Review Berjalan', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'REVISION_REQUIRED':
        return { label: 'Dalam Revisi Penulis', color: 'bg-rose-50 text-rose-800 border-rose-200' };
      case 'ACCEPTED':
        return { label: 'Diterima (Accepted)', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'PUBLISHED':
        return { label: 'Telah Diterbitkan', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'DECLINED':
        return { label: 'Ditolak', color: 'bg-slate-100 text-slate-700 border-slate-200' };
      default:
        return { label: status, color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <DashboardLayout
      title="Semua Naskah Masuk (Editorial Pool)"
      subtitle="Pengelolaan alur editorial terpusat untuk seluruh naskah pada jurnal yang ditugaskan."
    >
      {/* Search & Status Filters */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari naskah, nomor ID, atau penulis..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Semua Naskah' },
            { id: 'technical', label: 'Desk Check' },
            { id: 'review', label: 'Dalam Review' },
            { id: 'revision', label: 'Revisi' },
            { id: 'accepted', label: 'Diterima' },
            { id: 'published', label: 'Terbit' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedStatus === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Table / Cards */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400">Memuat naskah editorial...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-base mb-1">Tidak ada naskah ditemukan</h3>
            <p className="text-xs text-slate-500">Tidak ada naskah yang cocok dengan filter yang dipilih.</p>
          </div>
        ) : (
          filtered.map((sub) => {
            const badge = getStatusBadge(sub.status);
            return (
              <div
                key={sub.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-blue-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                      {sub.submission_number}
                    </span>
                    <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs text-blue-700 font-bold truncate">
                      {sub.journal_title}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug mb-2">
                    {sub.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium flex-wrap">
                    <span>
                      Penulis Utama: <strong className="text-slate-800 font-semibold">{sub.author_name}</strong> ({sub.author_email})
                    </span>
                    <span>•</span>
                    <span>
                      Tanggal Masuk: {new Date(sub.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {sub.reviewers && sub.reviewers.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-blue-700 font-semibold">
                          {sub.reviewers.length} Reviewer Ditugaskan
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <Link
                    to={`/editor/submissions/${sub.id}`}
                    className="w-full md:w-auto px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Proses Editorial</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
};
