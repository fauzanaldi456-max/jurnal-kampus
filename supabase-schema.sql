-- ====================================================================
-- CENDRALOKA JOURNAL MANAGEMENT SYSTEM
-- SUPABASE POSTGRESQL SCHEMA MIGRATION
-- ====================================================================

-- 1. BASE TABLES (IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.institutions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  city TEXT,
  country TEXT DEFAULT 'Indonesia',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'author',
  institution TEXT,
  orcid TEXT,
  phone TEXT,
  bio TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.journals (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  abbreviation TEXT,
  issn_online TEXT,
  issn_print TEXT,
  description TEXT,
  scope TEXT,
  publisher TEXT,
  institution_id TEXT REFERENCES public.institutions(id) ON DELETE SET NULL,
  contact_email TEXT,
  article_count INTEGER DEFAULT 0,
  citation_count INTEGER DEFAULT 0,
  sinta_accreditation TEXT,
  doi_prefix TEXT DEFAULT '10.5281/cendraloka',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.journal_editors (
  id TEXT PRIMARY KEY,
  journal_id TEXT NOT NULL REFERENCES public.journals(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role_in_journal TEXT DEFAULT 'Section Editor',
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.submissions (
  id TEXT PRIMARY KEY,
  submission_number TEXT UNIQUE NOT NULL,
  journal_id TEXT NOT NULL REFERENCES public.journals(id),
  author_id TEXT NOT NULL REFERENCES public.users(id),
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  keywords TEXT,
  category TEXT,
  file_path TEXT,
  file_name TEXT,
  file_size BIGINT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'SUBMITTED', 
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.submission_authors (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  institution TEXT,
  orcid TEXT,
  is_corresponding BOOLEAN DEFAULT FALSE,
  order_num INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.submission_files (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  file_type TEXT NOT NULL DEFAULT 'manuscript',
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  uploaded_by TEXT NOT NULL REFERENCES public.users(id),
  version INTEGER DEFAULT 1,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.submission_status_history (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  comment TEXT,
  changed_by TEXT NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.review_assignments (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  reviewer_id TEXT NOT NULL REFERENCES public.users(id),
  assigned_by TEXT NOT NULL REFERENCES public.users(id),
  status TEXT NOT NULL DEFAULT 'INVITED',
  due_date TIMESTAMPTZ NOT NULL,
  recommendation TEXT,
  review_notes TEXT,
  confidential_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.review_reports (
  id TEXT PRIMARY KEY,
  assignment_id TEXT NOT NULL UNIQUE REFERENCES public.review_assignments(id) ON DELETE CASCADE,
  score NUMERIC DEFAULT 0,
  evaluation_rubric JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.editorial_decisions (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  editor_id TEXT NOT NULL REFERENCES public.users(id),
  decision TEXT NOT NULL,
  decision_notes TEXT NOT NULL,
  notify_author BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.revision_responses (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES public.users(id),
  round INTEGER DEFAULT 1,
  response_letter TEXT NOT NULL,
  file_path TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.journal_issues (
  id TEXT PRIMARY KEY,
  journal_id TEXT NOT NULL REFERENCES public.journals(id) ON DELETE CASCADE,
  volume INTEGER NOT NULL,
  issue INTEGER NOT NULL,
  year INTEGER NOT NULL,
  title TEXT,
  publication_date TIMESTAMPTZ,
  is_current BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.published_articles (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL UNIQUE REFERENCES public.submissions(id) ON DELETE CASCADE,
  issue_id TEXT NOT NULL REFERENCES public.journal_issues(id) ON DELETE CASCADE,
  doi TEXT UNIQUE NOT NULL,
  pages TEXT,
  published_date TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Memberikan akses baca & tulis untuk anon & authenticated
-- ====================================================================

ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_editors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.published_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Buat policies open access (SELECT, INSERT, UPDATE, DELETE) untuk memfasilitasi API & Frontend
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN 
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public access on %I" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public access on %I" ON public.%I FOR ALL USING (true) WITH CHECK (true);', tbl, tbl);
  END LOOP;
END $$;
