export interface LaporanHasilEvaluasi {
  id: string;
  tanggal: string;
  tanggalMulaiEvaluasi: string;
  tanggalAkhirEvaluasi: string;
  perwadagId: string;
  perwadagName: string;
  nomorEvaluasi: string;
  matriks: string;
  uploadFile?: string;
  uploadFileUrl?: string;
  year: number;
  inspektorat: number;
}

export const LAPORAN_HASIL_EVALUASI_DATA: LaporanHasilEvaluasi[] = [
  {
    id: "LHE001",
    tanggal: "2024-05-23",
    tanggalMulaiEvaluasi: "2024-05-15",
    tanggalAkhirEvaluasi: "2024-05-22",
    perwadagId: "PWD001",
    perwadagName: "Atdag Moscow – Rusia",
    nomorEvaluasi: "LHE/001/2024",
    matriks: "Sangat Baik",
    uploadFile: "laporan-hasil-evaluasi-atdag-moscow-2024.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-atdag-moscow-2024.pdf",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "LHE002",
    tanggal: "2024-05-28",
    tanggalMulaiEvaluasi: "2024-05-20",
    tanggalAkhirEvaluasi: "2024-05-27",
    perwadagId: "PWD002",
    perwadagName: "ITPC Vancouver – Canada",
    nomorEvaluasi: "LHE/002/2024",
    matriks: "Baik",
    uploadFile: "laporan-hasil-evaluasi-itpc-vancouver-2024.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-itpc-vancouver-2024.pdf",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "LHE003",
    tanggal: "2024-06-18",
    tanggalMulaiEvaluasi: "2024-06-10",
    tanggalAkhirEvaluasi: "2024-06-17",
    perwadagId: "PWD010",
    perwadagName: "Atdag Beijing – Tiongkok",
    nomorEvaluasi: "LHE/003/2024",
    matriks: "Sangat Baik",
    uploadFile: "laporan-hasil-evaluasi-atdag-beijing-2024.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-atdag-beijing-2024.pdf",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "LHE004",
    tanggal: "2024-06-23",
    tanggalMulaiEvaluasi: "2024-06-15",
    tanggalAkhirEvaluasi: "2024-06-22",
    perwadagId: "PWD011",
    perwadagName: "ITPC Osaka – Jepang",
    nomorEvaluasi: "LHE/004/2024",
    matriks: "Baik",
    uploadFile: "laporan-hasil-evaluasi-itpc-osaka-2024.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-itpc-osaka-2024.pdf",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "LHE005",
    tanggal: "2024-07-13",
    tanggalMulaiEvaluasi: "2024-07-05",
    tanggalAkhirEvaluasi: "2024-07-12",
    perwadagId: "PWD019",
    perwadagName: "Atdag New Delhi – India",
    nomorEvaluasi: "LHE/005/2024",
    matriks: "Cukup",
    uploadFile: "laporan-hasil-evaluasi-atdag-newdelhi-2024.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-atdag-newdelhi-2024.pdf",
    year: 2024,
    inspektorat: 3
  },
];

export const YEARS_LAPORAN_HASIL_EVALUASI = Array.from(
  new Set(LAPORAN_HASIL_EVALUASI_DATA.map(item => item.year))
).sort((a, b) => b - a);

export const MATRIKS_OPTIONS = [
  "Sangat Baik",
  "Baik",
  "Cukup",
  "Kurang"
] as const;