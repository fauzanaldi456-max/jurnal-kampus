export type PageView =
  | 'beranda'
  | 'direktori-jurnal'
  | 'artikel'
  | 'panduan-publikasi'
  | 'tentang-kami'
  | 'artikel-detail'
  | 'masuk'
  | 'daftar';

export interface Author {
  name: string;
  affiliationNumber: string;
  isCorresponding?: boolean;
  email?: string;
  orcid?: string;
  orcidUrl?: string;
  institution: string;
  scopusHIndex?: number;
  roleDescription?: string;
}

export interface Article {
  id: string;
  title: string;
  titleEn: string;
  journalName: string;
  journalShort: string;
  volume: string;
  issue: string;
  year: number;
  month: string;
  pages: string;
  doi: string;
  sintaRank: string;
  isOpenAccess: boolean;
  license: string;
  abstractId: {
    background: string;
    methodology: string;
    keyFindings: string;
    implications: string;
  };
  abstractEn: {
    background: string;
    methodology: string;
    keyFindings: string;
    implications: string;
  };
  keywords: string[];
  authors: Author[];
  timeline: {
    received: string;
    revised: string;
    accepted: string;
    publishedOnline: string;
  };
  metrics: {
    views: number;
    downloads: number;
    citations: number;
    plumX: number;
  };
  pdfSize: string;
  sha256: string;
  discipline: string;
  referencesCount: number;
}

export interface Journal {
  id: string;
  title: string;
  shortName: string;
  eIssn: string;
  pIssn: string;
  sintaGrade: number; // 1 to 5
  frequency: string;
  publisher: string;
  discipline: string;
  acceptanceRate: string;
  totalArticles: number;
  currentIssue: string;
  description: string;
  isDoajIndexed: boolean;
  isCopeMember: boolean;
}

export interface EditorialMember {
  id: string;
  name: string;
  role: string;
  subRole: string;
  category: string;
  institution: string;
  bio: string;
  orcid: string;
  orcidUrl: string;
  scopusHIndex?: string;
  sintaScore?: string;
  imageUrl: string;
  ethicalStandard?: string;
}

export interface PartnerFaculty {
  id: string;
  code: string;
  cluster: string;
  name: string;
  description: string;
  icon: string;
}

export interface SubmissionDraft {
  targetJournal: string;
  articleType: string;
  title: string;
  abstract: string;
  keywords: string;
  discipline: string;
  primaryAuthorName: string;
  primaryAuthorEmail: string;
  primaryAuthorInstitution: string;
  primaryAuthorOrcid: string;
  coAuthors: string;
  similarityScore: number;
  fileName: string;
  fileSize: string;
  agreedToOriginality: boolean;
  agreedToCope: boolean;
}

export type UserRole = 'author' | 'editor' | 'reviewer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  institution?: string;
  orcid?: string;
  phone?: string;
  bio?: string;
  created_at?: string;
}

export type SubmissionStatus =
  | 'SUBMITTED'
  | 'TECHNICAL_CHECK'
  | 'IN_REVIEW'
  | 'REVISION_REQUIRED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'IN_PRODUCTION'
  | 'PUBLISHED';
