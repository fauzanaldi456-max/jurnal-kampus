import React, { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import { PageView, Article } from './types';
import { PRIMARY_ARTICLE } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { PublicationGuideView } from './views/PublicationGuideView';
import { ArticleDetailView } from './views/ArticleDetailView';
import { AboutView } from './views/AboutView';
import { JournalDirectoryView } from './views/JournalDirectoryView';
import { ArticleCatalogView } from './views/ArticleCatalogView';
import { NotFoundView } from './views/NotFoundView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';

// Protected Route Guard
import { ProtectedRoute } from './components/ProtectedRoute';

// Author Views
import { AuthorDashboardView } from './views/author/AuthorDashboardView';
import { AuthorSubmissionsView } from './views/author/AuthorSubmissionsView';
import { AuthorSubmissionDetailView } from './views/author/AuthorSubmissionDetailView';
import { AuthorNewSubmissionView } from './views/author/AuthorNewSubmissionView';
import { AuthorProfileView } from './views/author/AuthorProfileView';

// Editor Views
import { EditorDashboardView } from './views/editor/EditorDashboardView';
import { EditorSubmissionsView } from './views/editor/EditorSubmissionsView';
import { EditorSubmissionDetailView } from './views/editor/EditorSubmissionDetailView';
import { EditorReviewersView } from './views/editor/EditorReviewersView';
import { EditorDecisionsView } from './views/editor/EditorDecisionsView';

// Reviewer Views
import { ReviewerDashboardView } from './views/reviewer/ReviewerDashboardView';
import { ReviewerAssignmentsView } from './views/reviewer/ReviewerAssignmentsView';
import { ReviewerAssignmentDetailView } from './views/reviewer/ReviewerAssignmentDetailView';
import { ReviewerHistoryView } from './views/reviewer/ReviewerHistoryView';

// Admin Views
import { AdminDashboardView } from './views/admin/AdminDashboardView';
import { AdminUsersView } from './views/admin/AdminUsersView';
import { AdminJournalsView } from './views/admin/AdminJournalsView';
import { AdminAuditLogsView } from './views/admin/AdminAuditLogsView';

// Modals
import { CitationModal } from './components/CitationModal';
import { QRCodeModal } from './components/QRCodeModal';
import { SubmissionModal } from './components/SubmissionModal';
import { LoginModal } from './components/LoginModal';
import { WaiverModal } from './components/WaiverModal';
import { TicketModal } from './components/TicketModal';

// Helper component to ensure window scrolls to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedArticle, setSelectedArticle] = useState<Article>(PRIMARY_ARTICLE);

  // Modals state
  const [citationModalOpen, setCitationModalOpen] = useState(false);
  const [citationArticle, setCitationArticle] = useState<Article>(PRIMARY_ARTICLE);

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrDoi, setQrDoi] = useState(PRIMARY_ARTICLE.doi);

  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [waiverModalOpen, setWaiverModalOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  // Modal URL query param sync
  const modalParam = searchParams.get('modal');
  const isSubmissionOpen = submissionModalOpen || modalParam === 'submission';
  const isLoginOpen = loginModalOpen || modalParam === 'login';
  const isWaiverOpen = waiverModalOpen || modalParam === 'waiver';
  const isTicketOpen = ticketModalOpen || modalParam === 'ticket';
  const isCitationOpen = citationModalOpen || modalParam === 'citation';
  const isQrOpen = qrModalOpen || modalParam === 'qr';

  const closeModal = () => {
    setSubmissionModalOpen(false);
    setLoginModalOpen(false);
    setWaiverModalOpen(false);
    setTicketModalOpen(false);
    setCitationModalOpen(false);
    setQrModalOpen(false);

    if (modalParam) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('modal');
      nextParams.delete('articleId');
      nextParams.delete('doi');
      setSearchParams(nextParams, { replace: true });
    }
  };

  const handleNavigate = (page: PageView, articleId?: string) => {
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
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    navigate(`/artikel/${article.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCitation = (article: Article) => {
    setCitationArticle(article);
    setCitationModalOpen(true);
  };

  const handleOpenQR = (article: Article) => {
    setQrDoi(article.doi);
    setQrModalOpen(true);
  };

  const handleOpenSubmission = () => {
    setSubmissionModalOpen(true);
  };

  const handleOpenLogin = () => {
    navigate('/masuk');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWaiver = () => {
    setWaiverModalOpen(true);
  };

  const handleOpenTicket = () => {
    setTicketModalOpen(true);
  };

  const isAuthPage =
    location.pathname === '/masuk' ||
    location.pathname === '/login' ||
    location.pathname === '/portal' ||
    location.pathname === '/daftar' ||
    location.pathname === '/register';

  const isDashboardPage =
    location.pathname.startsWith('/author') ||
    location.pathname.startsWith('/editor') ||
    location.pathname.startsWith('/reviewer') ||
    location.pathname.startsWith('/admin');

  const hidePublicHeaderFooter = isAuthPage || isDashboardPage;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-700">
      <ScrollToTop />

      {/* Top Universal Navbar (Hidden on Login Page and Dashboard Pages) */}
      {!hidePublicHeaderFooter && (
        <Navbar
          onNavigate={handleNavigate}
          onOpenLogin={handleOpenLogin}
          onOpenSubmission={handleOpenSubmission}
        />
      )}

      {/* Main Content Area with React Router */}
      <main className={`flex-1 ${hidePublicHeaderFooter ? 'pt-0' : 'pt-24'}`}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <HomeView
                onSelectArticle={handleSelectArticle}
                onOpenSubmission={handleOpenSubmission}
                onOpenCitation={handleOpenCitation}
                onNavigatePublicationGuide={() => navigate('/panduan-publikasi')}
                onNavigateDirectory={() => navigate('/direktori-jurnal')}
                onNavigateArticles={() => navigate('/artikel')}
                onOpenWaiver={handleOpenWaiver}
              />
            }
          />

          <Route
            path="/direktori-jurnal"
            element={
              <JournalDirectoryView
                onSelectArticle={handleSelectArticle}
                onOpenSubmissionWithJournal={() => handleOpenSubmission()}
                onNavigateArticles={() => navigate('/artikel')}
              />
            }
          />
          <Route path="/jurnal" element={<Navigate to="/direktori-jurnal" replace />} />

          <Route
            path="/artikel"
            element={
              <ArticleCatalogView
                onSelectArticle={handleSelectArticle}
                onOpenCitation={handleOpenCitation}
              />
            }
          />

          <Route
            path="/artikel/:id"
            element={
              <ArticleDetailView
                article={selectedArticle}
                onOpenCitation={handleOpenCitation}
                onOpenQR={handleOpenQR}
                onSelectArticle={handleSelectArticle}
                onNavigateJournal={() => navigate('/direktori-jurnal')}
              />
            }
          />

          <Route
            path="/panduan-publikasi"
            element={
              <PublicationGuideView
                onNavigate={handleNavigate}
                onOpenSubmission={handleOpenSubmission}
                onOpenWaiver={handleOpenWaiver}
                onOpenTicket={handleOpenTicket}
              />
            }
          />

          <Route
            path="/tentang-kami"
            element={
              <AboutView
                onOpenTicket={handleOpenTicket}
                onOpenWaiver={handleOpenWaiver}
                onNavigatePublicationGuide={() => navigate('/panduan-publikasi')}
              />
            }
          />

          {/* Unified Login & Register Routes */}
          <Route path="/masuk" element={<LoginView />} />
          <Route path="/login" element={<Navigate to="/masuk" replace />} />
          <Route path="/portal" element={<Navigate to="/masuk" replace />} />
          <Route path="/daftar" element={<RegisterView />} />
          <Route path="/register" element={<Navigate to="/daftar" replace />} />

          {/* AUTHOR (Mahasiswa / Penulis) Protected Routes */}
          <Route
            path="/author/dashboard"
            element={
              <ProtectedRoute allowedRoles={['author', 'admin']}>
                <AuthorDashboardView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/author/submissions"
            element={
              <ProtectedRoute allowedRoles={['author', 'admin']}>
                <AuthorSubmissionsView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/author/submissions/new"
            element={
              <ProtectedRoute allowedRoles={['author', 'admin']}>
                <AuthorNewSubmissionView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/author/submissions/:id"
            element={
              <ProtectedRoute allowedRoles={['author', 'admin']}>
                <AuthorSubmissionDetailView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/author/profile"
            element={
              <ProtectedRoute allowedRoles={['author', 'admin']}>
                <AuthorProfileView />
              </ProtectedRoute>
            }
          />

          {/* EDITORIAL (Dewan Editor OJS) Protected Routes */}
          <Route
            path="/editor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['editor', 'admin']}>
                <EditorDashboardView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/submissions"
            element={
              <ProtectedRoute allowedRoles={['editor', 'admin']}>
                <EditorSubmissionsView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/submissions/:id"
            element={
              <ProtectedRoute allowedRoles={['editor', 'admin']}>
                <EditorSubmissionDetailView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/reviewers"
            element={
              <ProtectedRoute allowedRoles={['editor', 'admin']}>
                <EditorReviewersView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/decisions"
            element={
              <ProtectedRoute allowedRoles={['editor', 'admin']}>
                <EditorDecisionsView />
              </ProtectedRoute>
            }
          />

          {/* REVIEWER (Mitra Bestari) Protected Routes */}
          <Route
            path="/reviewer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['reviewer', 'admin']}>
                <ReviewerDashboardView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviewer/assignments"
            element={
              <ProtectedRoute allowedRoles={['reviewer', 'admin']}>
                <ReviewerAssignmentsView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviewer/assignments/:id"
            element={
              <ProtectedRoute allowedRoles={['reviewer', 'admin']}>
                <ReviewerAssignmentDetailView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviewer/history"
            element={
              <ProtectedRoute allowedRoles={['reviewer', 'admin']}>
                <ReviewerHistoryView />
              </ProtectedRoute>
            }
          />

          {/* SUPER ADMIN Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsersView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/journals"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminJournalsView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAuditLogsView />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback Page */}
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </main>

      {/* Institutional Footer (Hidden on Login Page and Dashboard Pages) */}
      {!hidePublicHeaderFooter && (
        <Footer
          onNavigate={handleNavigate}
          onOpenWaiver={handleOpenWaiver}
        />
      )}

      {/* Global Interactive Modals */}
      <CitationModal
        isOpen={isCitationOpen}
        onClose={closeModal}
        article={citationArticle}
      />

      <QRCodeModal
        isOpen={isQrOpen}
        onClose={closeModal}
        doi={qrDoi}
      />

      <SubmissionModal
        isOpen={isSubmissionOpen}
        onClose={closeModal}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeModal}
      />

      <WaiverModal
        isOpen={isWaiverOpen}
        onClose={closeModal}
      />

      <TicketModal
        isOpen={isTicketOpen}
        onClose={closeModal}
      />
    </div>
  );
}
