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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6 flex flex-col gap-4 border border-[#e5eeff]">
        <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4059aa] text-[22px]">contact_support</span>
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
              Tiket Asistensi Editorial & Helpdesk OJS
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
            <span className="material-symbols-outlined text-[36px]">confirmation_number</span>
            <span className="font-bold text-sm text-[#0b1c30]">
              Tiket Berhasil Dibuat: #{ticketNo}
            </span>
            <p className="text-[#45464d] max-w-xs">
              Tim sekretariat Jurnexa akan merespons melalui surel Anda dalam tempo &lt; 24 jam kerja.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 pt-1 text-xs text-[#0b1c30]">
            <div>
              <label className="block font-semibold mb-1">Topik Bantuan:</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#c6c6cd] focus:ring-2 focus:ring-[#4059aa]/40 focus:outline-none"
              >
                <option value="ojs-tech">Kendala Teknis Portal OJS 3 (Upload Gagal/Error)</option>
                <option value="reviewer-invitation">Konfirmasi Undangan Mitra Bestari</option>
                <option value="apc-billing">Pertanyaan Invoice APC & Rekening Lembaga</option>
                <option value="mou-partner">MoU Kerja Sama Kemitraan Fakultas</option>
                <option value="doi-query">Verifikasi Registrasi Metadata DOI Crossref</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama pengirim tiket"
                  className="w-full p-2.5 rounded-lg border border-[#c6c6cd] focus:ring-2 focus:ring-[#4059aa]/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Surel Balasan:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="surel@institusi.ac.id"
                  className="w-full p-2.5 rounded-lg border border-[#c6c6cd] focus:ring-2 focus:ring-[#4059aa]/40 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Uraian Pertanyaan / Kendala:</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Deskripsikan detail kendala Anda..."
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
                Kirim Tiket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
