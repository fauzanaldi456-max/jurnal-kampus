import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageView } from '../types';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPage?: PageView;
  onNavigate?: (page: PageView, articleId?: string) => void;
  onOpenLogin: () => void;
  onOpenSubmission?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenLogin,
  onOpenSubmission
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Dynamically resolve active page based on current URL path
  const getActivePage = (): PageView => {
    const p = location.pathname;
    if (p === '/') return 'beranda';
    if (p === '/direktori-jurnal' || p.startsWith('/jurnal')) return 'direktori-jurnal';
    if (p.startsWith('/artikel/')) return 'artikel-detail';
    if (p === '/artikel') return 'artikel';
    if (p === '/panduan-publikasi') return 'panduan-publikasi';
    if (p === '/tentang-kami') return 'tentang-kami';
    if (p === '/masuk' || p === '/login' || p === '/portal') return 'masuk';
    if (p === '/daftar' || p === '/register') return 'daftar';
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
    } else if (page === 'masuk') {
      navigate('/masuk');
    } else if (page === 'daftar') {
      navigate('/daftar');
    }

    if (onNavigate) {
      onNavigate(page, articleId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Main Header */}
      <header className="w-full">
        <div className="h-16 md:h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => handleNavigation('beranda')}
              className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
                <span className="material-symbols-outlined text-[20px]">auto_stories</span>
              </div>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-lg font-bold tracking-tight text-slate-900 leading-none">
                  CENDRALOKA
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-slate-500 leading-tight tracking-wider uppercase mt-0.5">
                  Scientific Publishing
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation - Centered without capsule background */}
          <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 mx-auto">
            <button
              onClick={() => handleNavigation('beranda')}
              className={`text-sm transition-colors cursor-pointer py-1 ${
                activePage === 'beranda'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => handleNavigation('direktori-jurnal')}
              className={`text-sm transition-colors cursor-pointer py-1 ${
                activePage === 'direktori-jurnal'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              Direktori Jurnal
            </button>
            <button
              onClick={() => handleNavigation('artikel')}
              className={`text-sm transition-colors cursor-pointer py-1 ${
                activePage === 'artikel' || activePage === 'artikel-detail'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              Artikel
            </button>
            <button
              onClick={() => handleNavigation('panduan-publikasi')}
              className={`text-sm transition-colors cursor-pointer py-1 ${
                activePage === 'panduan-publikasi'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              Panduan Publikasi
            </button>
            <button
              onClick={() => handleNavigation('tentang-kami')}
              className={`text-sm transition-colors cursor-pointer py-1 ${
                activePage === 'tentang-kami'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              Tentang Kami
            </button>
          </nav>

          {/* Right Action Elements */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Desktop Action Buttons (Visible on lg screens) */}
            <div className="hidden lg:flex items-center gap-2">
              {user ? (
                <button
                  onClick={() => navigate(`/${user.role}/dashboard`)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation('masuk')}
                    className={`inline-flex items-center justify-center px-4 sm:px-5 py-2 text-xs font-semibold rounded-full transition-all shadow-xs cursor-pointer ${
                      activePage === 'masuk'
                        ? 'bg-blue-600 text-white border border-blue-600'
                        : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => handleNavigation('daftar')}
                    className={`inline-flex items-center justify-center px-4 sm:px-5 py-2 text-xs font-bold rounded-full transition-all shadow-xs cursor-pointer ${
                      activePage === 'daftar'
                        ? 'bg-blue-700 text-white shadow-sm'
                        : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 shadow-blue-500/10'
                    }`}
                  >
                    Daftar
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button - Gabungan Masuk & Menu Navigasi jadi Garis 3 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu navigasi"
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 active:scale-95 transition-all cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-700" />
              ) : (
                <Menu className="w-5 h-5 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 flex flex-col gap-2 shadow-xl animate-fadeIn">
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
              {user ? (
                <button
                  onClick={() => {
                    navigate(`/${user.role}/dashboard`);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Buka Dashboard</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      handleNavigation('masuk');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-2.5 rounded-full border text-xs font-semibold text-center cursor-pointer transition-colors ${
                      activePage === 'masuk'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => {
                      handleNavigation('daftar');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-2.5 rounded-full text-xs font-bold text-center cursor-pointer transition-colors shadow-xs ${
                      activePage === 'daftar'
                        ? 'bg-blue-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Daftar
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
};
