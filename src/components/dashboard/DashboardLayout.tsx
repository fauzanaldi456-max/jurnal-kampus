import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  ShieldCheck,
  FileCheck2,
  Users,
  BookOpen,
  History,
  LogOut,
  Bell,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
  hideHeaderCard?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  actionButton,
  hideHeaderCard = false,
}) => {
  const { user, logout, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('cendraloka_sidebar_collapsed') === 'true';
  });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('cendraloka_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Load notifications from server
  useEffect(() => {
    if (!token) return;
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/v1/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setNotifications(data.notifications || []);
          }
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };
    fetchNotifications();
  }, [token]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAllRead = async () => {
    if (!token) return;
    try {
      await fetch('/api/v1/notifications/read-all', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari portal jurnal Cendraloka?')) {
      await logout();
      navigate('/masuk');
    }
  };

  // Role configuration for navigation items
  const getNavItems = (): NavItem[] => {
    if (!user) return [];

    switch (user.role) {
      case 'author':
        return [
          { label: 'Dasbor Utama', href: '/author/dashboard', icon: LayoutDashboard },
          { label: 'Naskah Publikasi Saya', href: '/author/submissions', icon: FileText },
          { label: 'Ajukan Naskah Baru', href: '/author/submissions/new', icon: PlusCircle },
          { label: 'Profil & Afiliasi Penulis', href: '/author/profile', icon: User },
        ];
      case 'editor':
        return [
          { label: 'Dasbor Editorial', href: '/editor/dashboard', icon: LayoutDashboard },
          { label: 'Semua Naskah Masuk', href: '/editor/submissions', icon: FileText },
          { label: 'Mitra Bestari (Reviewer)', href: '/editor/reviewers', icon: Users },
          { label: 'Keputusan Editorial', href: '/editor/decisions', icon: ShieldCheck },
        ];
      case 'reviewer':
        return [
          { label: 'Dasbor Mitra Bestari', href: '/reviewer/dashboard', icon: LayoutDashboard },
          { label: 'Tugas Telaah Naskah', href: '/reviewer/assignments', icon: FileCheck2 },
          { label: 'Riwayat Telaah Reviewer', href: '/reviewer/history', icon: History },
        ];
      case 'admin':
        return [
          { label: 'Ringkasan Sistem', href: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Manajemen Pengguna', href: '/admin/users', icon: Users },
          { label: 'Direktori Jurnal', href: '/admin/journals', icon: BookOpen },
          { label: 'Jejak Audit Keamanan', href: '/admin/audit-logs', icon: History },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const roleMeta: Record<string, { label: string; shortRole: string; color: string; quickAction: { label: string; href: string } }> = {
    author: {
      label: 'Mahasiswa / Penulis',
      shortRole: 'Penulis Riset',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      quickAction: { label: 'Ajukan Naskah Baru', href: '/author/submissions/new' },
    },
    editor: {
      label: 'Dewan Editor (OJS)',
      shortRole: 'Editor In Chief',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      quickAction: { label: 'Antrean Naskah Masuk', href: '/editor/submissions' },
    },
    reviewer: {
      label: 'Mitra Bestari (Reviewer)',
      shortRole: 'Peer Reviewer',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      quickAction: { label: 'Tugas Telaah Naskah', href: '/reviewer/assignments' },
    },
    admin: {
      label: 'Super Administrator',
      shortRole: 'System Admin',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      quickAction: { label: 'Kelola Pengguna', href: '/admin/users' },
    },
  };

  const currentRoleMeta = user?.role ? roleMeta[user.role] : {
    label: 'Pengguna',
    shortRole: 'User',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    quickAction: { label: 'Dasbor', href: '/' },
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-800 antialiased">
      {/* Desktop Left Sidebar (Collapsible with Icon Mode) */}
      <aside
        className={`hidden lg:flex shrink-0 flex-col bg-white border-r border-slate-200/80 sticky top-0 h-screen z-30 justify-between transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20 p-3.5' : 'w-72 p-5'
        }`}
      >
        <div>
          {/* Top Brand Logo & Toggle */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className={`flex items-center gap-3 py-1 group ${
                isSidebarCollapsed ? 'justify-center mx-auto' : 'px-2'
              }`}
              title="Cendraloka OJS"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform shrink-0">
                <span className="material-symbols-outlined text-[22px]">auto_stories</span>
              </div>
              {!isSidebarCollapsed && (
                <div className="overflow-hidden">
                  <div className="font-['Space_Grotesk'] text-lg font-bold text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
                    Cendraloka
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 font-mono font-bold uppercase">
                      OJS
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium tracking-wide block mt-1 truncate">
                    Portal Jurnal Ilmiah
                  </span>
                </div>
              )}
            </Link>

            {!isSidebarCollapsed && (
              <button
                type="button"
                onClick={toggleSidebarCollapse}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer shrink-0"
                title="Tutup Sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Expand toggle button when collapsed */}
          {isSidebarCollapsed && (
            <div className="flex justify-center mb-4">
              <button
                type="button"
                onClick={toggleSidebarCollapse}
                className="w-9 h-9 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition cursor-pointer"
                title="Buka Sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Nav Items List */}
          <div className="space-y-1">
            {!isSidebarCollapsed && (
              <span className="block px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                Menu Navigasi
              </span>
            )}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={`flex items-center rounded-2xl text-xs font-semibold transition-all group relative ${
                      isSidebarCollapsed
                        ? 'justify-center p-3'
                        : 'justify-between px-3.5 py-3'
                    } ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                      {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {item.badge !== undefined && (
                      isSidebarCollapsed ? (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                      ) : (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Support Link: "Kembali Ke halaman" (Clean button, Card and Copyright removed) */}
        <div className="pt-4 border-t border-slate-100">
          <Link
            to="/"
            title="Kembali Ke halaman"
            className={`flex items-center rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-200 text-xs font-bold transition-all shadow-2xs group ${
              isSidebarCollapsed
                ? 'justify-center p-3'
                : 'justify-center gap-2 py-2.5 px-3 w-full'
            }`}
          >
            <ArrowLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform text-slate-500 group-hover:text-blue-600" />
            {!isSidebarCollapsed && <span>Kembali Ke halaman</span>}
          </Link>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar (Cleaned up, Search Bar Removed) */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 h-18 flex items-center px-4 sm:px-8 justify-between">
          {/* Left: Mobile Toggle (Mobile only) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Buka navigasi menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Right Header: Notifications, User Capsule */}
          <div className="flex items-center gap-2 sm:gap-3 ml-3 sm:ml-6 shrink-0">

            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
                title="Pemberitahuan Sistem"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-xl border border-slate-200 py-3 z-50 animate-fadeIn">
                  <div className="px-5 pb-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Pemberitahuan Sistem</span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
                      >
                        Tandai sudah dibaca
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">Tidak ada notifikasi baru</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3.5 hover:bg-slate-50 transition text-xs ${!n.is_read ? 'bg-blue-50/40' : ''}`}
                        >
                          <p className="font-bold text-slate-900 mb-0.5">{n.title}</p>
                          <p className="text-slate-600 text-[11px] leading-relaxed mb-1">{n.message}</p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(n.created_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Capsule (MediCore AI Style) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-full hover:bg-slate-100/80 transition cursor-pointer border border-transparent hover:border-slate-200"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left max-w-[130px]">
                  <span className="block text-xs font-bold text-slate-900 truncate leading-tight">
                    {user?.full_name?.split(',')[0]}
                  </span>
                  <span className="block text-[10px] text-slate-500 font-medium truncate">
                    {currentRoleMeta.shortRole}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-xl border border-slate-200 p-3 z-50 animate-fadeIn">
                  <div className="p-3 rounded-2xl bg-slate-50 mb-2">
                    <p className="font-bold text-xs text-slate-900 truncate">{user?.full_name}</p>
                    <p className="text-[10px] text-slate-500 truncate font-mono mt-0.5">{user?.email}</p>
                    <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentRoleMeta.color}`}>
                      {currentRoleMeta.label}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-100 font-medium"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                      <span>Kembali Ke halaman</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-bold cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Keluar dari Akun</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full p-6 flex flex-col justify-between shadow-2xl animate-slideRight">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">auto_stories</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">CENDRALOKA</span>
                      <span className="text-[10px] text-blue-600 font-medium">Journal Portal</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentRoleMeta.color}`}
                  >
                    {currentRoleMeta.label}
                  </span>
                </div>

                <nav className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold ${
                          isActive ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali Ke halaman</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {/* Optional Title Header Card (for Subpages or views that don't have their own custom hero) */}
          {!hideHeaderCard && title && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {title}
                  </h1>
                  {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>}
                </div>
                {actionButton && <div className="shrink-0">{actionButton}</div>}
              </div>
            </div>
          )}

          {/* Children View Content */}
          {children}
        </main>
      </div>
    </div>
  );
};
