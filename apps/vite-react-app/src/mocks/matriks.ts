export interface Matriks {
  id: string;
  tanggal: string;
  perwadagId: string;
  perwadagName: string;
  status: 'Diisi' | 'Belum Diisi';
  temuan: string;
  rekomendasi: string;
  year: number;
  inspektorat: number;
}

export const MATRIKS_DATA: Matriks[] = [
  {
    id: "MTX001",
    tanggal: "2024-06-15",
    perwadagId: "PWD001",
    perwadagName: "Atdag Moscow – Rusia",
    status: "Diisi",
    temuan: "Kegiatan promosi perdagangan berjalan dengan baik, namun perlu peningkatan dalam dokumentasi kegiatan dan pelaporan berkala.",
    rekomendasi: "Meningkatkan sistem dokumentasi kegiatan dan membuat jadwal pelaporan yang lebih terstruktur untuk memudahkan monitoring.",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "MTX002",
    tanggal: "2024-06-20",
    perwadagId: "PWD002",
    perwadagName: "ITPC Vancouver – Canada",
    status: "Diisi",
    temuan: "Pelaksanaan program ITPC sudah sesuai target, tetapi masih ada kendala dalam koordinasi dengan stakeholder lokal.",
    rekomendasi: "Membuat mekanisme koordinasi yang lebih efektif dengan stakeholder lokal dan mengadakan pertemuan rutin bulanan.",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "MTX003",
    tanggal: "2024-07-10",
    perwadagId: "PWD010",
    perwadagName: "Atdag Beijing – Tiongkok",
    status: "Diisi",
    temuan: "Program fasilitasi perdagangan menunjukkan hasil positif dengan peningkatan volume ekspor sebesar 15%.",
    rekomendasi: "Mempertahankan strategi yang sudah berjalan baik dan melakukan ekspansi program ke sektor komoditas lainnya.",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "MTX004",
    tanggal: "2024-07-15",
    perwadagId: "PWD011",
    perwadagName: "ITPC Osaka – Jepang",
    status: "Belum Diisi",
    temuan: "",
    rekomendasi: "",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "MTX005",
    tanggal: "2024-08-05",
    perwadagId: "PWD019",
    perwadagName: "Atdag New Delhi – India",
    status: "Diisi",
    temuan: "Pelaksanaan misi dagang berjalan sesuai rencana, namun partisipasi eksportir Indonesia masih terbatas.",
    rekomendasi: "Meningkatkan sosialisasi program kepada eksportir dan memberikan insentif untuk meningkatkan partisipasi.",
    year: 2024,
    inspektorat: 3
  },
  {
    id: "MTX006",
    tanggal: "2024-08-12",
    perwadagId: "PWD020",
    perwadagName: "ITPC Mumbai – India",
    status: "Diisi",
    temuan: "Program capacity building untuk UMKM menunjukkan dampak positif dengan peningkatan kemampuan ekspor peserta.",
    rekomendasi: "Memperluas program capacity building ke lebih banyak UMKM dan menambah modul pelatihan digital marketing.",
    year: 2024,
    inspektorat: 3
  },
  {
    id: "MTX007",
    tanggal: "2024-09-08",
    perwadagId: "PWD028",
    perwadagName: "Atdag Hamburg – Jerman",
    status: "Belum Diisi",
    temuan: "",
    rekomendasi: "",
    year: 2024,
    inspektorat: 4
  },
  {
    id: "MTX008",
    tanggal: "2024-09-15",
    perwadagId: "PWD029",
    perwadagName: "ITPC Duesseldorf – Jerman",
    status: "Diisi",
    temuan: "Networking dengan importir lokal sudah terjalin baik, namun masih perlu peningkatan dalam hal kontrak jangka panjang.",
    rekomendasi: "Fokus pada pembangunan hubungan jangka panjang dengan importir dan membuat agreement yang lebih sustainable.",
    year: 2024,
    inspektorat: 4
  },
  {
    id: "MTX009",
    tanggal: "2023-11-10",
    perwadagId: "PWD003",
    perwadagName: "Konsuldag Los Angeles – Amerika Serikat",
    status: "Diisi",
    temuan: "Program Indonesia Trade Expo mendapat respons positif dari buyer Amerika, dengan total transaksi mencapai $2.5 juta.",
    rekomendasi: "Meningkatkan frekuensi trade expo dan mengundang lebih banyak buyer potensial dari berbagai negara bagian.",
    year: 2023,
    inspektorat: 1
  },
  {
    id: "MTX010",
    tanggal: "2023-11-18",
    perwadagId: "PWD004",
    perwadagName: "KDEI New York – Amerika Serikat",
    status: "Diisi",
    temuan: "Kegiatan diplomasi ekonomi berjalan efektif dengan tercapainya beberapa MoU perdagangan strategis.",
    rekomendasi: "Mempertahankan momentum diplomasi ekonomi dan melakukan follow-up implementasi MoU yang telah ditandatangani.",
    year: 2023,
    inspektorat: 1
  },
  {
    id: "MTX011",
    tanggal: "2023-12-05",
    perwadagId: "PWD012",
    perwadagName: "Konsuldag Busan – Korea Selatan",
    status: "Diisi",
    temuan: "Fasilitasi ekspor komoditas perikanan mengalami kendala dalam hal sertifikasi halal dan standar kualitas.",
    rekomendasi: "Membantu eksportir dalam proses sertifikasi halal dan memberikan guidance untuk memenuhi standar kualitas Korea Selatan.",
    year: 2023,
    inspektorat: 2
  },
  {
    id: "MTX012",
    tanggal: "2023-12-12",
    perwadagId: "PWD013",
    perwadagName: "KDEI Seoul – Korea Selatan",
    status: "Diisi",
    temuan: "Kerjasama dengan Korean Trade Authority berjalan baik dan membuka peluang ekspor baru untuk produk fashion Indonesia.",
    rekomendasi: "Memanfaatkan momentum kerjasama untuk mengembangkan brand Indonesia di pasar fashion Korea Selatan.",
    year: 2023,
    inspektorat: 2
  },
  {
    id: "MTX013",
    tanggal: "2022-10-20",
    perwadagId: "PWD021",
    perwadagName: "Konsuldag Karachi – Pakistan",
    status: "Diisi",
    temuan: "Program market intelligence berjalan dengan baik dan menghasilkan data pasar yang akurat untuk eksportir Indonesia.",
    rekomendasi: "Memperluas cakupan market intelligence ke lebih banyak sektor dan membuat publikasi regular untuk eksportir.",
    year: 2022,
    inspektorat: 3
  },
  {
    id: "MTX014",
    tanggal: "2022-10-28",
    perwadagId: "PWD022",
    perwadagName: "KDEI Islamabad – Pakistan",
    status: "Diisi",
    temuan: "Kegiatan business matching menunjukkan hasil yang memuaskan dengan tercapainya 25 kontrak perdagangan baru.",
    rekomendasi: "Meningkatkan kualitas business matching dengan pre-screening yang lebih ketat dan follow-up yang intensif.",
    year: 2022,
    inspektorat: 3
  },
  {
    id: "MTX015",
    tanggal: "2022-11-15",
    perwadagId: "PWD030",
    perwadagName: "Konsuldag Milan – Italia",
    status: "Belum Diisi",
    temuan: "",
    rekomendasi: "",
    year: 2022,
    inspektorat: 4
  }
];

export const YEARS_MATRIKS = Array.from(
  new Set(MATRIKS_DATA.map(item => item.year))
).sort((a, b) => b - a);

export const STATUS_OPTIONS = [
  "Diisi",
  "Belum Diisi"
] as const;