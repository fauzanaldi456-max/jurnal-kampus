import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Award,
  ShieldCheck,
  Building,
  CheckCircle2,
  Send,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { Journal, Article } from '../types';
import { CONSORTIUM_JOURNALS, CATALOG_ARTICLES } from '../data/mockData';

interface JournalDirectoryViewProps {
  onSelectArticle: (article: Article) => void;
  onOpenSubmissionWithJournal: (journalShort: string) => void;
  onNavigateArticles: () => void;
}

export const JournalDirectoryView: React.FC<JournalDirectoryViewProps> = ({
  onSelectArticle,
  onOpenSubmissionWithJournal,
  onNavigateArticles
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSinta, setSelectedSinta] = useState<string>('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [onlyDoaj, setOnlyDoaj] = useState(false);

  const disciplines = [
    'all',
    'Keteknikan & Komputer',
    'Sains Terapan & Rekayasa',
    'Biosains & Medika',
    'Hukum & Tata Kelola',
    'Ekonomi & Bisnis',
    'Pendidikan Terapan'
  ];

  const filteredJournals = CONSORTIUM_JOURNALS.filter((journal) => {
    const matchesSearch =
      journal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journal.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journal.eIssn.includes(searchQuery) ||
      journal.publisher.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSinta =
      selectedSinta === 'all' || journal.sintaGrade === parseInt(selectedSinta);

    const matchesDiscipline =
      selectedDiscipline === 'all' ||
      journal.discipline.toLowerCase().includes(selectedDiscipline.toLowerCase());

    const matchesDoaj = !onlyDoaj || journal.isDoajIndexed;

    return matchesSearch && matchesSinta && matchesDiscipline && matchesDoaj;
  });

  return (
    <div className="bg-[#f8fafc] min-h-screen text-[#1e293b]">
      {/* Directory Header */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-primary font-mono uppercase tracking-wider block mb-2">
              DIREKTORI RESMI KONSORSIUM
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Koleksi 24 Jurnal Ilmiah Terakreditasi Nasional
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Seluruh jurnal mitra dikelola dengan sistem OJS 3.4 berstandar internasional, mematuhi kaidah penelaahan sejawat berintegritas, dan menjamin hak cipta terbuka bagi para penulis.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari jurnal, singkatan, e-ISSN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* SINTA filter */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
                <span className="text-slate-500 font-bold px-2 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> SINTA:
                </span>
                {['all', '1', '2', '3', '4'].map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedSinta(grade)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      selectedSinta === grade
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {grade === 'all' ? 'Semua' : `S${grade}`}
                  </button>
                ))}
              </div>

              {/* Discipline dropdown */}
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-primary"
              >
                <option value="all">Semua Rumpun Ilmu</option>
                <option value="Keteknikan">Keteknikan & Komputer</option>
                <option value="Sains">Sains Terapan</option>
                <option value="Biosains">Biosains & Kedokteran</option>
                <option value="Hukum">Hukum & Kebijakan</option>
                <option value="Ekonomi">Ekonomi & Bisnis</option>
                <option value="Pendidikan">Pendidikan Terapan</option>
              </select>

              {/* DOAJ Toggle */}
              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={onlyDoaj}
                  onChange={(e) => setOnlyDoaj(e.target.checked)}
                  className="rounded text-primary focus:ring-0"
                />
                <span className="font-semibold">DOAJ Terindeks</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Journals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm text-slate-500">
            Menampilkan <strong className="text-slate-800">{filteredJournals.length}</strong> jurnal ilmiah dari konsorsium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJournals.map((journal) => (
            <div
              key={journal.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold font-mono bg-blue-50 text-primary border border-blue-200">
                    {journal.shortName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                      SINTA {journal.sintaGrade}
                    </span>
                    {journal.isDoajIndexed && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        DOAJ
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug mb-2">
                  {journal.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {journal.description}
                </p>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600 mb-4 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">e-ISSN / p-ISSN:</span>
                    <span className="font-mono font-medium text-slate-800">
                      {journal.eIssn} / {journal.pIssn}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Penerbit:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[180px]">
                      {journal.publisher}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Frekuensi:</span>
                    <span className="font-medium text-slate-800">{journal.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tingkat Penerimaan:</span>
                    <span className="font-bold text-emerald-700">{journal.acceptanceRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Edisi Terkini:</span>
                    <span className="font-medium text-slate-800">{journal.currentIssue}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onOpenSubmissionWithJournal(journal.shortName)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Naskah</span>
                </button>
                <button
                  onClick={onNavigateArticles}
                  className="inline-flex items-center justify-center py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  title="Lihat Naskah Terbitan"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
