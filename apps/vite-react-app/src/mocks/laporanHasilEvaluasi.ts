export interface LaporanHasilEvaluasi {
  id: string;
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
  {
    id: "LHE006",
    tanggalMulaiEvaluasi: "2024-07-12",
    tanggalAkhirEvaluasi: "2024-07-19",
    perwadagId: "PWD020",
    perwadagName: "ITPC Mumbai – India",
    nomorEvaluasi: "LHE/006/2024",
    matriks: "Baik",
    uploadFile: "laporan-hasil-evaluasi-itpc-mumbai-2024.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-itpc-mumbai-2024.pdf",
    year: 2024,
    inspektorat: 3
  },
  {
    id: "LHE007",
    tanggalMulaiEvaluasi: "2024-08-08",
    tanggalAkhirEvaluasi: "2024-08-15",
    perwadagId: "PWD028",
    perwadagName: "Atdag Hamburg – Jerman",
    nomorEvaluasi: "LHE/007/2024",
    matriks: "Sangat Baik",
    uploadFile: "laporan-hasil-evaluasi-atdag-hamburg-2024.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-atdag-hamburg-2024.pdf",
    year: 2024,
    inspektorat: 4
  },
  {
    id: "LHE008",
    tanggalMulaiEvaluasi: "2024-08-15",
    tanggalAkhirEvaluasi: "2024-08-22",
    perwadagId: "PWD029",
    perwadagName: "ITPC Duesseldorf – Jerman",
    nomorEvaluasi: "LHE/008/2024",
    matriks: "Baik",
    uploadFile: "laporan-hasil-evaluasi-itpc-duesseldorf-2024.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-itpc-duesseldorf-2024.pdf",
    year: 2024,
    inspektorat: 4
  },
  {
    id: "LHE009",
    tanggalMulaiEvaluasi: "2023-12-10",
    tanggalAkhirEvaluasi: "2023-12-17",
    perwadagId: "PWD003",
    perwadagName: "Konsuldag Los Angeles – Amerika Serikat",
    nomorEvaluasi: "LHE/009/2023",
    matriks: "Baik",
    uploadFile: "laporan-hasil-evaluasi-konsuldag-losangeles-2023.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-konsuldag-losangeles-2023.pdf",
    year: 2023,
    inspektorat: 1
  },
  {
    id: "LHE010",
    tanggalMulaiEvaluasi: "2023-12-18",
    tanggalAkhirEvaluasi: "2023-12-25",
    perwadagId: "PWD004",
    perwadagName: "KDEI New York – Amerika Serikat",
    nomorEvaluasi: "LHE/010/2023",
    matriks: "Sangat Baik",
    uploadFile: "laporan-hasil-evaluasi-kdei-newyork-2023.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-kdei-newyork-2023.pdf",
    year: 2023,
    inspektorat: 1
  },
  {
    id: "LHE011",
    tanggalMulaiEvaluasi: "2023-01-05",
    tanggalAkhirEvaluasi: "2023-01-12",
    perwadagId: "PWD012",
    perwadagName: "Konsuldag Busan – Korea Selatan",
    nomorEvaluasi: "LHE/011/2023",
    matriks: "Cukup",
    uploadFile: "laporan-hasil-evaluasi-konsuldag-busan-2023.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-konsuldag-busan-2023.pdf",
    year: 2023,
    inspektorat: 2
  },
  {
    id: "LHE012",
    tanggalMulaiEvaluasi: "2023-01-12",
    tanggalAkhirEvaluasi: "2023-01-19",
    perwadagId: "PWD013",
    perwadagName: "KDEI Seoul – Korea Selatan",
    nomorEvaluasi: "LHE/012/2023",
    matriks: "Baik",
    uploadFile: "laporan-hasil-evaluasi-kdei-seoul-2023.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-kdei-seoul-2023.pdf",
    year: 2023,
    inspektorat: 2
  },
  {
    id: "LHE013",
    tanggalMulaiEvaluasi: "2022-12-20",
    tanggalAkhirEvaluasi: "2022-12-27",
    perwadagId: "PWD021",
    perwadagName: "Konsuldag Karachi – Pakistan",
    nomorEvaluasi: "LHE/013/2022",
    matriks: "Baik",
    uploadFile: "laporan-hasil-evaluasi-konsuldag-karachi-2022.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-konsuldag-karachi-2022.pdf",
    year: 2022,
    inspektorat: 3
  },
  {
    id: "LHE014",
    tanggalMulaiEvaluasi: "2022-12-28",
    tanggalAkhirEvaluasi: "2023-01-04",
    perwadagId: "PWD022",
    perwadagName: "KDEI Islamabad – Pakistan",
    nomorEvaluasi: "LHE/014/2022",
    matriks: "Sangat Baik",
    uploadFile: "laporan-hasil-evaluasi-kdei-islamabad-2022.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-kdei-islamabad-2022.pdf",
    year: 2022,
    inspektorat: 3
  },
  {
    id: "LHE015",
    tanggalMulaiEvaluasi: "2022-01-15",
    tanggalAkhirEvaluasi: "2022-01-22",
    perwadagId: "PWD030",
    perwadagName: "Konsuldag Milan – Italia",
    nomorEvaluasi: "LHE/015/2022",
    matriks: "Cukup",
    uploadFile: "laporan-hasil-evaluasi-konsuldag-milan-2022.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-konsuldag-milan-2022.pdf",
    year: 2022,
    inspektorat: 4
  },
  {
    id: "LHE016",
    tanggalMulaiEvaluasi: "2024-09-10",
    tanggalAkhirEvaluasi: "2024-09-17",
    perwadagId: "PWD005",
    perwadagName: "Atdag London – Inggris",
    nomorEvaluasi: "LHE/016/2024",
    matriks: "Baik",
    uploadFile: "laporan-hasil-evaluasi-atdag-london-2024.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-atdag-london-2024.pdf",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "LHE017",
    tanggalMulaiEvaluasi: "2024-09-15",
    tanggalAkhirEvaluasi: "2024-09-22",
    perwadagId: "PWD006",
    perwadagName: "ITPC Birmingham – Inggris",
    nomorEvaluasi: "LHE/017/2024",
    matriks: "Sangat Baik",
    uploadFile: "laporan-hasil-evaluasi-itpc-birmingham-2024.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-itpc-birmingham-2024.pdf",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "LHE018",
    tanggalMulaiEvaluasi: "2024-10-08",
    tanggalAkhirEvaluasi: "2024-10-15",
    perwadagId: "PWD014",
    perwadagName: "Konsuldag Singapore – Singapura",
    nomorEvaluasi: "LHE/018/2024",
    matriks: "Baik",
    uploadFile: "laporan-hasil-evaluasi-konsuldag-singapore-2024.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-konsuldag-singapore-2024.pdf",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "LHE019",
    tanggalMulaiEvaluasi: "2024-10-12",
    tanggalAkhirEvaluasi: "2024-10-19",
    perwadagId: "PWD015",
    perwadagName: "KDEI Singapore – Singapura",
    nomorEvaluasi: "LHE/019/2024",
    matriks: "Sangat Baik",
    uploadFile: "laporan-hasil-evaluasi-kdei-singapore-2024.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-kdei-singapore-2024.pdf",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "LHE020",
    tanggalMulaiEvaluasi: "2024-11-05",
    tanggalAkhirEvaluasi: "2024-11-12",
    perwadagId: "PWD023",
    perwadagName: "Atdag Riyadh – Arab Saudi",
    nomorEvaluasi: "LHE/020/2024",
    matriks: "Cukup",
    uploadFile: "laporan-hasil-evaluasi-atdag-riyadh-2024.pdf",
    uploadFileUrl: "blob:http://localhost:3000/laporan-hasil-evaluasi-atdag-riyadh-2024.pdf",
    year: 2024,
    inspektorat: 3
  }
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