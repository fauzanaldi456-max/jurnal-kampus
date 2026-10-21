import React, { useState } from 'react';
import { Article } from '../types';

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article;
}

export const CitationModal: React.FC<CitationModalProps> = ({ isOpen, onClose, article }) => {
  const [activeTab, setActiveTab] = useState<'apa' | 'ieee' | 'harvard' | 'chicago' | 'vancouver'>('apa');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const citations: Record<string, string> = {
    apa: `Wijaya, H., Pratama, R., & Sudarmono, B. (${article.year}). ${article.title}. ${article.journalName}, ${article.volume.replace('Vol. ', '')}(${article.issue.replace('No. ', '')}), ${article.pages}. https://doi.org/${article.doi}`,
    ieee: `H. Wijaya, R. Pratama, and B. Sudarmono, "${article.title}," ${article.journalName}, vol. ${article.volume.replace('Vol. ', '')}, no. ${article.issue.replace('No. ', '')}, pp. ${article.pages}, ${article.month}, doi: ${article.doi}.`,
    harvard: `Wijaya, H., Pratama, R. and Sudarmono, B., ${article.year}. ${article.title}. ${article.journalName}, ${article.volume.replace('Vol. ', '')}(${article.issue.replace('No. ', '')}), pp.${article.pages}.`,
    chicago: `Wijaya, Hendra, Rizky Pratama, and Bambang Sudarmono. "${article.title}." ${article.journalName} ${article.volume.replace('Vol. ', '')}, no. ${article.issue.replace('No. ', '')} (${article.year}): ${article.pages}. https://doi.org/${article.doi}.`,
    vancouver: `Wijaya H, Pratama R, Sudarmono B. ${article.title}. ${article.journalShort}. ${article.year} Feb;${article.volume.replace('Vol. ', '')}(${article.issue.replace('No. ', '')}):${article.pages}.`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(citations[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadBibtex = () => {
    const bib = `@article{wijaya2025implementasi,
  title={${article.title}},
  author={Wijaya, Hendra and Pratama, Rizky and Sudarmono, Bambang},
  journal={${article.journalName}},
  volume={${article.volume.replace('Vol. ', '')}},
  number={${article.issue.replace('No. ', '')}},
  pages={${article.pages.replace('–', '--')}},
  year={${article.year}},
  publisher={Universitas Nusantara Press},
  doi={${article.doi}}
}`;
    const blob = new Blob([bib], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${article.journalShort.toLowerCase()}_${article.id}.bib`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadRIS = () => {
    const ris = `TY  - JOUR
TI  - ${article.title}
AU  - Wijaya, Hendra
AU  - Pratama, Rizky
AU  - Sudarmono, Bambang
JO  - ${article.journalName}
VL  - ${article.volume.replace('Vol. ', '')}
IS  - ${article.issue.replace('No. ', '')}
SP  - 142
EP  - 158
PY  - ${article.year}/02/14/
DO  - ${article.doi}
ER  - `;
    const blob = new Blob([ris], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${article.journalShort.toLowerCase()}_${article.id}.ris`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl p-6 sm:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">format_quote</span>
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900">
                Kutipan Ilmiah Resmi
              </h3>
              <p className="text-xs text-slate-500">
                Gunakan format sitasi baku untuk artikel naskah ini
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Format Selection Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 rounded-full text-xs">
          {(['apa', 'ieee', 'harvard', 'chicago', 'vancouver'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setActiveTab(fmt)}
              className={`px-4 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                activeTab === fmt
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {fmt === 'apa'
                ? 'APA 7th'
                : fmt === 'ieee'
                ? 'IEEE'
                : fmt === 'harvard'
                ? 'Harvard'
                : fmt === 'chicago'
                ? 'Chicago'
                : 'Vancouver'}
            </button>
          ))}
        </div>

        {/* Modal Citation Text View */}
        <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl text-xs text-slate-800 relative border border-slate-200 font-mono">
          <div className="leading-relaxed font-normal break-words">{citations[activeTab]}</div>
        </div>

        {/* Copy Action Row */}
        <div className="flex items-center justify-between">
          <span
            className={`font-['JetBrains_Mono'] text-xs text-emerald-600 font-semibold transition-opacity ${
              copied ? 'opacity-100' : 'opacity-0'
            }`}
          >
            ✓ Teks sitasi berhasil disalin ke clipboard!
          </span>
          <button
            onClick={handleCopy}
            className="ml-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>{copied ? 'Tersalin!' : 'Salin Teks Kutipan'}</span>
          </button>
        </div>

        {/* Export to Reference Managers Section */}
        <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-900">
            Unduh File Sitasi ke Reference Manager:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={downloadBibtex}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/60 text-left flex flex-col gap-0.5 transition-colors border border-slate-200 cursor-pointer group"
            >
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-blue-600">.BIB</span>
              <span className="text-[11px] text-slate-700 group-hover:text-blue-700">BibTeX / LaTeX</span>
            </button>
            <button
              onClick={downloadRIS}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/60 text-left flex flex-col gap-0.5 transition-colors border border-slate-200 cursor-pointer group"
            >
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-blue-600">.RIS</span>
              <span className="text-[11px] text-slate-700 group-hover:text-blue-700">Mendeley / Zotero</span>
            </button>
            <button
              onClick={downloadRIS}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/60 text-left flex flex-col gap-0.5 transition-colors border border-slate-200 cursor-pointer group"
            >
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-blue-600">.ENW</span>
              <span className="text-[11px] text-slate-700 group-hover:text-blue-700">Thomson EndNote</span>
            </button>
            <button
              onClick={downloadBibtex}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/60 text-left flex flex-col gap-0.5 transition-colors border border-slate-200 cursor-pointer group"
            >
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-blue-600">.XML</span>
              <span className="text-[11px] text-slate-700 group-hover:text-blue-700">Crossref Schema</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
