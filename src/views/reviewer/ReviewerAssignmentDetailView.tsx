import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import {
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Download,
  Send,
  Check,
  X,
  FileCheck2,
} from 'lucide-react';

export const ReviewerAssignmentDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();

  const [assignment, setAssignment] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rubric scores
  const [scoreOriginality, setScoreOriginality] = useState<number>(22);
  const [scoreMethodology, setScoreMethodology] = useState<number>(21);
  const [scoreAnalysis, setScoreAnalysis] = useState<number>(23);
  const [scoreReferences, setScoreReferences] = useState<number>(20);

  // Recommendation & Comments
  const [recommendation, setRecommendation] = useState<'ACCEPT' | 'MINOR_REVISIONS' | 'MAJOR_REVISIONS' | 'REJECT'>('MINOR_REVISIONS');
  const [reviewNotes, setReviewNotes] = useState('');
  const [confidentialNotes, setConfidentialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAssignment = async () => {
    if (!token || !id) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/v1/reviewer/assignments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAssignment(data.assignment);
          if (data.assignment.recommendation) {
            setRecommendation(data.assignment.recommendation);
          }
          if (data.assignment.review_notes) {
            setReviewNotes(data.assignment.review_notes);
          }
          if (data.assignment.confidential_notes) {
            setConfidentialNotes(data.assignment.confidential_notes);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [id, token]);

  const handleAccept = async () => {
    try {
      const res = await fetch(`/api/v1/reviewer/assignments/${id}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert('Undangan telaah naskah telah disetujui.');
        fetchAssignment();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async () => {
    const reason = prompt('Mohon sebutkan alasan penolakan telaah (misal: keterbatasan waktu atau potensi konflik kepentingan):');
    if (!reason) return;

    try {
      const res = await fetch(`/api/v1/reviewer/assignments/${id}/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        alert('Penolakan telaah telah dicatat.');
        fetchAssignment();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalScore = scoreOriginality + scoreMethodology + scoreAnalysis + scoreReferences;

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewNotes.trim()) {
      alert('Mohon isi catatan ulasan telaah untuk penulis dan editor.');
      return;
    }

    if (!window.confirm(`Kirim laporan telaah dengan rekomendasi [${recommendation}] dan total skor ${totalScore}/100?`)) {
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/v1/reviewer/assignments/${id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recommendation,
          review_notes: reviewNotes,
          confidential_notes: confidentialNotes,
          score: totalScore,
          evaluation_rubric: {
            originality: scoreOriginality,
            methodology: scoreMethodology,
            analysis: scoreAnalysis,
            references: scoreReferences,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('Laporan telaah sejawat berhasil dikirim ke Dewan Editor!');
        fetchAssignment();
      } else {
        alert(data.message || 'Gagal mengirim laporan telaah.');
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
      title={assignment ? `Lembar Telaah Sejawat: ${assignment.submission_number}` : 'Telaah Naskah'}
      subtitle="Evaluasi naskah dengan standar Double-Blind Peer Review (Identitas penulis dilindungi kerahasiaannya)."
      actionButton={
        <Link
          to="/reviewer/assignments"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </Link>
      }
    >
      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400">Memuat berkas telaah...</div>
      ) : !assignment ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-2" />
          <p className="font-bold text-slate-800">Tugas telaah tidak ditemukan.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Double-Blind Protection Banner */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-950 block">Protokol Kerahasiaan Double-Blind Aktif</span>
                <span className="text-[11px] text-blue-800">
                  Nama, afiliasi, dan kontak penulis disembunyikan secara otomatis untuk menjamin objektivitas telaah ilmiah.
                </span>
              </div>
            </div>
            <div className="shrink-0 text-right font-mono text-xs font-bold text-rose-700">
              Tenggat: {assignment.due_date}
            </div>
          </div>

          {/* Invitation Action if INVITED */}
          {assignment.status === 'INVITED' && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-center space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Undangan Telaah Naskah Baru</h3>
              <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
                Dewan redaksi mengundang kepakaran Anda untuk menelaah naskah berikut. Apakah Anda bersedia menyelesaikan telaah ini sesuai tenggat waktu yang ditentukan?
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Terima Undangan Telaah</span>
                </button>
                <button
                  type="button"
                  onClick={handleDecline}
                  className="px-6 py-2.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Tolak Undangan</span>
                </button>
              </div>
            </div>
          )}

          {/* Manuscript Details */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-blue-700">{assignment.journal_title}</span>
              <button
                type="button"
                onClick={() => alert(`Mengunduh berkas naskah tanpa identitas: ${assignment.file_name}`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Naskah Lengkap (PDF)</span>
              </button>
            </div>

            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-slate-900 leading-snug mb-3">
              {assignment.title}
            </h2>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Abstrak</span>
              <p className="text-xs text-slate-700 leading-relaxed">{assignment.abstract}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">Kata Kunci</span>
                <span className="font-medium text-slate-800">{assignment.keywords || '-'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">Kategori Naskah</span>
                <span className="font-semibold text-slate-800">{assignment.category}</span>
              </div>
            </div>
          </div>

          {/* Evaluation Form / Submitted Report */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-600" />
              <span>Formulir Rubrik Penilaian Telaah Sejawat</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Berikan evaluasi kuantitatif dan kualitatif secara profesional sesuai standar integritas publikasi ilmiah.
            </p>

            <form onSubmit={handleSubmitReport} className="space-y-6">
              {/* Scoring Rubric Grid */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Rubrik Penilaian Kuantitatif (Bobot 100 Poin)
                  </span>
                  <span className="text-sm font-['Space_Grotesk'] font-bold text-blue-700 px-3 py-1 rounded-xl bg-blue-100">
                    Total Skor: {totalScore} / 100
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1 font-bold text-slate-800">
                      <span>1. Orisinalitas & Nilai Kebaruan (1-25)</span>
                      <span className="text-blue-600">{scoreOriginality}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      value={scoreOriginality}
                      onChange={(e) => setScoreOriginality(parseInt(e.target.value, 10))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1 font-bold text-slate-800">
                      <span>2. Ketepatan Metodologi Riset (1-25)</span>
                      <span className="text-blue-600">{scoreMethodology}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      value={scoreMethodology}
                      onChange={(e) => setScoreMethodology(parseInt(e.target.value, 10))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1 font-bold text-slate-800">
                      <span>3. Analisis & Pembahasan Data (1-25)</span>
                      <span className="text-blue-600">{scoreAnalysis}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      value={scoreAnalysis}
                      onChange={(e) => setScoreAnalysis(parseInt(e.target.value, 10))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1 font-bold text-slate-800">
                      <span>4. Kualitas Sitasi & Referensi (1-25)</span>
                      <span className="text-blue-600">{scoreReferences}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      value={scoreReferences}
                      onChange={(e) => setScoreReferences(parseInt(e.target.value, 10))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Recommendation Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Rekomendasi Akhir Telaah *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'ACCEPT', label: 'Terima Tanpa Revisi' },
                    { id: 'MINOR_REVISIONS', label: 'Revisi Minor' },
                    { id: 'MAJOR_REVISIONS', label: 'Revisi Mayor' },
                    { id: 'REJECT', label: 'Tolak Naskah' },
                  ].map((rec) => (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => setRecommendation(rec.id as any)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        recommendation === rec.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {rec.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Notes to Author and Editor */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Catatan Telaah untuk Penulis & Dewan Editor *
                </label>
                <textarea
                  required
                  rows={5}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Uraikan temuan konstruktif, kekuatan naskah, serta saran perbaikan spesifik per bagian naskah (Abstrak, Metode, Hasil, Diskusi)..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600 leading-relaxed"
                />
              </div>

              {/* Confidential Notes for Editor only */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Catatan Rahasia Khusus Dewan Editor (Confidential to Editor)
                </label>
                <textarea
                  rows={3}
                  value={confidentialNotes}
                  onChange={(e) => setConfidentialNotes(e.target.value)}
                  placeholder="Catatan tertutup yang tidak akan diteruskan kepada penulis (misal: dugaan similaritas, potensi bias metodologi)..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  <span>
                    {isSubmitting ? 'Mengirim Laporan Telaah...' : 'Kirim Laporan Telaah Resmi ke Dewan Redaksi'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
