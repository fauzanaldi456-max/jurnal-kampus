import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Download,
  Users,
  ShieldCheck,
  Send,
  UserPlus,
  Clock,
  History,
  Check,
  X,
  FileCheck2,
} from 'lucide-react';

export const EditorSubmissionDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();

  const [submission, setSubmission] = useState<any | null>(null);
  const [reviewersList, setReviewersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Desk Check Action state
  const [deskCheckNotes, setDeskCheckNotes] = useState('');
  const [isDeskChecking, setIsDeskChecking] = useState(false);

  // Assign Reviewer Action state
  const [selectedReviewerId, setSelectedReviewerId] = useState('');
  const [dueDays, setDueDays] = useState('14');
  const [isAssigning, setIsAssigning] = useState(false);

  // Editorial Decision state
  const [decision, setDecision] = useState<'ACCEPT' | 'REVISION' | 'DECLINE'>('REVISION');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [notifyAuthor, setNotifyAuthor] = useState(true);
  const [isDeciding, setIsDeciding] = useState(false);

  const fetchDetail = async () => {
    if (!token || !id) return;
    try {
      setIsLoading(true);
      const [subRes, revRes] = await Promise.all([
        fetch(`/api/v1/editor/submissions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/v1/editor/reviewers', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (subRes.ok) {
        const subData = await subRes.json();
        if (subData.success) setSubmission(subData.submission);
      }

      if (revRes.ok) {
        const revData = await revRes.json();
        if (revData.success && revData.reviewers.length > 0) {
          setReviewersList(revData.reviewers);
          setSelectedReviewerId(revData.reviewers[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id, token]);

  const handleDeskCheck = async (passed: boolean) => {
    try {
      setIsDeskChecking(true);
      const res = await fetch(`/api/v1/editor/submissions/${id}/technical-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          passed,
          notes: deskCheckNotes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(passed ? 'Pemeriksaan teknis lolos!' : 'Permintaan revisi teknis telah dikirim ke penulis.');
        setDeskCheckNotes('');
        fetchDetail();
      } else {
        alert(data.message || 'Gagal memproses desk check.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsDeskChecking(false);
    }
  };

  const handleAssignReviewer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReviewerId) {
      alert('Pilih mitra bestari terlebih dahulu.');
      return;
    }

    try {
      setIsAssigning(true);
      const res = await fetch(`/api/v1/editor/submissions/${id}/assign-reviewer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reviewer_id: selectedReviewerId,
          due_days: dueDays,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message);
        fetchDetail();
      } else {
        alert(data.message || 'Gagal menugaskan reviewer.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionNotes.trim()) {
      alert('Mohon isi catatan resmi pertimbangan dewan editor untuk penulis.');
      return;
    }

    if (!window.confirm(`Yakin ingin menerbitkan keputusan editorial [${decision}] untuk naskah ini?`)) {
      return;
    }

    try {
      setIsDeciding(true);
      const res = await fetch(`/api/v1/editor/submissions/${id}/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          decision,
          notes: decisionNotes,
          notify_author: notifyAuthor,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message);
        setDecisionNotes('');
        fetchDetail();
      } else {
        alert(data.message || 'Gagal menerbitkan keputusan.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsDeciding(false);
    }
  };

  return (
    <DashboardLayout
      title={submission ? `Ruang Kerja Editorial: ${submission.submission_number}` : 'Detail Editorial'}
      subtitle="Pemeriksaan teknis, penugasan mitra bestari, evaluasi telaah, dan penerbitan keputusan dewan redaksi."
      actionButton={
        <Link
          to="/editor/submissions"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Editorial Pool</span>
        </Link>
      }
    >
      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400">Memuat berkas editorial...</div>
      ) : !submission ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-2" />
          <p className="font-bold text-slate-800">Naskah tidak ditemukan.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Card with Manuscript Details */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                {submission.submission_number}
              </span>
              <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-slate-100 text-slate-800">
                Status Saat Ini: <strong className="text-blue-700">{submission.status}</strong>
              </span>
            </div>

            <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-3">
              {submission.title}
            </h2>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Abstrak</span>
              <p className="text-xs text-slate-700 leading-relaxed">{submission.abstract}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Jurnal Tujuan</span>
                <span className="font-bold text-slate-900 truncate block">{submission.journal_title}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Penulis Korespondensi</span>
                <span className="font-bold text-slate-900 truncate block">{submission.author_name}</span>
                <span className="text-[10px] text-slate-400 truncate block">{submission.author_email}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Afiliasi Penulis</span>
                <span className="font-bold text-slate-900 truncate block">
                  {submission.author_institution || 'Perguruan Tinggi'}
                </span>
              </div>
            </div>
          </div>

          {/* EDITORIAL WORKFLOW TABS / SECTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Technical Check, Reviewer Reports, Decision */}
            <div className="lg:col-span-2 space-y-6">
              {/* ACTION 1: Technical Check (Desk Check) */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900">
                    Pemeriksaan Teknis & Ruang Lingkup (Desk Check)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Periksa kesesuaian format template jurnal, kelengkapan naskah, tingkat similaritas, dan kesesuaian ruang lingkup sebelum diteruskan ke peer-review.
                </p>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Catatan Evaluasi Teknis untuk Penulis
                  </label>
                  <textarea
                    rows={2}
                    value={deskCheckNotes}
                    onChange={(e) => setDeskCheckNotes(e.target.value)}
                    placeholder="Contoh: Format referensi telah sesuai IEEE. Naskah disetujui untuk peer-review..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-600 transition"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={isDeskChecking}
                    onClick={() => handleDeskCheck(true)}
                    className="px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>Loloskan ke Peer Review</span>
                  </button>
                  <button
                    type="button"
                    disabled={isDeskChecking}
                    onClick={() => handleDeskCheck(false)}
                    className="px-4 py-2.5 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span>Kembalikan untuk Revisi Teknis</span>
                  </button>
                </div>
              </div>

              {/* ACTION 2: Reviewers & Reports Overview */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900">
                    Mitra Bestari Ditugaskan & Laporan Telaah
                  </h3>
                </div>

                {submission.reviewAssignments?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center">
                    Belum ada mitra bestari yang ditugaskan. Gunakan formulir di sebelah kanan untuk menugaskan reviewer.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {submission.reviewAssignments?.map((ra: any) => (
                      <div key={ra.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                              {ra.reviewer_name}
                            </span>
                            <span className="text-[11px] text-slate-500">{ra.reviewer_institution}</span>
                          </div>
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                              ra.status === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {ra.status === 'COMPLETED' ? 'Telaah Selesai' : 'Sedang Menelaah'}
                          </span>
                        </div>

                        {ra.status === 'COMPLETED' && (
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <span className="text-slate-500 font-semibold">Rekomendasi Reviewer:</span>
                              <span className="font-bold text-blue-700 px-2 py-0.5 rounded-md bg-blue-50">
                                {ra.recommendation}
                              </span>
                            </div>
                            {ra.score && (
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-semibold">Skor Evaluasi:</span>
                                <span className="font-bold text-slate-900">{ra.score} / 100</span>
                              </div>
                            )}
                            <div>
                              <span className="text-slate-500 font-semibold block mb-0.5">Catatan Telaah untuk Penulis:</span>
                              <p className="text-slate-800 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                "{ra.review_notes || '-'}"
                              </p>
                            </div>
                            {ra.confidential_notes && (
                              <div>
                                <span className="text-rose-600 font-bold block mb-0.5">
                                  Catatan Rahasia untuk Editor Saja:
                                </span>
                                <p className="text-slate-800 bg-rose-50/40 p-2.5 rounded-lg border border-rose-100 text-[11px]">
                                  "{ra.confidential_notes}"
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ACTION 3: Final Editorial Decision */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900">
                    Penetapan Keputusan Dewan Redaksi (Editorial Decision)
                  </h3>
                </div>

                <form onSubmit={handleDecisionSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2">Pilihan Keputusan Resmi *</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: 'ACCEPT', label: 'Terima (Accept)', color: 'text-emerald-700 border-emerald-500 bg-emerald-50/50' },
                        { id: 'REVISION', label: 'Revisi (Revision)', color: 'text-rose-700 border-rose-500 bg-rose-50/50' },
                        { id: 'DECLINE', label: 'Tolak (Decline)', color: 'text-slate-700 border-slate-500 bg-slate-100' },
                      ].map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setDecision(d.id as any)}
                          className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                            decision === d.id ? `${d.color} shadow-xs ring-2 ring-blue-100` : 'border-slate-200 text-slate-600 bg-slate-50'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Surat Keputusan Editorial & Catatan Pengesahan *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={decisionNotes}
                      onChange={(e) => setDecisionNotes(e.target.value)}
                      placeholder="Uraikan alasan keputusan dewan editor, poin-poin revisi yang wajib diperbaiki penulis, atau jadwal penerbitan..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-600 transition"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyAuthor}
                      onChange={(e) => setNotifyAuthor(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span className="text-xs text-slate-700 font-medium">
                      Kirim pemberitahuan resmi dan perbarui status dasbor penulis secara instan
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isDeciding}
                    className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
                  >
                    {isDeciding ? 'Menerbitkan Keputusan...' : `Terbitkan Keputusan Editorial [${decision}]`}
                  </button>
                </form>
              </div>
            </div>

            {/* Right 1 Col: Assign Reviewer Form & Uploaded Files */}
            <div className="space-y-6">
              {/* Assign Reviewer Form */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
                <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  <span>Tugaskan Mitra Bestari</span>
                </h3>

                <form onSubmit={handleAssignReviewer} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Pilih Reviewer Terdaftar *</label>
                    <select
                      value={selectedReviewerId}
                      onChange={(e) => setSelectedReviewerId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                    >
                      {reviewersList.map((rev) => (
                        <option key={rev.id} value={rev.id}>
                          {rev.full_name} ({rev.institution})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Tenggat Waktu Telaah</label>
                    <select
                      value={dueDays}
                      onChange={(e) => setDueDays(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                    >
                      <option value="7">7 Hari (Fast-Track Review)</option>
                      <option value="14">14 Hari (Standar Konsorsium)</option>
                      <option value="21">21 Hari (Comprehensive Review)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isAssigning}
                    className="w-full py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {isAssigning ? 'Menugaskan...' : 'Kirim Penugasan Reviewer'}
                  </button>
                </form>
              </div>

              {/* Manuscript Files */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
                <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Berkas Dokumen</span>
                </h3>
                <div className="space-y-2">
                  {submission.files?.map((file: any) => (
                    <div
                      key={file.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-bold text-slate-900 truncate">{file.file_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Versi {file.version} • {file.file_type}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert(`Mengunduh dokumen: ${file.file_name}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Audit Trail */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
                <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-600" />
                  <span>Jejak Audit Naskah</span>
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {submission.history?.map((h: any) => (
                    <div key={h.id} className="text-xs border-b border-slate-100 pb-2">
                      <div className="flex items-center justify-between font-bold text-slate-800 mb-0.5">
                        <span>{h.new_status}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(h.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{h.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
