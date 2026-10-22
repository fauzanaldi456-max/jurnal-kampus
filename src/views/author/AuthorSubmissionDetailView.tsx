import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Upload,
  Download,
  Calendar,
  User,
  ShieldCheck,
  Send,
  MessageSquare,
  History,
  FileCheck2,
} from 'lucide-react';

export const AuthorSubmissionDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();

  const [submission, setSubmission] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Revision Form state
  const [revisionLetter, setRevisionLetter] = useState('');
  const [revisionFileName, setRevisionFileName] = useState('');
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);
  const [revisionSuccessMessage, setRevisionSuccessMessage] = useState<string | null>(null);

  const fetchDetail = async () => {
    if (!token || !id) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/v1/author/submissions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSubmission(data.submission);
        }
      }
    } catch (err) {
      console.error('Failed to load submission detail:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id, token]);

  const handleRevisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionLetter) {
      alert('Mohon tuliskan surat pengantar tanggapan revisi untuk reviewer & dewan editor.');
      return;
    }

    try {
      setIsSubmittingRevision(true);
      const res = await fetch(`/api/v1/author/submissions/${id}/revisions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          response_letter: revisionLetter,
          file_name: revisionFileName || 'Naskah_Revisi_Final.pdf',
          file_path: '/uploads/revision_' + Date.now() + '.pdf',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRevisionSuccessMessage('Berkas revisi berhasil dikirim ke Dewan Redaksi! Status naskah diperbarui.');
        setRevisionLetter('');
        setRevisionFileName('');
        fetchDetail();
      } else {
        alert(data.message || 'Gagal mengirim revisi.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsSubmittingRevision(false);
    }
  };

  // Timeline Stepper logic
  const stages = [
    { key: 'SUBMITTED', label: '1. Diajukan' },
    { key: 'TECHNICAL_CHECK', label: '2. Evaluasi Teknis' },
    { key: 'IN_REVIEW', label: '3. Peer Review' },
    { key: 'DECISION', label: '4. Keputusan Editorial' },
    { key: 'PUBLISHED', label: '5. Diterbitkan' },
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 0;
      case 'TECHNICAL_CHECK':
        return 1;
      case 'IN_REVIEW':
      case 'REVISION_REQUIRED':
        return 2;
      case 'ACCEPTED':
      case 'DECLINED':
        return 3;
      case 'PUBLISHED':
        return 4;
      default:
        return 0;
    }
  };

  const currentStageIndex = submission ? getStageIndex(submission.status) : 0;

  return (
    <DashboardLayout
      title={submission ? submission.submission_number : 'Detail Naskah'}
      subtitle="Pantau alur pelacakan editorial, riwayat komunikasi, dan unggah tanggapan revisi."
      actionButton={
        <Link
          to="/author/submissions"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Naskah</span>
        </Link>
      }
    >
      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400">Memuat rincian naskah...</div>
      ) : !submission ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-2" />
          <p className="font-bold text-slate-800">Naskah tidak ditemukan atau Anda tidak memiliki hak akses.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stepper Progress Bar */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">
              Pelacak Tahapan Naskah Ilmiah
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {stages.map((stage, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div
                    key={stage.key}
                    className={`p-3.5 rounded-2xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                        : isPassed
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1.5">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <Clock className="w-4 h-4 text-white animate-pulse" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                      )}
                    </div>
                    <span className="block text-xs font-bold leading-tight">{stage.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Info & Revision Notice */}
          {submission.status === 'REVISION_REQUIRED' && (
            <div className="bg-rose-50 border-2 border-rose-300/80 rounded-3xl p-6 sm:p-7 shadow-xs animate-fadeIn">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-rose-950 mb-1">
                    Permintaan Revisi Dari Dewan Redaksi
                  </h3>
                  <p className="text-xs text-rose-900 leading-relaxed mb-4">
                    Naskah Anda memerlukan perbaikan berdasarkan rekomendasi hasil telaah peer-reviewer. Mohon
                    baca catatan keputusan di bawah, siapkan naskah perbaikan beserta berkas tanggapan (response letter), lalu unggah melalui formulir revisi di bawah ini.
                  </p>

                  {/* Decision Note from Editor */}
                  {submission.decisions && submission.decisions.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white border border-rose-200 mb-5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                        Catatan Keputusan Dewan Redaksi:
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed italic">
                        "{submission.decisions[0].decision_notes}"
                      </p>
                    </div>
                  )}

                  {/* Revision Upload Form */}
                  <form onSubmit={handleRevisionSubmit} className="space-y-4 bg-white p-5 rounded-2xl border border-rose-200">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Formulir Pengiriman Berkas Revisi
                    </h4>

                    {revisionSuccessMessage && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{revisionSuccessMessage}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Surat Tanggapan Penulis (Author Response Letter) *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={revisionLetter}
                        onChange={(e) => setRevisionLetter(e.target.value)}
                        placeholder="Uraikan ringkasan poin-poin perbaikan yang telah Anda lakukan terhadap setiap komentar telaah dari reviewer..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Nama Berkas Naskah Revisi (PDF/DOCX)
                      </label>
                      <input
                        type="text"
                        value={revisionFileName}
                        onChange={(e) => setRevisionFileName(e.target.value)}
                        placeholder="Contoh: Naskah_Revisi_Final_v2.pdf"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-600 transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingRevision}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingRevision ? 'Mengirim Revisi...' : 'Kirim Berkas Revisi ke Editor'}</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Manuscript Metadata */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-2">
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              <span>{submission.journal_title}</span>
            </div>

            <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-4">
              {submission.title}
            </h2>

            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Abstrak Naskah</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {submission.abstract}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-1.5">Kata Kunci</h4>
                <div className="flex flex-wrap gap-1.5">
                  {submission.keywords?.split(',').map((kw: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
                      {kw.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-1.5">Kategori / Ruang Lingkup</h4>
                <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold inline-block">
                  {submission.category || 'Original Research'}
                </span>
              </div>
            </div>

            {/* Authors Section */}
            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Penulis & Kontributor Terdaftar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {submission.authors?.map((aut: any) => (
                  <div key={aut.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                      {aut.full_name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs truncate">{aut.full_name}</span>
                        {aut.is_corresponding ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                            Korespondensi
                          </span>
                        ) : null}
                      </div>
                      <span className="block text-[11px] text-slate-500 truncate">{aut.institution}</span>
                      <span className="block text-[10px] text-slate-400 font-mono truncate">{aut.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Files & History in 2-Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Uploaded Files */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Berkas Naskah Terdaftar</span>
              </h3>
              <div className="space-y-2.5">
                {submission.files?.map((file: any) => (
                  <div
                    key={file.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs font-bold text-slate-900 truncate">{file.file_name}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">
                        Versi {file.version} • {(file.file_size / 1024 / 1024).toFixed(2)} MB • {file.file_type}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert(`Mengunduh berkas: ${file.file_name}`)}
                      className="p-2 rounded-xl text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                      title="Unduh Berkas"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Status History Audit Trail */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                <span>Riwayat Status & Komunikasi</span>
              </h3>
              <div className="space-y-4">
                {submission.history?.map((h: any) => (
                  <div key={h.id} className="relative pl-6 pb-2 border-l-2 border-blue-200 last:border-l-0">
                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{h.new_status}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(h.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{h.comment}</p>
                    {h.changed_by_name && (
                      <span className="block text-[10px] text-slate-400 mt-1">Oleh: {h.changed_by_name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
