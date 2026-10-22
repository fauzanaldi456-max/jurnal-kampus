import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [detectedRole, setDetectedRole] = useState('Penulis & Peneliti');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const val = identifier.toLowerCase();
    let role = 'Penulis & Peneliti';
    if (val.includes('editor')) role = 'Dewan Editor';
    else if (val.includes('reviewer')) role = 'Mitra Bestari';
    else if (val.includes('admin')) role = 'Administrator';
    setDetectedRole(role);

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  const handleGoToFullPage = () => {
    onClose();
    navigate('/masuk');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-7 flex flex-col gap-5 border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900 leading-tight">
                Pintu Masuk Terpadu Portal OJS
              </h3>
              <p className="text-[11px] text-slate-500">1 Pintu untuk seluruh peran konsorsium</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* 1 Pintu Note */}
        <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-2xl flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-[11px] text-slate-700 leading-snug">
            <strong>Masuk 1 Pintu:</strong> Hak akses Penulis, Mitra Bestari, atau Dewan Editor langsung terdeteksi otomatis.
          </span>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center text-xs text-emerald-600 font-semibold flex flex-col items-center gap-2.5">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-sm font-bold text-slate-900">Autentikasi 1 Pintu Berhasil!</span>
            <span className="text-xs text-blue-700">Mengarahkan ke Dashboard {detectedRole}...</span>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                Surel / Nama Pengguna OJS:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="penulis, reviewer, atau editor@cendraloka.ac.id"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-900">Kata Sandi:</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Tautan reset kata sandi telah dikirim.'); }} className="text-[11px] text-blue-600 hover:underline font-semibold">
                  Lupa Sandi?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Masuk ke Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Link to dedicated page */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleGoToFullPage}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium cursor-pointer"
              >
                <span>Buka Halaman Masuk Penuh (/masuk)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
