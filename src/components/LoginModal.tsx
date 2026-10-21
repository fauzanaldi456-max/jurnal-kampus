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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 flex flex-col gap-4 border border-[#e5eeff]">
        <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4059aa] text-[22px]">login</span>
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
              Masuk ke Portal OJS Jurnexa
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#eff4ff] rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setRole('author')}
            className={`py-1.5 rounded-md transition-all ${
              role === 'author'
                ? 'bg-white text-[#0b1c30] shadow-sm font-semibold'
                : 'text-[#45464d] hover:text-[#0b1c30]'
            }`}
          >
            Penulis
          </button>
          <button
            type="button"
            onClick={() => setRole('reviewer')}
            className={`py-1.5 rounded-md transition-all ${
              role === 'reviewer'
                ? 'bg-white text-[#0b1c30] shadow-sm font-semibold'
                : 'text-[#45464d] hover:text-[#0b1c30]'
            }`}
          >
            Mitra Bestari
          </button>
          <button
            type="button"
            onClick={() => setRole('editor')}
            className={`py-1.5 rounded-md transition-all ${
              role === 'editor'
                ? 'bg-white text-[#0b1c30] shadow-sm font-semibold'
                : 'text-[#45464d] hover:text-[#0b1c30]'
            }`}
          >
            Editor OJS
          </button>
        </div>

        {isSuccess ? (
          <div className="py-6 text-center text-xs text-[#0c9488] font-semibold flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[32px]">check_circle</span>
            <span>Autentikasi Berhasil! Mengalihkan ke dashboard...</span>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
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
                    ? 'reviewer@jurnexa.ac.id'
                    : 'editor@jurnexa.ac.id'
                }
                className="w-full p-2.5 rounded-lg border border-[#c6c6cd] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#4059aa]/40 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[#0b1c30]">Kata Sandi:</label>
                <a href="#" className="text-[11px] text-[#4059aa] hover:underline">
                  Lupa Sandi?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-lg border border-[#c6c6cd] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#4059aa]/40 focus:outline-none"
              />
            </div>

            <div className="p-2.5 bg-[#eff4ff] rounded-lg text-[11px] text-[#45464d] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#4059aa]">info</span>
              <span>
                Demo Sandbox: Anda dapat masuk dengan akun demo apapun untuk simulasi portal.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-black hover:bg-[#131b2e] text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
            >
              Masuk ke Dashboard
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
