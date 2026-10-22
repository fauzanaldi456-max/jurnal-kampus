import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { BookOpen, PlusCircle, Building, CheckCircle2, X } from 'lucide-react';

export const AdminJournalsView: React.FC = () => {
  const { token } = useAuth();
  const [journals, setJournals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Journal Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [issnOnline, setIssnOnline] = useState('');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState('');
  const [sinta, setSinta] = useState('SINTA 2');
  const [publisher, setPublisher] = useState('Konsorsium Jurnal Ilmiah Cendraloka');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchJournals = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const res = await fetch('/api/v1/admin/journals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setJournals(data.journals || []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, [token]);

  const handleCreateJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Judul jurnal wajib diisi.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/v1/admin/journals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          abbreviation,
          issn_online: issnOnline,
          description,
          scope,
          sinta_accreditation: sinta,
          publisher,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('Jurnal baru berhasil ditambahkan!');
        setModalOpen(false);
        setTitle('');
        setAbbreviation('');
        setIssnOnline('');
        setDescription('');
        fetchJournals();
      } else {
        alert(data.message || 'Gagal membuat jurnal.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Direktori Jurnal Konsorsium"
      subtitle="Tata kelola berkala ilmiah, delegasi dewan redaksi, status akreditasi SINTA, dan pengindeksan."
      actionButton={
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-blue-500/20 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Jurnal Baru</span>
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-400">Memuat jurnal...</div>
        ) : (
          journals.map((j) => (
            <div
              key={j.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between hover:border-blue-200 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {j.sinta_accreditation || 'Terakreditasi'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">e-ISSN: {j.issn_online || '-'}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug mb-2">{j.title}</h3>

                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {j.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Penerbit: {j.publisher}</span>
                <span className="font-bold text-blue-700">{j.real_submission_count || 0} Naskah</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add Journal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900">
                Tambah Jurnal Ilmiah Baru
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJournal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Judul Lengkap Jurnal *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Jurnal Sains Terapan & Inovasi Energi"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Nama Singkat (Abbr)</label>
                  <input
                    type="text"
                    value={abbreviation}
                    onChange={(e) => setAbbreviation(e.target.value)}
                    placeholder="J. Sains Terap."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">e-ISSN</label>
                  <input
                    type="text"
                    value={issnOnline}
                    onChange={(e) => setIssnOnline(e.target.value)}
                    placeholder="2888-1234"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Deskripsi Fokus & Ruang Lingkup</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Uraikan fokus keilmuan dan target publikasi..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Akreditasi SINTA</label>
                  <select
                    value={sinta}
                    onChange={(e) => setSinta(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="SINTA 1">SINTA 1 (Garuda Unggul)</option>
                    <option value="SINTA 2">SINTA 2 (Terakreditasi Nasional)</option>
                    <option value="SINTA 3">SINTA 3</option>
                    <option value="SINTA 4">SINTA 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Penerbit</label>
                  <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Mendaftarkan Jurnal...' : 'Daftarkan Jurnal ke Konsorsium'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
