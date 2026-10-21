import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Quote,
  Download,
  Calendar,
  Eye,
  TrendingUp,
  Award,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { Article } from '../types';
import { CATALOG_ARTICLES } from '../data/mockData';

interface ArticleCatalogViewProps {
  onSelectArticle: (article: Article) => void;
  onOpenCitation: (article: Article) => void;
}

export const ArticleCatalogView: React.FC<ArticleCatalogViewProps> = ({
  onSelectArticle,
  onOpenCitation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('Semua');
  const [sortBy, setSortBy] = useState<'latest' | 'citations' | 'views'>('latest');

  const disciplines = [
    'Semua',
    'Keteknikan & Komputer',
    'Biosains & Kedokteran',
    'Hukum & Kebijakan',
    'Telekomunikasi & IoT'
  ];

  let filtered = CATALOG_ARTICLES.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.authors.some((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      art.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
      art.journalShort.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDiscipline =
      selectedDiscipline === 'Semua' ||
      art.discipline.toLowerCase().includes(selectedDiscipline.toLowerCase().split(' ')[0]);

    return matchesSearch && matchesDiscipline;
  });

  filtered = filtered.sort((a, b) => {
    if (sortBy === 'citations') {
      return b.metrics.citations - a.metrics.citations;
    }
    if (sortBy === 'views') {
      return b.metrics.views - a.metrics.views;
    }
    return b.year - a.year;
  });

  return (
    <div className="bg-[#f8fafc] min-h-screen text-[#1e293b]">
      {/* Header */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-primary font-mono uppercase tracking-wider block mb-2">
              REPOSITORI DIGITAL KONSORSIUM
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Katalog Naskah Ilmiah & Terbitan Terbuka
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Seluruh naskah publikasi telah melewati penelaahan sejawat berstandar COPE, terintegrasi DOI Crossref, dan dapat diakses bebas secara global tanpa hambatan.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Strip */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari naskah, abstrak, topik, nama penulis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Filter and Sort */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {disciplines.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDiscipline(d)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedDiscipline === d
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-slate-700 font-semibold focus:outline-none"
                >
                  <option value="latest">Terbitan Terbaru</option>
                  <option value="citations">Sitasi Terbanyak</option>
                  <option value="views">Paling Banyak Dilihat</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex justify-between items-center text-xs sm:text-sm text-slate-500">
          <span>Menampilkan <strong>{filtered.length}</strong> naskah ilmiah terbitan</span>
        </div>

        <div className="space-y-4">
          {filtered.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-2.5 max-w-4xl">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded font-bold font-mono bg-blue-50 text-primary border border-blue-200">
                    {art.journalShort}
                  </span>
                  <span className="px-2.5 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {art.sintaRank}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {art.volume} {art.issue} ({art.year}) • Hlm. {art.pages}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    DOI: 10.35824/{art.journalShort.toLowerCase()}.{art.volume.toLowerCase().replace('vol. ', 'v')}{art.issue.toLowerCase().replace('no. ', 'i')}.{art.id.split('-').pop()}
                  </span>
                </div>

                <h2
                  onClick={() => onSelectArticle(art)}
                  className="text-lg sm:text-xl font-bold text-slate-900 hover:text-primary transition-colors cursor-pointer leading-snug"
                >
                  {art.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-500 font-serif italic line-clamp-1">
                  {art.titleEn}
                </p>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {art.abstractId.background}
                </p>

                {/* Author row & Keywords */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 pt-1">
                  <span className="font-semibold text-slate-800">
                    {art.authors.map((a) => a.name).join(', ')}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Terbit: {art.timeline.publishedOnline}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    {art.metrics.views.toLocaleString('id-ID')}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    {art.metrics.citations} sitasi
                  </span>
                </div>

                {/* Keywords tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {art.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600 font-mono"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex lg:flex-col items-center gap-2 shrink-0">
                <button
                  onClick={() => onSelectArticle(art)}
                  className="flex-1 lg:w-36 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Baca Naskah</span>
                </button>
                <button
                  onClick={() => onOpenCitation(art)}
                  className="flex-1 lg:w-36 inline-flex items-center justify-center gap-2 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Quote className="w-3.5 h-3.5 text-slate-600" />
                  <span>Sitasi</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
