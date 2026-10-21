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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6 flex flex-col gap-4 border border-[#e5eeff]">
        <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0c9488] text-[22px]">price_check</span>
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
              Permohonan Keringanan Biaya (APC Waiver)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center text-xs text-[#0c9488] flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[36px]">verified</span>
            <span className="font-bold text-sm text-[#0b1c30]">Permohonan Waiver Berhasil Diajukan!</span>
            <p className="text-[#45464d] max-w-xs">
              Tim Komite Pembiayaan Jurnexa akan memproses dalam 1-2 hari kerja sebelum penagihan naskah.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 pt-1 text-xs text-[#0b1c30]">
            <div>
              <label className="block font-semibold mb-1">Kategori Pemohon Keringanan:</label>
              <div className="grid grid-cols-1 gap-2">
                <label
                  className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer ${
                    applicantType === 's1'
                      ? 'bg-[#eff4ff] border-[#4059aa] text-[#4059aa] font-semibold'
                      : 'border-[#c6c6cd] text-[#45464d]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="waiverType"
                      checked={applicantType === 's1'}
                      onChange={() => setApplicantType('s1')}
                      className="text-[#4059aa]"
                    />
                    <span>Mahasiswa Strata Satu (S1) Skripsi / Tugas Akhir</span>
                  </div>
                  <span className="text-[10px] bg-[#e5eeff] px-2 py-0.5 rounded font-bold">
                    Diskon 100% (Gratis)
                  </span>
                </label>

                <label
                  className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer ${
                    applicantType === 'independent'
                      ? 'bg-[#eff4ff] border-[#4059aa] text-[#4059aa] font-semibold'
                      : 'border-[#c6c6cd] text-[#45464d]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="waiverType"
                      checked={applicantType === 'independent'}
                      onChange={() => setApplicantType('independent')}
                      className="text-[#4059aa]"
                    />
                    <span>Peneliti Mandiri Tanpa Hibah Institusi</span>
                  </div>
                  <span className="text-[10px] bg-[#e5eeff] px-2 py-0.5 rounded font-bold">
                    Diskon 50% - 75%
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Nama Penulis Utama:</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Nama lengkap dan gelar"
                className="w-full p-2.5 rounded-lg border border-[#c6c6cd] focus:ring-2 focus:ring-[#4059aa]/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Judul / ID Naskah yang Diterima:</label>
              <input
                type="text"
                required
                value={manuscriptTitle}
                onChange={(e) => setManuscriptTitle(e.target.value)}
                placeholder="Contoh: Implementasi Transformasi Deep Learning..."
                className="w-full p-2.5 rounded-lg border border-[#c6c6cd] focus:ring-2 focus:ring-[#4059aa]/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Alasan Pengajuan Dispensasi:</label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Jelaskan status pendanaan penelitian Anda secara singkat..."
                className="w-full p-2.5 rounded-lg border border-[#c6c6cd] focus:ring-2 focus:ring-[#4059aa]/40 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#c6c6cd] rounded-lg text-[#45464d] hover:bg-[#eff4ff]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-black hover:bg-[#131b2e] text-white rounded-lg font-semibold shadow-sm"
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
