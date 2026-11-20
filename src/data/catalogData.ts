export type ProductCategory = 'Dress' | 'Atasan' | 'Rok' | 'Outer' | 'Aksesori';
export type ProductColorName = 'White' | 'Soft Cream' | 'Crimson Red' | 'Soft Pink' | 'Pearl White' | 'Soft Ivory' | 'Warm Cream';
export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface ProductReview {
  id: string;
  reviewerName: string;
  city: string;
  sizeWorn: ProductSize;
  heightCm: number;
  rating: number;
  comment: string;
  wearingNote: string;
  photo: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  price: number;
  jumlah: number;
  originalPrice?: number;
  isLimitedEdition?: boolean;
  editionTag?: string;
  colors: { name: ProductColorName; hex: string }[];
  sizes: ProductSize[];
  images: string[];
  description: string;
  fabricDetails: string[];
  careInstructions: string;
  mixMatchIds: string[];
  reviews: ProductReview[];
}

export interface LoveNote {
  id: string;
  author: string;
  roleOrCity: string;
  itemPurchased: string;
  quote: string;
}

export interface JournalArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  coverImage: string;
  paragraphs: string[];
  stylingTips: string[];
}

export const WHIMSY_HERO_IMAGE = '/assets/aistudio/Beranda_ef87e22f.jpg';

export const COLOR_SWATCHES: Record<ProductColorName, string> = {
  White: '#FFFFFF',
  'Soft Cream': '#F6EEDF',
  'Crimson Red': '#9E2A2B',
  'Soft Pink': '#F5D0DC',
  'Pearl White': '#F9F6F0',
  'Soft Ivory': '#F7F1E5',
  'Warm Cream': '#F2E9D8',
};

export const SIZE_CHART_DATA: {
  size: ProductSize;
  bust: string;
  waist: string;
  hip: string;
  length: string;
}[] = [
  { size: 'XS', bust: '82–86 cm', waist: '64–68 cm', hip: '88–92 cm', length: '112 cm' },
  { size: 'S', bust: '86–90 cm', waist: '68–72 cm', hip: '92–96 cm', length: '114 cm' },
  { size: 'M', bust: '90–94 cm', waist: '72–76 cm', hip: '96–100 cm', length: '116 cm' },
  { size: 'L', bust: '94–100 cm', waist: '76–82 cm', hip: '100–106 cm', length: '118 cm' },
  { size: 'XL', bust: '100–106 cm', waist: '82–88 cm', hip: '106–112 cm', length: '120 cm' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'aurora-organza-dress',
    name: 'Floral Mini Dress',
    subtitle: 'Lengan puff beraksen pita satin dengan detail renda dan kerah Peter Pan',
    category: 'Dress',
    price: 489000,
    jumlah: 12,
    originalPrice: 549000,
    isLimitedEdition: true,
    editionTag: 'Edisi Terbatas',
    colors: [
      { name: 'Soft Pink', hex: '#F5D0DC' },
      { name: 'Warm Cream', hex: '#F2E9D8' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      '/assets/aistudio/dress_floral_1531175b.jpg',
    ],
    description:
      'Terinspirasi oleh nuansa pagi musim semi yang lembut dan romantis, mini dress ini memadukan motif bunga mawar pastel dengan aksen pita satin di bagian lengan serta trim renda yang manis. Potongan longgar beraksen ruffle di bagian bawah memberi kesan ringan, feminin, dan nyaman dikenakan seharian.',
    fabricDetails: [
      'Lapisan utama: Kain katun motif floral lembut yang ringan dan nyaman di kulit',
      'Furing dalam: 100% Cotton Voile sejuk dan tidak menerawang',
      'Detail: Kerah Peter Pan putih, trim renda di bagian depan dan bawah, serta pita satin merah muda di lengan',
    ],
    careInstructions: 'Cuci lembut dengan tangan menggunakan air dingin; jemur di tempat teduh dan setrika uap suhu rendah.',
    mixMatchIds: ['daisy-knit-cardigan', 'meadow-ribbon-clip'],
    reviews: [
      {
        id: 'rev-1',
        reviewerName: 'Nadia Pramesti',
        city: 'Bandung',
        sizeWorn: 'S',
        heightCm: 160,
        rating: 5,
        comment: 'Jatuhnya super ringan dan tidak gatal sama sekali karena furing katunnya adem. Warna lavendernya lembut banget di foto maupun aslinya.',
        wearingNote: 'Dipakai untuk piknik taman & acara lamaran sahabat.',
        photo: '/src/assets/images/whimsy_hero_banner_1795061353317.jpg',
      },
      {
        id: 'rev-2',
        reviewerName: 'Clarissa Putri',
        city: 'Jakarta Selatan',
        sizeWorn: 'M',
        heightCm: 164,
        rating: 5,
        comment: 'Detail renda dan pita satinnya rapi sekali. Bikin siluet terlihat anggun tanpa terasa berlebihan.',
        wearingNote: 'Dipadukan dengan sepatu Mary Jane krem.',
        photo: '/src/assets/images/whimsy_dress_lavender_1795061353169.jpg',
      },
    ] as ProductReview[],
  },
  {
    id: 'solstice-chiffon-blouse',
    name: 'Blus Satin Bordir Bunga Pita',
    subtitle: 'Lengan panjang balon dengan detail kerah renda Peter Pan',
    category: 'Atasan',
    price: 319000,
    jumlah: 8,
    colors: [
      { name: 'Pearl White', hex: '#F9F6F0' },
      { name: 'Soft Ivory', hex: '#F7F1E5' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/assets/aistudio/blouse_92897f10.jpg',
    ],
    description:
      'Terinspirasi oleh keanggunan klasik gaya vintage Eropa, blus satin ini memadukan kilau kain yang lembut dengan detail bordir bunga pastel di bagian dada serta pita satin merah muda manis di garis leher.',
    fabricDetails: [
      'Bahan utama: Satin silk lembut dengan kilau mewah yang ringan dan jatuh di badan',
      'Detail: Bordir motif bunga pada bagian depan, renda halus di sekeliling kerah dan dada, serta pita satin merah muda di leher',
      'Lengan: Lengan panjang model balon beraksen ruffle dan renda',
    ],
    careInstructions: 'Gunakan laundry bag bila mencuci dengan mesin mode delicate, atau rendam singkat dengan deterjen lembut.',
    mixMatchIds: ['meadow-pleated-skirt', 'daisy-knit-cardigan'],
    reviews: [
      {
        id: 'rev-3',
        reviewerName: 'Rania Kusuma',
        city: 'Yogyakarta',
        sizeWorn: 'M',
        heightCm: 158,
        rating: 5,
        comment: 'Sulaman di kerahnya halus banget dan warna butter yellow-nya cerah tapi kalem, langsung bikin wajah kelihatan segar.',
        wearingNote: 'Dipakai ngampus dan ngopi sore di kedai buku.',
        photo: '/src/assets/images/whimsy_blouse_butter_1795061352925.jpg',
      },
    ],
  },
  {
    id: 'meadow-pleated-skirt',
    name: 'Rok Midi Ruffle',
    subtitle: 'Rok midi bertingkat putih dengan aksen ruffle lebar & mengembang ringan',
    category: 'Rok',
    price: 215000,
    jumlah: 4,
    isLimitedEdition: true,
    editionTag: 'Koleksi Musim Ini',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Soft Cream', hex: '#F6EEDF' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      '/assets/aistudio/rok_ruffle_daf269d0.jpg',
    ],
    description:
      'Rok midi bertingkat dari bahan katun ringan yang mengembang manis di setiap langkah. Dilengkapi potongan tiered dengan aksen ruffle lebar di bagian bawah sehingga memberi volume lembut, mudah dipadukan untuk tampilan kasual sehari-hari, maupun dipadankan dengan knitwear favorit.',
    fabricDetails: [
      'Bahan utama: Katun poplin ringan dengan struktur rapi dan tekstur nyaman di kulit',
      'Lapisan dalam: Furing lembut yang membantu menjaga jatuh rok agar tidak menerawang',
      'Detail: Desain bertingkat (tiered) dengan jahitan sambung horizontal dan aksen ruffle lebar di bagian bawah',
    ],
    careInstructions: 'Cuci lembut dengan tangan menggunakan air dingin, jangan diperas terlalu keras agar bentuk ruffle tetap rapi.',
    mixMatchIds: ['solstice-chiffon-blouse', 'daisy-knit-cardigan'],
    reviews: [
      {
        id: 'rev-4',
        reviewerName: 'Tari Maharani',
        city: 'Surabaya',
        sizeWorn: 'S',
        heightCm: 162,
        rating: 5,
        comment: 'Berputar pakai rok ini rasanya seperti di negeri dongeng! Lipatannya jatuh rapi dan warna sage-nya mudah dipadu padan.',
        wearingNote: 'Dipadukan dengan blus kuning mentega untuk pameran seni.',
        photo: '/src/assets/images/whimsy_skirt_sage_1795061354056.jpg',
      },
    ],
  },
  {
    id: 'daisy-knit-cardigan',
    name: 'Kardigan Rajut Merah',
    subtitle: 'Rajutan berhoodie merah bata dengan motif kucing putih',
    category: 'Outer',
    price: 1745000,
    jumlah: 3,
    isLimitedEdition: true,
    editionTag: 'Edisi Terbatas',
    colors: [
      { name: 'Crimson Red', hex: '#9E2A2B' },
      { name: 'Warm Cream', hex: '#F2E9D8' },
    ],
    sizes: ['S', 'M', 'L'],
    images: [
      '/assets/aistudio/cardigan_fc6b738c.jpg',
    ],
    description:
      'Kardigan rajut lengan panjang berona merah bata dengan motif kucing putih yang menggemaskan. Dilengkapi penutup kepala (hoodie) serta kancing depan untuk tampilan layering yang nyaman di cuaca sejuk maupun ruangan ber-AC.',
    fabricDetails: [
      'Benang: Rajutan benang katun akrilik yang lembut, hangat, dan bertekstur nyaman di kulit',
      'Ornamen: Motif rajut kucing putih dan pola geometris jacquard di bagian depan, bahu, serta lengan',
      'Potongan: Relaxed fit dengan penutup kepala (hoodie), rib elastis di ujung lengan dan bawah',
    ],
    careInstructions: 'Cuci tangan dengan air dingin, peras perlahan dengan handuk, dan keringkan secara mendatar (flat dry).',
    mixMatchIds: ['aurora-organza-dress', 'meadow-pleated-skirt'],
    reviews: [
      {
        id: 'rev-5',
        reviewerName: 'Gita Lestari',
        city: 'Depok',
        sizeWorn: 'M',
        heightCm: 159,
        rating: 5,
        comment: 'Rajutannya lembut banget, tidak gerah saat dipakai kuliah. Bordiran bunga asternya bikin banyak teman tanya beli di mana.',
        wearingNote: 'Dilapisi di atas dress putih polos atau rok sage.',
        photo: '/src/assets/images/whimsy_outer_cardigan_1795061353288.jpg',
      },
    ],
  },
  {
    id: 'meadow-lace-dress',
    name: 'Gaun Floral Pita',
    subtitle: 'Gaun sifon motif floral lembut dengan pita bahu menjuntai & aksen bunga 3D',
    category: 'Dress',
    price: 525000,
    jumlah: 9,
    isLimitedEdition: true,
    editionTag: 'Signature Piece',
    colors: [
      { name: 'Soft Pink', hex: '#F5D0DC' },
      { name: 'Soft Ivory', hex: '#F7F1E5' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      '/assets/aistudio/dress_pink_797700fa.jpg',
    ],
    description:
      'Gaun midi anggun yang dirancang untuk momen istimewa penuh keanggunan. Memadukan lapisan luar sifon bermotif floral halus dengan detail cowl neck yang jatuh lembut, pita bahu menjuntai beraksen gelombang, serta ornamen bunga 3D.',
    fabricDetails: [
      'Bahan utama: Lapisan luar sifon motif floral dengan furing dalam yang nyaman dan tidak menerawang',
      'Detail: Tali bahu pita menjuntai bergelombang, ornamen bunga 3D di bagian pinggang dan rok',
      'Panjang rok: Midi jatuh di bawah betis dengan efek melambai',
    ],
    careInstructions: 'Cuci tangan terpisah, gantung menggunakan hanger berlapis kain, dan hindari pemutih.',
    mixMatchIds: ['daisy-knit-cardigan', 'solstice-chiffon-blouse'],
    reviews: [
      {
        id: 'rev-6',
        reviewerName: 'Salsa Amelia',
        city: 'Bogor',
        sizeWorn: 'S',
        heightCm: 161,
        rating: 5,
        comment: 'Cutting smocked-nya nyaman banget dan tidak sesak. Sangat fotogenik saat terkena cahaya matahari sore.',
        wearingNote: 'Dipakai untuk foto wisuda outdoor.',
        photo: '/src/assets/images/whimsy_hero_banner_1795061353317.jpg',
      },
    ],
  },
  {
    id: 'meadow-ribbon-clip',
    name: 'Jepit Pita Bunga Tulip',
    subtitle: 'Aksesori rambut pita dengan juntai bunga tulip',
    category: 'Aksesori',
    price: 145000,
    jumlah: 15,
    colors: [
      { name: 'Soft Pink', hex: '#F5D0DC' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    sizes: [],
    images: [
      '/assets/aistudio/tulip_bow_d7c1b06a.jpg',
      '/assets/aistudio/tulip_bow_white_dd49b356.jpg',
    ],
    description:
      'Jepit rambut pita handmade merah muda lembut dengan juntai tangkai hijau dan dua kuntum bunga tulip satin di ujungnya. Memberi sentuhan manis yang playful pada gaya rambut half-up maupun rambut terurai bergelombang.',
    fabricDetails: [
      'Material: Pita transparan beraksen juntai panjang dan kuntum bunga tulip satin',
      'Jepitan: Klip rambut praktis yang ringan dan nyaman digunakan seharian',
      'Detail: Dua juntai tangkai dengan mahkota bunga tulip yang menggantung manis',
    ],
    careInstructions: 'Lap lembut dengan kain kering; simpan di dalam kotak penyimpanan agar bentuk pita tidak terlipat.',
    mixMatchIds: ['aurora-organza-dress', 'solstice-chiffon-blouse'],
    reviews: [
      {
        id: 'rev-7',
        reviewerName: 'Keisha Azzahra',
        city: 'Tangerang',
        sizeWorn: 'S',
        heightCm: 157,
        rating: 5,
        comment: 'Packing-nya cantik sekali dan pitanya tidak berat di rambut. Cocok untuk melengkapi outfit pastel.',
        wearingNote: 'Dipakai di acara ulang tahun adik.',
        photo: '/src/assets/images/whimsy_dress_lavender_1795061353169.jpg',
      },
    ],
  },
];

export const LOVE_NOTES: LoveNote[] = [
  {
    id: 'ln-1',
    author: 'Nadia Pramesti',
    roleOrCity: 'Bandung · Pembeli Gaun Aurora',
    itemPurchased: 'Gaun Midi Aurora Organza',
    quote:
      'Setiap jahitannya terasa dikerjakan dengan hati. Saat mengenakan gaun ini, saya merasa jauh lebih percaya diri dan bebas berekspresi tanpa kehilangan kenyamanan.',
  },
  {
    id: 'ln-2',
    author: 'Rania Kusuma',
    roleOrCity: 'Yogyakarta · Pembeli Blus Solstice',
    itemPurchased: 'Blus Kerah Bunga Solstice',
    quote:
      'Warna pastelnya lembut di mata dan sulaman bunga liarnya begitu detail. Kemasan kotaknya yang disertai ilustrasi kartu ucapan langsung bikin hari saya cerah.',
  },
  {
    id: 'ln-3',
    author: 'Gita Lestari',
    roleOrCity: 'Depok · Pembeli Kardigan Aster',
    itemPurchased: 'Kardigan Rajut Aster Langit',
    quote:
      'Kardigan rajut paling lembut yang pernah saya miliki! Mudah sekali dipadukan dengan rok panjang maupun celana kain untuk aktivitas kuliah harian.',
  },
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'lookbook-senja',
    title: 'Lookbook Musim Semi: Merangkai Gaya di Bawah Cahaya Keemasan',
    category: 'Lookbook & Inspirasi',
    date: '14 Maret 2026',
    readTime: '4 menit baca',
    excerpt:
      'Menyatukan bahan organza ringan, kerah renda vintage, dan palet lavender-sage untuk menciptakan siluet yang terasa seperti puisi berjalan.',
    coverImage: '/src/assets/images/whimsy_hero_banner_1795061353317.jpg',
    paragraphs: [
      'Koleksi musim ini lahir dari kerinduan akan pagi yang tenang di taman botani—di mana embun masih menempel di kelopak aster dan angin membawa aroma rumput segar. Kami ingin menerjemahkan ketenangan tersebut ke dalam potongan busana yang lembut namun tetap praktis untuk keseharian perempuan modern.',
      'Kunci dari tampilan whimsy yang elegan adalah keseimbangan tekstur. Ketika Anda memadukan rok tulle berlipit dengan kardigan rajut halus, kontras antara bahan yang melayang dan rajutan hangat menciptakan dimensi visual yang tidak berlebihan.',
    ],
    stylingTips: [
      'Pilih satu warna pastel dominan sebagai fokus utama (misalnya Lavender atau Sage Green), lalu lengkapi dengan warna krem hangat sebagai penyeimbang.',
      'Gunakan aksesori bertekstur lembut seperti jepit pita satin atau bros bunga kecil agar keseluruhan tampilan tetap harmonis.',
      'Padukan gaun bernuansa dongeng dengan sepatu datar Mary Jane atau sandal tali kulit cokelat muda untuk kesan santai yang tetap anggun.',
    ],
  },
  {
    id: 'padu-padan-kardigan',
    title: '5 Cara Memadukan Kardigan Rajut Motif Bunga dari Kampus ke Akhir Pekan',
    category: 'Tips Padu Padan',
    date: '28 Februari 2026',
    readTime: '3 menit baca',
    excerpt:
      'Dari tampilan layering rapi bersama rok plisket hingga disampirkan santai di bahu saat mengenakan blus berkerah sulam.',
    coverImage: '/src/assets/images/whimsy_outer_cardigan_1795061353288.jpg',
    paragraphs: [
      'Outer rajut dengan detail sulaman tangan sering kali dianggap hanya cocok untuk acara santai. Padahal, dengan pemilihan bawahan yang tepat, kardigan pastel dapat menjadi kunci gaya semi-formal yang segar dan berkarakter.',
      'Untuk hari kuliah atau pertemuan kreatif, kancingkan dua kancing teratas kardigan baby blue dan masukkan sedikit ke pinggang rok high-waist. Di akhir pekan, biarkan kardigan terbuka di atas gaun organza untuk perlindungan ekstra dari angin sore.',
    ],
    stylingTips: [
      'Biarkan kerah Peter Pan dari blus bagian dalam keluar menumpuk di atas garis leher kardigan untuk sentuhan retro manis.',
      'Pilih tas kanvas berwarna gading atau tas rotan kecil untuk menjaga kesan ringan.',
    ],
  },
  {
    id: 'cerita-dibalik-kain',
    title: 'Di Balik Atelier: Memilih Kain yang Bernapas dan Nyaman di Iklim Tropis',
    category: 'Cerita Koleksi',
    date: '10 Februari 2026',
    readTime: '5 menit baca',
    excerpt:
      'Mengapa lapisan furing katun voile dan benang rajut serat susu menjadi standar utama di setiap rancangan kami.',
    coverImage: '/src/assets/images/whimsy_dress_lavender_1795061353169.jpg',
    paragraphs: [
      'Banyak busana bergaya fairycore atau vintage tampak indah di foto, tetapi terasa panas saat dikenakan beraktivitas di Indonesia. Sejak sketsa pertama, kami berkomitmen merancang pakaian yang tidak hanya memanjakan mata, melainkan juga ramah bagi kulit sepanjang hari.',
      'Setiap gaun organza kami selalu dilapisi 100% katun voile yang menyerap keringat dengan baik, sementara sulaman kerah dikerjakan dengan benang katun lembut agar bagian dalam tetap halus tanpa gesekan.',
    ],
    stylingTips: [
      'Selalu cek komposisi lapisan furing sebelum memilih busana organza atau sifon.',
      'Simpan busana berbahan halus dengan gantungan berlapis busa atau kain untuk menjaga bentuk bahu.',
    ],
  },
];

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
