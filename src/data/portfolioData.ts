export interface SkillFocusItem {
  id: string;
  label: string;
  roleTitle: string;
  summary: string;
  tools: string[];
}

export interface ExperienceItem {
  id: string;
  category: 'IT & Akademik' | 'Sukarelawan';
  role: string;
  organization: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface TrainingItem {
  id: string;
  title: string;
  organizer: string;
  year: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  description: string;
  stack: string[];
  accentBg: string;
  image: string;
  linksToCatalog?: boolean;
}

export const ADINI_PORTRAIT = '/assets/aistudio/adini_foto_a6989c56.jpg';

export const PROFILE_INFO = {
  fullName: 'Adini Riska Putri',
  greeting: "Welcome to Adini's corner!",
  subtitle: 'Mahasiswi Sistem Informasi | Pengolahan Data & Pengembangan Web',
  location: 'Depok, Jawa Barat',
  email: 'nirisa05@gmail.com',
  instagramHandle: '@harusadini',
  instagramUrl: 'https://instagram.com/harusadini',
  university: 'Universitas Gunadarma',
  major: 'Sistem Informasi',
  studyPeriod: '2024 – Sekarang',
  gpa: '3,96 / 4,00',
  aboutParagraph1:
    'Saya Adini Riska Putri, mahasiswi program studi Sistem Informasi di Universitas Gunadarma dengan ketertarikan mendalam pada teknologi informasi, perancangan basis data, dan pengolahan data yang terstruktur. Melalui pembelajaran intensif di perkuliahan serta praktikum Lepkom, saya telah membangun fondasi yang kuat dalam pengelolaan database MySQL, bahasa pemrograman Java dan C, pengembangan antarmuka web menggunakan HTML5, serta penyajian analisis data dengan Microsoft Excel.',
  aboutParagraph2:
    'Di luar ranah teknis, saya menyalurkan sisi kreatif melalui desain visual di Canva serta terlibat langsung dalam kegiatan sosial dan kerelawanan. Pengalaman memandu dan mengedukasi anak-anak melatih kemampuan komunikasi empatik, manajemen waktu, dan kerja sama tim. Dari pengalaman tersebut, saya meyakini bahwa teknologi dan kreativitas akan selalu bermakna ketika mampu memberi dampak positif bagi lingkungan sekitar.',
};

export const SKILL_FOCUS_TABS: SkillFocusItem[] = [
  {
    id: 'mysql',
    label: 'MySQL & Basis Data',
    roleTitle: 'Perancangan Skema & Operasi CRUD',
    summary:
      'Merancang struktur tabel relasional, menjaga integritas data, serta menghubungkan basis data MySQL dengan aplikasi desktop secara terstruktur.',
    tools: ['MySQL', 'Draw.io', 'ERD Modeling'],
  },
  {
    id: 'java',
    label: 'Java & Bahasa C',
    roleTitle: 'Logika Pemrograman & Konsep OOP',
    summary:
      'Mengimplementasikan sintaks dasar, struktur kontrol percabangan dan perulangan, serta prinsip Object Oriented Programming (OOP) untuk aplikasi desktop.',
    tools: ['Java OOP', 'Bahasa C', 'Desktop Logic'],
  },
  {
    id: 'web',
    label: 'HTML5 & Desain Visual',
    roleTitle: 'Antarmuka Web Estetik & Responsif',
    summary:
      'Memadukan struktur semantik HTML5 dengan komposisi warna pastel dan tata letak bersih untuk menciptakan pengalaman pengguna yang nyaman.',
    tools: ['HTML5', 'Canva', 'UI Layout'],
  },
  {
    id: 'excel',
    label: 'Microsoft Excel',
    roleTitle: 'Pengolahan & Penyajian Data',
    summary:
      'Mengolah dataset operasional, menyusun formula terstruktur, serta menyajikan laporan visual yang rapi dan mudah dipahami untuk pengambilan keputusan.',
    tools: ['Microsoft Excel', 'Microsoft Office', 'Data Reporting'],
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'lepkom',
    category: 'IT & Akademik',
    role: 'Student Lepkom (Semester 1 – 4)',
    organization: 'Laboratorium Pengembangan Komputer · Universitas Gunadarma',
    period: '2024 – Sekarang',
    location: 'Depok, Jawa Barat',
    highlights: [
      'Menguasai konsep dasar pengembangan aplikasi desktop serta penerapan logika pemrograman terstruktur.',
      'Mengelola basis data MySQL secara menyeluruh, mulai dari pembuatan struktur tabel hingga manipulasi data (Create, Read, Update, Delete).',
      'Menghubungkan aplikasi desktop dengan basis data untuk pengolahan dan penyimpanan informasi yang terorganisir.',
      'Menerapkan konsep Object Oriented Programming (OOP) pada Java serta struktur kontrol percabangan dan perulangan.',
    ],
  },
  {
    id: 'semai-ilmu',
    category: 'Sukarelawan',
    role: 'Pengisi Materi (Volunteer)',
    organization: 'Semai Ilmu',
    period: 'Agustus 2026',
    location: 'Program Edukasi Anak',
    highlights: [
      'Menyampaikan materi mitigasi bencana alam secara sederhana dan aplikatif guna membangun kesiapsiagaan serta respons cepat pada anak-anak.',
      'Mengedukasi dan menanamkan kesadaran lingkungan sejak dini melalui aktivitas interaktif mengenai pentingnya menjaga alam.',
      'Memandu lebih dari 30 anak agar aktif berpartisipasi dalam setiap sesi diskusi serta permainan edukatif.',
    ],
  },
  {
    id: 'rumah-kencana',
    category: 'Sukarelawan',
    role: 'Fasilitator Kreatif (Volunteer)',
    organization: 'Rumah Kencana',
    period: 'Juni 2025',
    location: 'Kegiatan Seni & Pendampingan',
    highlights: [
      'Memandu dan memotivasi lebih dari 20 anak untuk mengeksplorasi kreativitas serta mengekspresikan diri melalui seni lukis.',
      'Mendampingi anak-anak secara personal guna membangun rasa percaya diri mereka selama aktivitas berlangsung.',
      'Bekerja sama dengan tim yayasan dalam menyiapkan seluruh kebutuhan logistik, peralatan melukis, dan memastikan kelancaran serta keamanan acara.',
    ],
  },
];

export const TRAININGS: TrainingItem[] = [
  {
    id: 'karirnex',
    title: 'Pelatihan Microsoft Excel',
    organizer: 'KarirNex',
    year: '2026',
  },
  {
    id: 'dicoding',
    title: 'Pelatihan Pemrograman Java',
    organizer: 'Dicoding',
    year: '2025',
  },
  {
    id: 'technofair',
    title: 'Workshop Artificial Intelligence',
    organizer: 'Technofair 12.0',
    year: '2025',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'whimsy-katalog',
    title: 'Katalog Fashion',
    category: 'Pengembangan Web & E-Commerce',
    year: '2026',
    summary:
      'Website e-commerce fashion perempuan dengan filter produk interaktif, galeri detail, dan keranjang belanja.',
    description:
      'Dirancang untuk menggabungkan keahlian struktur HTML5 yang bersih dengan arahan visual fairycore-vintage modern. Dilengkapi sistem filter multi-kriteria (kategori, harga, ukuran, warna), halaman detail produk lengkap dengan size chart serta padu padan, jurnal lookbook, hingga keranjang belanja aktif.',
    stack: ['HTML5', 'UI Design', 'Canva', 'E-Commerce Flow'],
    accentBg: 'bg-[#F8D2E0]/45',
    image: '/assets/aistudio/fashion_e48791f9.jpeg',
    linksToCatalog: true,
  },
  {
    id: 'inventaris-mysql',
    title: 'Drawing with an Oil Pastel',
    category: 'Karya Lukisan',
    year: '2023',
    summary:
      'Karya ini dibuat untuk memenuhi tugas Seni Budaya tingkat SMA dengan mengeksplorasi teknik blending dan layering menggunakan oil pastel.\nInspired by Wunemo (YouTube)',
    description:
      'Dengan mengambil referensi dari kanal wunemo, saya belajar mengolah tekstur oil pastel agar menyerupai sapuan kuas cat minyak yang ekspresif. Fokus utama karya ini adalah permainan gradasi warna pastel pada latar belakang untuk menonjolkan ketenangan objek utama yang sedang larut dalam bacaannya.',
    stack: ['Oil pastel dan kertas'],
    accentBg: 'bg-[#C7E0DA]/55',
    image: '/assets/aistudio/lukisan_oil_pastel_407aaa8e.jpeg',
  },
  {
    id: 'excel-analytics',
    title: 'Interactive Sales Dashboard',
    category: 'Pengolahan Data · Microsoft Excel',
    year: '2026',
    summary:
      'Merancang dan membangun sebuah Sales Dashboard interaktif untuk memvisualisasikan performa penjualan tahunan secara komprehensif dan mudah dipahami.',
    description:
      'Terinspirasi dari pelatihan Microsoft Excel di KarirNex, proyek ini menata dataset mentah menjadi tabel rekapitulasi yang konsisten, meminimalkan kesalahan pencatatan manual, dan menyajikan grafik ringkas untuk keperluan evaluasi kegiatan.',
    stack: ['Microsoft Excel'],
    accentBg: 'bg-[#FAF0A1]/50',
    image: '/assets/aistudio/Dashboard_Penjualan_7b5beb14.png',
  },
  {
    id: 'edukasi-visual',
    title: 'Kit Edukasi Kreatif & Mitigasi Anak',
    category: 'Desain Konten & Sosial',
    year: '2025',
    summary:
      'Materi presentasi visual dan alur aktivitas permainan edukatif yang diterapkan langsung untuk lebih dari 30 anak.',
    description:
      'Mengedukasi mitigasi bencana alam ramah anak di Canva untuk mendukung sesi belajar interaktif bersama Semai Ilmu agar mudah dipahami dan menyenangkan.',
    stack: ['Canva dan Komunikasi'],
    accentBg: 'bg-[#F8D2E0]/35',
    image: '/assets/aistudio/edukasi_semai_3e821cd2.jpeg',
  },
];

export const SKILLS_SUMMARY = {
  tools: ['MySQL', 'Draw.io', 'Microsoft Office', 'HTML5'],
  hardSkills: ['Microsoft Excel', 'Microsoft PowerPoint', 'Microsoft Word', 'Canva', 'Java', 'C'],
  softSkills: ['Problem Solving', 'Critical Thinking', 'Time Management', 'Communication'],
  languages: ['Bahasa Indonesia (Native)', 'Bahasa Inggris (Elementary)'],
};
