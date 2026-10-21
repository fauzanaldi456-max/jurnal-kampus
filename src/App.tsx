import React, { useState, useEffect } from 'react';
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

// Modals
import { CitationModal } from './components/CitationModal';
import { QRCodeModal } from './components/QRCodeModal';
import { SubmissionModal } from './components/SubmissionModal';
import { LoginModal } from './components/LoginModal';
import { WaiverModal } from './components/WaiverModal';
import { TicketModal } from './components/TicketModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('panduan-publikasi');
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

  // Handle URL hash or direct routing if user refreshed or clicks
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleNavigate = (page: PageView, articleId?: string) => {
    if (articleId) {
      const found = CATALOG_ARTICLES.find((a) => a.id === articleId) || PRIMARY_ARTICLE;
      setSelectedArticle(found);
      setCurrentPage('artikel-detail');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setCurrentPage('artikel-detail');
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

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#1e293b] font-sans antialiased selection:bg-[#0052cc]/15 selection:text-[#0052cc]">
      {/* Top Universal Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenSubmission={handleOpenSubmission}
      />

      {/* Main Content Area - padded for fixed header */}
      <main className="flex-1 pt-28">
        {currentPage === 'beranda' && (
          <HomeView
            onSelectArticle={handleSelectArticle}
            onOpenSubmission={handleOpenSubmission}
            onOpenCitation={handleOpenCitation}
            onNavigatePublicationGuide={() => handleNavigate('panduan-publikasi')}
            onNavigateDirectory={() => handleNavigate('direktori-jurnal')}
            onNavigateArticles={() => handleNavigate('artikel')}
            onOpenWaiver={() => setWaiverModalOpen(true)}
          />
        )}

        {currentPage === 'panduan-publikasi' && (
          <PublicationGuideView
            onNavigate={handleNavigate}
            onOpenSubmission={handleOpenSubmission}
            onOpenWaiver={() => setWaiverModalOpen(true)}
            onOpenTicket={() => setTicketModalOpen(true)}
          />
        )}

        {currentPage === 'artikel-detail' && (
          <ArticleDetailView
            article={selectedArticle}
            onOpenCitation={handleOpenCitation}
            onOpenQR={handleOpenQR}
            onSelectArticle={handleSelectArticle}
            onNavigateJournal={() => handleNavigate('direktori-jurnal')}
          />
        )}

        {currentPage === 'tentang-kami' && (
          <AboutView
            onOpenTicket={() => setTicketModalOpen(true)}
            onOpenWaiver={() => setWaiverModalOpen(true)}
            onNavigatePublicationGuide={() => handleNavigate('panduan-publikasi')}
          />
        )}

        {currentPage === 'direktori-jurnal' && (
          <JournalDirectoryView
            onSelectArticle={handleSelectArticle}
            onOpenSubmissionWithJournal={() => handleOpenSubmission()}
            onNavigateArticles={() => handleNavigate('artikel')}
          />
        )}

        {currentPage === 'artikel' && (
          <ArticleCatalogView
            onSelectArticle={handleSelectArticle}
            onOpenCitation={handleOpenCitation}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenWaiver={() => setWaiverModalOpen(true)}
      />

      {/* Global Interactive Modals */}
      <CitationModal
        isOpen={citationModalOpen}
        onClose={() => setCitationModalOpen(false)}
        article={citationArticle}
      />

      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        doi={qrDoi}
      />

      <SubmissionModal
        isOpen={submissionModalOpen}
        onClose={() => setSubmissionModalOpen(false)}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      <WaiverModal
        isOpen={waiverModalOpen}
        onClose={() => setWaiverModalOpen(false)}
      />

      <TicketModal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
      />
    </div>
  );
}
