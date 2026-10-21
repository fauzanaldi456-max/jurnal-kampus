import React, { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useSearchParams
} from 'react-router-dom';
import { PageView, Article } from './types';
import { PRIMARY_ARTICLE, CATALOG_ARTICLES } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { PublicationGuideView } from './views/PublicationGuideView';
import { ArticleDetailView } from './views/ArticleDetailView';
import { AboutView } from './views/AboutView';
import { JournalDirectoryView } from './views/JournalDirectoryView';
import { ArticleCatalogView } from './views/ArticleCatalogView';
import { NotFoundView } from './views/NotFoundView';

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
    setLoginModalOpen(true);
  };

  const handleOpenWaiver = () => {
    setWaiverModalOpen(true);
  };

  const handleOpenTicket = () => {
    setTicketModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-700">
      <ScrollToTop />

      {/* Top Universal Navbar */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenLogin={handleOpenLogin}
        onOpenSubmission={handleOpenSubmission}
      />

      {/* Main Content Area with React Router */}
      <main className="flex-1 pt-24">
        <Routes>
          {/* Beranda */}
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

          {/* Direktori Jurnal & Aliases */}
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

          {/* Katalog Artikel Repositori */}
          <Route
            path="/artikel"
            element={
              <ArticleCatalogView
                onSelectArticle={handleSelectArticle}
                onOpenCitation={handleOpenCitation}
              />
            }
          />

          {/* Dynamic Article Detail */}
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

          {/* Panduan Publikasi */}
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

          {/* Tentang Kami */}
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

          {/* 404 Not Found Page */}
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </main>

      {/* Institutional Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenWaiver={handleOpenWaiver}
      />

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
