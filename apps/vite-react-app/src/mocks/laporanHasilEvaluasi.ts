export interface LaporanHasilEvaluasi {
  id: string;
  tanggal: string;
  perwadagId: string;
  perwadagName: string;
  nomorEvaluasi: string;
  matriks: string;
  uploadLink?: string;
  year: number;
  inspektorat: number;
}

export const LAPORAN_HASIL_EVALUASI_DATA: LaporanHasilEvaluasi[] = [
  {
    id: "LHE001",
    tanggal: "2024-05-15",
    perwadagId: "PWD001",
    perwadagName: "Atdag Moscow – Rusia",
    nomorEvaluasi: "LHE/001/2024",
    matriks: "Sangat Baik",
    uploadLink: "https://drive.google.com/file/d/lhe001-laporan/view",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "LHE002",
    tanggal: "2024-05-20",
    perwadagId: "PWD002",
    perwadagName: "ITPC Vancouver – Canada",
    nomorEvaluasi: "LHE/002/2024",
    matriks: "Baik",
    uploadLink: "https://drive.google.com/file/d/lhe002-laporan/view",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "LHE003",
    tanggal: "2024-06-10",
    perwadagId: "PWD010",
    perwadagName: "Atdag Beijing – Tiongkok",
    nomorEvaluasi: "LHE/003/2024",
    matriks: "Sangat Baik",
    uploadLink: "https://drive.google.com/file/d/lhe003-laporan/view",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "LHE004",
    tanggal: "2024-06-15",
    perwadagId: "PWD011",
    perwadagName: "ITPC Osaka – Jepang",
    nomorEvaluasi: "LHE/004/2024",
    matriks: "Baik",
    uploadLink: "https://drive.google.com/file/d/lhe004-laporan/view",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "LHE005",
    tanggal: "2024-07-05",
    perwadagId: "PWD019",
    perwadagName: "Atdag New Delhi – India",
    nomorEvaluasi: "LHE/005/2024",
    matriks: "Cukup",
    uploadLink: "https://drive.google.com/file/d/lhe005-laporan/view",
    year: 2024,
    inspektorat: 3
  },
  {
    id: "LHE006",
    tanggal: "2024-07-12",
    perwadagId: "PWD020",
    perwadagName: "ITPC Mumbai – India",
    nomorEvaluasi: "LHE/006/2024",
    matriks: "Baik",
    uploadLink: "https://drive.google.com/file/d/lhe006-laporan/view",
    year: 2024,
    inspektorat: 3
  },
  {
    id: "LHE007",
    tanggal: "2024-08-08",
    perwadagId: "PWD028",
    perwadagName: "Atdag Hamburg – Jerman",
    nomorEvaluasi: "LHE/007/2024",
    matriks: "Sangat Baik",
    uploadLink: "https://drive.google.com/file/d/lhe007-laporan/view",
    year: 2024,
    inspektorat: 4
  },
  {
    id: "LHE008",
    tanggal: "2024-08-15",
    perwadagId: "PWD029",
    perwadagName: "ITPC Duesseldorf – Jerman",
    nomorEvaluasi: "LHE/008/2024",
    matriks: "Baik",
    uploadLink: "https://drive.google.com/file/d/lhe008-laporan/view",
    year: 2024,
    inspektorat: 4
  },
  {
    id: "LHE009",
    tanggal: "2023-12-10",
    perwadagId: "PWD003",
    perwadagName: "Konsuldag Los Angeles – Amerika Serikat",
    nomorEvaluasi: "LHE/009/2023",
    matriks: "Baik",
    uploadLink: "https://drive.google.com/file/d/lhe009-laporan/view",
    year: 2023,
    inspektorat: 1
  },
  {
    id: "LHE010",
    tanggal: "2023-12-18",
    perwadagId: "PWD004",
    perwadagName: "KDEI New York – Amerika Serikat",
    nomorEvaluasi: "LHE/010/2023",
    matriks: "Sangat Baik",
    uploadLink: "https://drive.google.com/file/d/lhe010-laporan/view",
    year: 2023,
    inspektorat: 1
  },
  {
    id: "LHE011",
    tanggal: "2023-01-05",
    perwadagId: "PWD012",
    perwadagName: "Konsuldag Busan – Korea Selatan",
    nomorEvaluasi: "LHE/011/2023",
    matriks: "Cukup",
    uploadLink: "https://drive.google.com/file/d/lhe011-laporan/view",
    year: 2023,
    inspektorat: 2
  },
  {
    id: "LHE012",
    tanggal: "2023-01-12",
    perwadagId: "PWD013",
    perwadagName: "KDEI Seoul – Korea Selatan",
    nomorEvaluasi: "LHE/012/2023",
    matriks: "Baik",
    uploadLink: "https://drive.google.com/file/d/lhe012-laporan/view",
    year: 2023,
    inspektorat: 2
  },
  {
    id: "LHE013",
    tanggal: "2022-12-20",
    perwadagId: "PWD021",
    perwadagName: "Konsuldag Karachi – Pakistan",
    nomorEvaluasi: "LHE/013/2022",
    matriks: "Baik",
    uploadLink: "https://drive.google.com/file/d/lhe013-laporan/view",
    year: 2022,
    inspektorat: 3
  },
  {
    id: "LHE014",
    tanggal: "2022-12-28",
    perwadagId: "PWD022",
    perwadagName: "KDEI Islamabad – Pakistan",
    nomorEvaluasi: "LHE/014/2022",
    matriks: "Sangat Baik",
    uploadLink: "https://drive.google.com/file/d/lhe014-laporan/view",
    year: 2022,
    inspektorat: 3
  },
  {
    id: "LHE015",
    tanggal: "2022-01-15",
    perwadagId: "PWD030",
    perwadagName: "Konsuldag Milan – Italia",
    nomorEvaluasi: "LHE/015/2022",
    matriks: "Cukup",
    uploadLink: "https://drive.google.com/file/d/lhe015-laporan/view",
    year: 2022,
    inspektorat: 4
  },
  {
    id: "LHE016",
    tanggal: "2024-09-10",
    perwadagId: "PWD005",
    perwadagName: "Atdag London – Inggris",
    nomorEvaluasi: "LHE/016/2024",
    matriks: "Baik",
    uploadLink: "https://drive.google.com/file/d/lhe016-laporan/view",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "LHE017",
    tanggal: "2024-09-15",
    perwadagId: "PWD006",
    perwadagName: "ITPC Birmingham – Inggris",
    nomorEvaluasi: "LHE/017/2024",
    matriks: "Sangat Baik",
    uploadLink: "https://drive.google.com/file/d/lhe017-laporan/view",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "LHE018",
    tanggal: "2024-10-08",
    perwadagId: "PWD014",
    perwadagName: "Konsuldag Singapore – Singapura",
    nomorEvaluasi: "LHE/018/2024",
    matriks: "Baik",
    uploadLink: "https://drive.google.com/file/d/lhe018-laporan/view",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "LHE019",
    tanggal: "2024-10-12",
    perwadagId: "PWD015",
    perwadagName: "KDEI Singapore – Singapura",
    nomorEvaluasi: "LHE/019/2024",
    matriks: "Sangat Baik",
    uploadLink: "https://drive.google.com/file/d/lhe019-laporan/view",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "LHE020",
    tanggal: "2024-11-05",
    perwadagId: "PWD023",
    perwadagName: "Atdag Riyadh – Arab Saudi",
    nomorEvaluasi: "LHE/020/2024",
    matriks: "Cukup",
    uploadLink: "https://drive.google.com/file/d/lhe020-laporan/view",
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