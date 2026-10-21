import React, { useState } from 'react';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose }) => {
  const [topic, setTopic] = useState('ojs-tech');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketNo, setTicketNo] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const no = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketNo(no);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 sm:p-7 flex flex-col gap-5 border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">contact_support</span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900">
              Tiket Asistensi Editorial & Helpdesk OJS
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
              <span className="material-symbols-outlined text-[32px]">confirmation_number</span>
            </div>
            <span className="font-bold text-base text-slate-900">
              Tiket Berhasil Dibuat: #{ticketNo}
            </span>
            <p className="text-slate-500 max-w-xs leading-relaxed">
              Tim sekretariat Cendraloka akan merespons melalui surel Anda dalam tempo &lt; 24 jam kerja.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1 text-xs text-slate-900">
            <div>
              <label className="block font-semibold mb-1.5 text-slate-900">Topik Bantuan:</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-slate-900 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none cursor-pointer font-medium"
              >
                <option value="ojs-tech">Kendala Teknis Portal OJS 3 (Upload Gagal/Error)</option>
                <option value="reviewer-invitation">Konfirmasi Undangan Mitra Bestari</option>
                <option value="apc-billing">Pertanyaan Invoice APC & Rekening Lembaga</option>
                <option value="mou-partner">MoU Kerja Sama Kemitraan Fakultas</option>
                <option value="doi-query">Verifikasi Registrasi Metadata DOI Crossref</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold mb-1.5 text-slate-900">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama pengirim tiket"
                  className="w-full p-3 rounded-2xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1.5 text-slate-900">Surel Balasan:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="surel@institusi.ac.id"
                  className="w-full p-3 rounded-2xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1.5 text-slate-900">Uraian Pertanyaan / Kendala:</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Deskripsikan detail kendala Anda..."
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
                Kirim Tiket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
