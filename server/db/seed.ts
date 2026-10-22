import bcrypt from 'bcryptjs';
import { getDb, exec, queryOne, run } from './database.js';
import { SCHEMA_SQL } from './schema.js';

export async function initAndSeed(): Promise<void> {
  await getDb();

  // Execute schema creation
  exec(SCHEMA_SQL);

  // Check if users already seeded
  const existingUser = queryOne('SELECT id FROM users LIMIT 1;');
  if (existingUser) {
    console.log('Database already initialized and seeded.');
    return;
  }

  console.log('Seeding initial data into Cendraloka database...');

  const defaultPasswordHash = bcrypt.hashSync('Password123!', 10);
  const now = new Date().toISOString();

  // 1. Seed Institutions
  const institutions = [
    { id: 'inst-1', name: 'Universitas Padjadjaran', code: 'UNPAD', city: 'Bandung', country: 'Indonesia' },
    { id: 'inst-2', name: 'Institut Teknologi Bandung', code: 'ITB', city: 'Bandung', country: 'Indonesia' },
    { id: 'inst-3', name: 'Universitas Indonesia', code: 'UI', city: 'Depok', country: 'Indonesia' },
    { id: 'inst-4', name: 'Universitas Gadjah Mada', code: 'UGM', city: 'Yogyakarta', country: 'Indonesia' },
    { id: 'inst-5', name: 'Konsorsium Jurnal Ilmiah Cendraloka', code: 'CENDRA', city: 'Jakarta', country: 'Indonesia' },
  ];

  for (const inst of institutions) {
    run(
      'INSERT INTO institutions (id, name, code, city, country, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [inst.id, inst.name, inst.code, inst.city, inst.country, now]
    );
  }

  // 2. Seed Users
  const users = [
    {
      id: 'usr-author-1',
      email: 'penulis.utama@universitas.ac.id',
      password_hash: defaultPasswordHash,
      full_name: 'Dr. Muhammad Fauzan, S.T., M.Kom.',
      role: 'author',
      institution: 'Universitas Padjadjaran',
      orcid: '0000-0002-1825-0097',
      phone: '+6281234567890',
      bio: 'Dosen dan peneliti spesialis Rekayasa Perangkat Lunak, Natural Language Processing, dan Sistem Cerdas.',
    },
    {
      id: 'usr-editor-1',
      email: 'editor.in.chief@cendraloka.ac.id',
      password_hash: defaultPasswordHash,
      full_name: 'Prof. Dr. Ir. Hendra Gunawan, M.T.',
      role: 'editor',
      institution: 'Institut Teknologi Bandung',
      orcid: '0000-0001-9982-1204',
      phone: '+6281198765432',
      bio: 'Ketua Dewan Editor Konsorsium Cendraloka dan Guru Besar Bidang Sistem Informasi.',
    },
    {
      id: 'usr-reviewer-1',
      email: 'mitra.bestari@cendraloka.ac.id',
      password_hash: defaultPasswordHash,
      full_name: 'Dr. Maya Anindita, M.Sc.',
      role: 'reviewer',
      institution: 'Universitas Indonesia',
      orcid: '0000-0003-4412-8871',
      phone: '+6281355443322',
      bio: 'Mitra Bestari Senior bidang Algoritma Pembelajaran Mesin dan Bioinformatika Terapan.',
    },
    {
      id: 'usr-admin-1',
      email: 'admin@cendraloka.ac.id',
      password_hash: defaultPasswordHash,
      full_name: 'Administrator Portal Cendraloka',
      role: 'admin',
      institution: 'Konsorsium Jurnal Ilmiah Cendraloka',
      orcid: '0000-0002-0000-1111',
      phone: '+6281000112233',
      bio: 'Super Administrator Pengelola Sistem dan Infrastruktur Portal Publikasi Ilmiah.',
    },
  ];

  for (const u of users) {
    run(
      `INSERT INTO users (id, email, password_hash, full_name, role, institution, orcid, phone, bio, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      [u.id, u.email, u.password_hash, u.full_name, u.role, u.institution, u.orcid, u.phone, u.bio, now, now]
    );

    run(
      'INSERT INTO user_roles (id, user_id, role, created_at) VALUES (?, ?, ?, ?)',
      [`role-${u.id}`, u.id, u.role, now]
    );
  }

  // 3. Seed Journals
  const journals = [
    {
      id: 'jrn-1',
      slug: 'jurnal-rekayasa-informatika-ai',
      title: 'Jurnal Rekayasa Informatika & Kecerdasan Buatan',
      abbreviation: 'J. Rekayasa Inform. AI',
      issn_online: '2775-8910',
      issn_print: '2775-8902',
      description: 'Publikasi berkala ilmiah peer-reviewed yang mencakup arsitektur komputasi modern, rekayasa perangkat lunak berskala besar, machine learning, dan model bahasa alami.',
      scope: 'Informatika, Kecerdasan Buatan, Rekayasa Perangkat Lunak, Data Science',
      publisher: 'Konsorsium Sains Komputer Nusantara',
      institution_id: 'inst-1',
      contact_email: 'jria@cendraloka.ac.id',
      article_count: 48,
      citation_count: 312,
      sinta_accreditation: 'SINTA 2',
      doi_prefix: '10.5281/jria',
    },
    {
      id: 'jrn-2',
      slug: 'jurnal-manajemen-tata-kelola-publik',
      title: 'Jurnal Tata Kelola & Kebijakan Publik',
      abbreviation: 'J. Tata Kelola Kebijak. Publik',
      issn_online: '2810-1234',
      issn_print: '2810-1226',
      description: 'Forum ilmiah multidisiplin untuk studi kebijakan publik berbasis bukti, reformasi birokrasi, tata kelola pemerintahan digital, dan kebijakan ekonomi makro.',
      scope: 'Administrasi Publik, Kebijakan Publik, Manajemen Pemerintahan',
      publisher: 'Fakultas Ilmu Sosial & Ilmu Politik Konsorsium',
      institution_id: 'inst-3',
      contact_email: 'jtkkp@cendraloka.ac.id',
      article_count: 36,
      citation_count: 189,
      sinta_accreditation: 'SINTA 2',
      doi_prefix: '10.5281/jtkkp',
    },
    {
      id: 'jrn-3',
      slug: 'jurnal-komunikasi-transformasi-digital',
      title: 'Jurnal Transformasi Digital & Media',
      abbreviation: 'J. Transform. Digit. Media',
      issn_online: '2920-5678',
      issn_print: '2920-566X',
      description: 'Menyajikan kajian kritis tentang dinamika komunikasi digital, literasi kecerdasan buatan di media massa, etika algoritma, dan budaya siber kontemporer.',
      scope: 'Ilmu Komunikasi, Studi Media, Transformasi Digital',
      publisher: 'Asosiasi Peneliti Media Digital Nusantara',
      institution_id: 'inst-4',
      contact_email: 'jtdm@cendraloka.ac.id',
      article_count: 29,
      citation_count: 142,
      sinta_accreditation: 'SINTA 3',
      doi_prefix: '10.5281/jtdm',
    },
    {
      id: 'jrn-4',
      slug: 'jurnal-pendidikan-sains-teknologi',
      title: 'Jurnal Inovasi Pembelajaran Sains & Teknologi',
      abbreviation: 'J. Inov. Pembelaj. Sains Teknol.',
      issn_online: '2988-7712',
      issn_print: '2988-7704',
      description: 'Kajian empiris dan metodologis mengenai pedagogi STEM terintegrasi, pemanfaatan laboratorium virtual, dan kurikulum adaptif masa depan.',
      scope: 'Pendidikan Vokasi, Teknologi Pendidikan, Pedagogi STEM',
      publisher: 'Lembaga Pengembangan Kurikulum Konsorsium',
      institution_id: 'inst-2',
      contact_email: 'jipst@cendraloka.ac.id',
      article_count: 22,
      citation_count: 98,
      sinta_accreditation: 'SINTA 3',
      doi_prefix: '10.5281/jipst',
    },
  ];

  for (const j of journals) {
    run(
      `INSERT INTO journals (id, slug, title, abbreviation, issn_online, issn_print, description, scope, publisher, institution_id, contact_email, article_count, citation_count, sinta_accreditation, doi_prefix, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)`,
      [j.id, j.slug, j.title, j.abbreviation, j.issn_online, j.issn_print, j.description, j.scope, j.publisher, j.institution_id, j.contact_email, j.article_count, j.citation_count, j.sinta_accreditation, j.doi_prefix, now, now]
    );

    // Assign editor to all journals
    run(
      'INSERT INTO journal_editors (id, journal_id, user_id, role_in_journal, assigned_at) VALUES (?, ?, ?, ?, ?)',
      [`je-${j.id}`, j.id, 'usr-editor-1', 'Editor-in-Chief', now]
    );
  }

  // 4. Seed Submissions for Author (representing different realistic lifecycle statuses)
  const sampleSubmissions = [
    {
      id: 'sub-001',
      submission_number: 'SUB-2025-001',
      journal_id: 'jrn-1',
      author_id: 'usr-author-1',
      title: 'Optimalisasi Model Transformer Ringan untuk Analisis Sentimen Opini Publik Berbahasa Indonesia pada Dokumen Kebijakan',
      abstract: 'Penelitian ini mengkaji efisiensi komputasi dari arsitektur distilled transformer yang dioptimasi khusus untuk klasifikasi sentimen wacana regulasi publik dalam Bahasa Indonesia...',
      keywords: 'Distilled Transformer, Deep Learning, Natural Language Processing, Kebijakan Publik',
      category: 'Original Research',
      file_path: '/uploads/manuscript-sub-001.pdf',
      file_name: 'Naskah_Lengkap_Transformer_Optimalisasi.pdf',
      file_size: 1420500,
      status: 'IN_REVIEW',
    },
    {
      id: 'sub-002',
      submission_number: 'SUB-2025-002',
      journal_id: 'jrn-1',
      author_id: 'usr-author-1',
      title: 'Implementasi Zero-Knowledge Rollups pada Tata Kelola Identitas Akademik Terdesentralisasi Antar-Perguruan Tinggi',
      abstract: 'Menghadapi fragmentasi kredensial akademik, paper ini mengusulkan framework privasi terverifikasi menggunakan ZK-Rollups yang beroperasi di lapisan kedua jaringan konsorsium perguruan tinggi...',
      keywords: 'Blockchain, Zero-Knowledge Proofs, Kredensial Digital, Tata Kelola Kampus',
      category: 'System Architecture',
      file_path: '/uploads/manuscript-sub-002.pdf',
      file_name: 'ZK_Rollups_Academic_Identity.pdf',
      file_size: 2150800,
      status: 'TECHNICAL_CHECK',
    },
    {
      id: 'sub-003',
      submission_number: 'SUB-2025-003',
      journal_id: 'jrn-2',
      author_id: 'usr-author-1',
      title: 'Evaluasi Dampak Kebijakan Satu Data Terhadap Efisiensi Pelayanan Publik Daerah: Studi Komparatif 5 Provinsi',
      abstract: 'Penyelarasan standar interoperabilitas metadata Satu Data Indonesia di tingkat daerah menghadapi hambatan koordinasi multisektoral...',
      keywords: 'Satu Data Indonesia, Interoperabilitas, Kebijakan Publik, Efisiensi Tata Kelola',
      category: 'Policy Review',
      file_path: '/uploads/manuscript-sub-003.pdf',
      file_name: 'Evaluasi_Satu_Data_Provinsi.pdf',
      file_size: 980400,
      status: 'REVISION_REQUIRED',
    },
    {
      id: 'sub-004',
      submission_number: 'SUB-2025-004',
      journal_id: 'jrn-1',
      author_id: 'usr-author-1',
      title: 'Pendeteksian Intrusi Jaringan Sensor Nirkabel Menggunakan Ensemble Random Forest Berbasis Dynamic Feature Weighting',
      abstract: 'Keamanan pada node sensor berdaya rendah membutuhkan model pendeteksi anomali yang tangguh terhadap perubahan distribusi data trafik secara tiba-tiba...',
      keywords: 'Wireless Sensor Networks, Intrusion Detection, Ensemble Learning, Cyber Defense',
      category: 'Original Research',
      file_path: '/uploads/manuscript-sub-004.pdf',
      file_name: 'WSN_Intrusion_Detection_Ensemble.pdf',
      file_size: 1890200,
      status: 'ACCEPTED',
    },
    {
      id: 'sub-005',
      submission_number: 'SUB-2025-005',
      journal_id: 'jrn-3',
      author_id: 'usr-author-1',
      title: 'Dinamika Literasi Algoritmik dan Fenomena Echo Chamber pada Generasi Z dalam Ekosistem Konten Pendek',
      abstract: 'Penyebaran informasi melalui mekanisme feed rekomendasi personal mengubah cara konsumsi informasi audiens muda...',
      keywords: 'Literasi Algoritma, Echo Chamber, Media Sosial, Komunikasi Digital',
      category: 'Communication Studies',
      file_path: '/uploads/manuscript-sub-005.pdf',
      file_name: 'Dinamika_Literasi_EchoChamber.pdf',
      file_size: 1240100,
      status: 'PUBLISHED',
    },
  ];

  for (const s of sampleSubmissions) {
    run(
      `INSERT INTO submissions (id, submission_number, journal_id, author_id, title, abstract, keywords, category, file_path, file_name, file_size, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.id, s.submission_number, s.journal_id, s.author_id, s.title, s.abstract, s.keywords, s.category, s.file_path, s.file_name, s.file_size, s.status, now, now]
    );

    // Seed Co-authors
    run(
      `INSERT INTO submission_authors (id, submission_id, full_name, email, institution, orcid, is_corresponding, order_num)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [`aut-${s.id}-1`, s.id, 'Dr. Muhammad Fauzan, S.T., M.Kom.', 'penulis.utama@universitas.ac.id', 'Universitas Padjadjaran', '0000-0002-1825-0097', 1, 1]
    );

    run(
      `INSERT INTO submission_authors (id, submission_id, full_name, email, institution, orcid, is_corresponding, order_num)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [`aut-${s.id}-2`, s.id, 'Ahmad Fadhil, M.Cs.', 'fadhil@universitas.ac.id', 'Universitas Gadjah Mada', '0000-0003-1299-8812', 0, 2]
    );

    // Seed Files
    run(
      `INSERT INTO submission_files (id, submission_id, file_type, file_name, file_path, file_size, uploaded_by, version, uploaded_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [`file-${s.id}-1`, s.id, 'manuscript', s.file_name, s.file_path, s.file_size, s.author_id, 1, now]
    );

    // Seed Status History
    run(
      `INSERT INTO submission_status_history (id, submission_id, previous_status, new_status, comment, changed_by, created_at)
       VALUES (?, ?, NULL, 'SUBMITTED', 'Naskah berhasil diajukan oleh penulis dan masuk ke antrean sekretariat jurnal.', ?, ?)`,
      [`hist-${s.id}-1`, s.id, s.author_id, now]
    );

    if (s.status !== 'SUBMITTED') {
      run(
        `INSERT INTO submission_status_history (id, submission_id, previous_status, new_status, comment, changed_by, created_at)
         VALUES (?, ?, 'SUBMITTED', ?, 'Pembaruan status tahapan oleh Editor-in-Chief.', ?, ?)`,
        [`hist-${s.id}-2`, s.id, s.status, 'usr-editor-1', now]
      );
    }
  }

  // 5. Seed Review Assignment for Reviewer
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  run(
    `INSERT INTO review_assignments (id, submission_id, reviewer_id, assigned_by, status, due_date, recommendation, review_notes, confidential_notes, created_at)
     VALUES (?, ?, ?, ?, 'ACCEPTED', ?, NULL, NULL, NULL, ?)`,
    ['rev-assign-1', 'sub-001', 'usr-reviewer-1', 'usr-editor-1', dueDate, now]
  );

  // 6. Seed Editorial Decision for Sub-003 (Revision Required)
  run(
    `INSERT INTO editorial_decisions (id, submission_id, editor_id, decision, decision_notes, notify_author, created_at)
     VALUES (?, ?, ?, 'REVISION', 'Naskah memerlukan revisi minor pada penguatan metodologi empiris perbandingan 5 provinsi serta pembaruan sitasi literatur terbitan 3 tahun terakhir.', 1, ?)`,
    ['dec-sub-003', 'sub-003', 'usr-editor-1', now]
  );

  // 7. Seed Notifications
  const sampleNotifications = [
    {
      id: 'notif-1',
      user_id: 'usr-author-1',
      title: 'Pembaruan Status Naskah',
      message: 'Naskah SUB-2025-001 telah memasuki tahap peer-review oleh Mitra Bestari independen.',
      link: '/author/submissions/sub-001',
    },
    {
      id: 'notif-2',
      user_id: 'usr-author-1',
      title: 'Permintaan Revisi Editorial',
      message: 'Naskah SUB-2025-003 memerlukan revisi minor sesuai catatan dewan editor.',
      link: '/author/submissions/sub-003',
    },
    {
      id: 'notif-3',
      user_id: 'usr-editor-1',
      title: 'Pengajuan Naskah Baru Masuk',
      message: 'Naskah baru SUB-2025-002 memerlukan pemeriksaan teknis (desk check) awal.',
      link: '/editor/submissions/sub-002',
    },
    {
      id: 'notif-4',
      user_id: 'usr-reviewer-1',
      title: 'Tugas Review Aktif',
      message: 'Anda memiliki 1 tugas telaah naskah yang telah diterima dengan tenggat waktu 14 hari ke depan.',
      link: '/reviewer/assignments/rev-assign-1',
    },
  ];

  for (const n of sampleNotifications) {
    run(
      'INSERT INTO notifications (id, user_id, title, message, link, is_read, created_at) VALUES (?, ?, ?, ?, ?, 0, ?)',
      [n.id, n.user_id, n.title, n.message, n.link, now]
    );
  }

  // 8. Seed Audit Logs
  const auditLogs = [
    {
      id: 'log-1',
      user_id: 'usr-admin-1',
      action: 'SYSTEM_BOOTSTRAP',
      entity_type: 'SYSTEM',
      entity_id: 'cendraloka-core',
      details: 'Inisialisasi sistem database relasional portal Cendraloka versi multi-role.',
      ip_address: '127.0.0.1',
    },
    {
      id: 'log-2',
      user_id: 'usr-author-1',
      action: 'SUBMISSION_CREATE',
      entity_type: 'SUBMISSION',
      entity_id: 'sub-001',
      details: 'Pengajuan naskah awal nomor SUB-2025-001 ke Jurnal Rekayasa Informatika & Kecerdasan Buatan.',
      ip_address: '127.0.0.1',
    },
  ];

  for (const a of auditLogs) {
    run(
      'INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [a.id, a.user_id, a.action, a.entity_type, a.entity_id, a.details, a.ip_address, now]
    );
  }

  console.log('Database successfully initialized with 17 relational tables and comprehensive seed data!');
}
