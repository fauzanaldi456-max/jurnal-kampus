import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import 'dotenv/config';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://sqgtpmwynzwprjzurocj.supabase.co';
const SECRET_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SECRET_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SECRET_KEY, {
  realtime: {
    transport: WebSocket
  }
});

async function runSeed() {
  console.log('Seeding institutions & journals...');

  const institutions = [
    { id: 'inst-1', name: 'Universitas Padjadjaran', code: 'UNPAD', city: 'Bandung', country: 'Indonesia', created_at: new Date().toISOString() },
    { id: 'inst-2', name: 'Institut Teknologi Bandung', code: 'ITB', city: 'Bandung', country: 'Indonesia', created_at: new Date().toISOString() },
    { id: 'inst-3', name: 'Universitas Indonesia', code: 'UI', city: 'Depok', country: 'Indonesia', created_at: new Date().toISOString() },
    { id: 'inst-4', name: 'Universitas Gadjah Mada', code: 'UGM', city: 'Yogyakarta', country: 'Indonesia', created_at: new Date().toISOString() },
    { id: 'inst-5', name: 'Konsorsium Jurnal Ilmiah Cendraloka', code: 'CENDRA', city: 'Jakarta', country: 'Indonesia', created_at: new Date().toISOString() },
  ];

  for (const inst of institutions) {
    const { error } = await supabase.from('institutions').upsert(inst);
    if (error) console.error('Error inserting institution:', inst.id, error);
    else console.log('✅ Institution upserted:', inst.name);
  }

  const now = new Date().toISOString();
  const users = [
    {
      id: 'usr-author-1',
      email: 'penulis.utama@universitas.ac.id',
      password_hash: '$2b$10$7Z2v1L4Zk12.1j987654321012345678901234567890123456789',
      full_name: 'Dr. Muhammad Fauzan, S.T., M.Kom.',
      role: 'author',
      institution: 'Universitas Padjadjaran',
      orcid: '0000-0002-1825-0097',
      phone: '+6281234567890',
      bio: 'Dosen dan peneliti spesialis Rekayasa Perangkat Lunak, Natural Language Processing, dan Sistem Cerdas.',
      is_active: true,
      created_at: now,
      updated_at: now
    },
    {
      id: 'usr-editor-1',
      email: 'editor.in.chief@cendraloka.ac.id',
      password_hash: '$2b$10$7Z2v1L4Zk12.1j987654321012345678901234567890123456789',
      full_name: 'Prof. Dr. Ir. Hendra Gunawan, M.T.',
      role: 'editor',
      institution: 'Institut Teknologi Bandung',
      orcid: '0000-0001-9982-1204',
      phone: '+6281198765432',
      bio: 'Ketua Dewan Editor Konsorsium Cendraloka dan Guru Besar Bidang Sistem Informasi.',
      is_active: true,
      created_at: now,
      updated_at: now
    },
    {
      id: 'usr-reviewer-1',
      email: 'mitra.bestari@cendraloka.ac.id',
      password_hash: '$2b$10$7Z2v1L4Zk12.1j987654321012345678901234567890123456789',
      full_name: 'Dr. Maya Anindita, M.Sc.',
      role: 'reviewer',
      institution: 'Universitas Indonesia',
      orcid: '0000-0003-4412-8871',
      phone: '+6281355443322',
      bio: 'Mitra Bestari Senior bidang Algoritma Pembelajaran Mesin dan Bioinformatika Terapan.',
      is_active: true,
      created_at: now,
      updated_at: now
    },
    {
      id: 'usr-admin-1',
      email: 'admin@cendraloka.ac.id',
      password_hash: '$2b$10$7Z2v1L4Zk12.1j987654321012345678901234567890123456789',
      full_name: 'Administrator Portal Cendraloka',
      role: 'admin',
      institution: 'Konsorsium Jurnal Ilmiah Cendraloka',
      orcid: '0000-0002-0000-1111',
      phone: '+6281000112233',
      bio: 'Super Administrator Pengelola Sistem dan Infrastruktur Portal Publikasi Ilmiah.',
      is_active: true,
      created_at: now,
      updated_at: now
    },
  ];

  for (const u of users) {
    const { error } = await supabase.from('users').upsert(u);
    if (error) console.error('Error inserting user:', u.email, error);
    else console.log('✅ User upserted:', u.email);
  }

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
      status: 'active',
      created_at: now,
      updated_at: now
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
      status: 'active',
      created_at: now,
      updated_at: now
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
      status: 'active',
      created_at: now,
      updated_at: now
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
      status: 'active',
      created_at: now,
      updated_at: now
    },
  ];

  for (const j of journals) {
    const { error } = await supabase.from('journals').upsert(j);
    if (error) console.error('Error inserting journal:', j.title, error);
    else console.log('✅ Journal upserted:', j.title);
  }
}

runSeed();
