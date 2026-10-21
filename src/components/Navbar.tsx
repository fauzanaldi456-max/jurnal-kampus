import React, { useState } from 'react';
import { PageView } from '../types';
import { CATALOG_ARTICLES, CONSORTIUM_JOURNALS } from '../data/mockData';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView, articleId?: string) => void;
  onOpenLogin: () => void;
  onOpenSubmission: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenLogin,
  onOpenSubmission
}) => {
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
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Top Banner Notice */}
      <div className="bg-[#131b2e] text-[#eaf1ff] text-center py-1.5 px-4 text-xs font-semibold flex items-center justify-center gap-1.5">
        <span className="material-symbols-outlined text-[15px] text-[#89f5e7]">science</span>
        <span>Portal Publikasi Ilmiah Multidisiplin Terintegrasi — Data Contoh Bersifat Simulasi Demo</span>
      </div>

      {/* Main Header */}
      <header className="w-full border-b border-[#e5eeff]/80">
        <div className="h-20 max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('beranda')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1XBiqhKvx6nccFffsdEcS1Ufqs9_Sv_WaiKNMIYOg9xiEJUH0pdjdDjXSAIEyra4-ZnBanTOGyx42mGAhdfHgtokuVZLLYScUT1Y3ZWS2fzgV63Ws-13Wc67_9AAFgiT8bxPDCgayLGhJKoJY9-mIsxszNR56w5aap6Jdx2YkAYCNG84NnCNdODQy_tGktFBM1V2YXzzLHHWO9t0kfq9-b4sUczOVkD6uzJ02ttbFeq6WtmMEEAuYnLTUc"
                alt="Jurnexa Brand Logo"
                className="h-8 w-auto object-contain group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-['Plus_Jakarta_Sans'] text-lg font-bold tracking-tight text-[#0b1c30] leading-none">
                  JURNEXA
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#45464d] leading-tight tracking-wider uppercase">
                  Scientific Publishing
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 p-1">
              <button
                onClick={() => onNavigate('beranda')}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === 'beranda'
                    ? 'bg-[#e5eeff] text-[#4059aa] font-semibold'
                    : 'text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
                }`}
              >
                Beranda
              </button>
              <button
                onClick={() => onNavigate('direktori-jurnal')}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === 'direktori-jurnal'
                    ? 'bg-[#e5eeff] text-[#4059aa] font-semibold'
                    : 'text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
                }`}
              >
                Direktori Jurnal
              </button>
              <button
                onClick={() => onNavigate('artikel')}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === 'artikel' || currentPage === 'artikel-detail'
                    ? 'bg-[#e5eeff] text-[#4059aa] font-semibold'
                    : 'text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
                }`}
              >
                Artikel
              </button>
              <button
                onClick={() => onNavigate('panduan-publikasi')}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === 'panduan-publikasi'
                    ? 'bg-[#e5eeff] text-[#4059aa] font-semibold'
                    : 'text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
                }`}
              >
                Panduan Publikasi
              </button>
              <button
                onClick={() => onNavigate('tentang-kami')}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === 'tentang-kami'
                    ? 'bg-[#e5eeff] text-[#4059aa] font-semibold'
                    : 'text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
                }`}
              >
                Tentang Kami
              </button>
            </nav>
          </div>

          {/* Right Action Elements */}
          <div className="flex items-center gap-2.5">
            {/* Live Search Input with Dropdown Popover */}
            <div className="relative hidden md:block">
              <div className="flex items-center bg-[#eff4ff] px-3 py-1.5 rounded-lg gap-2 text-[#45464d] focus-within:ring-2 focus-within:ring-[#4059aa]/30 focus-within:bg-white transition-all">
                <span className="material-symbols-outlined text-[18px]">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Cari DOI, judul, atau penulis..."
                  className="bg-transparent text-xs text-[#0b1c30] placeholder:text-[#76777d] focus:outline-none w-48 xl:w-64"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="text-[#76777d] hover:text-[#0b1c30]"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>

              {/* Search Results Popover */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div
                  className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#e5eeff] p-3 max-h-96 overflow-y-auto z-50 min-w-[320px] xl:min-w-[400px]"
                  onMouseLeave={() => setIsSearchOpen(false)}
                >
                  <div className="text-[11px] font-semibold text-[#45464d] uppercase tracking-wider mb-2">
                    Hasil Pencarian Terindeks ({filteredArticles.length + filteredJournals.length})
                  </div>

                  {hasSearchResults ? (
                    <div className="space-y-3">
                      {filteredArticles.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-[#4059aa] uppercase mb-1">
                            Manuskrip Artikel
                          </div>
                          <div className="space-y-1.5">
                            {filteredArticles.slice(0, 4).map((art) => (
                              <button
                                key={art.id}
                                onClick={() => {
                                  onNavigate('artikel-detail', art.id);
                                  setIsSearchOpen(false);
                                  setSearchQuery('');
                                }}
                                className="w-full text-left p-2 rounded-lg hover:bg-[#eff4ff] transition-colors group"
                              >
                                <div className="text-xs font-semibold text-[#0b1c30] group-hover:text-[#4059aa] line-clamp-1">
                                  {art.title}
                                </div>
                                <div className="text-[11px] text-[#45464d] flex items-center gap-2 mt-0.5">
                                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#4059aa]">
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
                          <div className="text-[10px] font-bold text-[#0c9488] uppercase mb-1">
                            Jurnal Ilmiah
                          </div>
                          <div className="space-y-1">
                            {filteredJournals.map((jr) => (
                              <button
                                key={jr.id}
                                onClick={() => {
                                  onNavigate('direktori-jurnal');
                                  setIsSearchOpen(false);
                                  setSearchQuery('');
                                }}
                                className="w-full text-left p-2 rounded-lg hover:bg-[#eff4ff] transition-colors flex items-center justify-between"
                              >
                                <span className="text-xs font-medium text-[#0b1c30]">{jr.title}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#e5eeff] font-semibold text-[#1d3989]">
                                  SINTA {jr.sintaGrade}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-xs text-[#45464d]">
                      Tidak ditemukan hasil untuk <span className="font-semibold">"{searchQuery}"</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Masuk (Sign in) Button */}
            <button
              onClick={onOpenLogin}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-[#0b1c30] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#e5eeff] hover:bg-[#eff4ff] transition-colors"
            >
              Masuk
            </button>

            {/* Kirim Artikel (Submit manuscript) CTA */}
            <button
              onClick={onOpenSubmission}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-black text-white hover:bg-[#131b2e] transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span className="hidden xs:inline">Kirim Artikel</span>
              <span className="xs:hidden">Submit</span>
            </button>

            {/* User Profile Avatar with drop menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white focus:outline-none hover:ring-2 hover:ring-[#4059aa]/40 transition-all"
                title="Akun Pengguna"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#e5eeff] p-2 z-50 text-xs text-[#0b1c30]"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[#e5eeff] mb-1">
                    <div className="font-semibold text-sm">Peneliti / Penulis</div>
                    <div className="text-[11px] text-[#45464d] truncate">penulis@institusi.ac.id</div>
                  </div>
                  <button
                    onClick={() => {
                      onOpenSubmission();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#eff4ff] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#4059aa]">add_circle</span>
                    <span>Ajukan Naskah Baru</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('panduan-publikasi');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#eff4ff] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#4059aa]">checklist</span>
                    <span>Checklist Pra-Submisi</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenLogin();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#eff4ff] flex items-center gap-2 text-[#4059aa] font-medium"
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
              className="lg:hidden p-2 rounded-lg text-[#0b1c30] hover:bg-[#eff4ff]"
            >
              <span className="material-symbols-outlined text-[24px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#e5eeff] bg-white px-4 py-3 flex flex-col gap-2 shadow-lg">
            {/* Mobile Search input */}
            <div className="flex items-center bg-[#eff4ff] px-3 py-2 rounded-lg gap-2 text-[#45464d] mb-2">
              <span className="material-symbols-outlined text-[18px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel, jurnal, DOI..."
                className="bg-transparent text-xs text-[#0b1c30] w-full focus:outline-none"
              />
            </div>
            <button
              onClick={() => {
                onNavigate('beranda');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-left text-sm font-medium ${
                currentPage === 'beranda' ? 'bg-[#e5eeff] text-[#4059aa] font-semibold' : 'text-[#45464d]'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => {
                onNavigate('direktori-jurnal');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-left text-sm font-medium ${
                currentPage === 'direktori-jurnal' ? 'bg-[#e5eeff] text-[#4059aa] font-semibold' : 'text-[#45464d]'
              }`}
            >
              Direktori Jurnal
            </button>
            <button
              onClick={() => {
                onNavigate('artikel');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-left text-sm font-medium ${
                currentPage === 'artikel' || currentPage === 'artikel-detail'
                  ? 'bg-[#e5eeff] text-[#4059aa] font-semibold'
                  : 'text-[#45464d]'
              }`}
            >
              Artikel
            </button>
            <button
              onClick={() => {
                onNavigate('panduan-publikasi');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-left text-sm font-medium ${
                currentPage === 'panduan-publikasi'
                  ? 'bg-[#e5eeff] text-[#4059aa] font-semibold'
                  : 'text-[#45464d]'
              }`}
            >
              Panduan Publikasi
            </button>
            <button
              onClick={() => {
                onNavigate('tentang-kami');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-left text-sm font-medium ${
                currentPage === 'tentang-kami'
                  ? 'bg-[#e5eeff] text-[#4059aa] font-semibold'
                  : 'text-[#45464d]'
              }`}
            >
              Tentang Kami
            </button>
            <div className="pt-2 border-t border-[#e5eeff] flex gap-2">
              <button
                onClick={() => {
                  onOpenLogin();
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-2 rounded-lg border border-[#e5eeff] text-xs font-semibold text-center"
              >
                Masuk
              </button>
              <button
                onClick={() => {
                  onOpenSubmission();
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-2 rounded-lg bg-black text-white text-xs font-semibold text-center"
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
