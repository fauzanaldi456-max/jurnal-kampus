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
    const randomCode = `JURNEXA-SUB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto border border-[#e5eeff]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#131b2e] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                Portal Pengajuan Naskah (OJS 3 Gateway)
              </h3>
              <p className="text-xs text-[#45464d]">
                Konsorsium Publikasi Jurnexa — Standar Etika COPE & Double-Blind Review
              </p>
            </div>
          </div>
          <button
            onClick={resetForm}
            className="p-1.5 rounded-lg hover:bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {!isSubmitted ? (
          <>
            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-medium">
              <div
                className={`p-2 rounded-lg border ${
                  step === 1
                    ? 'bg-[#131b2e] text-white border-transparent'
                    : 'bg-[#eff4ff] text-[#45464d] border-[#d3e4fe]'
                }`}
              >
                1. Sasaran Jurnal
              </div>
              <div
                className={`p-2 rounded-lg border ${
                  step === 2
                    ? 'bg-[#131b2e] text-white border-transparent'
                    : 'bg-[#eff4ff] text-[#45464d] border-[#d3e4fe]'
                }`}
              >
                2. Metadata Naskah
              </div>
              <div
                className={`p-2 rounded-lg border ${
                  step === 3
                    ? 'bg-[#131b2e] text-white border-transparent'
                    : 'bg-[#eff4ff] text-[#45464d] border-[#d3e4fe]'
                }`}
              >
                3. Profil Penulis
              </div>
              <div
                className={`p-2 rounded-lg border ${
                  step === 4
                    ? 'bg-[#131b2e] text-white border-transparent'
                    : 'bg-[#eff4ff] text-[#45464d] border-[#d3e4fe]'
                }`}
              >
                4. Berkas & Kirim
              </div>
            </div>

            {/* Step 1: Journal Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    Pilih Jurnal Tujuan dalam Konsorsium:
                  </label>
                  <select
                    value={targetJournal}
                    onChange={(e) => setTargetJournal(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#c6c6cd] bg-white text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#4059aa]/40 focus:outline-none"
                  >
                    {CONSORTIUM_JOURNALS.map((j) => (
                      <option key={j.id} value={j.id}>
                        [{j.shortName}] {j.title} (SINTA {j.sintaGrade} • e-ISSN: {j.eIssn})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedJournalObj && (
                  <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#d3e4fe] text-xs text-[#0b1c30] space-y-1">
                    <div className="font-semibold text-[#4059aa]">
                      {selectedJournalObj.title} ({selectedJournalObj.shortName})
                    </div>
                    <p className="text-[#45464d] text-[11px]">{selectedJournalObj.description}</p>
                    <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-['JetBrains_Mono']">
                      <span className="bg-[#e5eeff] px-2 py-0.5 rounded text-[#1d3989]">
                        Akreditasi: SINTA {selectedJournalObj.sintaGrade}
                      </span>
                      <span className="bg-[#e5eeff] px-2 py-0.5 rounded text-[#1d3989]">
                        Frekuensi: {selectedJournalObj.frequency}
                      </span>
                      <span className="bg-[#e5eeff] px-2 py-0.5 rounded text-[#0c9488]">
                        Acceptance Rate: {selectedJournalObj.acceptanceRate}
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    Jenis Manuskrip:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Research Article', 'Review Article', 'Short Communication'].map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setArticleType(t)}
                        className={`p-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                          articleType === t
                            ? 'bg-[#e5eeff] text-[#4059aa] border-[#4059aa] font-semibold'
                            : 'bg-white text-[#45464d] border-[#e5eeff] hover:bg-[#eff4ff]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-[#e5eeff] rounded-lg text-xs text-[#1d3989] flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">verified</span>
                  <span>
                    Seluruh naskah yang dikirimkan wajib mematuhi standar penulisan empiris IMRaD serta batas toleransi Turnitin di bawah 20%. Biaya submisi adalah Rp 0 (Gratis).
                  </span>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 bg-black hover:bg-[#131b2e] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Lanjut ke Metadata</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Metadata */}
            {step === 2 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    Judul Lengkap Naskah (Maks. 15 Kata):
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Implementasi Algoritma Deteksi Objek..."
                    className="w-full p-2.5 rounded-lg border border-[#c6c6cd] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#4059aa]/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    Abstrak Terstruktur (200 - 250 Kata):
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={abstractText}
                    onChange={(e) => setAbstractText(e.target.value)}
                    placeholder="Latar Belakang: ... Metodologi: ... Temuan Kunci: ... Implikasi: ..."
                    className="w-full p-2.5 rounded-lg border border-[#c6c6cd] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#4059aa]/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    Kata Kunci (Dipisahkan tanda koma, 4–6 kata):
                  </label>
                  <input
                    type="text"
                    required
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Contoh: Deep Learning, Edge Computing, Computer Vision"
                    className="w-full p-2.5 rounded-lg border border-[#c6c6cd] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#4059aa]/40 focus:outline-none"
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 border border-[#c6c6cd] text-[#45464d] rounded-lg text-xs font-medium hover:bg-[#eff4ff]"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    disabled={!title || !abstractText}
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 bg-black hover:bg-[#131b2e] disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Lanjut ke Penulis</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Author Info */}
            {step === 3 && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                      Nama Penulis Utama (dengan Gelar):
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Dr. Hendra Wijaya, M.T."
                      className="w-full p-2.5 rounded-lg border border-[#c6c6cd] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#4059aa]/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                      Alamat Surel (Institusional):
                    </label>
                    <input
                      type="email"
                      required
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      placeholder="hendra.wijaya@universitas.ac.id"
                      className="w-full p-2.5 rounded-lg border border-[#c6c6cd] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#4059aa]/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    Afiliasi Institusi / Kampus / Lembaga Riset:
                  </label>
                  <input
                    type="text"
                    required
                    value={authorInstitution}
                    onChange={(e) => setAuthorInstitution(e.target.value)}
                    placeholder="Laboratorium Komputasi, Fakultas Ilmu Komputer, Universitas Nusantara"
                    className="w-full p-2.5 rounded-lg border border-[#c6c6cd] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#4059aa]/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    ORCID ID (16 Digit Terverifikasi):
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#45464d] bg-[#eff4ff] px-2.5 py-2 rounded border border-[#c6c6cd]">
                      https://orcid.org/
                    </span>
                    <input
                      type="text"
                      value={authorOrcid}
                      onChange={(e) => setAuthorOrcid(e.target.value)}
                      placeholder="0000-0002-1825-9012"
                      className="flex-1 p-2 rounded-lg border border-[#c6c6cd] text-xs font-['JetBrains_Mono'] text-[#0b1c30] focus:ring-2 focus:ring-[#4059aa]/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 border border-[#c6c6cd] text-[#45464d] rounded-lg text-xs font-medium hover:bg-[#eff4ff]"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    disabled={!authorName || !authorEmail}
                    onClick={() => setStep(4)}
                    className="px-5 py-2.5 bg-black hover:bg-[#131b2e] disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
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
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    Unggah Naskah Lengkap (DOCX / LaTeX ZIP):
                  </label>
                  <div className="border-2 border-dashed border-[#c6c6cd] rounded-xl p-6 text-center hover:bg-[#eff4ff] transition-colors cursor-pointer relative">
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
                    <span className="material-symbols-outlined text-[36px] text-[#4059aa] mb-1">
                      cloud_upload
                    </span>
                    <div className="text-xs font-semibold text-[#0b1c30]">
                      {fileName ? fileName : 'Klik atau seret berkas manuskrip ke sini'}
                    </div>
                    <p className="text-[11px] text-[#45464d] mt-1">
                      Mendukung format .docx (Word) atau .zip (LaTeX Overleaf package). Maks 25 MB.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <label className="flex items-start gap-2 text-xs text-[#0b1c30] cursor-pointer">
                    <input type="checkbox" required className="mt-0.5 rounded text-[#4059aa]" />
                    <span>
                      Saya menyatakan naskah ini adalah <strong>karya orisinal</strong>, belum pernah diterbitkan di media lain, dan tidak sedang dalam proses telaah di jurnal manapun.
                    </span>
                  </label>
                  <label className="flex items-start gap-2 text-xs text-[#0b1c30] cursor-pointer">
                    <input type="checkbox" required className="mt-0.5 rounded text-[#4059aa]" />
                    <span>
                      Saya menyetujui proses penelaahan <strong>Double-Blind Peer Review</strong> dan mematuhi etika publikasi COPE.
                    </span>
                  </label>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-4 py-2 border border-[#c6c6cd] text-[#45464d] rounded-lg text-xs font-medium hover:bg-[#eff4ff]"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-black hover:bg-[#131b2e] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    <span>Submit Naskah Sekarang</span>
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          /* Confirmation Receipt */
          <div className="py-6 text-center flex flex-col items-center gap-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-[#e5eeff] text-[#0c9488] flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">task_alt</span>
            </div>
            <div className="space-y-1">
              <h4 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30]">
                Pengajuan Naskah Berhasil Terkirim!
              </h4>
              <p className="text-xs text-[#45464d] max-w-md mx-auto">
                Berkas naskah Anda telah terdaftar dalam sistem antrean editorial Jurnexa OJS Gateway untuk tahapan Desk Review (Hari ke 1–5).
              </p>
            </div>

            <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#d3e4fe] w-full max-w-md text-left font-['JetBrains_Mono'] text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#45464d]">Nomor Registrasi:</span>
                <span className="font-bold text-[#4059aa]">{trackingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464d]">Jurnal Sasaran:</span>
                <span className="font-semibold text-[#0b1c30]">{selectedJournalObj?.shortName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464d]">Status Terkini:</span>
                <span className="text-[#0c9488] font-bold">In Desk Screening</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464d]">Biaya Submisi:</span>
                <span className="text-[#0b1c30]">Rp 0,- (Bebas Biaya)</span>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="mt-2 px-6 py-2.5 bg-black hover:bg-[#131b2e] text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              Kembali ke Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
