import React, { useState } from 'react';
import { CONSORTIUM_JOURNALS } from '../data/mockData';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [targetJournal, setTargetJournal] = useState(CONSORTIUM_JOURNALS[0].id);
  const [articleType, setArticleType] = useState('Research Article');
  const [title, setTitle] = useState('');
  const [abstractText, setAbstractText] = useState('');
  const [keywords, setKeywords] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorInstitution, setAuthorInstitution] = useState('');
  const [authorOrcid, setAuthorOrcid] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = `CENDRALOKA-SUB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTrackingId(randomCode);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setStep(1);
    setIsSubmitted(false);
    setTitle('');
    setAbstractText('');
    setKeywords('');
    setFileName('');
    onClose();
  };

  const selectedJournalObj = CONSORTIUM_JOURNALS.find((j) => j.id === targetJournal);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl p-6 sm:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">upload_file</span>
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900">
                Portal Pengajuan Naskah (OJS 3 Gateway)
              </h3>
              <p className="text-xs text-slate-500">
                Konsorsium Publikasi Cendraloka — Standar Etika COPE & Double-Blind Review
              </p>
            </div>
          </div>
          <button
            onClick={resetForm}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {!isSubmitted ? (
          <>
            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
              <div
                className={`py-2 px-1 rounded-full transition-all ${
                  step === 1
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                1. Sasaran Jurnal
              </div>
              <div
                className={`py-2 px-1 rounded-full transition-all ${
                  step === 2
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                2. Metadata Naskah
              </div>
              <div
                className={`py-2 px-1 rounded-full transition-all ${
                  step === 3
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                3. Profil Penulis
              </div>
              <div
                className={`py-2 px-1 rounded-full transition-all ${
                  step === 4
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                4. Berkas & Kirim
              </div>
            </div>

            {/* Step 1: Journal Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Pilih Jurnal Tujuan dalam Konsorsium:
                  </label>
                  <select
                    value={targetJournal}
                    onChange={(e) => setTargetJournal(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none cursor-pointer font-medium"
                  >
                    {CONSORTIUM_JOURNALS.map((j) => (
                      <option key={j.id} value={j.id}>
                        [{j.shortName}] {j.title} (SINTA {j.sintaGrade} • e-ISSN: {j.eIssn})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedJournalObj && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 space-y-1.5">
                    <div className="font-bold text-blue-600">
                      {selectedJournalObj.title} ({selectedJournalObj.shortName})
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">{selectedJournalObj.description}</p>
                    <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-['JetBrains_Mono']">
                      <span className="bg-white px-2.5 py-1 rounded-full border border-slate-200 text-blue-700 font-semibold">
                        Akreditasi: SINTA {selectedJournalObj.sintaGrade}
                      </span>
                      <span className="bg-white px-2.5 py-1 rounded-full border border-slate-200 text-slate-700">
                        Frekuensi: {selectedJournalObj.frequency}
                      </span>
                      <span className="bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-emerald-700 font-semibold">
                        Acceptance Rate: {selectedJournalObj.acceptanceRate}
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Jenis Manuskrip:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Research Article', 'Review Article', 'Short Communication'].map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setArticleType(t)}
                        className={`p-3 rounded-2xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                          articleType === t
                            ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs text-blue-800 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-blue-600 shrink-0 mt-0.5">verified</span>
                  <span>
                    Seluruh naskah yang dikirimkan wajib mematuhi standar penulisan empiris IMRaD serta batas toleransi Turnitin di bawah 20%. Biaya submisi adalah Rp 0 (Gratis).
                  </span>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Lanjut ke Metadata</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Metadata */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Judul Lengkap Naskah (Maks. 15 Kata):
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Implementasi Algoritma Deteksi Objek..."
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Abstrak Terstruktur (200 - 250 Kata):
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={abstractText}
                    onChange={(e) => setAbstractText(e.target.value)}
                    placeholder="Latar Belakang: ... Metodologi: ... Temuan Kunci: ... Implikasi: ..."
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Kata Kunci (Dipisahkan tanda koma, 4–6 kata):
                  </label>
                  <input
                    type="text"
                    required
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Contoh: Deep Learning, Edge Computing, Computer Vision"
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-full text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    disabled={!title || !abstractText}
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Lanjut ke Penulis</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Author Info */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                      Nama Penulis Utama (dengan Gelar):
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Dr. Hendra Wijaya, M.T."
                      className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                      Alamat Surel (Institusional):
                    </label>
                    <input
                      type="email"
                      required
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      placeholder="hendra.wijaya@universitas.ac.id"
                      className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Afiliasi Institusi / Kampus / Lembaga Riset:
                  </label>
                  <input
                    type="text"
                    required
                    value={authorInstitution}
                    onChange={(e) => setAuthorInstitution(e.target.value)}
                    placeholder="Laboratorium Komputasi, Fakultas Ilmu Komputer, Universitas Nusantara"
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    ORCID ID (16 Digit Terverifikasi):
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="font-['JetBrains_Mono'] text-xs text-slate-500 bg-slate-100 px-3 py-2.5 rounded-2xl border border-slate-200">
                      https://orcid.org/
                    </span>
                    <input
                      type="text"
                      value={authorOrcid}
                      onChange={(e) => setAuthorOrcid(e.target.value)}
                      placeholder="0000-0002-1825-9012"
                      className="flex-1 p-3 rounded-2xl border border-slate-200 text-xs font-['JetBrains_Mono'] text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-full text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    disabled={!authorName || !authorEmail}
                    onClick={() => setStep(4)}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Lanjut ke Berkas</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: File Upload & Declarations */}
            {step === 4 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Unggah Naskah Lengkap (DOCX / LaTeX ZIP):
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative group">
                    <input
                      type="file"
                      accept=".docx,.doc,.zip,.pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFileName(e.target.files[0].name);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      {fileName ? fileName : 'Klik atau seret berkas manuskrip ke sini'}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Mendukung format .docx (Word) atau .zip (LaTeX Overleaf package). Maks 25 MB.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input type="checkbox" required className="mt-0.5 rounded text-blue-600 focus:ring-0 accent-blue-600" />
                    <span>
                      Saya menyatakan naskah ini adalah <strong>karya orisinal</strong>, belum pernah diterbitkan di media lain, dan tidak sedang dalam proses telaah di jurnal manapun.
                    </span>
                  </label>
                  <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input type="checkbox" required className="mt-0.5 rounded text-blue-600 focus:ring-0 accent-blue-600" />
                    <span>
                      Saya menyetujui proses penelaahan <strong>Double-Blind Peer Review</strong> dan mematuhi etika publikasi COPE.
                    </span>
                  </label>
                </div>

                <div className="flex justify-between pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-full text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-blue-400">send</span>
                    <span>Submit Naskah Sekarang</span>
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          /* Confirmation Receipt */
          <div className="py-6 text-center flex flex-col items-center gap-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">task_alt</span>
            </div>
            <div className="space-y-1">
              <h4 className="font-['Space_Grotesk'] text-xl font-bold text-slate-900">
                Pengajuan Naskah Berhasil Terkirim!
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Berkas naskah Anda telah terdaftar dalam sistem antrean editorial Cendraloka OJS Gateway untuk tahapan Desk Review (Hari ke 1–5).
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 w-full max-w-md text-left font-['JetBrains_Mono'] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor Registrasi:</span>
                <span className="font-bold text-blue-600">{trackingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jurnal Sasaran:</span>
                <span className="font-semibold text-slate-900">{selectedJournalObj?.shortName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status Terkini:</span>
                <span className="text-emerald-700 font-bold">In Desk Screening</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Biaya Submisi:</span>
                <span className="text-slate-900">Rp 0,- (Bebas Biaya)</span>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="mt-2 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-semibold shadow-xs cursor-pointer"
            >
              Kembali ke Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
