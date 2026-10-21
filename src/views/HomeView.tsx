import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  Globe,
  FileText,
  Calendar,
  Sparkles,
  Quote,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Article, Journal } from '../types';
import { CATALOG_ARTICLES, CONSORTIUM_JOURNALS } from '../data/mockData';

interface HomeViewProps {
  onSelectArticle: (article: Article) => void;
  onOpenSubmission: () => void;
  onOpenCitation: (article: Article) => void;
  onNavigatePublicationGuide: () => void;
  onNavigateDirectory: () => void;
  onNavigateArticles: () => void;
  onOpenWaiver: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectArticle,
  onOpenSubmission,
  onOpenCitation,
  onNavigatePublicationGuide,
  onNavigateDirectory,
  onNavigateArticles,
  onOpenWaiver
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('Semua');

  const disciplines = [
    'Semua',
    'Keteknikan & Komputer',
    'Biosains & Kedokteran',
    'Hukum & Kebijakan',
    'Telekomunikasi & IoT'
  ];

  const filteredArticles = CATALOG_ARTICLES.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.authors.some((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      art.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDiscipline =
      selectedDiscipline === 'Semua' || art.discipline.includes(selectedDiscipline.split(' ')[0]);

    return matchesSearch && matchesDiscipline;
  });

  return (
    <div className="bg-white min-h-screen text-slate-900">
      {/* Hero Section - Clean Modern Minimalist positioned higher up */}
      <section className="relative overflow-hidden pt-8 sm:pt-12 md:pt-16 pb-28 md:pb-36">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-gradient-to-b from-blue-50/70 via-indigo-50/20 to-transparent pointer-events-none -z-10 rounded-b-[4rem]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6">
              Gerbang Riset Ilmiah Terbuka Nusantara
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Jelajahi lebih dari <strong className="text-slate-900 font-semibold">1.480 naskah ilmiah bermutu</strong> dari <strong className="text-slate-900 font-semibold">24 jurnal bereputasi SINTA</strong>. Bebas diakses, diunduh, dan dikutip untuk kemajuan ilmu pengetahuan bangsa.
            </p>
          </div>
        </div>
      </section>

      {/* Author Fast Actions Bento - Pushed below the fold */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Layanan Terpadu Penulis & Peneliti
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Fasilitas cepat untuk mempersiapkan, menyusun, dan mengajukan naskah ilmiah Anda ke konsorsium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div
            onClick={onNavigatePublicationGuide}
            className="card-ref p-8 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-slate-900 text-lg mb-3 group-hover:text-blue-600 transition-colors">
                Panduan Penulisan & Template Naskah
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Akses panduan struktur IMRaD, kepatuhan sitasi IEEE/APA 7th, dan unduh template resmi format DOCX serta LaTeX.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 group-hover:underline">
                Buka Panduan Penulisan
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={onOpenSubmission}
            className="card-ref p-8 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-slate-900 text-lg mb-3 group-hover:text-emerald-700 transition-colors">
                Kirim Naskah Baru (OJS Wizard)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Ajukan manuskrip baru secara terintegrasi ke salah satu dari 24 jurnal konsorsium dengan verifikasi metadata instan.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 group-hover:underline">
                Mulai Pengajuan Naskah
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={onOpenWaiver}
            className="card-ref p-8 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-slate-900 text-lg mb-3 group-hover:text-amber-700 transition-colors">
                Permohonan Bebas Biaya (APC Waiver)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Fasilitas subsidi 100% dan diskon biaya penerbitan bagi mahasiswa tingkat akhir, peneliti mandiri, dan wilayah 3T.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 group-hover:underline">
                Ajukan Keringanan APC
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Consortium Journals Grid - Sleek Neutral Section */}
      <section className="bg-slate-50/70 border-y border-slate-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-semibold mb-2">
                <span>DIREKTORI PENERBIT</span>
              </div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Jurnal Ilmiah Unggulan Konsorsium
              </h2>
            </div>
            <button
              onClick={onNavigateDirectory}
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 group cursor-pointer"
            >
              <span>Lihat Seluruh 24 Jurnal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONSORTIUM_JOURNALS.slice(0, 6).map((journal: Journal) => (
              <div
                key={journal.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                      {journal.shortName}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      SINTA {journal.sintaGrade}
                    </span>
                  </div>

                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-slate-900 text-base mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {journal.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-6 leading-relaxed">
                    {journal.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
                  <div className="flex justify-between">
                    <span>e-ISSN:</span>
                    <span className="font-mono text-slate-800 font-medium">{journal.eIssn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Terbit Terakhir:</span>
                    <span className="font-medium text-slate-800">{journal.currentIssue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tingkat Penerimaan:</span>
                    <span className="font-bold text-emerald-700">{journal.acceptanceRate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Published Articles List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-600 text-xs font-semibold mb-2">
              <span>REPOSITORI TERBUKA</span>
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Artikel Publikasi Terkini
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Diseminasi riset ilmiah terbaru yang telah melewati proses peer review dan terbit resmi.
            </p>
          </div>

          {/* Discipline Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {disciplines.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDiscipline(d)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedDiscipline === d
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredArticles.slice(0, 4).map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-2.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                    {art.journalShort}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {art.sintaRank}
                  </span>
                  <span className="text-slate-400 font-['JetBrains_Mono']">
                    {art.volume} {art.issue} ({art.year})
                  </span>
                </div>

                <h3
                  onClick={() => onSelectArticle(art)}
                  className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer leading-snug"
                >
                  {art.title}
                </h3>

                <p className="text-xs text-slate-500 font-serif italic line-clamp-1">
                  {art.titleEn}
                </p>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {art.abstractId.background}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                  <span className="font-medium text-slate-700">{art.authors.map((a) => a.name).join(', ')}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Terbit: {art.timeline.publishedOnline}
                  </span>
                  <span>•</span>
                  <span>{art.metrics.views.toLocaleString('id-ID')} dilihat</span>
                </div>
              </div>

              <div className="flex lg:flex-col items-center gap-2.5 shrink-0">
                <button
                  onClick={() => onSelectArticle(art)}
                  className="flex-1 lg:w-40 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>Baca Naskah</span>
                </button>
                <button
                  onClick={() => onOpenCitation(art)}
                  className="flex-1 lg:w-40 inline-flex items-center justify-center gap-2 py-2 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Quote className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sitasi</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={onNavigateArticles}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <span>Buka Katalog Lengkap Naskah Ilmiah</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};
