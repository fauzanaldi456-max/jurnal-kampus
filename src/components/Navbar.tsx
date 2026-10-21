import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageView } from '../types';
import { CATALOG_ARTICLES, CONSORTIUM_JOURNALS } from '../data/mockData';

interface NavbarProps {
  currentPage?: PageView;
  onNavigate?: (page: PageView, articleId?: string) => void;
  onOpenLogin: () => void;
  onOpenSubmission: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenLogin,
  onOpenSubmission
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Dynamically resolve active page based on current URL path
  const getActivePage = (): PageView => {
    const p = location.pathname;
    if (p === '/') return 'beranda';
    if (p === '/direktori-jurnal' || p.startsWith('/jurnal')) return 'direktori-jurnal';
    if (p.startsWith('/artikel/')) return 'artikel-detail';
    if (p === '/artikel') return 'artikel';
    if (p === '/panduan-publikasi') return 'panduan-publikasi';
    if (p === '/tentang-kami') return 'tentang-kami';
    return currentPage || 'beranda';
  };

  const activePage = getActivePage();

  const handleNavigation = (page: PageView, articleId?: string) => {
    if (page === 'beranda') {
      navigate('/');
    } else if (page === 'direktori-jurnal') {
      navigate('/direktori-jurnal');
    } else if (page === 'artikel') {
      navigate('/artikel');
    } else if (page === 'artikel-detail') {
      navigate(articleId ? `/artikel/${articleId}` : '/artikel');
    } else if (page === 'panduan-publikasi') {
      navigate('/panduan-publikasi');
    } else if (page === 'tentang-kami') {
      navigate('/tentang-kami');
    }

    if (onNavigate) {
      onNavigate(page, articleId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Search filtering
  const filteredArticles = searchQuery.trim()
    ? CATALOG_ARTICLES.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.doi.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.authors.some((au) => au.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          a.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const filteredJournals = searchQuery.trim()
    ? CONSORTIUM_JOURNALS.filter(
        (j) =>
          j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          j.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          j.eIssn.includes(searchQuery)
      )
    : [];

  const hasSearchResults = filteredArticles.length > 0 || filteredJournals.length > 0;

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-200 text-center py-2 px-4 text-xs font-medium flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-[16px] text-blue-400">science</span>
        <span>Portal Publikasi Ilmiah Multidisiplin Terintegrasi — Data Contoh Bersifat Simulasi Demo</span>
      </div>

      {/* Main Header */}
      <header className="w-full">
        <div className="h-16 md:h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => handleNavigation('beranda')}
              className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
                <span className="material-symbols-outlined text-[20px]">auto_stories</span>
              </div>
              <div className="flex flex-col">
                <span className="font-['Plus_Jakarta_Sans'] text-lg font-bold tracking-tight text-slate-900 leading-none">
                  JURNEXA
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-slate-500 leading-tight tracking-wider uppercase mt-0.5">
                  Scientific Publishing
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/60">
              <button
                onClick={() => handleNavigation('beranda')}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  activePage === 'beranda'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                Beranda
              </button>
              <button
                onClick={() => handleNavigation('direktori-jurnal')}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  activePage === 'direktori-jurnal'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                Direktori Jurnal
              </button>
              <button
                onClick={() => handleNavigation('artikel')}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  activePage === 'artikel' || activePage === 'artikel-detail'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                Artikel
              </button>
              <button
                onClick={() => handleNavigation('panduan-publikasi')}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  activePage === 'panduan-publikasi'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                Panduan Publikasi
              </button>
              <button
                onClick={() => handleNavigation('tentang-kami')}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  activePage === 'tentang-kami'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                Tentang Kami
              </button>
            </nav>
          </div>

          {/* Right Action Elements */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Live Search Input with Dropdown Popover */}
            <div className="relative hidden md:block">
              <div className="flex items-center bg-slate-50 border border-slate-200/90 hover:border-slate-300 px-3.5 py-1.5 rounded-full gap-2 text-slate-500 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 focus-within:bg-white transition-all shadow-xs">
                <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Cari DOI, judul, atau penulis..."
                  className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none w-44 xl:w-60 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>

              {/* Search Results Popover */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div
                  className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 max-h-96 overflow-y-auto z-50 min-w-[320px] xl:min-w-[400px] animate-fadeIn"
                  onMouseLeave={() => setIsSearchOpen(false)}
                >
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                    Hasil Pencarian Terindeks ({filteredArticles.length + filteredJournals.length})
                  </div>

                  {hasSearchResults ? (
                    <div className="space-y-3">
                      {filteredArticles.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-blue-600 uppercase mb-1.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                            <span>Manuskrip Artikel</span>
                          </div>
                          <div className="space-y-1">
                            {filteredArticles.slice(0, 4).map((art) => (
                              <button
                                key={art.id}
                                onClick={() => {
                                  handleNavigation('artikel-detail', art.id);
                                  setIsSearchOpen(false);
                                  setSearchQuery('');
                                }}
                                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-200"
                              >
                                <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 line-clamp-1">
                                  {art.title}
                                </div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                                  <span className="font-['JetBrains_Mono'] text-[10px] text-blue-600 font-medium">
                                    {art.doi}
                                  </span>
                                  <span>•</span>
                                  <span className="truncate">{art.authors[0]?.name}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {filteredJournals.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-emerald-600 uppercase mb-1.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            <span>Jurnal Ilmiah</span>
                          </div>
                          <div className="space-y-1">
                            {filteredJournals.map((jr) => (
                              <button
                                key={jr.id}
                                onClick={() => {
                                  handleNavigation('direktori-jurnal');
                                  setIsSearchOpen(false);
                                  setSearchQuery('');
                                }}
                                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between border border-transparent hover:border-slate-200 cursor-pointer"
                              >
                                <span className="text-xs font-medium text-slate-900">{jr.title}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                                  SINTA {jr.sintaGrade}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-500">
                      Tidak ditemukan hasil untuk <span className="font-semibold text-slate-900">"{searchQuery}"</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Masuk (Sign in) Button */}
            <button
              onClick={onOpenLogin}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-full text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs cursor-pointer"
            >
              Masuk
            </button>

            {/* Kirim Artikel (Submit manuscript) CTA */}
            <button
              onClick={onOpenSubmission}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 text-xs font-semibold rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm hover:shadow-md cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[16px] text-blue-400 group-hover:scale-110 transition-transform">upload_file</span>
              <span className="hidden xs:inline">Kirim Artikel</span>
              <span className="xs:hidden">Submit</span>
            </button>

            {/* User Profile Avatar with drop menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 focus:outline-none hover:bg-slate-200 transition-all cursor-pointer"
                title="Akun Pengguna"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs text-slate-800 animate-fadeIn"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-3.5 py-2.5 border-b border-slate-100 mb-1">
                    <div className="font-bold text-slate-900 text-sm">Peneliti / Penulis</div>
                    <div className="text-[11px] text-slate-500 truncate">penulis@institusi.ac.id</div>
                  </div>
                  <button
                    onClick={() => {
                      onOpenSubmission();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 cursor-pointer font-medium"
                  >
                    <span className="material-symbols-outlined text-[16px] text-blue-600">add_circle</span>
                    <span>Ajukan Naskah Baru</span>
                  </button>
                  <button
                    onClick={() => {
                      handleNavigation('panduan-publikasi');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 cursor-pointer font-medium"
                  >
                    <span className="material-symbols-outlined text-[16px] text-blue-600">checklist</span>
                    <span>Checklist Pra-Submisi</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenLogin();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 flex items-center gap-2.5 text-blue-600 font-semibold cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                    <span>Ganti Akun OJS Reviewer</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 flex flex-col gap-2 shadow-xl animate-fadeIn">
            {/* Mobile Search input */}
            <div className="flex items-center bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-full gap-2 text-slate-500 mb-2">
              <span className="material-symbols-outlined text-[18px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel, jurnal, DOI..."
                className="bg-transparent text-xs text-slate-900 w-full focus:outline-none font-medium"
              />
            </div>
            <button
              onClick={() => {
                handleNavigation('beranda');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer ${
                activePage === 'beranda' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => {
                handleNavigation('direktori-jurnal');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer ${
                activePage === 'direktori-jurnal' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Direktori Jurnal
            </button>
            <button
              onClick={() => {
                handleNavigation('artikel');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer ${
                activePage === 'artikel' || activePage === 'artikel-detail'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Artikel
            </button>
            <button
              onClick={() => {
                handleNavigation('panduan-publikasi');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer ${
                activePage === 'panduan-publikasi'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Panduan Publikasi
            </button>
            <button
              onClick={() => {
                handleNavigation('tentang-kami');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer ${
                activePage === 'tentang-kami'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Tentang Kami
            </button>
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  onOpenLogin();
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-center text-slate-700 hover:bg-slate-50"
              >
                Masuk
              </button>
              <button
                onClick={() => {
                  onOpenSubmission();
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold text-center hover:bg-slate-800"
              >
                Kirim Artikel
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};
