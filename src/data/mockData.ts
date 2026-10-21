import { Article, Journal, EditorialMember, PartnerFaculty } from '../types';

export const PRIMARY_ARTICLE: Article = {
  id: 'jtirk-v8i2-142',
  title: 'Implementasi Transformasi Deep Learning pada Deteksi Dini Kerusakan Infrastruktur Jalan Nasional Berbasis Edge Computing',
  titleEn: 'Edge-Computing Based Deep Learning Transformation for Early-Stage Pavement Defect Identification on National Highway Networks',
  journalName: 'Jurnal Teknologi Informasi & Rekayasa Komputer (JTIRK)',
  journalShort: 'JTIRK',
  volume: 'Vol. 8',
  issue: 'No. 2',
  year: 2025,
  month: 'Februari 2025',
  pages: '142–158',
  doi: '10.35824/jtirk.v8i2.142',
  sintaRank: 'SINTA 2',
  isOpenAccess: true,
  license: 'CC BY 4.0',
  abstractId: {
    background:
      'Pemeliharaan jaringan jalan nasional sepanjang lebih dari 47.000 km di Indonesia selama ini masih bertumpu pada survei visual konvensional berkala yang lambat, rentan bias subjektivitas, dan memerlukan anggaran operasional tinggi. Keterlambatan identifikasi retak mikro (micro-cracks) kerap mengakibatkan eskalasi kerusakan struktural menjadi lubang jalan (potholes) masif dalam waktu singkat akibat curah hujan tropis yang ekstrem.',
    methodology:
      'Riset ini mengusulkan arsitektur Edge-Vision Transformer-CNN Hybrid teroptimasi TensorRT yang diintegrasikan langsung pada perangkat pemrosesan tepi berdaya rendah (NVIDIA Jetson Orin Nano 8GB) yang terpasang pada armada kendaraan inspeksi jalan. Model dilatih menggunakan dataset komposit 18.420 citra permukaan aspal beresolusi tinggi mencakup 4 kategori patologi kerusakan jalan di wilayah Pantura dan Lintas Sumatra.',
    keyFindings:
      'Eksperimen empiris lapangan mendemonstrasikan bahwa model yang dikuantisasi int8 mencapai skor rata-rata presisi mAP@50 sebesar 91,4% pada kecepatan inferensi nyata 38,4 Frame Per Second (FPS) di atas kecepatan jelajah kendaraan dinas 60 km/jam, dengan konsumsi daya listrik puncak hanya 14,2 Watt. Sistem terbukti mampu membedakan genangan air biasa dari retak memanjang (longitudinal crack) dengan tingkat false positive rate di bawah 2,8%.',
    implications:
      'Implementasi komputasi tepi ini memangkas ketergantungan transmisi video mentah berbasis bandwidth tinggi ke cloud server hingga 98,2%, di mana hanya telemetri metadata koordinat GPS berformat GeoJSON dan snapshot bounding box terkompresi yang dikirimkan ke Dashboard Balai Pelaksanaan Jalan Nasional (BPJN) secara real-time.'
  },
  abstractEn: {
    background:
      'Maintaining more than 47,000 km of national road networks in Indonesia predominantly relies on periodic visual inspections that suffer from severe subjective bias, latency, and high logistics costs. Delayed detection of micro-cracks accelerates structural deterioration into critical potholes under heavy tropical downpours.',
    methodology:
      'This study proposes an edge-optimized Hybrid Vision Transformer-CNN framework accelerated with NVIDIA TensorRT, deployed directly on edge devices (NVIDIA Jetson Orin Nano 8GB) mounted on surveillance vehicles. The system is trained on 18,420 high-resolution pavement defect captures covering four prominent distress classes across Sumatra and Java national corridors.',
    keyFindings:
      'Field evaluations reveal that our INT8-quantized model attains a mean average precision (mAP@50) of 91.4% with a steady inference speed of 38.4 FPS under vehicle speeds of up to 60 km/h, consuming only 14.2W of power. The false-positive rate regarding benign road shadows and water puddles remains suppressed under 2.8%.',
    implications:
      'Edge inference minimizes heavy video upload bandwidth by 98.2%, streaming only lightweight GeoJSON distress vectors and timestamped GPS coordinates to the highway authority central maintenance dispatch.'
  },
  keywords: [
    'Deep Learning',
    'Edge Computing',
    'Computer Vision',
    'Infrastruktur Jalan',
    'Jetson Orin',
    'Preventive Maintenance'
  ],
  authors: [
    {
      name: 'Dr. Hendra Wijaya, M.T.',
      affiliationNumber: '1,*',
      isCorresponding: true,
      email: 'hendra.wijaya@nusantara.ac.id',
      orcid: '0000-0002-1825-9012',
      orcidUrl: 'https://orcid.org/0000-0002-1825-9012',
      institution: 'Laboratorium Computer Vision & IoT, Fak. Ilmu Komputer, Universitas Nusantara, Indonesia',
      scopusHIndex: 12,
      roleDescription: 'Konseptualisasi model, perancangan firmware inferensi tepi, validasi eksperimen lapang.'
    },
    {
      name: 'Ir. Rizky Pratama, M.Kom.',
      affiliationNumber: '2',
      isCorresponding: false,
      email: 'rizky.pratama@brin.go.id',
      orcid: '0000-0001-7712-4091',
      orcidUrl: 'https://orcid.org/0000-0001-7712-4091',
      institution: 'Pusat Riset Kecerdasan Artifisial Terapan & Robotika Terapan, Badan Riset dan Inovasi Nasional (BRIN)',
      scopusHIndex: 8,
      roleDescription: 'Akuisisi data fotogrametri dan kuantisasi TensorRT PTQ INT8.'
    },
    {
      name: 'Prof. Dr. Bambang Sudarmono, Ph.D.',
      affiliationNumber: '3',
      isCorresponding: false,
      email: 'bambang.sudarmono@presisi.ac.id',
      orcid: '0000-0002-8491-4921',
      orcidUrl: 'https://orcid.org/0000-0002-8491-4921',
      institution: 'Departemen Ilmu Komputer, Institut Teknologi Rekayasa Presisi, Indonesia',
      scopusHIndex: 18,
      roleDescription: 'Supervisi teoritis arsitektur transformer dan metodologi audit telemetri.'
    }
  ],
  timeline: {
    received: '12 Des 2024',
    revised: '18 Jan 2025',
    accepted: '02 Feb 2025',
    publishedOnline: '14 Feb 2025'
  },
  metrics: {
    views: 3421,
    downloads: 812,
    citations: 14,
    plumX: 89
  },
  pdfSize: '1.8 MB',
  sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  discipline: 'Keteknikan & Ilmu Komputer',
  referencesCount: 11
};

export const CATALOG_ARTICLES: Article[] = [
  PRIMARY_ARTICLE,
  {
    id: 'jtirk-v7i4-089',
    title: 'Segmentasi Semantik Retak Permukaan Jembatan Beton Menggunakan Arsitektur U-Net Modifikasi',
    titleEn: 'Semantic Segmentation of Concrete Bridge Surface Cracks Using Modified U-Net Architecture',
    journalName: 'Jurnal Teknologi Informasi & Rekayasa Komputer (JTIRK)',
    journalShort: 'JTIRK',
    volume: 'Vol. 7',
    issue: 'No. 4',
    year: 2024,
    month: 'November 2024',
    pages: '310–324',
    doi: '10.35824/jtirk.v7i4.089',
    sintaRank: 'SINTA 2',
    isOpenAccess: true,
    license: 'CC BY 4.0',
    abstractId: {
      background: 'Inspeksi berkala pada pilar jembatan beton berskala bentang panjang membutuhkan evaluasi visual yang objektif untuk mencegah keruntuhan tiba-tiba akibat korosi tulangan baja.',
      methodology: 'Kami memodifikasi arsitektur encoder U-Net dengan residual attention module untuk mengidentifikasi retak mikro berukuran sub-milimeter.',
      keyFindings: 'Model menghasilkan IoU rata-rata 89.2% pada dataset 4.200 foto inspeksi infrastruktur jembatan nasional.',
      implications: 'Diterapkan sebagai plugin evaluasi citra drone inspeksi Kementerian PUPR.'
    },
    abstractEn: {
      background: 'Long-span concrete bridge inspections demand objective crack mapping to mitigate structural collapse risks.',
      methodology: 'We integrate residual attention gates into U-Net encoder to classify micro-fractures.',
      keyFindings: 'Achieved 89.2% mean IoU over 4,200 highway bridge structural survey captures.',
      implications: 'Deployed as a post-processing tool for automated UAV aerial diagnostics.'
    },
    keywords: ['U-Net', 'Jembatan Beton', 'Computer Vision', 'Deep Learning', 'Infrastruktur'],
    authors: [
      {
        name: 'Ir. Agus Setiawan, M.T.',
        affiliationNumber: '1',
        isCorresponding: true,
        institution: 'Pusat Studi Rekayasa Konstruksi, ITB',
        orcid: '0000-0003-1289-4401'
      },
      {
        name: 'Dr. Indah Permatasari',
        affiliationNumber: '2',
        institution: 'Balai Jembatan Khusus & Terowongan'
      }
    ],
    timeline: {
      received: '10 Sep 2024',
      revised: '15 Okt 2024',
      accepted: '01 Nov 2024',
      publishedOnline: '18 Nov 2024'
    },
    metrics: {
      views: 1890,
      downloads: 430,
      citations: 9,
      plumX: 42
    },
    pdfSize: '2.1 MB',
    sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    discipline: 'Keteknikan & Sipil',
    referencesCount: 16
  },
  {
    id: 'jtirk-v8i1-114',
    title: 'Optimasi Bandwidth Transmisi Sensor LoRaWAN untuk Pemantauan Struktur Terowongan Kereta Api Cepat',
    titleEn: 'LoRaWAN Sensor Transmission Bandwidth Optimization for High-Speed Railway Tunnel Structural Health Monitoring',
    journalName: 'Jurnal Teknologi Informasi & Rekayasa Komputer (JTIRK)',
    journalShort: 'JTIRK',
    volume: 'Vol. 8',
    issue: 'No. 1',
    year: 2025,
    month: 'Januari 2025',
    pages: '12–28',
    doi: '10.35824/jtirk.v8i1.114',
    sintaRank: 'SINTA 2',
    isOpenAccess: true,
    license: 'CC BY 4.0',
    abstractId: {
      background: 'Keterbatasan penetrasi sinyal elektromagnetik pada terowongan bawah tanah membutuhkan protokol komunikasi berdaya rendah dengan efisiensi spektral tinggi.',
      methodology: 'Kami menerapkan kompresi delta adaptif dan skema penjadwalan multi-kanal LoRaWAN untuk 120 sensor strain gauge.',
      keyFindings: 'Efisiensi payload meningkat sebesar 74.3% dengan zero data loss pada kecepatan jelajah kereta 350 km/jam.',
      implications: 'Solusi berbiaya terjangkau untuk pemeliharaan keselamatan transportasi massal modern.'
    },
    abstractEn: {
      background: 'Subterranean RF attenuation within rail tunnels poses severe hurdles for continuous structural telemetry.',
      methodology: 'Implemented adaptive delta encoding with multichannel LoRaWAN scheduling.',
      keyFindings: 'Yielded 74.3% payload compression with zero frame drops during high-speed passes.',
      implications: 'Viable IoT architecture for resilient rail transit telematics.'
    },
    keywords: ['LoRaWAN', 'IoT', 'Kereta Cepat', 'Pemantauan Struktur', 'Sensor'],
    authors: [
      {
        name: 'M. Fadhil, S.T., M.Sc.',
        affiliationNumber: '1',
        isCorresponding: true,
        institution: 'Fakultas Teknik Elektro, ITS',
        orcid: '0000-0002-4519-8921'
      },
      {
        name: 'Prof. Dr. S. Rahayu',
        affiliationNumber: '2',
        institution: 'Badan Riset Kereta Api Nasional'
      }
    ],
    timeline: {
      received: '02 Nov 2024',
      revised: '05 Des 2024',
      accepted: '22 Des 2024',
      publishedOnline: '08 Jan 2025'
    },
    metrics: {
      views: 2410,
      downloads: 512,
      citations: 6,
      plumX: 37
    },
    pdfSize: '1.4 MB',
    sha256: 'b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01',
    discipline: 'Telekomunikasi & IoT',
    referencesCount: 14
  },
  {
    id: 'jtirk-v6i3-052',
    title: 'Evaluasi Kuantitatif Kerusakan Asfal Berdasarkan Rekonstruksi 3D Fotogrametri Pesawat Nirawak (UAV)',
    titleEn: 'Quantitative Evaluation of Asphalt Distress Based on UAV Photogrammetric 3D Reconstruction',
    journalName: 'Jurnal Teknologi Informasi & Rekayasa Komputer (JTIRK)',
    journalShort: 'JTIRK',
    volume: 'Vol. 6',
    issue: 'No. 3',
    year: 2023,
    month: 'Agustus 2023',
    pages: '204–219',
    doi: '10.35824/jtirk.v6i3.052',
    sintaRank: 'SINTA 2',
    isOpenAccess: true,
    license: 'CC BY 4.0',
    abstractId: {
      background: 'Survei fotogrametri drone beresolusi tinggi menawarkan alternatif cepat untuk pemetaan topografi jalan raya.',
      methodology: 'Studi mengombinasikan Structure-from-Motion (SfM) dengan Multi-View Stereo (MVS) untuk mengestimasi volumetrik lubang jalan.',
      keyFindings: 'Tingkat akurasi estimasi volume mencapai margin error 4.1% dibandingkan pengukuran manual penggaris laser.',
      implications: 'Mempercepat perancangan estimasi material aspal tambal sulam pada dinas bina marga daerah.'
    },
    abstractEn: {
      background: 'UAV photogrammetry delivers rapid spatial surveying for corridor-level pavement audits.',
      methodology: 'Integrated Structure-from-Motion with volumetric point-cloud mesh extraction.',
      keyFindings: 'Delivered volumetric estimations within 4.1% error against physical lidar scans.',
      implications: 'Directly applicable for civil repair contractor volume billing.'
    },
    keywords: ['UAV', 'Fotogrametri', '3D Reconstruction', 'Bina Marga', 'Potholes'],
    authors: [
      {
        name: 'D. Pramono, S.T., M.Eng.',
        affiliationNumber: '1',
        isCorresponding: true,
        institution: 'Jurusan Teknik Geodesi, Universitas Diponegoro'
      }
    ],
    timeline: {
      received: '14 Mei 2023',
      revised: '20 Jun 2023',
      accepted: '12 Jul 2023',
      publishedOnline: '01 Agu 2023'
    },
    metrics: {
      views: 3120,
      downloads: 980,
      citations: 21,
      plumX: 65
    },
    pdfSize: '3.2 MB',
    sha256: 'c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef012',
    discipline: 'Geomatika & Rekayasa Sipil',
    referencesCount: 22
  },
  {
    id: 'jbm-v4i1-018',
    title: 'Analisis Mutasi Genomik SARS-CoV-2 Subvarian Rekombinan Menggunakan Pendekatan Filogenetik Molekuler di Wilayah Jawa Barat',
    titleEn: 'Genomic Mutation Analysis of Recombinant SARS-CoV-2 Subvariants Using Molecular Phylogenetic Approach in West Java',
    journalName: 'Jurnal Biomedika Nusantara (JBN)',
    journalShort: 'JBN',
    volume: 'Vol. 4',
    issue: 'No. 1',
    year: 2025,
    month: 'Januari 2025',
    pages: '45–59',
    doi: '10.35824/jbn.v4i1.018',
    sintaRank: 'SINTA 3',
    isOpenAccess: true,
    license: 'CC BY 4.0',
    abstractId: {
      background: 'Surveilans genomik berkala mutlak diperlukan guna mengantisipasi penurunan efikasi vaksin terhadap sub-garis keturunan baru.',
      methodology: 'Next-Generation Sequencing (NGS) terhadap 350 sampel klinis dianalisis dengan algoritma Maximum Likelihood.',
      keyFindings: 'Ditemukan 3 klaster rekombinan unik dengan substitusi asam amino pada domain pengikat reseptor (RBD).',
      implications: 'Menjadi rujukan satgas pengendalian penyakit menular provinsi.'
    },
    abstractEn: {
      background: 'Continuous genomic surveillance is pivotal to track immune escape across recombinant lineages.',
      methodology: 'NGS clinical isolates investigated via Maximum Likelihood phylogenetic clustering.',
      keyFindings: 'Identified three distinct recombinant clades harboring novel RBD substitutions.',
      implications: 'Informing regional epidemiological advisory taskforces.'
    },
    keywords: ['SARS-CoV-2', 'Genomik', 'Filogenetik', 'Biomedika', 'NGS'],
    authors: [
      {
        name: 'Dr. apt. Siti Nurhaliza, M.Biomed.',
        affiliationNumber: '1',
        isCorresponding: true,
        institution: 'Pusat Riset Biomedika Indonesia (PRBI)'
      }
    ],
    timeline: {
      received: '01 Des 2024',
      revised: '12 Jan 2025',
      accepted: '20 Jan 2025',
      publishedOnline: '30 Jan 2025'
    },
    metrics: {
      views: 1420,
      downloads: 388,
      citations: 3,
      plumX: 28
    },
    pdfSize: '1.9 MB',
    sha256: 'd4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0123',
    discipline: 'Biosains & Kedokteran',
    referencesCount: 28
  },
  {
    id: 'jsh-v10i2-094',
    title: 'Transformasi Kebijakan Perlindungan Data Pribadi pada Ekosistem Layanan Keuangan Digital Berbasis Kecerdasan Buatan',
    titleEn: 'Transformation of Personal Data Protection Policies in AI-Driven Digital Financial Services Ecosystems',
    journalName: 'Jurnal Studi Kebijakan & Hukum Nasional (JSKHN)',
    journalShort: 'JSKHN',
    volume: 'Vol. 10',
    issue: 'No. 2',
    year: 2024,
    month: 'Desember 2024',
    pages: '178–194',
    doi: '10.35824/jskhn.v10i2.094',
    sintaRank: 'SINTA 2',
    isOpenAccess: true,
    license: 'CC BY 4.0',
    abstractId: {
      background: 'Adopsi sistem credit scoring berbasis AI menimbulkan potensi pelanggaran privasi dan diskriminasi algoritma sistemik.',
      methodology: 'Penelitian hukum yuridis normatif dengan pendekatan perbandingan regulasi UU PDP RI dan EU GDPR.',
      keyFindings: 'Diperlukan regulasi sektoral turunan OJK yang mewajibkan audit algorithmic impact assessment secara berkala.',
      implications: 'Rekomendasi naskah akademik revisi peraturan otoritas jasa keuangan.'
    },
    abstractEn: {
      background: 'Autonomous credit scoring algorithms introduce profound risks regarding automated bias and profiling privacy violations.',
      methodology: 'Normative juridical comparative study bench-marking Indonesian PDP Law against European Union GDPR.',
      keyFindings: 'Formulates mandatory algorithmic impact audit protocols for non-bank fintech operators.',
      implications: 'Direct policy brief submitted to the Financial Services Authority regulator.'
    },
    keywords: ['UU PDP', 'Kecerdasan Buatan', 'Fintech', 'Hukum Perlindungan Data', 'Etika AI'],
    authors: [
      {
        name: 'Dr. Amanda Savitri, S.H., LL.M.',
        affiliationNumber: '1',
        isCorresponding: true,
        institution: 'Fakultas Hukum, Universitas Indonesia',
        orcid: '0000-0002-1400-8832'
      }
    ],
    timeline: {
      received: '15 Okt 2024',
      revised: '10 Nov 2024',
      accepted: '28 Nov 2024',
      publishedOnline: '15 Des 2024'
    },
    metrics: {
      views: 2870,
      downloads: 740,
      citations: 11,
      plumX: 53
    },
    pdfSize: '1.1 MB',
    sha256: 'e5f67890123456789abcdef0123456789abcdef0123456789abcdef01234',
    discipline: 'Hukum & Tata Kelola Publik',
    referencesCount: 34
  }
];

export const EDITORIAL_MEMBERS: EditorialMember[] = [
  {
    id: 'ed-1',
    name: 'Prof. Dr. Bambang Sudarmono, M.Sc., Ph.D.',
    role: 'Editor-in-Chief',
    subRole: 'Ketua Konsorsium Jurnexa',
    category: 'Pimpinan & Pengarah',
    institution: 'Universitas Indonesia Terpadu',
    bio: 'Guru Besar Rekayasa Komputasi & Sistem Cerdas. Mantan reviewer Ditjen Diktiristek RI dengan pengalaman lebih dari 25 tahun dalam tata kelola jurnal internasional bereputasi.',
    orcid: '0000-0002-8491-4921',
    orcidUrl: 'https://orcid.org/0000-0002-8491-4921',
    scopusHIndex: '18 (2.410 Sitasi)',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBsgXKUK0-MO2jezLkl9mwaRiCOSRxaWmG_viLXiqJBnW9EgR7i1Crs4bFC5A1zO1tmAiUiyi6RfUyWoMP65h6rOvd1KAM7I23RpA6btZUBFAoa1dlzne2NnQmaRCCz66IluWFY3Oj-i1Bmu6wO_lPacS9TZNVXI_DHa2hsYICmRlyBV-YUvnRzcfJNeloMMlTCWZ4Ubcq9BHdkAB2wKoygtuNtyzkPT7zPQpe5iAZhI3O4kdW29rdYAA'
  },
  {
    id: 'ed-2',
    name: 'Dr. Eng. Ratna Nirmala Dewi, S.T., M.Eng.',
    role: 'Sains & Rekayasa',
    subRole: 'Koordinator Bidang Sains & Rekayasa',
    category: 'Bidang Sains & Rekayasa',
    institution: 'Institut Teknologi Nusantara Mandiri',
    bio: 'Spesialis Rekayasa Material Terapan & Sensor Cerdas. Memimpin komite standarisasi metodologi penulisan teknis dan validasi instrumen empiris di konsorsium.',
    orcid: '0000-0001-9238-1102',
    orcidUrl: 'https://orcid.org/0000-0001-9238-1102',
    scopusHIndex: '14 (1.180 Sitasi)',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB8X7WmoW2qezjYuCEs9b8mBUeSrX_SUKnydXVLu4W-YzpzlLI8MryonzY1tYjt5g8Fr5UX0M8uiFqYGnqHtwlfxnzdFiJEUBIRsaG82Ofuh5giif3HKf7G4t1y1F93fDoz8qZ6Q6fTWgAzDnHpshisX1M-v8lpo40HYS2bw5Nl-hfITEgaVHpaKlfi4LfOOxBdTYNYUKWGNfN3EcAByQcoc68a7bzgUl_PRkp2CSuinGn3flqynoitg'
  },
  {
    id: 'ed-3',
    name: 'Prof. Dr. H. M. Firdaus Gunawan, S.Sos., M.Si.',
    role: 'Sosial & Humaniora',
    subRole: 'Koordinator Sosial & Humaniora',
    category: 'Bidang Sosial & Humaniora',
    institution: 'Universitas Gadjah Peradaban',
    bio: 'Pakar Kebijakan Publik & Sosiologi Transformasi Digital. Menyelenggarakan audit peer-review untuk rumpun ilmu humaniora, pedagogi, dan studi komunikasi.',
    orcid: '0000-0003-7741-2900',
    orcidUrl: 'https://orcid.org/0000-0003-7741-2900',
    sintaScore: 'Score: 412 (Verified)',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC8qoevZx79BTUQM1T5CgPjE2ZK3xCne4B9ThV8lkVbhuLxIOctV-zDhH5OE594kWrqJid87mHo9W1XLNUm_pPm97yqB9Ekcj6qr5MKTCfTrmT-QkIj-UuTXX2tvy6WPkpO0VF9uFTea0S1JCYjGYaR3atUjHimk1pgIr27BrXIb8YbmHgEGpWVIbC5gbDvcUUpt0qBXwcEKLy1abRrHtd37qEgodhndWDLkgQiRLufOYFQ75kzZSnbsA'
  },
  {
    id: 'ed-4',
    name: 'Dr. Amanda Savitri, S.H., LL.M.',
    role: 'Etika & Kepatuhan',
    subRole: 'Ketua Panel Etika & Integritas',
    category: 'Etika & Regulasi',
    institution: 'Fakultas Hukum Nusantara',
    bio: 'Pakar Hukum Hak Kekayaan Intelektual, Lisensi Creative Commons, dan Arbitrasi Naskah Ilmiah. Anggota Tersertifikasi COPE (Committee on Publication Ethics).',
    orcid: '0000-0002-1400-8832',
    orcidUrl: 'https://orcid.org/0000-0002-1400-8832',
    ethicalStandard: 'COPE Accredited',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDtK-k5a7HiXJCHN0xTUW4FoQ_nsXJqBjNX5FQ8rtEUZNFJcjNtdy3lJ-hSwd6MBmlKUyfcqAI2V3aJxDN_RjHJBmeoh5hcs3VkhycSrLBFZEa7AIG3Brpc6HsDs9NvoKt8m8qesZoI5u_tPD1OdVZCIVYg-231ImB56vPY2IqhMIyJ4jk6HIP4X7dNLcGQmLxbnkAZHGOdwkakCLVcm4W7UxWQ6zyL_yPxtH2Or7wYf8u8j8M8Lq-y8w'
  }
];

export const PARTNER_FACULTIES: PartnerFaculty[] = [
  {
    id: 'ftin',
    code: 'FTIN-KONSOR',
    cluster: 'Klaster Komputasi',
    name: 'Fakultas Teknik Informatika Nusantara',
    description: 'Pengampu 4 jurnal bidang Kecerdasan Buatan, Rekayasa Perangkat Lunak, dan Keamanan Siber Terapan.',
    icon: 'memory'
  },
  {
    id: 'prbi',
    code: 'PRBI-JAKARTA',
    cluster: 'Klaster Biomedis',
    name: 'Pusat Riset Biomedika Indonesia',
    description: 'Pengampu penerbitan farmakologi klinis, epidemiologi komunitas, dan inovasi diagnosis biosains.',
    icon: 'biotech'
  },
  {
    id: 'fkip',
    code: 'FKIP-SERANG',
    cluster: 'Klaster Pedagogi',
    name: 'Fakultas Keguruan & Ilmu Pendidikan',
    description: 'Fokus pada metodologi pembelajaran modern, kurikulum adaptif, dan asesmen pendidikan kejuruan.',
    icon: 'school'
  },
  {
    id: 'aphtn',
    code: 'APHTN-PUSAT',
    cluster: 'Klaster Hukum',
    name: 'Asosiasi Pengajar Hukum Tata Negara',
    description: 'Kolaborator jurnal konstitusi, reformasi peradilan, dan hukum perundang-undangan nasional.',
    icon: 'gavel'
  },
  {
    id: 'lkem',
    code: 'LKEM-RESEARCH',
    cluster: 'Klaster Ekonomi',
    name: 'Lembaga Kajian Ekonomi Moneter',
    description: 'Penerbit berkala studi makroekonomi, kebijakan fiskal berkelanjutan, dan ekonomi digital mikro.',
    icon: 'query_stats'
  },
  {
    id: 'kjik',
    code: 'KJIK-REGIONAL',
    cluster: 'Klaster Komunikasi',
    name: 'Konsorsium Jurnal Ilmu Komunikasi',
    description: 'Menelaah dinamika media massa, etika jurnalisme digital, dan komunikasi siber kontemporer.',
    icon: 'forum'
  }
];

export const CONSORTIUM_JOURNALS: Journal[] = [
  {
    id: 'jtirk',
    title: 'Jurnal Teknologi Informasi & Rekayasa Komputer',
    shortName: 'JTIRK',
    eIssn: '2721-8902',
    pIssn: '2548-1234',
    sintaGrade: 2,
    frequency: '4 Nomor / Tahun',
    publisher: 'Universitas Nusantara Press',
    discipline: 'Rekayasa & Informatika',
    acceptanceRate: '21.4%',
    totalArticles: 168,
    currentIssue: 'Vol. 8 No. 2 (2025)',
    description: 'Mewadahi riset orisinal bidang kecerdasan buatan, IoT, arsitektur komputasi awan/tepi, dan visi komputer.',
    isDoajIndexed: true,
    isCopeMember: true
  },
  {
    id: 'jrsi',
    title: 'Jurnal Rekayasa Sipil & Infrastruktur Nasional',
    shortName: 'JRSI',
    eIssn: '2614-7820',
    pIssn: '2302-9981',
    sintaGrade: 2,
    frequency: '3 Nomor / Tahun',
    publisher: 'Konsorsium Teknik Sipil Nusantara',
    discipline: 'Teknik Sipil & Lingkungan',
    acceptanceRate: '24.8%',
    totalArticles: 132,
    currentIssue: 'Vol. 12 No. 1 (2025)',
    description: 'Publikasi perancangan struktur transportasi, dinamika tanah gempa, manajemen air, dan ketahanan material beton.',
    isDoajIndexed: true,
    isCopeMember: true
  },
  {
    id: 'jbn',
    title: 'Jurnal Biomedika & Farmasi Klinis Nusantara',
    shortName: 'JBN',
    eIssn: '2809-5431',
    pIssn: '2655-3211',
    sintaGrade: 3,
    frequency: '4 Nomor / Tahun',
    publisher: 'Pusat Riset Biomedika Indonesia',
    discipline: 'Biosains & Kedokteran',
    acceptanceRate: '27.1%',
    totalArticles: 98,
    currentIssue: 'Vol. 4 No. 1 (2025)',
    description: 'Artikel riset dasar maupun terapan kedokteran tropis, genomik molekuler, bioinformatika, dan teknologi obat herbal.',
    isDoajIndexed: true,
    isCopeMember: true
  },
  {
    id: 'jskhn',
    title: 'Jurnal Studi Kebijakan & Hukum Nasional',
    shortName: 'JSKHN',
    eIssn: '2527-9018',
    pIssn: '2355-6749',
    sintaGrade: 2,
    frequency: '2 Nomor / Tahun',
    publisher: 'Asosiasi Pengajar Hukum Tata Negara',
    discipline: 'Sosial & Humaniora',
    acceptanceRate: '19.8%',
    totalArticles: 84,
    currentIssue: 'Vol. 10 No. 2 (2024)',
    description: 'Telaah kritis pembaharuan hukum perundang-undangan, hak asasi manusia, tata kelola data digital, dan peradilan tata usaha negara.',
    isDoajIndexed: true,
    isCopeMember: true
  },
  {
    id: 'jrem',
    title: 'Jurnal Riset Ekonomi Moneter & Pembangunan',
    shortName: 'JREMP',
    eIssn: '2775-6129',
    pIssn: '2460-5891',
    sintaGrade: 3,
    frequency: '3 Nomor / Tahun',
    publisher: 'Lembaga Kajian Ekonomi Moneter',
    discipline: 'Ekonomi & Bisnis',
    acceptanceRate: '28.5%',
    totalArticles: 110,
    currentIssue: 'Vol. 7 No. 1 (2025)',
    description: 'Fokus kajian transmisi kebijakan moneter, stabilitas sistem keuangan, ekonomi sirkular, dan transformasi pembayaran non-tunai.',
    isDoajIndexed: true,
    isCopeMember: true
  },
  {
    id: 'jpk',
    title: 'Jurnal Pedagogi & Transformasi Kurikulum Kejuruan',
    shortName: 'JPTKK',
    eIssn: '2828-9002',
    pIssn: '2615-1123',
    sintaGrade: 4,
    frequency: '3 Nomor / Tahun',
    publisher: 'FKIP Mitra Konsorsium',
    discipline: 'Pendidikan Terapan',
    acceptanceRate: '33.2%',
    totalArticles: 92,
    currentIssue: 'Vol. 5 No. 2 (2024)',
    description: 'Inovasi model pembelajaran vokasi berbasis proyek, asesmen kompetensi abad-21, dan integrasi teknologi media interaktif.',
    isDoajIndexed: false,
    isCopeMember: true
  }
];

export const ARTICLE_REFERENCES = [
  {
    num: 1,
    citation: 'Kementerian Pekerjaan Umum dan Perumahan Rakyat Republik Indonesia, "Rencana Strategis Ditjen Bina Marga 2020–2024," Jakarta: Kementerian PUPR, 2020.',
    doi: '10.35824/pupr.stat.2020.01',
    url: 'https://doi.org/10.35824/pupr.stat.2020.01'
  },
  {
    num: 2,
    citation: 'A. H. Pratomo, S. Mulyono, and D. R. Santoso, "Impact of heavy tropical precipitation on asphalt micro-crack propagation in Southeast Asian highway corridors," International Journal of Pavement Engineering, vol. 24, no. 3, pp. 201–214, 2023.',
    doi: '10.1080/10298436.2023.2189421',
    url: 'https://doi.org/10.1080/10298436.2023.2189421'
  },
  {
    num: 3,
    citation: 'R. Kurniawan and T. B. Susilo, "Analisis pengaruh beban gandar berlebih (ODOL) terhadap umur sisa rencana perkerasan lentur jalur Pantura," Jurnal Rekayasa Sipil & Infrastruktur, vol. 12, no. 1, pp. 45–56, 2023.',
    doi: '10.22146/jrsi.v12i1.78201',
    url: 'https://doi.org/10.22146/jrsi.v12i1.78201'
  },
  {
    num: 4,
    citation: 'F. Zhang, Z. Shen, and H. Liao, "Latency bottlenecks in cloud-centric automated pavement monitoring infrastructures," IEEE Transactions on Intelligent Transportation Systems, vol. 23, no. 8, pp. 11980–11993, Aug. 2022.',
    doi: '10.1109/TITS.2021.3108920',
    url: 'https://doi.org/10.1109/TITS.2021.3108920'
  },
  {
    num: 5,
    citation: 'M. R. Al-Hadithi and K. Gopalakrishnan, "Life-cycle cost benefits of predictive edge analytics in civil asset maintenance," Computer-Aided Civil and Infrastructure Engineering, vol. 37, no. 5, pp. 582–597, 2022.',
    doi: '10.1111/mice.12749',
    url: 'https://doi.org/10.1111/mice.12749'
  },
  {
    num: 6,
    citation: 'C. Chen, X. Liu, and J. Song, "Transformers in real-time computer vision: A comprehensive edge deployment benchmark," ACM Computing Surveys, vol. 55, no. 11, Art. 231, pp. 1–38, Nov. 2023.',
    doi: '10.1145/3588764',
    url: 'https://doi.org/10.1145/3588764'
  },
  {
    num: 7,
    citation: 'G. Jacob, S. K. Gupta, and P. Warden, "Quantization and training of neural networks for efficient integer-arithmetic-only inference," in Proc. IEEE/CVF Conf. Comput. Vis. Pattern Recognit. (CVPR), 2018, pp. 2704–2713.',
    doi: '10.1109/CVPR.2018.00286',
    url: 'https://doi.org/10.1109/CVPR.2018.00286'
  },
  {
    num: 8,
    citation: 'H. Wijaya and R. Pratama, "CLAHE-accelerated crack detection under severe illumination cast in road monitoring," in Proc. IEEE Int. Conf. Cybern. Comput. Intell. (CyberneticsCom), 2024, pp. 112–117.',
    doi: '10.1109/CyberneticsCom58721.2024.1029104',
    url: 'https://doi.org/10.1109/CyberneticsCom58721.2024.1029104'
  },
  {
    num: 9,
    citation: 'Z. Zheng et al., "Distance-IoU loss: Faster and better learning for bounding box regression," in Proc. AAAI Conf. Artif. Intell., vol. 34, no. 7, pp. 12993–13000, 2020.',
    doi: '10.1609/aaai.v34i07.6999',
    url: 'https://doi.org/10.1609/aaai.v34i07.6999'
  },
  {
    num: 10,
    citation: 'B. Sudarmono and H. Wijaya, "Benchmark dataset citra jalan raya berkondisi tropis (ID-RoadDefect-2024)," Zenodo Data Repository, 2024.',
    doi: '10.5281/zenodo.1084219',
    url: 'https://doi.org/10.5281/zenodo.1084219'
  }
];
