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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl p-6 flex flex-col items-center text-center gap-4 border border-[#e5eeff]">
        <div className="flex items-center justify-between w-full pb-2 border-b border-[#e5eeff]">
          <span className="text-sm font-bold text-[#0b1c30]">QR Code Tautan Permanen</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* QR Code Graphic Block */}
        <div className="w-48 h-48 bg-[#eff4ff] rounded-xl p-4 flex flex-col items-center justify-center relative border border-[#d3e4fe] shadow-inner">
          <svg className="w-full h-full text-[#0b1c30]" fill="currentColor" viewBox="0 0 100 100">
            <path d="M10 10h30v30h-30z M15 15v20h20v-20z M20 20h10v10h-10z M60 10h30v30h-30z M65 15v20h20v-20z M70 20h10v10h-10z M10 60h30v30h-30z M15 65v20h20v-20z M20 70h10v10h-10z M45 10h10v20h-10z M45 40h20v10h-20z M60 50h10v20h-10z M80 50h10v10h-10z M70 70h20v20h-20z M50 70h10v20h-10z M45 60h10v10h-10z M20 45h20v10h-20z" />
          </svg>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-center gap-2">
            <span className="font-['JetBrains_Mono'] text-xs text-[#0b1c30] font-semibold">
              {doi}
            </span>
            <button
              onClick={copyUrl}
              className="p-1 rounded hover:bg-[#eff4ff] text-[#4059aa]"
              title="Salin URL"
            >
              <span className="material-symbols-outlined text-[15px]">
                {copied ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>
          <p className="text-[11px] text-[#45464d] leading-normal">
            Pindai menggunakan kamera ponsel untuk langsung menuju naskah resmi terbitan.
          </p>
        </div>
      </div>
    </div>
  );
};
