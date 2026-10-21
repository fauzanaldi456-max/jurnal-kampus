import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Download,
  Quote,
  Award,
  Globe,
  FileText,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Article, Journal } from '../types';
import { PRIMARY_ARTICLE, CATALOG_ARTICLES, CONSORTIUM_JOURNALS } from '../data/mockData';

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
    <div className="bg-[#f8fafc] min-h-screen text-[#1e293b]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white py-16 sm:py-24">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-xs font-semibold text-cyan-300 mb-6 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>KONSORSIUM PENERBITAN ILMIAH TERAKREDITASI NASIONAL</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
              Gerbang Riset Ilmiah Terbuka Nusantara
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              Jelajahi lebih dari <strong>1.480 naskah ilmiah bermutu</strong> dari <strong>24 jurnal bereputasi SINTA</strong>. Bebas diakses, diunduh, dan dikutip untuk kemajuan ilmu pengetahuan bangsa.
            </p>

            {/* Central Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <div className="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden p-1.5 border border-slate-200">
                <div className="pl-3.5 pr-2 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Cari judul artikel, penulis, kata kunci, atau DOI (mis: Deep Learning)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 px-2 text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
                />
                <button
                  onClick={onNavigateArticles}
                  className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0"
                >
                  Cari Naskah
                </button>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-center pt-4 border-t border-slate-800/80 text-xs">
              <div>
                <span className="block text-xl sm:text-2xl font-black text-cyan-400 font-mono">24</span>
                <span className="text-slate-400">Jurnal Mitra</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-black text-emerald-400 font-mono">1.480+</span>
                <span className="text-slate-400">Artikel Terbuka</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-black text-amber-400 font-mono">100%</span>
                <span className="text-slate-400">Open Access</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-black text-indigo-400 font-mono">SINTA 1–4</span>
                <span className="text-slate-400">Terakreditasi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Featured Manuscript Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
                Naskah Unggulan Terbitan Terbaru
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {PRIMARY_ARTICLE.journalShort} • {PRIMARY_ARTICLE.volume} {PRIMARY_ARTICLE.issue} ({PRIMARY_ARTICLE.month})
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              <Award className="w-3.5 h-3.5" />
              {PRIMARY_ARTICLE.sintaRank}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <h2
                onClick={() => onSelectArticle(PRIMARY_ARTICLE)}
                className="text-xl sm:text-2xl font-black text-slate-900 hover:text-primary transition-colors cursor-pointer leading-snug"
              >
                {PRIMARY_ARTICLE.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {PRIMARY_ARTICLE.abstractId.background} {PRIMARY_ARTICLE.abstractId.keyFindings}
              </p>

              {/* Authors & Metrics Row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 pt-2">
                <span className="font-semibold text-slate-800">
                  {PRIMARY_ARTICLE.authors.map((a) => a.name.split(',')[0]).join(', ')}
                </span>
                <span>•</span>
                <span className="font-mono text-primary font-medium">
                  DOI: 10.35824/jtirk.v8i2.142
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <strong>{PRIMARY_ARTICLE.metrics.citations}</strong> Sitasi Crossref
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-center">
              <button
                onClick={() => onSelectArticle(PRIMARY_ARTICLE)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-xs shadow-xs transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Baca Naskah Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenCitation(PRIMARY_ARTICLE)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                <Quote className="w-4 h-4" />
                <span>Sitasi Artikel</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Author Fast Actions Bento */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
            Layanan Terpadu Penulis & Peneliti
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Fasilitas cepat untuk mempersiapkan, menyusun, dan mengajukan naskah ilmiah Anda ke konsorsium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div
            onClick={onNavigatePublicationGuide}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-primary transition-colors">
              Panduan Penulisan & Template Naskah
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Akses panduan struktur IMRaD, kepatuhan sitasi IEEE/APA 7th, dan unduh template resmi format DOCX serta LaTeX.
            </p>
            <span className="text-xs font-semibold text-primary inline-flex items-center gap-1">
              Buka Panduan Penulisan <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 2 */}
          <div
            onClick={onOpenSubmission}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-emerald-700 transition-colors">
              Kirim Naskah Baru (OJS Wizard)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Ajukan manuskrip baru secara terintegrasi ke salah satu dari 24 jurnal konsorsium dengan verifikasi metadata instan.
            </p>
            <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">
              Mulai Pengajuan Naskah <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 3 */}
          <div
            onClick={onOpenWaiver}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-amber-700 transition-colors">
              Permohonan Bebas Biaya (APC Waiver)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Fasilitas subsidi 100% dan diskon biaya penerbitan bagi mahasiswa tingkat akhir, peneliti mandiri, dan wilayah 3T.
            </p>
            <span className="text-xs font-semibold text-amber-700 inline-flex items-center gap-1">
              Ajukan Keringanan APC <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* Featured Consortium Journals Grid */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-primary uppercase font-mono tracking-wider block mb-1">
                DIREKTORI PENERBIT
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Jurnal Ilmiah Unggulan Konsorsium
              </h2>
            </div>
            <button
              onClick={onNavigateDirectory}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <span>Lihat Seluruh 24 Jurnal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONSORTIUM_JOURNALS.slice(0, 6).map((journal: Journal) => (
              <div
                key={journal.id}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-white text-primary border border-slate-200 font-mono">
                      {journal.shortName}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                      SINTA {journal.sintaGrade}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {journal.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {journal.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>e-ISSN:</span>
                    <span className="font-mono text-slate-800">{journal.eIssn}</span>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
              Artikel Publikasi Terkini
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Diseminasi riset ilmiah terbaru yang telah melewati proses peer review dan terbit resmi.
            </p>
          </div>

          {/* Discipline Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            {disciplines.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDiscipline(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedDiscipline === d
                    ? 'bg-primary text-white shadow-xs'
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
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded font-bold bg-blue-50 text-primary border border-blue-200 font-mono">
                    {art.journalShort}
                  </span>
                  <span className="px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {art.sintaRank}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {art.volume} {art.issue} ({art.year})
                  </span>
                </div>

                <h3
                  onClick={() => onSelectArticle(art)}
                  className="text-base sm:text-lg font-bold text-slate-900 hover:text-primary transition-colors cursor-pointer leading-snug"
                >
                  {art.title}
                </h3>

                <p className="text-xs text-slate-500 font-serif italic line-clamp-1">
                  {art.titleEn}
                </p>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {art.abstractId.background}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-1">
                  <span>{art.authors.map((a) => a.name).join(', ')}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Terbit: {art.timeline.publishedOnline}
                  </span>
                  <span>•</span>
                  <span>{art.metrics.views.toLocaleString('id-ID')} dilihat</span>
                </div>
              </div>

              <div className="flex lg:flex-col items-center gap-2 shrink-0">
                <button
                  onClick={() => onSelectArticle(art)}
                  className="flex-1 lg:w-36 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Baca Naskah</span>
                </button>
                <button
                  onClick={() => onOpenCitation(art)}
                  className="flex-1 lg:w-36 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Quote className="w-3.5 h-3.5" />
                  <span>Sitasi</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={onNavigateArticles}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 shadow-xs transition-all"
          >
            <span>Buka Katalog Lengkap Naskah Ilmiah</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
