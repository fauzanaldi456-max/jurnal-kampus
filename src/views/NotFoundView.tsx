import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
      <div className="card-ref p-8 md:p-14 rounded-3xl max-w-2xl mx-auto border border-slate-200/80 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[32px]">find_in_page</span>
        </div>

        <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          Halaman Tidak Ditemukan
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto mb-8 leading-relaxed">
          Tautan, repositori naskah, atau direktori yang Anda tuju tidak tersedia atau telah dipindahkan ke alamat permanen baru.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all shadow-sm hover:shadow-md inline-flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>Kembali ke Beranda</span>
          </Link>
          <Link
            to="/artikel"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all inline-flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            <span>Jelajahi Katalog Artikel</span>
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center gap-6 text-xs text-slate-500">
          <Link to="/direktori-jurnal" className="hover:text-blue-600 transition-colors">
            Direktori Jurnal
          </Link>
          <span>•</span>
          <Link to="/panduan-publikasi" className="hover:text-blue-600 transition-colors">
            Panduan Penulis
          </Link>
          <span>•</span>
          <Link to="/tentang-kami" className="hover:text-blue-600 transition-colors">
            Tentang Konsorsium
          </Link>
        </div>
      </div>
    </div>
  );
};
