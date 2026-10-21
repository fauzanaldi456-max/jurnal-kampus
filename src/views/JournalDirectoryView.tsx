import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Award,
  Send
} from 'lucide-react';
import { Journal, Article } from '../types';
import { CONSORTIUM_JOURNALS } from '../data/mockData';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSinta = searchParams.get('sinta') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSinta, setSelectedSinta] = useState<string>(initialSinta);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [onlyDoaj, setOnlyDoaj] = useState(false);

  const handleSintaChange = (s: string) => {
    setSelectedSinta(s);
    const newParams = new URLSearchParams(searchParams);
    if (s === 'all') {
      newParams.delete('sinta');
    } else {
      newParams.set('sinta', s);
    }
    setSearchParams(newParams, { replace: true });
  };

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
    <div className="bg-white min-h-screen text-slate-900">
      {/* Directory Header */}
      <section className="bg-white border-b border-slate-200/80 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-4">
              Koleksi 24 Jurnal Ilmiah Terakreditasi Nasional
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Seluruh jurnal mitra dikelola dengan sistem OJS 3.4 berstandar internasional, mematuhi kaidah penelaahan sejawat berintegritas, dan menjamin hak cipta terbuka bagi para penulis.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="sticky top-16 md:top-20 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari jurnal, singkatan, e-ISSN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              {/* SINTA filter */}
              <div className="flex items-center bg-slate-100/80 p-1 rounded-full text-xs border border-slate-200/60">
                <span className="text-slate-500 font-bold px-3 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-600" /> SINTA:
                </span>
                {['all', '1', '2', '3', '4'].map((grade) => (
                  <button
                    key={grade}
                    onClick={() => handleSintaChange(grade)}
                    className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                      selectedSinta === grade
                        ? 'bg-slate-900 text-white shadow-xs'
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
                className="bg-slate-50 border border-slate-200 text-xs rounded-full px-4 py-2.5 text-slate-700 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
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
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer bg-slate-50 px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors select-none">
                <input
                  type="checkbox"
                  checked={onlyDoaj}
                  onChange={(e) => setOnlyDoaj(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0 cursor-pointer accent-blue-600"
                />
                <span className="font-semibold">DOAJ Terindeks</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Journals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Menampilkan <strong className="text-slate-900">{filteredJournals.length}</strong> jurnal ilmiah dari konsorsium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJournals.map((journal) => (
            <div
              key={journal.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200">
                    {journal.shortName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      SINTA {journal.sintaGrade}
                    </span>
                    {journal.isDoajIndexed && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        DOAJ
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-2.5">
                  {journal.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-5 line-clamp-3">
                  {journal.description}
                </p>

                <div className="p-4 bg-slate-50/70 rounded-2xl space-y-2 text-xs text-slate-600 mb-5 border border-slate-100">
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

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2.5">
                <button
                  onClick={() => onOpenSubmissionWithJournal(journal.shortName)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-blue-400" />
                  <span>Kirim Naskah</span>
                </button>
                <button
                  onClick={onNavigateArticles}
                  className="inline-flex items-center justify-center py-2.5 px-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                  title="Lihat Naskah Terbitan"
                >
                  <BookOpen className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
