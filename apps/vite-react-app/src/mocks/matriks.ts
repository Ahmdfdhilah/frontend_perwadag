export interface Matriks {
  id: string;
  tanggal: string;
  tanggalMulaiEvaluasi: string;
  tanggalAkhirEvaluasi: string;
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
    tanggalMulaiEvaluasi: "2024-06-15",
    tanggalAkhirEvaluasi: "2024-06-22",
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
    tanggalMulaiEvaluasi: "2024-06-20",
    tanggalAkhirEvaluasi: "2024-06-27",
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
    tanggalMulaiEvaluasi: "2024-07-10",
    tanggalAkhirEvaluasi: "2024-07-17",
    perwadagId: "PWD010",
    perwadagName: "Atdag Beijing – Tiongkok",
    status: "Diisi",
    temuan: "Program fasilitasi perdagangan menunjukkan hasil positif dengan peningkatan volume ekspor sebesar 15%.",
    rekomendasi: "Mempertahankan strategi yang sudah berjalan baik dan melakukan ekspansi program ke sektor komoditas lainnya.",
    year: 2024,
    inspektorat: 2
  },
];

export const YEARS_MATRIKS = Array.from(
  new Set(MATRIKS_DATA.map(item => item.year))
).sort((a, b) => b - a);

export const STATUS_OPTIONS = [
  "Diisi",
  "Belum Diisi"
] as const;