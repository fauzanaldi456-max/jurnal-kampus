export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL, -- 'author', 'editor', 'reviewer', 'admin'
  institution TEXT,
  orcid TEXT,
  phone TEXT,
  bio TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS institutions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  city TEXT,
  country TEXT DEFAULT 'Indonesia',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS journals (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  abbreviation TEXT,
  issn_online TEXT,
  issn_print TEXT,
  description TEXT,
  scope TEXT,
  publisher TEXT,
  institution_id TEXT,
  contact_email TEXT,
  article_count INTEGER DEFAULT 0,
  citation_count INTEGER DEFAULT 0,
  sinta_accreditation TEXT,
  doi_prefix TEXT DEFAULT '10.5281/cendraloka',
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (institution_id) REFERENCES institutions(id)
);

CREATE TABLE IF NOT EXISTS journal_editors (
  id TEXT PRIMARY KEY,
  journal_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role_in_journal TEXT DEFAULT 'Section Editor',
  assigned_at TEXT NOT NULL,
  FOREIGN KEY (journal_id) REFERENCES journals(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  submission_number TEXT UNIQUE NOT NULL,
  journal_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  keywords TEXT,
  category TEXT,
  file_path TEXT,
  file_name TEXT,
  file_size INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'SUBMITTED', 
  -- Statuses: 'SUBMITTED', 'TECHNICAL_CHECK', 'IN_REVIEW', 'REVISION_REQUIRED', 'ACCEPTED', 'DECLINED', 'IN_PRODUCTION', 'PUBLISHED'
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (journal_id) REFERENCES journals(id),
  FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS submission_authors (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  institution TEXT,
  orcid TEXT,
  is_corresponding INTEGER DEFAULT 0,
  order_num INTEGER DEFAULT 1,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS submission_files (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'manuscript', 'supplementary', 'revision', 'blind_manuscript'
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  uploaded_by TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  uploaded_at TEXT NOT NULL,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS submission_status_history (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  comment TEXT,
  changed_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS review_assignments (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  reviewer_id TEXT NOT NULL,
  assigned_by TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'INVITED', -- 'INVITED', 'ACCEPTED', 'DECLINED', 'COMPLETED'
  due_date TEXT NOT NULL,
  recommendation TEXT, -- 'ACCEPT', 'MINOR_REVISIONS', 'MAJOR_REVISIONS', 'REJECT'
  review_notes TEXT,
  confidential_notes TEXT,
  created_at TEXT NOT NULL,
  completed_at TEXT,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id),
  FOREIGN KEY (assigned_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS review_reports (
  id TEXT PRIMARY KEY,
  assignment_id TEXT NOT NULL UNIQUE,
  score REAL DEFAULT 0,
  evaluation_rubric TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (assignment_id) REFERENCES review_assignments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS editorial_decisions (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  editor_id TEXT NOT NULL,
  decision TEXT NOT NULL, -- 'ACCEPT', 'REVISION', 'DECLINE'
  decision_notes TEXT NOT NULL,
  notify_author INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (editor_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS revision_responses (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  round INTEGER DEFAULT 1,
  response_letter TEXT NOT NULL,
  file_path TEXT,
  submitted_at TEXT NOT NULL,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS journal_issues (
  id TEXT PRIMARY KEY,
  journal_id TEXT NOT NULL,
  volume INTEGER NOT NULL,
  issue INTEGER NOT NULL,
  year INTEGER NOT NULL,
  title TEXT,
  publication_date TEXT,
  is_current INTEGER DEFAULT 0,
  FOREIGN KEY (journal_id) REFERENCES journals(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS published_articles (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL UNIQUE,
  issue_id TEXT NOT NULL,
  doi TEXT UNIQUE NOT NULL,
  pages TEXT,
  published_date TEXT NOT NULL,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (issue_id) REFERENCES journal_issues(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details TEXT,
  ip_address TEXT,
  created_at TEXT NOT NULL
);

-- Indices for rapid performance and query optimization
CREATE INDEX IF NOT EXISTS idx_submissions_journal ON submissions(journal_id);
CREATE INDEX IF NOT EXISTS idx_submissions_author ON submissions(author_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_review_sub ON review_assignments(submission_id);
CREATE INDEX IF NOT EXISTS idx_review_rev ON review_assignments(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
`;
