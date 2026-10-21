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
    <div className="flex flex-col w-full">
      {/* Top Breadcrumb & Quick Anchor Bar */}
      <section className="w-full bg-[#eff4ff] px-4 md:px-8 py-2 shadow-sm border-b border-[#d3e4fe]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#45464d]">
            <button
              onClick={() => onNavigate('beranda')}
              className="hover:text-black transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Beranda</span>
            </button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#0b1c30] font-semibold">Panduan Publikasi</span>
          </nav>
          <div className="flex items-center gap-4 font-['JetBrains_Mono'] text-xs text-[#45464d]">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#0c9488]"></span>
              <span>COPE Standards Compliant (Ed. 2025/v2.4)</span>
            </span>
            <span className="hidden md:inline-block text-[#76777d]">|</span>
            <span className="hidden md:inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#4059aa]">update</span>
              <span>Pembaruan: 12 Januari 2025</span>
            </span>
          </div>
        </div>
      </section>

      {/* Hero Header Section */}
      <section className="w-full px-4 md:px-8 pt-10 pb-6 bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded bg-[#dce1ff] text-[#00164e] text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Standar Editorial Terpadu Konsorsium Jurnexa</span>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl text-[#0b1c30] font-bold tracking-tight leading-tight">
              Panduan Komprehensif Publikasi Ilmiah &amp; Integritas Penulisan
            </h1>
            <p className="text-base text-[#45464d] max-w-3xl leading-relaxed">
              Standar pedoman penyiapan naskah, alur peer-review tertutup ganda (double-blind), kepatuhan etika Committee on Publication Ethics (COPE), dan transparansi pembiayaan bagi seluruh civitas akademika konsorsium Jurnexa.
            </p>

            {/* Fast Download Action Pillows */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() =>
                  downloadFile(
                    'JURNEXA_Template_MSWord_2025.docx',
                    'Template Resmi Jurnexa Format MS Word (IMRaD Standard Document Demo)'
                  )
                }
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-lg bg-black text-white text-xs font-medium hover:bg-[#131b2e] transition-all shadow-sm group"
              >
                <span className="material-symbols-outlined text-[20px] text-[#89f5e7] group-hover:translate-y-0.5 transition-transform">
                  article
                </span>
                <div className="flex flex-col text-left">
                  <span className="font-semibold leading-tight text-sm">Unduh Template MS Word</span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#bec6e0] leading-tight">
                    Format .docx (A4, 2-Kolom)
                  </span>
                </div>
                <span className="material-symbols-outlined text-[18px] ml-1">download</span>
              </button>

              <button
                onClick={() =>
                  downloadFile(
                    'JURNEXA_LaTeX_Overleaf_Template_2025.zip',
                    '% Jurnexa LaTeX Document Class Simulation Package'
                  )
                }
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-lg bg-[#e5eeff] text-[#1d3989] text-xs font-medium hover:bg-[#d3e4fe] transition-all shadow-sm group border border-[#c6c6cd]/50"
              >
                <span className="material-symbols-outlined text-[20px] text-[#4059aa] group-hover:rotate-12 transition-transform">
                  terminal
                </span>
                <div className="flex flex-col text-left">
                  <span className="font-semibold leading-tight text-sm">Unduh Template LaTeX</span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#45464d] leading-tight">
                    Package .zip &amp; Overleaf Ready
                  </span>
                </div>
                <span className="material-symbols-outlined text-[18px] ml-1">folder_zip</span>
              </button>

              <button
                onClick={() => scrollToSection('pre-submission')}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] transition-colors text-xs font-semibold border border-[#d3e4fe]"
              >
                <span className="material-symbols-outlined text-[18px]">checklist</span>
                <span>Checklist Mandiri</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bento Widget */}
          <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-md flex flex-col gap-4 relative overflow-hidden border border-[#e5eeff]">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#8fa7fe]/20 pointer-events-none"></div>
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-semibold text-[#45464d] uppercase tracking-wider">
                Statistik Editorial Rata-Rata
              </span>
              <span className="material-symbols-outlined text-[#4059aa] text-[20px]">speed</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#e5eeff]">
                <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-black">
                  2.4<span className="text-xs font-normal text-[#45464d] ml-1">Minggu</span>
                </div>
                <div className="text-[11px] text-[#45464d] mt-0.5">First Editorial Decision</div>
              </div>
              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#e5eeff]">
                <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#4059aa]">
                  38<span className="text-xs font-normal text-[#45464d] ml-1">Hari</span>
                </div>
                <div className="text-[11px] text-[#45464d] mt-0.5">Siklus Review Penuh</div>
              </div>
              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#e5eeff]">
                <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#0c9488]">
                  21.4%
                </div>
                <div className="text-[11px] text-[#45464d] mt-0.5">Acceptance Rate (Selektif)</div>
              </div>
              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#e5eeff]">
                <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-black">
                  100%
                </div>
                <div className="text-[11px] text-[#45464d] mt-0.5">Open Access DOI Crossref</div>
              </div>
            </div>
            <div className="p-3 bg-[#e5eeff] rounded-lg flex items-center gap-3 text-[#1d3989] text-xs">
              <span className="material-symbols-outlined text-[20px] shrink-0">info</span>
              <p className="leading-snug">
                Seluruh publikasi terindeks permanen pada repository nasional dan platform mitra internasional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Guideline Navigation Bar */}
      <section className="sticky top-20 z-40 w-full bg-white/95 backdrop-blur shadow-sm border-y border-[#e5eeff]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 overflow-x-auto scrollbar-none py-2.5">
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
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === nav.id
                    ? 'bg-black text-white shadow-sm'
                    : 'text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
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
      <section className="w-full px-4 md:px-8 py-10 bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Primary 8-Column Guideline Stream */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* SECTION 1: IMRaD Requirements */}
            <article
              id="imrad"
              className="scroll-mt-36 p-6 md:p-8 bg-white rounded-xl shadow-sm border border-[#e5eeff] flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-[#e5eeff] flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-base text-[#4059aa]">
                    01
                  </span>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#0b1c30]">
                      Persyaratan &amp; Sistematika Naskah
                    </h2>
                    <p className="text-xs text-[#45464d]">
                      Struktur IMRaD Baku (Introduction, Methods, Results, and Discussion)
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex px-3 py-1 bg-[#eff4ff] text-[#0b1c30] rounded font-['JetBrains_Mono'] text-xs font-medium border border-[#d3e4fe]">
                  Panjang: 4.500 - 8.000 Kata
                </span>
              </div>

              <p className="text-sm text-[#45464d] leading-relaxed">
                Setiap naskah yang diajukan ke portal Jurnexa wajib mematuhi standar penulisan empiris ilmiah. Penulisan dapat menggunakan Bahasa Indonesia baku sesuai EYD V atau Bahasa Inggris akademis (UK/US standard yang konsisten).
              </p>

              {/* IMRaD Accordion / Visual Breakdown */}
              <div className="grid grid-cols-1 gap-3">
                {/* Title, Abstract, Keywords */}
                <div className="p-4 bg-[#eff4ff] rounded-lg border border-[#d3e4fe]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4059aa] text-[20px]">title</span>
                      Judul, Penulis &amp; Abstrak
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#45464d]">
                      Maks 15 Kata (Judul)
                    </span>
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Judul naskah wajib ringkas, informatif, dan tidak memuat singkatan non-standar. Abstrak terstruktur 200–250 kata merangkum latar belakang, tujuan spesifik, metodologi utama, temuan kunci, serta implikasi kebaruan riset. Sertakan 4–6 kata kunci spesifik yang dapat diindeks oleh mesin pengindeks global.
                  </p>
                </div>

                {/* Introduction */}
                <div className="p-4 bg-white rounded-lg shadow-sm border border-[#e5eeff]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4059aa] text-[20px]">explore</span>
                      Introduction (Pendahuluan)
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#45464d] bg-[#eff4ff] px-2 py-0.5 rounded">
                      Bobot ~20%
                    </span>
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Menguraikan latar belakang konseptual, tinjauan literatur primer (minimal 80% berasal dari jurnal bereputasi 5 tahun terakhir), celah penelitian (research gap), justifikasi kebaruan (novelty), dan tujuan investigasi yang jelas di paragraf penutup.
                  </p>
                </div>

                {/* Methods */}
                <div className="p-4 bg-white rounded-lg shadow-sm border border-[#e5eeff]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4059aa] text-[20px]">biotech</span>
                      Methods (Metode Riset)
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#45464d] bg-[#eff4ff] px-2 py-0.5 rounded">
                      Reproducible
                    </span>
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Detail perancangan eksperimen, teknik pengambilan sampel, instrumen validasi, protokol uji etika (jika melibatkan subjek hayati), dan metodologi analitis statistik secara transparan agar hasil penelitian dapat direplikasi secara independen.
                  </p>
                </div>

                {/* Results & Discussion */}
                <div className="p-4 bg-white rounded-lg shadow-sm border border-[#e5eeff]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4059aa] text-[20px]">query_stats</span>
                      Results and Discussion (Hasil &amp; Pembahasan)
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#45464d] bg-[#eff4ff] px-2 py-0.5 rounded">
                      Bobot ~50%
                    </span>
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Penyajian data temuan melalui visualisasi grafis bermutu tinggi, disusul dengan sintesis komparatif terhadap hipotesis serta literatur terdahulu. Pembahasan wajib menjawab pertanyaan penelitian dan tidak mengulang isi tabel secara tekstual semata.
                  </p>
                </div>

                {/* Conclusion */}
                <div className="p-4 bg-[#eff4ff] rounded-lg border border-[#d3e4fe]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4059aa] text-[20px]">task_alt</span>
                      Conclusion &amp; Future Works
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#45464d]">
                      1 Paragraf Terpadu
                    </span>
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Ringkasan kesimpulan yang menjawab rumusan masalah secara langsung, diiringi keterbatasan studi (limitations) serta rekomendasi arah penelitian masa depan tanpa menggunakan poin enumerasi numerik.
                  </p>
                </div>
              </div>
            </article>

            {/* SECTION 2: Anti-Plagiarism & AI Usage */}
            <article
              id="anti-plagiarisme"
              className="scroll-mt-36 p-6 md:p-8 bg-white rounded-xl shadow-sm border border-[#e5eeff] flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-[#e5eeff] flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-base text-[#4059aa]">
                    02
                  </span>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#0b1c30]">
                      Kebijakan Anti-Plagiarisme &amp; AI Usage
                    </h2>
                    <p className="text-xs text-[#45464d]">
                      Integritas Orisinalitas &amp; Penggunaan Kecerdasan Buatan
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#e5eeff] text-[#1d3989] rounded text-xs font-semibold">
                  Toleransi Maks. 20%
                </span>
              </div>

              {/* Plagiarism Meter Bar */}
              <div className="p-4 bg-[#eff4ff] rounded-lg border border-[#d3e4fe] flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#0b1c30] font-semibold">
                    Batas Ambang Kemiripan Similarity (Turnitin / iThenticate)
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#45464d]">
                    Maksimal 20% Keseluruhan (Maks. 3% per sumber tunggal)
                  </span>
                </div>
                <div className="w-full bg-[#e5eeff] h-3.5 rounded-full overflow-hidden flex border border-[#c6c6cd]/40">
                  <div className="bg-[#0c9488] h-full w-[20%]" title="Zona Diterima (≤ 20%)"></div>
                  <div className="bg-[#8fa7fe] h-full w-[15%]" title="Zona Revisi Menyeluruh (21-35%)"></div>
                  <div className="bg-[#ffdad6] h-full w-[65%]" title="Zona Ditolak Otomatis (> 35%)"></div>
                </div>
                <div className="flex justify-between font-['JetBrains_Mono'] text-[11px] pt-1">
                  <span className="text-[#0c9488] font-bold">0% - 20% (Lolos Skrining)</span>
                  <span className="text-[#4059aa] font-bold">21% - 35% (Revisi Parafrasa)</span>
                  <span className="text-[#ba1a1a] font-bold">&gt; 35% (Desk Reject)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#f8f9ff] rounded-lg border border-[#e5eeff] flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#0b1c30] font-['Plus_Jakarta_Sans'] font-bold text-sm">
                    <span className="material-symbols-outlined text-[#4059aa] text-[22px]">auto_fix_high</span>
                    <span>Etika Pemanfaatan AI Generatif</span>
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Peralatan AI (seperti ChatGPT, Claude, atau Gemini){' '}
                    <strong>tidak dapat dicantumkan sebagai penulis (author/co-author)</strong> karena tidak memiliki akuntabilitas legal. AI hanya diizinkan untuk koreksi gramatika dan pemolesan gaya bahasa.
                  </p>
                </div>
                <div className="p-4 bg-[#f8f9ff] rounded-lg border border-[#e5eeff] flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#0b1c30] font-['Plus_Jakarta_Sans'] font-bold text-sm">
                    <span className="material-symbols-outlined text-[#4059aa] text-[22px]">assignment_turned_in</span>
                    <span>Kewajiban AI Statement</span>
                  </div>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Penulis wajib mencantumkan sub-bagian deklarasi:{' '}
                    <code className="font-['JetBrains_Mono'] text-[11px] bg-[#e5eeff] text-[#1d3989] px-1.5 py-0.5 rounded">
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
              className="scroll-mt-36 p-6 md:p-8 bg-white rounded-xl shadow-sm border border-[#e5eeff] flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-[#e5eeff] flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-base text-[#4059aa]">
                    03
                  </span>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#0b1c30]">
                      Gaya Penulisan &amp; Format Sitasi
                    </h2>
                    <p className="text-xs text-[#45464d]">
                      Standar Sitasi Berdasarkan Rumpun Disiplin Ilmu
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#4059aa] text-[24px]">library_books</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* IEEE Card */}
                <div className="p-4 bg-[#eff4ff] rounded-lg border border-[#d3e4fe] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-['Plus_Jakarta_Sans'] text-sm text-[#0b1c30] font-bold">
                      Format IEEE
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#e5eeff] text-[#1d3989] font-['JetBrains_Mono'] text-xs font-semibold">
                      Keteknikan / CS
                    </span>
                  </div>
                  <p className="text-xs text-[#45464d]">
                    Menggunakan penomoran angka berurutan di dalam tanda kurung siku{' '}
                    <code className="font-['JetBrains_Mono'] text-[#4059aa] font-bold">[1]</code> sesuai urutan kemunculan di teks utama.
                  </p>
                  <div className="p-3 bg-white rounded font-['JetBrains_Mono'] text-[11px] text-[#45464d] leading-relaxed border border-[#e5eeff]">
                    [1] A. Pratama and S. Wijaya, "Neural graph embeddings in digital indexing,"{' '}
                    <em>IEEE Trans. Knowl. Data Eng.</em>, vol. 34, no. 2, pp. 412–424, 2024, doi: 10.1109/TKDE.2023.1234567.
                  </div>
                </div>

                {/* APA 7th Card */}
                <div className="p-4 bg-[#eff4ff] rounded-lg border border-[#d3e4fe] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-['Plus_Jakarta_Sans'] text-sm text-[#0b1c30] font-bold">
                      Format APA 7th Edition
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#e5eeff] text-[#1d3989] font-['JetBrains_Mono'] text-xs font-semibold">
                      Sosial / Humaniora
                    </span>
                  </div>
                  <p className="text-xs text-[#45464d]">
                    Menggunakan sistem Nama-Tahun dalam tanda kurung{' '}
                    <code className="font-['JetBrains_Mono'] text-[#4059aa] font-bold">(Pratama &amp; Wijaya, 2024)</code> dengan daftar pustaka alfabetis.
                  </p>
                  <div className="p-3 bg-white rounded font-['JetBrains_Mono'] text-[11px] text-[#45464d] leading-relaxed border border-[#e5eeff]">
                    Pratama, A., &amp; Wijaya, S. (2024). Kebijakan tata kelola data sains terbuka.{' '}
                    <em>Jurnal Studi Kebijakan Ilmiah</em>, 12(1), 55–69. https://doi.org/10.5555/jurnexa.2024.12
                  </div>
                </div>
              </div>

              {/* Reference Manager Tools */}
              <div className="p-4 bg-[#f8f9ff] rounded-lg border border-[#e5eeff] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[28px] text-[#4059aa]">extension</span>
                  <div>
                    <div className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30]">
                      Kewajiban Reference Manager
                    </div>
                    <div className="text-xs text-[#45464d]">
                      Wajib menggunakan Mendeley, Zotero, atau EndNote dengan tautan DOI aktif pada minimal 85% referensi.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded bg-[#e5eeff] text-[#1d3989] font-['JetBrains_Mono'] text-xs font-semibold">
                    Mendeley .csl
                  </span>
                  <span className="px-3 py-1 rounded bg-[#e5eeff] text-[#1d3989] font-['JetBrains_Mono'] text-xs font-semibold">
                    Zotero Style
                  </span>
                </div>
              </div>
            </article>

            {/* SECTION 4: Peer-Review Workflow */}
            <article
              id="alur-review"
              className="scroll-mt-36 p-6 md:p-8 bg-white rounded-xl shadow-sm border border-[#e5eeff] flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-[#e5eeff] flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-base text-[#4059aa]">
                    04
                  </span>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#0b1c30]">
                      Siklus &amp; Alur Peer-Review
                    </h2>
                    <p className="text-xs text-[#45464d]">
                      Prosedur Double-Blind Peer Review (4–6 Minggu)
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#eff4ff] text-[#45464d] rounded font-['JetBrains_Mono'] text-xs font-semibold border border-[#d3e4fe]">
                  Double-Blind Review
                </span>
              </div>

              <p className="text-sm text-[#45464d] leading-relaxed">
                Seluruh jurnal di bawah Konsorsium Jurnexa menerapkan mekanisme telaah sejawat tertutup ganda (identitas mitra bestari dan penulis saling dirahasiakan) untuk memastikan objektivitas evaluasi ilmiah mutlak.
              </p>

              {/* Stepper Process Flow */}
              <div className="relative flex flex-col gap-4 pl-2">
                {/* Step 1 */}
                <div className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div className="w-0.5 bg-[#e5eeff] grow mt-2"></div>
                  </div>
                  <div className="grow pb-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30]">
                        Submisi &amp; Skrining Awal (Desk Review)
                      </h3>
                      <span className="font-['JetBrains_Mono'] text-xs text-[#4059aa] font-semibold">
                        Hari ke 1 - 5
                      </span>
                    </div>
                    <p className="text-xs text-[#45464d] mt-1 leading-relaxed">
                      Pemeriksaan kesesuaian ruang lingkup (focus &amp; scope), kepatuhan template penulisan, dan uji kemiripan awal (Turnitin iThenticate). Naskah yang tidak memenuhi kriteria format akan dikembalikan ke penulis.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#4059aa] text-white flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div className="w-0.5 bg-[#e5eeff] grow mt-2"></div>
                  </div>
                  <div className="grow pb-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30]">
                        Penugasan Reviewer Independen
                      </h3>
                      <span className="font-['JetBrains_Mono'] text-xs text-[#4059aa] font-semibold">
                        Minggu ke 2 - 4
                      </span>
                    </div>
                    <p className="text-xs text-[#45464d] mt-1 leading-relaxed">
                      Naskah ditelaah secara substantif oleh minimal dua (2) orang mitra bestari independen dengan rekam jejak publikasi relevan, bebas dari afiliasi institusi yang sama dengan penulis.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#8fa7fe] text-[#1d3989] flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <div className="w-0.5 bg-[#e5eeff] grow mt-2"></div>
                  </div>
                  <div className="grow pb-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30]">
                        Keputusan Editorial &amp; Revisi Naskah
                      </h3>
                      <span className="font-['JetBrains_Mono'] text-xs text-[#4059aa] font-semibold">
                        Minggu ke 4 - 5
                      </span>
                    </div>
                    <p className="text-xs text-[#45464d] mt-1 leading-relaxed">
                      Section Editor mengeluarkan salah satu keputusan: <em>Accept Submission</em>, <em>Revisions Required (Minor/Major)</em>, <em>Resubmit for Review</em>, atau <em>Decline</em>. Penulis diberi waktu 14 hari kerja untuk perbaikan.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#131b2e] text-white flex items-center justify-center font-bold text-xs">
                      4
                    </div>
                  </div>
                  <div className="grow">
                    <div className="flex items-center justify-between">
                      <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30]">
                        Copyediting, Proofreading &amp; DOI Minting
                      </h3>
                      <span className="font-['JetBrains_Mono'] text-xs text-[#4059aa] font-semibold">
                        Minggu ke 6
                      </span>
                    </div>
                    <p className="text-xs text-[#45464d] mt-1 leading-relaxed">
                      Finalisasi tata letak (layout galley), proofreading author final, penerbitan Digital Object Identifier (DOI) resmi dari Crossref, dan pengindeksan open access.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* SECTION 5: APC Policy & Waivers */}
            <article
              id="kebijakan-apc"
              className="scroll-mt-36 p-6 md:p-8 bg-white rounded-xl shadow-sm border border-[#e5eeff] flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-[#e5eeff] flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-base text-[#4059aa]">
                    05
                  </span>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#0b1c30]">
                      Kebijakan Biaya Publikasi (APC)
                    </h2>
                    <p className="text-xs text-[#45464d]">
                      Transparansi Model Open Access &amp; Kebijakan Keringanan (Waiver)
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#4059aa] text-[24px]">price_check</span>
              </div>

              <p className="text-sm text-[#45464d] leading-relaxed">
                Konsorsium Jurnexa mengadopsi model <strong>Platinum &amp; Gold Open Access Bersubsidi</strong>. Biaya publikasi (Article Processing Charge / APC) dibebankan semata-mata untuk operasional server preservasi digital permanen, registrasi DOI Crossref, tata letak profesional, dan pengujian anti-plagiarisme.
              </p>

              {/* APC Pricing Table Bento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#eff4ff] rounded-lg border border-[#d3e4fe] flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-[#45464d] uppercase">
                      Biaya Submisi (Submission Fee)
                    </div>
                    <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-black mt-1">
                      Rp 0,-
                    </div>
                    <p className="text-xs text-[#45464d] mt-2 leading-relaxed">
                      Tidak ada pungutan biaya sama sekali pada tahapan pengajuan, desk review, maupun review naskah.
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs text-[#0c9488] font-bold">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span> 100% Bebas Biaya Submisi
                  </span>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm border border-[#4059aa]/40 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-[#4059aa] uppercase">
                      APC Naskah Diterima (Reguler)
                    </div>
                    <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#4059aa] mt-1">
                      Rp 750.000,-
                    </div>
                    <p className="text-xs text-[#45464d] mt-2 leading-relaxed">
                      Hanya ditagihkan setelah naskah resmi dinyatakan <strong>ACCEPTED</strong> oleh Dewan Editor Jurnexa.
                    </p>
                  </div>
                  <span className="mt-4 font-['JetBrains_Mono'] text-xs text-[#45464d]">
                    Termasuk Crossref DOI + Galley PDF
                  </span>
                </div>

                <div className="p-4 bg-[#eff4ff] rounded-lg border border-[#d3e4fe] flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-[#45464d] uppercase">
                      Skema Keringanan (Waiver)
                    </div>
                    <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#0c9488] mt-1">
                      Diskon s.d 100%
                    </div>
                    <p className="text-xs text-[#45464d] mt-2 leading-relaxed">
                      Tersedia pembebasan biaya bagi mahasiswa strata satu (S1) dan peneliti mandiri tanpa pendanaan hibah institusional.
                    </p>
                  </div>
                  <button
                    onClick={onOpenWaiver}
                    className="mt-4 inline-flex items-center gap-1 text-xs text-[#4059aa] font-bold hover:underline"
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
              className="scroll-mt-36 p-6 md:p-8 bg-white rounded-xl shadow-sm border border-[#e5eeff] flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-[#e5eeff] flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-base text-[#4059aa]">
                    06
                  </span>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#0b1c30]">
                      Hak Cipta, Lisensi &amp; Kebijakan Retraksi
                    </h2>
                    <p className="text-xs text-[#45464d]">
                      Creative Commons Attribution 4.0 International (CC-BY 4.0)
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#4059aa] text-[24px]">verified_user</span>
              </div>

              <div className="p-4 bg-[#eff4ff] rounded-lg border border-[#d3e4fe] flex items-start gap-4">
                <div className="p-2.5 rounded bg-[#e5eeff] text-[#1d3989] shrink-0">
                  <span className="material-symbols-outlined text-[32px]">balance</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30]">
                    Penulis Mempertahankan Hak Cipta Penuh (Author Copyright Retention)
                  </h3>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Penulis mempertahankan hak cipta penuh atas naskah tanpa pembatasan. Penulis memberikan hak publikasi pertama kepada Jurnexa di bawah naungan lisensi internasional <strong>Creative Commons Attribution 4.0 (CC BY 4.0)</strong>, yang memperbolehkan pihak manapun mendistribusikan, memodifikasi, dan menyitasi naskah dengan menyebutkan atribusi penulis asli.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#f8f9ff] rounded-lg border border-[#e5eeff]">
                  <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30] mb-1">
                    Kebijakan Retraksi Naskah
                  </h4>
                  <p className="text-xs text-[#45464d] leading-relaxed">
                    Jurnexa tunduk sepenuhnya pada pedoman retraksi COPE. Penarikan publikasi (retraction) diberlakukan bila ditemukan fabrikasi data, manipulasi visual, pelanggaran etika kepengarangan yang parah, atau plagiarisme tak termaafkan.
                  </p>
                </div>
                <div className="p-4 bg-[#f8f9ff] rounded-lg border border-[#e5eeff]">
                  <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30] mb-1">
                    Pengarsipan Repository Mandiri
                  </h4>
                  <p className="text-xs text-[#45464d] leading-relaxed">
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
              className="scroll-mt-36 p-6 bg-white rounded-xl shadow-md border border-[#e5eeff] flex flex-col gap-4"
            >
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4059aa] text-[22px]">fact_check</span>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                    Checklist Sebelum Submit
                  </h3>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-['JetBrains_Mono'] text-xs font-semibold ${
                    isAllChecked ? 'bg-[#0c9488] text-white' : 'bg-[#e5eeff] text-[#1d3989]'
                  }`}
                >
                  {checkedCount}/6 Siap
                </span>
              </div>
              <p className="text-xs text-[#45464d] leading-relaxed">
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
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-colors cursor-pointer select-none ${
                      checklist[idx]
                        ? 'bg-[#eff4ff] border-[#4059aa]/40'
                        : 'bg-[#f8f9ff] border-[#e5eeff] hover:bg-[#eff4ff]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checklist[idx]}
                      onChange={() => toggleChecklistItem(idx)}
                      className="mt-1 w-4 h-4 rounded text-[#4059aa] cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#0b1c30]">{item.title}</span>
                      <span className="text-[11px] text-[#45464d] leading-snug">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Dynamic Status Box */}
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 transition-all ${
                  isAllChecked
                    ? 'bg-[#dce1ff] text-[#00164e] font-semibold border border-[#8fa7fe]'
                    : 'bg-[#e5eeff] text-[#1d3989]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
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
                className={`w-full py-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                  isAllChecked
                    ? 'bg-black text-white hover:bg-[#131b2e] cursor-pointer'
                    : 'bg-black/40 text-white/70 cursor-not-allowed opacity-60'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">publish</span>
                <span>Lanjut Submit ke Portal OJS</span>
              </button>
            </div>

            {/* Download Kit Direct Widget */}
            <div className="p-6 bg-[#eff4ff] rounded-xl shadow-sm border border-[#d3e4fe] flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4059aa] text-[22px]">
                  download_for_offline
                </span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                  Paket Berkas Submisi
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() =>
                    downloadFile('Template_Jurnexa_Word.docx', 'Template Word Resmi Jurnexa')
                  }
                  className="p-3 bg-white rounded-lg hover:shadow-sm transition-all flex items-center justify-between group text-left border border-[#e5eeff]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#4059aa]">description</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#0b1c30] group-hover:text-[#4059aa]">
                        Template Jurnexa (Word)
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[11px] text-[#45464d]">
                        DOCX • 185 KB
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#45464d] group-hover:text-[#4059aa]">
                    download
                  </span>
                </button>

                <button
                  onClick={() =>
                    downloadFile('Template_LaTeX_Standard.zip', 'LaTeX Template Standard')
                  }
                  className="p-3 bg-white rounded-lg hover:shadow-sm transition-all flex items-center justify-between group text-left border border-[#e5eeff]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#4059aa]">code_blocks</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#0b1c30] group-hover:text-[#4059aa]">
                        Template LaTeX Standar
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[11px] text-[#45464d]">
                        ZIP • 420 KB
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#45464d] group-hover:text-[#4059aa]">
                    download
                  </span>
                </button>

                <button
                  onClick={() =>
                    downloadFile('Form_Surat_Orisinalitas.pdf', 'Surat Pernyataan Bebas Plagiasi')
                  }
                  className="p-3 bg-white rounded-lg hover:shadow-sm transition-all flex items-center justify-between group text-left border border-[#e5eeff]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#4059aa]">verified_user</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#0b1c30] group-hover:text-[#4059aa]">
                        Form Surat Orisinalitas
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[11px] text-[#45464d]">
                        PDF • 95 KB
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#45464d] group-hover:text-[#4059aa]">
                    download
                  </span>
                </button>
              </div>
            </div>

            {/* Editorial Assistance & Contact Box */}
            <div
              id="editorial-contact"
              className="p-6 bg-white rounded-xl shadow-sm border border-[#e5eeff] flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4059aa] text-[22px]">support_agent</span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                  Bantuan &amp; Tim Editorial
                </h3>
              </div>
              <p className="text-xs text-[#45464d] leading-relaxed">
                Mengalami kesulitan teknis pada portal OJS, kendala akun reviewer, atau pengajuan surat dispensasi waiver APC?
              </p>
              <div className="flex flex-col gap-2 text-xs text-[#45464d]">
                <div className="flex items-center gap-2 p-2 rounded bg-[#eff4ff]">
                  <span className="material-symbols-outlined text-[#4059aa] text-[18px]">mail</span>
                  <span className="font-['JetBrains_Mono'] text-[#0b1c30]">editorial@jurnexa.ac.id</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-[#eff4ff]">
                  <span className="material-symbols-outlined text-[#4059aa] text-[18px]">chat</span>
                  <span>Layanan Helpdesk OJS (08:30 - 16:30 WIB)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-[#eff4ff]">
                  <span className="material-symbols-outlined text-[#4059aa] text-[18px]">location_on</span>
                  <span>Sekretariat Konsorsium Publikasi Jurnexa</span>
                </div>
              </div>
              <button
                onClick={onOpenTicket}
                className="w-full py-2.5 rounded-lg bg-[#e5eeff] text-[#1d3989] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#d3e4fe] transition-colors border border-[#8fa7fe]/40"
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
