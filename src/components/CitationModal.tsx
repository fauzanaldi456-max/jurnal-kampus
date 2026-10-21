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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto border border-[#e5eeff]">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#4059aa]">
              <span className="material-symbols-outlined text-[20px]">format_quote</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                Kutipan Ilmiah Resmi
              </h3>
              <p className="text-xs text-[#45464d]">
                Gunakan format sitasi baku untuk artikel naskah ini
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Format Selection Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#eff4ff] rounded-lg text-xs">
          {(['apa', 'ieee', 'harvard', 'chicago', 'vancouver'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setActiveTab(fmt)}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === fmt
                  ? 'bg-white text-[#0b1c30] shadow-sm font-semibold'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
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
        <div className="p-4 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] relative border border-[#d3e4fe]">
          <div className="leading-relaxed font-normal">{citations[activeTab]}</div>
        </div>

        {/* Copy Action Row */}
        <div className="flex items-center justify-between">
          <span
            className={`font-['JetBrains_Mono'] text-xs text-[#0c9488] transition-opacity ${
              copied ? 'opacity-100' : 'opacity-0'
            }`}
          >
            ✓ Teks sitasi berhasil disalin ke clipboard!
          </span>
          <button
            onClick={handleCopy}
            className="ml-auto px-4 py-2 bg-black hover:bg-[#131b2e] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>{copied ? 'Tersalin!' : 'Salin Teks Kutipan'}</span>
          </button>
        </div>

        {/* Export to Reference Managers Section */}
        <div className="pt-2 border-t border-[#e5eeff] flex flex-col gap-2">
          <span className="text-xs font-bold text-[#0b1c30]">
            Unduh File Sitasi ke Reference Manager:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={downloadBibtex}
              className="p-2.5 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] text-left flex flex-col gap-0.5 transition-colors border border-[#e5eeff]"
            >
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#4059aa]">.BIB</span>
              <span className="text-[11px] text-[#0b1c30]">BibTeX / LaTeX</span>
            </button>
            <button
              onClick={downloadRIS}
              className="p-2.5 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] text-left flex flex-col gap-0.5 transition-colors border border-[#e5eeff]"
            >
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#4059aa]">.RIS</span>
              <span className="text-[11px] text-[#0b1c30]">Mendeley / Zotero</span>
            </button>
            <button
              onClick={downloadRIS}
              className="p-2.5 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] text-left flex flex-col gap-0.5 transition-colors border border-[#e5eeff]"
            >
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#4059aa]">.ENW</span>
              <span className="text-[11px] text-[#0b1c30]">Thomson EndNote</span>
            </button>
            <button
              onClick={downloadBibtex}
              className="p-2.5 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] text-left flex flex-col gap-0.5 transition-colors border border-[#e5eeff]"
            >
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#4059aa]">.XML</span>
              <span className="text-[11px] text-[#0b1c30]">Crossref Schema</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
