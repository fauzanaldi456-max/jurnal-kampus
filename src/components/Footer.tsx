import React from 'react';
import { PageView } from '../types';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenWaiver?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-white shadow-[0_-1px_6px_rgba(0,0,0,0.03)] border-t border-[#e5eeff]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img
                alt="Jurnexa Brand Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1XBiqhKvx6nccFffsdEcS1Ufqs9_Sv_WaiKNMIYOg9xiEJUH0pdjdDjXSAIEyra4-ZnBanTOGyx42mGAhdfHgtokuVZLLYScUT1Y3ZWS2fzgV63Ws-13Wc67_9AAFgiT8bxPDCgayLGhJKoJY9-mIsxszNR56w5aap6Jdx2YkAYCNG84NnCNdODQy_tGktFBM1V2YXzzLHHWO9t0kfq9-b4sUczOVkD6uzJ02ttbFeq6WtmMEEAuYnLTUc"
              />
              <div className="flex flex-col">
                <span className="font-['Plus_Jakarta_Sans'] text-lg text-[#0b1c30] font-bold tracking-tight">
                  JURNEXA
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#45464d] uppercase tracking-wider">
                  Scientific Publishing
                </span>
              </div>
            </div>
            <p className="text-xs text-[#45464d] leading-relaxed max-w-sm">
              Platform portal jurnal ilmiah terintegrasi yang berkomitmen menjunjung tinggi integritas penelitian, etika open access internasional, dan transparansi proses peer-review.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#e5eeff] text-[#1d3989] text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>COPE Ethical Standard</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#eff4ff] text-[#45464d] font-['JetBrains_Mono'] text-xs font-medium">
                <span>DOAJ Compliant</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#eff4ff] text-[#45464d] font-['JetBrains_Mono'] text-xs font-medium">
                <span>Crossref DOI</span>
              </div>
            </div>
          </div>

          {/* Kolom 1: Eksplorasi */}
          <div className="lg:col-span-2 flex flex-col gap-2.5">
            <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30] uppercase tracking-wider">
              Eksplorasi
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-[#45464d]">
              <li>
                <button
                  onClick={() => onNavigate('direktori-jurnal')}
                  className="hover:text-[#4059aa] transition-colors text-left"
                >
                  Direktori Jurnal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('artikel')}
                  className="hover:text-[#4059aa] transition-colors text-left"
                >
                  Artikel Terbaru
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('direktori-jurnal')}
                  className="hover:text-[#4059aa] transition-colors text-left"
                >
                  Bidang Ilmu & Klaster
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('artikel')}
                  className="hover:text-[#4059aa] transition-colors text-left"
                >
                  Edisi Khusus (Special Issue)
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 2: Layanan Penulis & Editor */}
          <div className="lg:col-span-3 flex flex-col gap-2.5">
            <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30] uppercase tracking-wider">
              Layanan Penulis & Editor
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-[#45464d]">
              <li>
                <button
                  onClick={() => onNavigate('panduan-publikasi')}
                  className="hover:text-[#4059aa] transition-colors text-left"
                >
                  Panduan Penulis (IMRaD)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('panduan-publikasi')}
                  className="hover:text-[#4059aa] transition-colors text-left"
                >
                  Biaya Publikasi (APC & Waiver)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('panduan-publikasi')}
                  className="hover:text-[#4059aa] transition-colors text-left"
                >
                  Etika Publikasi & Anti-Plagiarisme
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('panduan-publikasi')}
                  className="hover:text-[#4059aa] transition-colors text-left"
                >
                  Alur Double-Blind Peer Review
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('panduan-publikasi')}
                  className="hover:text-[#4059aa] transition-colors text-left"
                >
                  Template Naskah (Docx/LaTeX)
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Institusi & Kontak */}
          <div className="lg:col-span-3 flex flex-col gap-2.5">
            <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30] uppercase tracking-wider">
              Institusi & Kontak
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-[#45464d]">
              <li>
                <button
                  onClick={() => onNavigate('tentang-kami')}
                  className="hover:text-[#4059aa] transition-colors text-left"
                >
                  Tentang Jurnexa Publishing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tentang-kami')}
                  className="hover:text-[#4059aa] transition-colors text-left"
                >
                  Mitra Institusi & Jaringan
                </button>
              </li>
              <li>
                <span className="text-[#45464d] cursor-pointer hover:text-[#4059aa]">
                  Kebijakan Privasi
                </span>
              </li>
              <li>
                <span className="text-[#45464d] cursor-pointer hover:text-[#4059aa]">
                  Syarat & Ketentuan Konsorsium
                </span>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tentang-kami')}
                  className="hover:text-[#4059aa] transition-colors text-left"
                >
                  Kontak Tim Editorial & Sekretariat
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#e5eeff] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#45464d]">
          <p>© 2025 Jurnexa Portal Ilmiah. Seluruh naskah yang diterbitkan mematuhi standar etika COPE. Semua data simulasi bertanda demo.</p>
          <div className="flex items-center gap-4 font-['JetBrains_Mono'] text-[11px] shrink-0">
            <span className="inline-block w-2 h-2 rounded-full bg-[#4059aa]"></span>
            <span>Sistem Pengarsipan Digital Permanen</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
