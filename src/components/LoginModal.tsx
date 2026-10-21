import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [role, setRole] = useState<'author' | 'reviewer' | 'editor'>('author');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-7 flex flex-col gap-5 border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">login</span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900">
              Masuk ke Portal OJS Cendraloka
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 rounded-full text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRole('author')}
            className={`py-2 rounded-full transition-all cursor-pointer ${
              role === 'author'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Penulis
          </button>
          <button
            type="button"
            onClick={() => setRole('reviewer')}
            className={`py-2 rounded-full transition-all cursor-pointer ${
              role === 'reviewer'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mitra Bestari
          </button>
          <button
            type="button"
            onClick={() => setRole('editor')}
            className={`py-2 rounded-full transition-all cursor-pointer ${
              role === 'editor'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Editor OJS
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center text-xs text-emerald-600 font-semibold flex flex-col items-center gap-2.5">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <span className="text-sm font-bold text-slate-900">Autentikasi Berhasil! Mengalihkan ke dashboard...</span>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                Surel / Nama Pengguna OJS:
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  role === 'author'
                    ? 'penulis@universitas.ac.id'
                    : role === 'reviewer'
                    ? 'reviewer@cendraloka.ac.id'
                    : 'editor@cendraloka.ac.id'
                }
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-900">Kata Sandi:</label>
                <a href="#" className="text-[11px] text-blue-600 hover:underline font-semibold">
                  Lupa Sandi?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-[11px] text-slate-600 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-blue-600 shrink-0">info</span>
              <span>
                Demo Sandbox: Anda dapat masuk dengan akun demo apapun untuk simulasi portal.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              Masuk ke Dashboard
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
