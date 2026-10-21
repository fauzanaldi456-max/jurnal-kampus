import React, { useState } from 'react';

interface WaiverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaiverModal: React.FC<WaiverModalProps> = ({ isOpen, onClose }) => {
  const [applicantType, setApplicantType] = useState<'s1' | 'independent' | 'developing'>('s1');
  const [authorName, setAuthorName] = useState('');
  const [manuscriptTitle, setManuscriptTitle] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 sm:p-7 flex flex-col gap-5 border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">price_check</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-slate-900">
              Permohonan Keringanan Biaya (APC Waiver)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center text-xs text-emerald-600 flex flex-col items-center gap-2.5">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">verified</span>
            </div>
            <span className="font-bold text-base text-slate-900">Permohonan Waiver Berhasil Diajukan!</span>
            <p className="text-slate-500 max-w-xs leading-relaxed">
              Tim Komite Pembiayaan Jurnexa akan memproses dalam 1-2 hari kerja sebelum penagihan naskah.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1 text-xs text-slate-900">
            <div>
              <label className="block font-semibold mb-2 text-slate-900">Kategori Pemohon Keringanan:</label>
              <div className="grid grid-cols-1 gap-2.5">
                <label
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all select-none ${
                    applicantType === 's1'
                      ? 'bg-blue-50/70 border-blue-300 text-blue-900 font-semibold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="waiverType"
                      checked={applicantType === 's1'}
                      onChange={() => setApplicantType('s1')}
                      className="text-blue-600 focus:ring-0 accent-blue-600 cursor-pointer"
                    />
                    <span>Mahasiswa Strata Satu (S1) Skripsi / Tugas Akhir</span>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-bold">
                    Diskon 100% (Gratis)
                  </span>
                </label>

                <label
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all select-none ${
                    applicantType === 'independent'
                      ? 'bg-blue-50/70 border-blue-300 text-blue-900 font-semibold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="waiverType"
                      checked={applicantType === 'independent'}
                      onChange={() => setApplicantType('independent')}
                      className="text-blue-600 focus:ring-0 accent-blue-600 cursor-pointer"
                    />
                    <span>Peneliti Mandiri Tanpa Hibah Institusi</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold">
                    Diskon 50% - 75%
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1.5 text-slate-900">Nama Penulis Utama:</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Nama lengkap dan gelar"
                className="w-full p-3 rounded-2xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1.5 text-slate-900">Judul / ID Naskah yang Diterima:</label>
              <input
                type="text"
                required
                value={manuscriptTitle}
                onChange={(e) => setManuscriptTitle(e.target.value)}
                placeholder="Contoh: Implementasi Transformasi Deep Learning..."
                className="w-full p-3 rounded-2xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1.5 text-slate-900">Alasan Pengajuan Dispensasi:</label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Jelaskan status pendanaan penelitian Anda secara singkat..."
                className="w-full p-3 rounded-2xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-semibold shadow-xs cursor-pointer"
              >
                Kirim Permohonan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
