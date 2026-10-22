import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import {
  FileText,
  Search,
  Filter,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  Calendar,
  Building,
  User,
} from 'lucide-react';

export const AuthorSubmissionsView: React.FC = () => {
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
        const res = await fetch('/api/v1/author/submissions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setSubmissions(data.submissions || []);
          }
        }
      } catch (err) {
        console.error('Failed to fetch author submissions:', err);
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
      (sub.journal_title && sub.journal_title.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      selectedStatus === 'all'
        ? true
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
        return { label: 'Pemeriksaan Administrasi', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'IN_REVIEW':
        return { label: 'Dalam Proses Telaah (Review)', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'REVISION_REQUIRED':
        return { label: 'Revisi Diperlukan', color: 'bg-rose-50 text-rose-700 border-rose-200' };
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
    <DashboardLayout
      title="Naskah Publikasi Saya"
      subtitle="Daftar lengkap naskah ilmiah yang Anda ajukan ke jurnal ilmiah konsorsium Cendraloka."
      actionButton={
        <Link
          to="/author/submissions/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-blue-500/20 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ajukan Naskah Baru</span>
        </Link>
      }
    >
      {/* Search and Filters Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau nomor naskah..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'review', label: 'Dalam Review' },
            { id: 'revision', label: 'Perlu Revisi' },
            { id: 'accepted', label: 'Diterima' },
            { id: 'published', label: 'Diterbitkan' },
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

      {/* Submissions List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400">Memuat data naskah...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-base mb-1">Tidak ada naskah ditemukan</h3>
            <p className="text-xs text-slate-500 mb-4">Coba sesuaikan kata kunci pencarian atau filter status Anda.</p>
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
                    <span className="text-xs text-blue-700 font-semibold truncate">
                      {sub.journal_title}
                    </span>
                  </div>

                  <h2 className="font-bold text-slate-900 text-base sm:text-lg leading-snug mb-2">
                    {sub.title}
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                    {sub.abstract}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(sub.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    {sub.category && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                        {sub.category}
                      </span>
                    )}
                    {sub.authors && sub.authors.length > 0 && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{sub.authors.length} Penulis</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <Link
                    to={`/author/submissions/${sub.id}`}
                    className="w-full md:w-auto px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Buka Rincian & Revisi</span>
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
