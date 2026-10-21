import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageView } from '../types';

interface FooterProps {
  onNavigate?: (page: PageView) => void;
  onOpenWaiver?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenWaiver }) => {
  const navigate = useNavigate();

  const handleNav = (path: string, page: PageView) => {
    navigate(path);
    if (onNavigate) {
      onNavigate(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-14">
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <span className="material-symbols-outlined text-[20px]">auto_stories</span>
              </div>
              <div className="flex flex-col">
                <span className="font-['Plus_Jakarta_Sans'] text-lg text-slate-900 font-bold tracking-tight">
                  JURNEXA
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-slate-500 uppercase tracking-wider">
                  Scientific Publishing
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
              Platform portal jurnal ilmiah terintegrasi yang berkomitmen menjunjung tinggi integritas penelitian, etika open access internasional, dan transparansi proses peer-review.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>COPE Ethical Standard</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 font-['JetBrains_Mono'] text-xs font-medium shadow-xs">
                <span>DOAJ Compliant</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 font-['JetBrains_Mono'] text-xs font-medium shadow-xs">
                <span>Crossref DOI</span>
              </div>
            </div>
          </div>

          {/* Kolom 1: Eksplorasi */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-slate-900 uppercase tracking-wider">
              Eksplorasi
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => handleNav('/direktori-jurnal', 'direktori-jurnal')}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer"
                >
                  Direktori Jurnal
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/artikel', 'artikel')}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer"
                >
                  Artikel Terbaru
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/direktori-jurnal', 'direktori-jurnal')}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer"
                >
                  Bidang Ilmu & Klaster
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/artikel', 'artikel')}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer"
                >
                  Edisi Khusus (Special Issue)
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 2: Layanan Penulis & Editor */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h3 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-slate-900 uppercase tracking-wider">
              Layanan Penulis & Editor
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => handleNav('/panduan-publikasi', 'panduan-publikasi')}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer"
                >
                  Panduan Penulis (IMRaD)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/panduan-publikasi', 'panduan-publikasi')}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer"
                >
                  Biaya Publikasi (APC & Waiver)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/panduan-publikasi', 'panduan-publikasi')}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer"
                >
                  Etika Publikasi & Anti-Plagiarisme
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/panduan-publikasi', 'panduan-publikasi')}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer"
                >
                  Alur Double-Blind Peer Review
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/panduan-publikasi', 'panduan-publikasi')}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer"
                >
                  Template Naskah (Docx/LaTeX)
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Institusi & Kontak */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h3 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-slate-900 uppercase tracking-wider">
              Institusi & Kontak
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => handleNav('/tentang-kami', 'tentang-kami')}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer"
                >
                  Tentang Jurnexa Publishing
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tentang-kami', 'tentang-kami')}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer"
                >
                  Mitra Institusi & Jaringan
                </button>
              </li>
              <li>
                <span className="text-slate-600 cursor-pointer hover:text-blue-600 transition-colors">
                  Kebijakan Privasi
                </span>
              </li>
              <li>
                <span className="text-slate-600 cursor-pointer hover:text-blue-600 transition-colors">
                  Syarat & Ketentuan Konsorsium
                </span>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tentang-kami', 'tentang-kami')}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer"
                >
                  Kontak Tim Editorial & Sekretariat
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 Jurnexa Portal Ilmiah. Seluruh naskah yang diterbitkan mematuhi standar etika COPE. Semua data simulasi bertanda demo.</p>
          <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-[11px] shrink-0">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Sistem Pengarsipan Digital Permanen</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
