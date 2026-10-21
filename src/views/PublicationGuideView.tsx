import React, { useState } from 'react';
import { PageView } from '../types';

interface PublicationGuideViewProps {
  onNavigate: (page: PageView) => void;
  onOpenSubmission: () => void;
  onOpenWaiver: () => void;
  onOpenTicket: () => void;
}

export const PublicationGuideView: React.FC<PublicationGuideViewProps> = ({
  onNavigate,
  onOpenSubmission,
  onOpenWaiver,
  onOpenTicket
}) => {
  const [activeTab, setActiveTab] = useState<string>('imrad');
  const [checklist, setChecklist] = useState<boolean[]>([false, false, false, false, false, false]);

  const checkedCount = checklist.filter(Boolean).length;
  const isAllChecked = checkedCount === checklist.length;

  const toggleChecklistItem = (index: number) => {
    setChecklist((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -140;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full bg-white text-slate-900">
      {/* Top Breadcrumb & Quick Anchor Bar */}
      <section className="w-full bg-slate-50/80 px-4 sm:px-6 lg:px-8 py-3 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <button
              onClick={() => onNavigate('beranda')}
              className="hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Beranda</span>
            </button>
            <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
            <span className="text-slate-900 font-semibold">Panduan Publikasi</span>
          </nav>
          <div className="flex items-center gap-4 font-['JetBrains_Mono'] text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>COPE Standards Compliant (Ed. 2025/v2.4)</span>
            </span>
            <span className="hidden md:inline-block text-slate-300">|</span>
            <span className="hidden md:inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-blue-600">update</span>
              <span>Pembaruan: 12 Januari 2025</span>
            </span>
          </div>
        </div>
      </section>

      {/* Hero Header Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pt-12 pb-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Standar Editorial Terpadu Konsorsium Jurnexa</span>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl lg:text-5xl text-slate-900 font-extrabold tracking-tight leading-[1.2]">
              Panduan Komprehensif Publikasi Ilmiah &amp; Integritas Penulisan
            </h1>
            <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
              Standar pedoman penyiapan naskah, alur peer-review tertutup ganda (double-blind), kepatuhan etika Committee on Publication Ethics (COPE), dan transparansi pembiayaan bagi seluruh civitas akademika konsorsium Jurnexa.
            </p>

            {/* Fast Download Action Pillows */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() =>
                  downloadFile(
                    'JURNEXA_Template_MSWord_2025.docx',
                    'Template Resmi Jurnexa Format MS Word (IMRaD Standard Document Demo)'
                  )
                }
                className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-sm group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]">article</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="leading-tight text-xs font-bold">Unduh Template MS Word</span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-slate-400 leading-tight">
                    Format .docx (A4, 2-Kolom)
                  </span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-white transition-colors">download</span>
              </button>

              <button
                onClick={() =>
                  downloadFile(
                    'JURNEXA_LaTeX_Overleaf_Template_2025.zip',
                    '% Jurnexa LaTeX Document Class Simulation Package'
                  )
                }
                className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-all shadow-xs border border-slate-200 cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">terminal</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="leading-tight text-xs font-bold">Unduh Template LaTeX</span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-slate-500 leading-tight">
                    Package .zip &amp; Overleaf Ready
                  </span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-slate-800 transition-colors">folder_zip</span>
              </button>

              <button
                onClick={() => scrollToSection('pre-submission')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors text-xs font-semibold border border-slate-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-blue-600">checklist</span>
                <span>Checklist Mandiri</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bento Widget */}
          <div className="lg:col-span-4 bg-white p-7 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-200 flex flex-col gap-5 relative overflow-hidden">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Statistik Editorial Rata-Rata
              </span>
              <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">speed</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-slate-900">
                  2.4<span className="text-xs font-normal text-slate-500 ml-1">Minggu</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-medium">First Editorial Decision</div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-blue-600">
                  38<span className="text-xs font-normal text-slate-500 ml-1">Hari</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Siklus Review Penuh</div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-emerald-600">
                  21.4%
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Acceptance Rate (Selektif)</div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-slate-900">
                  100%
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Open Access DOI Crossref</div>
              </div>
            </div>
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center gap-3 text-blue-800 text-xs">
              <span className="material-symbols-outlined text-[20px] text-blue-600 shrink-0">info</span>
              <p className="leading-snug">
                Seluruh publikasi terindeks permanen pada repository nasional dan platform mitra internasional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Guideline Navigation Bar - Clean Pills */}
      <section className="sticky top-16 md:top-20 z-40 w-full bg-white/95 backdrop-blur-md shadow-xs border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none py-3">
          <div className="flex items-center gap-2 min-w-max">
            {[
              { id: 'imrad', label: '1. Sistematika IMRaD', icon: 'menu_book' },
              { id: 'anti-plagiarisme', label: '2. Anti-Plagiarisme & AI', icon: 'policy' },
              { id: 'format-sitasi', label: '3. Gaya & Sitasi', icon: 'format_quote' },
              { id: 'alur-review', label: '4. Siklus Peer-Review', icon: 'schema' },
              { id: 'kebijakan-apc', label: '5. Kebijakan Biaya (APC)', icon: 'payments' },
              { id: 'hak-cipta', label: '6. Hak Cipta & CC-BY', icon: 'copyright' }
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => scrollToSection(nav.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === nav.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{nav.icon}</span>
                <span>{nav.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Core Content Area: Main Guidelines & Sidebar Auxiliaries */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-slate-50/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Primary 8-Column Guideline Stream */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* SECTION 1: IMRaD Requirements */}
            <article
              id="imrad"
              className="scroll-mt-36 p-6 sm:p-8 bg-white rounded-3xl shadow-xs border border-slate-200/90 flex flex-col gap-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-sm text-blue-600">
                    01
                  </span>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-slate-900">
                      Persyaratan &amp; Sistematika Naskah
                    </h2>
                    <p className="text-xs text-slate-500">
                      Struktur IMRaD Baku (Introduction, Methods, Results, and Discussion)
                    </p>
                  </div>
                </div>
                <span className="px-3.5 py-1 bg-slate-100 text-slate-700 rounded-full font-['JetBrains_Mono'] text-xs font-medium border border-slate-200">
                  Panjang: 4.500 - 8.000 Kata
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Setiap naskah yang diajukan ke portal Jurnexa wajib mematuhi standar penulisan empiris ilmiah. Penulisan dapat menggunakan Bahasa Indonesia baku sesuai EYD V atau Bahasa Inggris akademis (UK/US standard yang konsisten).
              </p>

              {/* IMRaD Accordion / Visual Breakdown */}
              <div className="grid grid-cols-1 gap-3.5">
                {/* Title, Abstract, Keywords */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-[20px]">title</span>
                      Judul, Penulis &amp; Abstrak
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      Maks 15 Kata (Judul)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Judul naskah wajib ringkas, informatif, dan tidak memuat singkatan non-standar. Abstrak terstruktur 200–250 kata merangkum latar belakang, tujuan spesifik, metodologi utama, temuan kunci, serta implikasi kebaruan riset. Sertakan 4–6 kata kunci spesifik yang dapat diindeks oleh mesin pengindeks global.
                  </p>
                </div>

                {/* Introduction */}
                <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-[20px]">explore</span>
                      Introduction (Pendahuluan)
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      Bobot ~20%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Menguraikan latar belakang konseptual, tinjauan literatur primer (minimal 80% berasal dari jurnal bereputasi 5 tahun terakhir), celah penelitian (research gap), justifikasi kebaruan (novelty), dan tujuan investigasi yang jelas di paragraf penutup.
                  </p>
                </div>

                {/* Methods */}
                <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-[20px]">biotech</span>
                      Methods (Metode Riset)
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      Reproducible
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Detail perancangan eksperimen, teknik pengambilan sampel, instrumen validasi, protokol uji etika (jika melibatkan subjek hayati), dan metodologi analitis statistik secara transparan agar hasil penelitian dapat direplikasi secara independen.
                  </p>
                </div>

                {/* Results & Discussion */}
                <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-[20px]">query_stats</span>
                      Results and Discussion (Hasil &amp; Pembahasan)
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      Bobot ~50%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Penyajian data temuan melalui visualisasi grafis bermutu tinggi, disusul dengan sintesis komparatif terhadap hipotesis serta literatur terdahulu. Pembahasan wajib menjawab pertanyaan penelitian dan tidak mengulang isi tabel secara tekstual semata.
                  </p>
                </div>

                {/* Conclusion */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-[20px]">task_alt</span>
                      Conclusion &amp; Future Works
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      1 Paragraf Terpadu
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ringkasan kesimpulan yang menjawab rumusan masalah secara langsung, diiringi keterbatasan studi (limitations) serta rekomendasi arah penelitian masa depan tanpa menggunakan poin enumerasi numerik.
                  </p>
                </div>
              </div>
            </article>

            {/* SECTION 2: Anti-Plagiarism & AI Usage */}
            <article
              id="anti-plagiarisme"
              className="scroll-mt-36 p-6 sm:p-8 bg-white rounded-3xl shadow-xs border border-slate-200/90 flex flex-col gap-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-sm text-blue-600">
                    02
                  </span>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-slate-900">
                      Kebijakan Anti-Plagiarisme &amp; AI Usage
                    </h2>
                    <p className="text-xs text-slate-500">
                      Integritas Orisinalitas &amp; Penggunaan Kecerdasan Buatan
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                  Toleransi Maks. 20%
                </span>
              </div>

              {/* Plagiarism Meter Bar */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-2.5">
                <div className="flex flex-wrap items-center justify-between text-xs gap-1">
                  <span className="text-slate-900 font-semibold">
                    Batas Ambang Kemiripan Similarity (Turnitin / iThenticate)
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-slate-500">
                    Maksimal 20% Keseluruhan (Maks. 3% per sumber tunggal)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-500 h-full w-[20%]" title="Zona Diterima (≤ 20%)"></div>
                  <div className="bg-amber-400 h-full w-[15%]" title="Zona Revisi Menyeluruh (21-35%)"></div>
                  <div className="bg-rose-500 h-full w-[65%]" title="Zona Ditolak Otomatis (> 35%)"></div>
                </div>
                <div className="flex justify-between font-['JetBrains_Mono'] text-[11px] pt-1">
                  <span className="text-emerald-700 font-bold">0% - 20% (Lolos Skrining)</span>
                  <span className="text-amber-700 font-bold">21% - 35% (Revisi Parafrasa)</span>
                  <span className="text-rose-700 font-bold">&gt; 35% (Desk Reject)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-slate-900 font-['Plus_Jakarta_Sans'] font-bold text-sm">
                    <span className="material-symbols-outlined text-blue-600 text-[22px]">auto_fix_high</span>
                    <span>Etika Pemanfaatan AI Generatif</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Peralatan AI (seperti ChatGPT, Claude, atau Gemini){' '}
                    <strong>tidak dapat dicantumkan sebagai penulis (author/co-author)</strong> karena tidak memiliki akuntabilitas legal. AI hanya diizinkan untuk koreksi gramatika dan pemolesan gaya bahasa.
                  </p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-slate-900 font-['Plus_Jakarta_Sans'] font-bold text-sm">
                    <span className="material-symbols-outlined text-blue-600 text-[22px]">assignment_turned_in</span>
                    <span>Kewajiban AI Statement</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Penulis wajib mencantumkan sub-bagian deklarasi:{' '}
                    <code className="font-['JetBrains_Mono'] text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                      "Declaration of Generative AI and AI-assisted technologies in the writing process"
                    </code>{' '}
                    pada bagian akhir naskah sebelum Daftar Pustaka.
                  </p>
                </div>
              </div>
            </article>

            {/* SECTION 3: Citation Style & References */}
            <article
              id="format-sitasi"
              className="scroll-mt-36 p-6 sm:p-8 bg-white rounded-3xl shadow-xs border border-slate-200/90 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-sm text-blue-600">
                    03
                  </span>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-slate-900">
                      Gaya Penulisan &amp; Format Sitasi
                    </h2>
                    <p className="text-xs text-slate-500">
                      Standar Sitasi Berdasarkan Rumpun Disiplin Ilmu
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-blue-600 text-[24px]">library_books</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* IEEE Card */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-['Plus_Jakarta_Sans'] text-sm text-slate-900 font-bold">
                      Format IEEE
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-['JetBrains_Mono'] text-xs font-semibold border border-blue-200">
                      Keteknikan / CS
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Menggunakan penomoran angka berurutan di dalam tanda kurung siku{' '}
                    <code className="font-['JetBrains_Mono'] text-blue-600 font-bold">[1]</code> sesuai urutan kemunculan di teks utama.
                  </p>
                  <div className="p-3 bg-white rounded-xl font-['JetBrains_Mono'] text-[11px] text-slate-600 leading-relaxed border border-slate-200">
                    [1] A. Pratama and S. Wijaya, "Neural graph embeddings in digital indexing,"{' '}
                    <em>IEEE Trans. Knowl. Data Eng.</em>, vol. 34, no. 2, pp. 412–424, 2024, doi: 10.1109/TKDE.2023.1234567.
                  </div>
                </div>

                {/* APA 7th Card */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-['Plus_Jakarta_Sans'] text-sm text-slate-900 font-bold">
                      Format APA 7th Edition
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-['JetBrains_Mono'] text-xs font-semibold border border-blue-200">
                      Sosial / Humaniora
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Menggunakan sistem Nama-Tahun dalam tanda kurung{' '}
                    <code className="font-['JetBrains_Mono'] text-blue-600 font-bold">(Pratama &amp; Wijaya, 2024)</code> dengan daftar pustaka alfabetis.
                  </p>
                  <div className="p-3 bg-white rounded-xl font-['JetBrains_Mono'] text-[11px] text-slate-600 leading-relaxed border border-slate-200">
                    Pratama, A., &amp; Wijaya, S. (2024). Kebijakan tata kelola data sains terbuka.{' '}
                    <em>Jurnal Studi Kebijakan Ilmiah</em>, 12(1), 55–69. https://doi.org/10.5555/jurnexa.2024.12
                  </div>
                </div>
              </div>

              {/* Reference Manager Tools */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">extension</span>
                  </div>
                  <div>
                    <div className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-slate-900">
                      Kewajiban Reference Manager
                    </div>
                    <div className="text-xs text-slate-500">
                      Wajib menggunakan Mendeley, Zotero, atau EndNote dengan tautan DOI aktif pada minimal 85% referensi.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-['JetBrains_Mono'] text-xs font-semibold shadow-xs">
                    Mendeley .csl
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-['JetBrains_Mono'] text-xs font-semibold shadow-xs">
                    Zotero Style
                  </span>
                </div>
              </div>
            </article>

            {/* SECTION 4: Peer-Review Workflow */}
            <article
              id="alur-review"
              className="scroll-mt-36 p-6 sm:p-8 bg-white rounded-3xl shadow-xs border border-slate-200/90 flex flex-col gap-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-sm text-blue-600">
                    04
                  </span>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-slate-900">
                      Siklus &amp; Alur Peer-Review
                    </h2>
                    <p className="text-xs text-slate-500">
                      Prosedur Double-Blind Peer Review (4–6 Minggu)
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-['JetBrains_Mono'] text-xs font-semibold border border-slate-200">
                  Double-Blind Review
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Seluruh jurnal di bawah Konsorsium Jurnexa menerapkan mekanisme telaah sejawat tertutup ganda (identitas mitra bestari dan penulis saling dirahasiakan) untuk memastikan objektivitas evaluasi ilmiah mutlak.
              </p>

              {/* Stepper Process Flow */}
              <div className="relative flex flex-col gap-4 pl-2">
                {/* Step 1 */}
                <div className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      1
                    </div>
                    <div className="w-0.5 bg-slate-200 grow mt-2"></div>
                  </div>
                  <div className="grow pb-6">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-slate-900">
                        Submisi &amp; Skrining Awal (Desk Review)
                      </h3>
                      <span className="font-['JetBrains_Mono'] text-xs text-blue-600 font-semibold">
                        Hari ke 1 - 5
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Pemeriksaan kesesuaian ruang lingkup (focus &amp; scope), kepatuhan template penulisan, dan uji kemiripan awal (Turnitin iThenticate). Naskah yang tidak memenuhi kriteria format akan dikembalikan ke penulis.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      2
                    </div>
                    <div className="w-0.5 bg-slate-200 grow mt-2"></div>
                  </div>
                  <div className="grow pb-6">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-slate-900">
                        Penugasan Reviewer Independen
                      </h3>
                      <span className="font-['JetBrains_Mono'] text-xs text-blue-600 font-semibold">
                        Minggu ke 2 - 4
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Naskah ditelaah secara substantif oleh minimal dua (2) orang mitra bestari independen dengan rekam jejak publikasi relevan, bebas dari afiliasi institusi yang sama dengan penulis.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      3
                    </div>
                    <div className="w-0.5 bg-slate-200 grow mt-2"></div>
                  </div>
                  <div className="grow pb-6">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-slate-900">
                        Keputusan Editorial &amp; Revisi Naskah
                      </h3>
                      <span className="font-['JetBrains_Mono'] text-xs text-blue-600 font-semibold">
                        Minggu ke 4 - 5
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Section Editor mengeluarkan salah satu keputusan: <em>Accept Submission</em>, <em>Revisions Required (Minor/Major)</em>, <em>Resubmit for Review</em>, atau <em>Decline</em>. Penulis diberi waktu 14 hari kerja untuk perbaikan.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      4
                    </div>
                  </div>
                  <div className="grow">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-slate-900">
                        Copyediting, Proofreading &amp; DOI Minting
                      </h3>
                      <span className="font-['JetBrains_Mono'] text-xs text-blue-600 font-semibold">
                        Minggu ke 6
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Finalisasi tata letak (layout galley), proofreading author final, penerbitan Digital Object Identifier (DOI) resmi dari Crossref, dan pengindeksan open access.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* SECTION 5: APC Policy & Waivers */}
            <article
              id="kebijakan-apc"
              className="scroll-mt-36 p-6 sm:p-8 bg-white rounded-3xl shadow-xs border border-slate-200/90 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-sm text-blue-600">
                    05
                  </span>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-slate-900">
                      Kebijakan Biaya Publikasi (APC)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Transparansi Model Open Access &amp; Kebijakan Keringanan (Waiver)
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-blue-600 text-[24px]">price_check</span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Konsorsium Jurnexa mengadopsi model <strong>Platinum &amp; Gold Open Access Bersubsidi</strong>. Biaya publikasi (Article Processing Charge / APC) dibebankan semata-mata untuk operasional server preservasi digital permanen, registrasi DOI Crossref, tata letak profesional, dan pengujian anti-plagiarisme.
              </p>

              {/* APC Pricing Table Bento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase">
                      Biaya Submisi (Submission Fee)
                    </div>
                    <div className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold text-slate-900 mt-2">
                      Rp 0,-
                    </div>
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      Tidak ada pungutan biaya sama sekali pada tahapan pengajuan, desk review, maupun review naskah.
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span> 100% Bebas Biaya Submisi
                  </span>
                </div>

                <div className="p-6 bg-white rounded-2xl shadow-md border-2 border-blue-600 flex flex-col justify-between relative">
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider">
                    Standar
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-blue-600 uppercase">
                      APC Naskah Diterima (Reguler)
                    </div>
                    <div className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold text-slate-900 mt-2">
                      Rp 750.000,-
                    </div>
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      Hanya ditagihkan setelah naskah resmi dinyatakan <strong>ACCEPTED</strong> oleh Dewan Editor Jurnexa.
                    </p>
                  </div>
                  <span className="mt-5 font-['JetBrains_Mono'] text-xs text-slate-500 font-medium">
                    Termasuk Crossref DOI + Galley PDF
                  </span>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase">
                      Skema Keringanan (Waiver)
                    </div>
                    <div className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold text-emerald-700 mt-2">
                      Diskon s.d 100%
                    </div>
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      Tersedia pembebasan biaya bagi mahasiswa strata satu (S1) dan peneliti mandiri tanpa pendanaan hibah institusional.
                    </p>
                  </div>
                  <button
                    onClick={onOpenWaiver}
                    className="mt-5 inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    <span>Ajukan Permohonan Waiver</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </article>

            {/* SECTION 6: Copyright & Retraction Policy */}
            <article
              id="hak-cipta"
              className="scroll-mt-36 p-6 sm:p-8 bg-white rounded-3xl shadow-xs border border-slate-200/90 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-sm text-blue-600">
                    06
                  </span>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-slate-900">
                      Hak Cipta, Lisensi &amp; Kebijakan Retraksi
                    </h2>
                    <p className="text-xs text-slate-500">
                      Creative Commons Attribution 4.0 International (CC-BY 4.0)
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-blue-600 text-[24px]">verified_user</span>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <span className="material-symbols-outlined text-[32px]">balance</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-slate-900">
                    Penulis Mempertahankan Hak Cipta Penuh (Author Copyright Retention)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Penulis mempertahankan hak cipta penuh atas naskah tanpa pembatasan. Penulis memberikan hak publikasi pertama kepada Jurnexa di bawah naungan lisensi internasional <strong>Creative Commons Attribution 4.0 (CC BY 4.0)</strong>, yang memperbolehkan pihak manapun mendistribusikan, memodifikasi, dan menyitasi naskah dengan menyebutkan atribusi penulis asli.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-slate-900 mb-2">
                    Kebijakan Retraksi Naskah
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Jurnexa tunduk sepenuhnya pada pedoman retraksi COPE. Penarikan publikasi (retraction) diberlakukan bila ditemukan fabrikasi data, manipulasi visual, pelanggaran etika kepengarangan yang parah, atau plagiarisme tak termaafkan.
                  </p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-slate-900 mb-2">
                    Pengarsipan Repository Mandiri
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Penulis diizinkan dan didorong mendepositkan versi <em>Pre-print</em> mau pun <em>Post-print (Publisher's PDF)</em> ke dalam repository institusi kampus (Sherpa/Romeo Green Open Access status).
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* Right 4-Column Sticky Auxiliary Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Interactive Pre-Submission Checklist Component */}
            <div
              id="pre-submission"
              className="scroll-mt-36 p-6 sm:p-7 bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-200 flex flex-col gap-5"
            >
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-blue-600 text-[22px]">fact_check</span>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-slate-900">
                    Checklist Sebelum Submit
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full font-['JetBrains_Mono'] text-xs font-semibold ${
                    isAllChecked ? 'bg-emerald-600 text-white' : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {checkedCount}/6 Siap
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Lengkapi verifikasi mandiri naskah Anda agar meminimalkan risiko pengembalian berkas pada tahap skrining awal editor.
              </p>

              {/* Interactive Checkbox List */}
              <div className="flex flex-col gap-2">
                {[
                  {
                    title: 'Format Template Naskah',
                    desc: 'Sudah sesuai file template resmi Word/LaTeX Jurnexa (IMRaD).'
                  },
                  {
                    title: 'Kelengkapan Metadata Penulis',
                    desc: 'Seluruh author mencantumkan nama lengkap, afiliasi, surel & ID ORCID valid.'
                  },
                  {
                    title: 'Resolusi Gambar & Grafik Tinggi',
                    desc: 'Gambar beresolusi minimal 300 DPI dengan teks label terbaca jelas.'
                  },
                  {
                    title: 'Referensi & Tautan DOI Aktif',
                    desc: 'Disusun dengan Mendeley/Zotero, 80%+ terbitan 5 tahun terakhir.'
                  },
                  {
                    title: 'Uji Similarity Pra-Submisi',
                    desc: 'Skor Turnitin/iThenticate di bawah 20% (tidak termasuk daftar pustaka).'
                  },
                  {
                    title: 'Surat Pernyataan Orisinalitas',
                    desc: 'Naskah tidak sedang diajukan (simultaneous submission) ke media lain.'
                  }
                ].map((item, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                      checklist[idx]
                        ? 'bg-blue-50/70 border-blue-200'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checklist[idx]}
                      onChange={() => toggleChecklistItem(idx)}
                      className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      <span className="text-[11px] text-slate-500 leading-snug mt-0.5">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Dynamic Status Box */}
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 transition-all ${
                  isAllChecked
                    ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] shrink-0">
                  {isAllChecked ? 'task_alt' : 'info'}
                </span>
                <span>
                  {isAllChecked
                    ? 'Semua checklist terpenuhi! Naskah Anda siap diajukan ke portal OJS.'
                    : `Centang semua poin di atas untuk memvalidasi kesiapan naskah (${6 - checkedCount} lagi).`}
                </span>
              </div>

              {/* Unlockable Submit Button */}
              <button
                onClick={onOpenSubmission}
                disabled={!isAllChecked}
                className={`w-full py-3.5 rounded-full font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                  isAllChecked
                    ? 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">publish</span>
                <span>Lanjut Submit ke Portal OJS</span>
              </button>
            </div>

            {/* Download Kit Direct Widget */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-blue-600 text-[22px]">
                  download_for_offline
                </span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-slate-900">
                  Paket Berkas Submisi
                </h3>
              </div>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() =>
                    downloadFile('Template_Jurnexa_Word.docx', 'Template Word Resmi Jurnexa')
                  }
                  className="p-3.5 bg-white rounded-2xl hover:shadow-xs transition-all flex items-center justify-between group text-left border border-slate-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">description</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                        Template Jurnexa (Word)
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[10px] text-slate-400">
                        DOCX • 185 KB
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 text-[20px]">
                    download
                  </span>
                </button>

                <button
                  onClick={() =>
                    downloadFile('Template_LaTeX_Standard.zip', 'LaTeX Template Standard')
                  }
                  className="p-3.5 bg-white rounded-2xl hover:shadow-xs transition-all flex items-center justify-between group text-left border border-slate-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">code_blocks</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                        Template LaTeX Standar
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[10px] text-slate-400">
                        ZIP • 420 KB
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 text-[20px]">
                    download
                  </span>
                </button>

                <button
                  onClick={() =>
                    downloadFile('Form_Surat_Orisinalitas.pdf', 'Surat Pernyataan Bebas Plagiasi')
                  }
                  className="p-3.5 bg-white rounded-2xl hover:shadow-xs transition-all flex items-center justify-between group text-left border border-slate-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                        Form Surat Orisinalitas
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[10px] text-slate-400">
                        PDF • 95 KB
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 text-[20px]">
                    download
                  </span>
                </button>
              </div>
            </div>

            {/* Editorial Assistance & Contact Box */}
            <div
              id="editorial-contact"
              className="p-6 sm:p-7 bg-white rounded-3xl shadow-xs border border-slate-200 flex flex-col gap-4"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-blue-600 text-[22px]">support_agent</span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-slate-900">
                  Bantuan &amp; Tim Editorial
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mengalami kesulitan teknis pada portal OJS, kendala akun reviewer, atau pengajuan surat dispensasi waiver APC?
              </p>
              <div className="flex flex-col gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">mail</span>
                  <span className="font-['JetBrains_Mono'] text-slate-900 font-medium">editorial@jurnexa.ac.id</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">chat</span>
                  <span>Layanan Helpdesk OJS (08:30 - 16:30 WIB)</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">location_on</span>
                  <span>Sekretariat Konsorsium Publikasi Jurnexa</span>
                </div>
              </div>
              <button
                onClick={onOpenTicket}
                className="w-full py-3 rounded-full bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">contact_support</span>
                <span>Kirim Tiket Asistensi Penulis</span>
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};
