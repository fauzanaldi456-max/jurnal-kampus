import React, { useState } from 'react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  doi: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, doi }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const doiUrl = `https://doi.org/${doi}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(doiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl p-6 sm:p-7 flex flex-col items-center text-center gap-5 border border-slate-200">
        <div className="flex items-center justify-between w-full pb-3 border-b border-slate-100">
          <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-slate-900">QR Code Tautan Permanen</span>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* QR Code Graphic Block */}
        <div className="w-52 h-52 bg-slate-50 rounded-2xl p-5 flex flex-col items-center justify-center relative border border-slate-200 shadow-inner">
          <svg className="w-full h-full text-slate-900" fill="currentColor" viewBox="0 0 100 100">
            <path d="M10 10h30v30h-30z M15 15v20h20v-20z M20 20h10v10h-10z M60 10h30v30h-30z M65 15v20h20v-20z M70 20h10v10h-10z M10 60h30v30h-30z M15 65v20h20v-20z M20 70h10v10h-10z M45 10h10v20h-10z M45 40h20v10h-20z M60 50h10v20h-10z M80 50h10v10h-10z M70 70h20v20h-20z M50 70h10v20h-10z M45 60h10v10h-10z M20 45h20v10h-20z" />
          </svg>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
            <span className="font-['JetBrains_Mono'] text-xs text-blue-600 font-semibold truncate">
              {doi}
            </span>
            <button
              onClick={copyUrl}
              className="p-1 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
              title="Salin URL"
            >
              <span className="material-symbols-outlined text-[15px]">
                {copied ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Pindai menggunakan kamera ponsel untuk langsung menuju naskah resmi terbitan.
          </p>
        </div>
      </div>
    </div>
  );
};
