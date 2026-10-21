import React, { useState } from 'react';
import {
  FileText,
  Download,
  Quote,
  Share2,
  QrCode,
  ExternalLink,
  Check,
  Copy,
  Calendar,
  Eye,
  TrendingUp,
  Cpu,
  Layers,
  Award,
  BookOpen,
  ShieldCheck,
  Building,
  User,
  Info,
  ChevronRight,
  Database,
  ArrowRight
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Article } from '../types';
import { PRIMARY_ARTICLE, CATALOG_ARTICLES, ARTICLE_REFERENCES } from '../data/mockData';

interface ArticleDetailViewProps {
  article?: Article;
  onOpenCitation: (article: Article) => void;
  onOpenQR: (article: Article) => void;
  onSelectArticle?: (article: Article) => void;
  onNavigateJournal?: (journalId: string) => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article: propArticle = PRIMARY_ARTICLE,
  onOpenCitation,
  onOpenQR,
  onSelectArticle,
  onNavigateJournal
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Dynamically resolve article from URL param if available, fallback to prop
  const article = id ? (CATALOG_ARTICLES.find((a) => a.id === id) || propArticle) : propArticle;

  const [abstractLang, setAbstractLang] = useState<'id' | 'en'>('id');
  const [citationFormat, setCitationFormat] = useState<'apa' | 'ieee' | 'chicago'>('apa');
  const [copiedDoi, setCopiedDoi] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [activeAuthorIndex, setActiveAuthorIndex] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleCopyDoi = () => {
    navigator.clipboard.writeText(`https://doi.org/${article.doi}`);
    setCopiedDoi(true);
    setTimeout(() => setCopiedDoi(false), 2200);
  };

  const getSidebarCitation = () => {
    if (citationFormat === 'apa') {
      return `${article.authors[0].name.split(',')[0]} et al. (${article.year}). ${article.title}. ${article.journalName}, ${article.volume}(${article.issue.replace('No. ', '')}), ${article.pages}. https://doi.org/${article.doi}`;
    } else if (citationFormat === 'ieee') {
      return `[1] ${article.authors[0].name.split(',')[0]} et al., "${article.title}," ${article.journalShort}, ${article.volume}, ${article.issue}, pp. ${article.pages}, ${article.month}. doi: ${article.doi}.`;
    } else {
      return `${article.authors[0].name}. "${article.title}." ${article.journalName} ${article.volume.replace('Vol. ', '')}, no. ${article.issue.replace('No. ', '')} (${article.year}): ${article.pages}.`;
    }
  };

  const handleCopySidebarCitation = () => {
    navigator.clipboard.writeText(getSidebarCitation());
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2200);
  };

  const handleDownloadPdf = () => {
    setDownloading(true);
    setTimeout(() => {
      const blob = new Blob([
        `%PDF-1.4\nJURNEXA SCIENTIFIC REPOSITORY\nArticle: ${article.title}\nAuthors: ${article.authors.map(a => a.name).join(', ')}\nDOI: https://doi.org/${article.doi}\nIndexed: SINTA 2 | DOAJ | Crossref\nChecksum SHA-256: ${article.sha256}`
      ], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${article.doi.replace(/\//g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloading(false);
    }, 800);
  };

  const relatedArticles = CATALOG_ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <div className="bg-white min-h-screen text-slate-900">
      {/* Top Breadcrumb Navigation */}
      <div className="bg-slate-50/80 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-slate-500 flex flex-wrap items-center gap-2">
          <Link to="/" className="hover:text-blue-600 transition-colors cursor-pointer">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/direktori-jurnal" className="hover:text-blue-600 transition-colors cursor-pointer">Direktori Jurnal</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link
            to="/direktori-jurnal"
            onClick={() => onNavigateJournal && onNavigateJournal('jtirk')}
            className="hover:text-blue-600 font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            {article.journalShort}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/artikel" className="hover:text-blue-600 text-slate-500 font-mono">
            {article.volume} {article.issue} ({article.year})
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          <span className="text-blue-600 font-medium truncate max-w-xs hidden sm:inline">
            {article.title}
          </span>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {/* Metadata pill row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              {article.sintaRank}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Akses Terbuka ({article.license})
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {article.journalShort} • {article.volume} {article.issue} ({article.month}) • Hlm. {article.pages}
            </span>
          </div>

          {/* Manuscript Title */}
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-[1.25] mb-3">
            {article.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-500 italic mb-6 font-serif">
            {article.titleEn}
          </p>

          {/* Authors List */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-3 mb-6">
            {article.authors.map((author, index) => (
              <div key={index} className="relative group">
                <button
                  onClick={() => setActiveAuthorIndex(activeAuthorIndex === index ? null : index)}
                  className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all px-3.5 py-1.5 rounded-full border cursor-pointer ${
                    activeAuthorIndex === index
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span>{author.name}</span>
                  <sup className="text-[10px] text-blue-600 font-bold">
                    {author.affiliationNumber}
                  </sup>
                  {author.isCorresponding && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono ml-0.5">
                      Penulis Korespondensi
                    </span>
                  )}
                </button>

                {/* Author Details Popover */}
                {activeAuthorIndex === index && (
                  <div className="absolute left-0 top-full mt-2 z-30 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 text-xs animate-fadeIn">
                    <div className="flex items-start justify-between pb-2 mb-2 border-b border-slate-100">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{author.name}</h4>
                        <p className="text-slate-500">{author.roleDescription || 'Peneliti Utama'}</p>
                      </div>
                      <button
                        onClick={() => setActiveAuthorIndex(null)}
                        className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded-full hover:bg-slate-100 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-2 text-slate-600">
                      <div className="flex items-start gap-2">
                        <Building className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span className="text-slate-700">{author.institution}</span>
                      </div>
                      {author.email && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-mono">Email:</span>
                          <a
                            href={`mailto:${author.email}`}
                            className="text-blue-600 hover:underline font-mono"
                          >
                            {author.email}
                          </a>
                        </div>
                      )}
                      {author.orcid && (
                        <div className="flex items-center gap-2">
                          <span className="text-[#a6ce39] font-bold font-mono">ORCID:</span>
                          <a
                            href={author.orcidUrl || `https://orcid.org/${author.orcid}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-700 hover:underline font-mono inline-flex items-center gap-1"
                          >
                            {author.orcid}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                      {author.scopusHIndex && (
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                          <span className="text-slate-500 font-medium">Scopus h-index:</span>
                          <span className="font-bold text-slate-900">{author.scopusHIndex}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Affiliation footnotes */}
          <div className="space-y-1 mb-6 text-xs text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            {article.authors.map((author, idx) => (
              <p key={idx}>
                <sup className="font-bold mr-1 text-slate-700">{author.affiliationNumber}</sup>
                <span>{author.institution}</span>
              </p>
            ))}
          </div>

          {/* DOI & Peer-Review Timeline Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pt-4 border-t border-slate-100">
            {/* DOI Box */}
            <div className="lg:col-span-5 flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
              <span className="text-xs font-bold text-slate-700 shrink-0">DOI:</span>
              <a
                href={`https://doi.org/${article.doi}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-blue-600 hover:underline truncate"
              >
                https://doi.org/{article.doi}
              </a>
              <button
                onClick={handleCopyDoi}
                className="ml-auto p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="Salin DOI"
              >
                {copiedDoi ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Peer Review Timeline */}
            <div className="lg:col-span-7 flex flex-wrap items-center justify-start lg:justify-end gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Masuk: <strong className="text-slate-700">{article.timeline.received}</strong></span>
              </div>
              <span className="text-slate-300">•</span>
              <div>
                <span>Revisi: <strong className="text-slate-700">{article.timeline.revised}</strong></span>
              </div>
              <span className="text-slate-300">•</span>
              <div>
                <span>Diterima: <strong className="text-slate-700">{article.timeline.accepted}</strong></span>
              </div>
              <span className="text-slate-300">•</span>
              <div>
                <span>Terbit: <strong className="text-emerald-700">{article.timeline.publishedOnline}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Strip */}
      <div className="sticky top-16 md:top-20 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Metrics summary */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <strong className="text-slate-900">{article.metrics.views.toLocaleString('id-ID')}</strong> Dilihat
            </span>
            <span className="flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <strong className="text-slate-900">{article.metrics.downloads.toLocaleString('id-ID')}</strong> Unduhan PDF
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <strong className="text-slate-900">{article.metrics.citations}</strong> Sitasi Crossref
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Download className={`w-3.5 h-3.5 text-blue-400 ${downloading ? 'animate-bounce' : ''}`} />
              <span>{downloading ? 'Menyiapkan...' : `Unduh PDF (${article.pdfSize})`}</span>
            </button>
            <button
              onClick={() => onOpenCitation(article)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-xs font-semibold transition-colors cursor-pointer"
            >
              <Quote className="w-3.5 h-3.5 text-slate-400" />
              <span>Sitasi</span>
            </button>
            <button
              onClick={() => onOpenQR(article)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-xs font-semibold transition-colors cursor-pointer"
              title="QR Code DOI"
            >
              <QrCode className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">QR DOI</span>
            </button>
            <button
              onClick={handleCopyDoi}
              className="inline-flex items-center gap-1.5 p-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-xs font-semibold transition-colors cursor-pointer"
              title="Bagikan Tautan"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 bg-slate-50/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Manuscript Reader (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Structured Abstract Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-slate-900">
                    {abstractLang === 'id' ? 'Abstrak Terstruktur' : 'Structured Abstract'}
                  </h2>
                </div>

                {/* Abstract Language Toggle */}
                <div className="flex items-center bg-slate-100/80 p-1 rounded-full border border-slate-200/60">
                  <button
                    onClick={() => setAbstractLang('id')}
                    className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      abstractLang === 'id'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Bahasa Indonesia
                  </button>
                  <button
                    onClick={() => setAbstractLang('en')}
                    className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      abstractLang === 'en'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Abstract Sections */}
              <div className="space-y-5 text-sm leading-relaxed text-slate-700">
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-blue-600 mb-1.5 font-['Plus_Jakarta_Sans']">
                    {abstractLang === 'id' ? '1. Latar Belakang & Masalah' : '1. Background & Problem'}
                  </h3>
                  <p>
                    {abstractLang === 'id'
                      ? article.abstractId.background
                      : article.abstractEn.background}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-blue-600 mb-1.5 font-['Plus_Jakarta_Sans']">
                    {abstractLang === 'id' ? '2. Metodologi Pendekatan' : '2. Methodology & Architecture'}
                  </h3>
                  <p>
                    {abstractLang === 'id'
                      ? article.abstractId.methodology
                      : article.abstractEn.methodology}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-blue-600 mb-1.5 font-['Plus_Jakarta_Sans']">
                    {abstractLang === 'id' ? '3. Temuan Kunci & Metrik Kinerja' : '3. Key Findings & Performance'}
                  </h3>
                  <p>
                    {abstractLang === 'id'
                      ? article.abstractId.keyFindings
                      : article.abstractEn.keyFindings}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-blue-600 mb-1.5 font-['Plus_Jakarta_Sans']">
                    {abstractLang === 'id' ? '4. Implikasi Lapang & Rekomendasi' : '4. Field Implications & Recommendations'}
                  </h3>
                  <p>
                    {abstractLang === 'id'
                      ? article.abstractId.implications
                      : article.abstractEn.implications}
                  </p>
                </div>
              </div>

              {/* Keywords */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  {abstractLang === 'id' ? 'Kata Kunci:' : 'Keywords:'}
                </span>
                {article.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-full transition-colors cursor-pointer font-['JetBrains_Mono'] border border-slate-200/60"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Manuscript Full Content Sections */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-8">
              {/* Section 1 */}
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  Pendahuluan
                </h3>
                <div className="text-sm leading-relaxed text-slate-700 space-y-3.5">
                  <p>
                    Jaringan jalan nasional merupakan tulang punggung konektivitas logistik dan pertumbuhan ekonomi antarkota di Indonesia. Dengan total panjang koridor melampaui 47.017 km, pemeliharaan kondisi perkerasan jalan menjadi tanggung jawab strategis Kementerian Pekerjaan Umum dan Perumahan Rakyat (PUPR) melalui Direktorat Jenderal Bina Marga.
                  </p>
                  <p>
                    Secara historis, penentuan indeks kondisi perkerasan jalan (Pavement Condition Index / PCI) dilakukan melalui survei manual atau kendaraan survei konvensional bertarif sewa tinggi. Kendala utama pendekatan ini meliputi keterbatasan frekuensi audit tahunan serta tingginya tingkat subjektivitas pengamat di lapangan. Pada iklim tropis Indonesia dengan intensitas curah hujan monsun tinggi, retak mikro berukuran sub-milimeter dapat tererosi menjadi lubang jalan (pothole) masif hanya dalam kurun waktu 7 hingga 14 hari bila terinfiltrasi air permukaan.
                  </p>
                  <p>
                    Kemunculan komputasi tepi (edge computing) yang dipadukan dengan arsitektur Vision Transformer terkuantisasi memberikan peluang baru untuk memproses citra resolusi tinggi secara otonom di atas armada kendaraan inspeksi jalan raya tanpa memerlukan konektivitas internet pita lebar yang stabil di wilayah pelosok.
                  </p>
                </div>
              </div>

              {/* Section 2: Methodology & System Architecture */}
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  Metodologi & Pipeline Arsitektur Tepi
                </h3>
                <div className="text-sm leading-relaxed text-slate-700 space-y-4">
                  <p>
                    Pipeline sistem dirancang untuk bekerja secara otonom pada modul komputasi tepi NVIDIA Jetson Orin Nano (8GB Unified LPDDR5). Sistem menerima aliran video 4K 60FPS dari modul kamera industri Sony IMX477 yang dipasang pada bumper depan kendaraan operasional pada ketinggian 1,2 meter dengan sudut kemiringan nadir 45 derajat.
                  </p>

                  {/* Interactive Flowchart Diagram - Dark accent matching reference */}
                  <div className="my-6 p-6 bg-slate-950 text-white rounded-3xl shadow-md border border-slate-800">
                    <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-800">
                      <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        DIAGRAM ALIR SISTEM (EDGE INFERENCE PIPELINE)
                      </span>
                      <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400">
                        Jetson Orin Nano • INT8 TensorRT
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
                      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                        <div className="text-cyan-300 font-mono font-bold text-[11px] mb-1">Tahap 1</div>
                        <div className="font-semibold text-white">Akuisisi Citra 4K</div>
                        <p className="text-[11px] text-slate-400 mt-1">Sony IMX477 @ 60FPS + GNSS RTK</p>
                      </div>
                      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                        <div className="text-cyan-300 font-mono font-bold text-[11px] mb-1">Tahap 2</div>
                        <div className="font-semibold text-white">Pre-Processing Tepi</div>
                        <p className="text-[11px] text-slate-400 mt-1">CLAHE Iluminasi + Bilateral Filter</p>
                      </div>
                      <div className="bg-slate-900 p-4 rounded-2xl border border-blue-500/50 bg-blue-950/20">
                        <div className="text-emerald-400 font-mono font-bold text-[11px] mb-1">Tahap 3</div>
                        <div className="font-semibold text-white">Inferensi Hybrid ViT</div>
                        <p className="text-[11px] text-slate-400 mt-1">TensorRT Engine INT8 (38.4 FPS)</p>
                      </div>
                      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                        <div className="text-cyan-300 font-mono font-bold text-[11px] mb-1">Tahap 4</div>
                        <div className="font-semibold text-white">Telemetri GeoJSON</div>
                        <p className="text-[11px] text-slate-400 mt-1">Koordinat GPS + Snapshot Bounding Box</p>
                      </div>
                    </div>
                  </div>

                  {/* Mathematical Formulation */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                      Formulasi Optimasi Fungsi Rugi (Loss Function):
                    </p>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-slate-900 text-center overflow-x-auto">
                      {"\\mathcal{L}_{total} = \\alpha \\mathcal{L}_{Focal}(p_t) + \\beta \\mathcal{L}_{DIoU}(b, \\hat{b}) + \\gamma \\mathcal{L}_{Attention}(\\Omega)"}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2.5">
                      Di mana <code className="text-blue-600 font-mono">\alpha=1.0</code>, <code className="text-blue-600 font-mono">\beta=2.5</code>, dan pembobotan <code className="text-blue-600 font-mono">\gamma=0.35</code> dipilih secara empiris untuk meminimalisasi deteksi palsu akibat bayangan pepohonan di sepanjang koridor Pantura.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3: Benchmark Results */}
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  Hasil Eksperimen & Analisis Metrik Kinerja
                </h3>
                <div className="text-sm leading-relaxed text-slate-700 space-y-4">
                  <p>
                    Pengujian komprehensif dilakukan pada koridor jalan nasional sepanjang 120 km (Segmen Cirebon–Tegal) di bawah berbagai skenario cuaca tropis (terik matahari penuh, berawan, dan kondisi pasca-hujan basah).
                  </p>

                  {/* Benchmark Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Platform Hardware</th>
                          <th className="py-3 px-4">Presisi Kuantisasi</th>
                          <th className="py-3 px-4">mAP@50 (%)</th>
                          <th className="py-3 px-4">FPS</th>
                          <th className="py-3 px-4">Konsumsi Daya</th>
                          <th className="py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-sans font-medium text-slate-800">Cloud Baseline (Xeon + RTX 4090)</td>
                          <td className="py-2.5 px-4">FP32</td>
                          <td className="py-2.5 px-4">93.2%</td>
                          <td className="py-2.5 px-4">72.0</td>
                          <td className="py-2.5 px-4">450 W</td>
                          <td className="py-2.5 px-4 font-sans text-amber-700 font-semibold">Non-Edge</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-sans font-medium text-slate-800">Jetson Xavier NX 16GB</td>
                          <td className="py-2.5 px-4">FP16</td>
                          <td className="py-2.5 px-4">88.7%</td>
                          <td className="py-2.5 px-4">21.5</td>
                          <td className="py-2.5 px-4">15.0 W</td>
                          <td className="py-2.5 px-4 font-sans text-slate-500">Baseline Tepi</td>
                        </tr>
                        <tr className="bg-emerald-50/60 hover:bg-emerald-50">
                          <td className="py-2.5 px-4 font-sans font-bold text-emerald-950">
                            Jetson Orin Nano 8GB (Usulan Kami)
                          </td>
                          <td className="py-2.5 px-4 text-emerald-800 font-bold">INT8 (TensorRT)</td>
                          <td className="py-2.5 px-4 text-emerald-800 font-bold">91.4%</td>
                          <td className="py-2.5 px-4 text-emerald-800 font-bold">38.4</td>
                          <td className="py-2.5 px-4 text-emerald-800 font-bold">14.2 W</td>
                          <td className="py-2.5 px-4 font-sans text-emerald-700 font-bold">Optimal Lapang</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Defect Distribution Visual Bar */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3.5">
                      Distribusi Sampel Kerusakan yang Terdeteksi pada Validasi Lapangan:
                    </h4>
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-600 mb-1">
                          <span>Retak Memanjang (Longitudinal Cracks)</span>
                          <span className="font-mono font-semibold">42% (7.736 sampel)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-600 mb-1">
                          <span>Retak Buaya (Alligator / Fatigue Cracks)</span>
                          <span className="font-mono font-semibold">28% (5.157 sampel)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: '28%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-600 mb-1">
                          <span>Lubang Jalan Kritis (Critical Potholes)</span>
                          <span className="font-mono font-semibold">18% (3.315 sampel)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-amber-600 h-full rounded-full" style={{ width: '18%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-600 mb-1">
                          <span>Alur Roda & Penurunan Permukaan (Rutting & Depression)</span>
                          <span className="font-mono font-semibold">12% (2.212 sampel)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: '12%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Kesimpulan */}
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  Kesimpulan & Arah Riset Mendatang
                </h3>
                <div className="text-sm leading-relaxed text-slate-700 space-y-3.5">
                  <p>
                    Implementasi komputasi tepi dengan kuantisasi INT8 membuktikan bahwa sistem kecerdasan artifisial dapat berjalan secara mandiri dan akurat pada perangkat komputasi bergerak tanpa memerlukan koneksi cloud berbiaya transmisi tinggi. Metrik presisi 91,4% pada laju 38,4 FPS memenuhi standar operasional kendaraan survei jalan nasional pada batas kecepatan dinas 60 km/jam.
                  </p>
                  <p>
                    Riset lanjutan difokuskan pada integrasi LiDAR 3D miniatur untuk mengukur kedalaman volumetrik retak mikro secara presisi guna mengestimasi tonase aspal campuran panas yang dibutuhkan sebelum tim preservasi jalan diterjunkan ke lokasi.
                  </p>
                </div>
              </div>

              {/* Section 5: Funding Acknowledgement */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Ucapan Terima Kasih & Pendanaan Riset
                </h4>
                <p className="leading-relaxed">
                  Penelitian ini didanai secara penuh oleh Hibah Penelitian Fundamental Reguler Kementerian Pendidikan Tinggi, Sains, dan Teknologi Republik Indonesia (BIMA Kemendiktisaintek) Tahun Anggaran 2024–2025 melalui Kontrak Kerja Sama No. <strong className="text-slate-900 font-mono">142/E5/PG.02.00.PT/2024</strong>. Penulis juga mengucapkan terima kasih kepada Balai Besar Pelaksanaan Jalan Nasional (BBPJN) DKI Jakarta–Jawa Barat atas fasilitasi perizinan uji armada survei lapang.
                </p>
              </div>

              {/* Section 6: Data Availability Statement */}
              <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200/80 text-xs text-slate-700 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-700 text-xs uppercase tracking-wider mb-1">
                    Pernyataan Ketersediaan Data & Kode Sumber
                  </h4>
                  <p className="leading-relaxed">
                    Dataset citra jalanan tropis teranotasi (ID-RoadDefect-2024) serta konfigurasi build model TensorRT telah didepositkan pada repositori terbuka Zenodo di bawah lisensi Creative Commons Attribution 4.0:
                  </p>
                  <a
                    href="https://doi.org/10.5281/zenodo.1084219"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-600 hover:underline font-mono font-bold mt-2 text-xs"
                  >
                    https://doi.org/10.5281/zenodo.1084219
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Section 7: References */}
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Daftar Pustaka ({ARTICLE_REFERENCES.length})
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">Standar Sitasi IEEE</span>
                </div>
                <ol className="space-y-3.5 text-xs leading-relaxed text-slate-600">
                  {ARTICLE_REFERENCES.map((ref) => (
                    <li key={ref.num} className="flex gap-2.5">
                      <span className="font-bold text-slate-800 shrink-0 font-mono">[{ref.num}]</span>
                      <div>
                        <span>{ref.citation}</span>
                        {ref.doi && (
                          <div className="mt-1">
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline font-mono inline-flex items-center gap-1"
                            >
                              doi:{ref.doi}
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* SHA-256 Checksum Card */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-700">Verifikasi Integritas Naskah (SHA-256):</span>
                </div>
                <code className="text-[11px] font-mono text-slate-600 truncate max-w-sm">
                  {article.sha256}
                </code>
              </div>
            </div>
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Instant Citation Widget */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Quote className="w-4 h-4 text-blue-600" />
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-slate-900 text-sm">Sitasi Instan</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Salin Cepat</span>
              </div>

              {/* Format Switcher */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-full mb-3.5">
                <button
                  onClick={() => setCitationFormat('apa')}
                  className={`py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    citationFormat === 'apa'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  APA 7th
                </button>
                <button
                  onClick={() => setCitationFormat('ieee')}
                  className={`py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    citationFormat === 'ieee'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  IEEE
                </button>
                <button
                  onClick={() => setCitationFormat('chicago')}
                  className={`py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    citationFormat === 'chicago'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Chicago
                </button>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs font-mono text-slate-700 leading-relaxed break-words mb-3.5">
                {getSidebarCitation()}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySidebarCitation}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedCitation ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-300" />
                      <span>Salin Sitasi</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => onOpenCitation(article)}
                  className="py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                  title="Buka Generator Sitasi Lengkap (.BIB / .RIS)"
                >
                  Format Lain...
                </button>
              </div>
            </div>

            {/* Journal Identity Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm font-mono">
                    {article.journalShort}
                  </div>
                  <div>
                    <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-slate-900 text-sm leading-snug">
                      {article.journalName}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono">e-ISSN: 2580-8737</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 py-4 border-y border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Akreditasi:</span>
                  <span className="font-bold text-emerald-700">{article.sintaRank} (Kemendiktisaintek)</span>
                </div>
                <div className="flex justify-between">
                  <span>Frekuensi Terbit:</span>
                  <span className="font-medium text-slate-800">4 Nomor / Tahun</span>
                </div>
                <div className="flex justify-between">
                  <span>Penerbit Konsorsium:</span>
                  <span className="font-medium text-slate-800">Institut Rekayasa & Komputer</span>
                </div>
                <div className="flex justify-between">
                  <span>Pengindeksan:</span>
                  <span className="font-medium text-slate-800">DOAJ, Crossref, Google Scholar</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onNavigateJournal) onNavigateJournal('jtirk');
                  navigate('/direktori-jurnal');
                }}
                className="w-full mt-4 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-full text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
              >
                <span>Lihat Profil Jurnal & Arsip</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </button>
            </div>

            {/* Quick In-Page Table of Contents */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-slate-900 text-sm mb-3.5 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                Navigasi Bagian Naskah
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2.5 hover:text-blue-600 cursor-pointer transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span>Abstrak Terstruktur</span>
                </li>
                <li className="flex items-center gap-2.5 hover:text-blue-600 cursor-pointer transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span>1. Pendahuluan & Urgensi Riset</span>
                </li>
                <li className="flex items-center gap-2.5 hover:text-blue-600 cursor-pointer transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span>2. Metodologi & Pipeline Tepi (Orin Nano)</span>
                </li>
                <li className="flex items-center gap-2.5 hover:text-blue-600 cursor-pointer transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span>3. Hasil Eksperimen & Analisis mAP</span>
                </li>
                <li className="flex items-center gap-2.5 hover:text-blue-600 cursor-pointer transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span>4. Kesimpulan & Rekomendasi</span>
                </li>
                <li className="flex items-center gap-2.5 hover:text-blue-600 cursor-pointer transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span>5. Pernyataan Pendanaan BIMA</span>
                </li>
                <li className="flex items-center gap-2.5 hover:text-blue-600 cursor-pointer transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span>6. Daftar Pustaka (10 Referensi)</span>
                </li>
              </ul>
            </div>

            {/* Related Articles in this Issue */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-slate-900 text-sm mb-3.5">
                Artikel Terkait dalam Edisi Ini
              </h3>
              <div className="space-y-3">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      if (onSelectArticle) onSelectArticle(rel);
                      navigate(`/artikel/${rel.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] font-bold text-blue-600 font-mono block mb-1">
                      {rel.journalShort} • {rel.volume}
                    </span>
                    <h5 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-slate-800 group-hover:text-blue-600 line-clamp-2 leading-snug">
                      {rel.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-1 truncate">
                      {rel.authors[0].name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Access & License Stamp */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Lisensi Distribusi Naskah</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Artikel ini didistribusikan di bawah ketentuan lisensi internasional <strong>Creative Commons Attribution 4.0 International (CC BY 4.0)</strong>, yang mengizinkan penggunaan, distribusi, dan reproduksi tanpa batas dalam media apa pun, asalkan karya asli dikutip dengan tepat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
