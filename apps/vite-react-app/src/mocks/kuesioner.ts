export interface Kuesioner {
  id: string;
  tanggalMulaiEvaluasi: string;
  tanggalAkhirEvaluasi: string;
  perwadagId: string;
  perwadagName: string;
  aspek: string;
  linkDokumen?: string;
  year: number;
  inspektorat: number;
}

export const KUESIONER_DATA: Kuesioner[] = [
  {
    id: "KS001",
    tanggalMulaiEvaluasi: "2024-05-15",
    tanggalAkhirEvaluasi: "2024-05-22",
    perwadagId: "PWD001",
    perwadagName: "Atdag Moscow – Rusia",
    aspek: "Tata Kelola Keuangan",
    linkDokumen: "https://drive.google.com/file/d/ks001-kuesioner/view",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "KS002",
    tanggalMulaiEvaluasi: "2024-05-20",
    tanggalAkhirEvaluasi: "2024-05-27",
    perwadagId: "PWD002",
    perwadagName: "ITPC Vancouver – Canada",
    aspek: "Manajemen SDM",
    linkDokumen: "https://drive.google.com/file/d/ks002-kuesioner/view",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "KS003",
    tanggalMulaiEvaluasi: "2024-06-10",
    tanggalAkhirEvaluasi: "2024-06-17",
    perwadagId: "PWD010",
    perwadagName: "Atdag Beijing – Tiongkok",
    aspek: "Promosi Dagang",
    linkDokumen: "https://drive.google.com/file/d/ks003-kuesioner/view",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "KS004",
    tanggalMulaiEvaluasi: "2024-06-15",
    tanggalAkhirEvaluasi: "2024-06-22",
    perwadagId: "PWD011",
    perwadagName: "ITPC Osaka – Jepang",
    aspek: "Fasilitasi Ekspor",
    linkDokumen: "https://drive.google.com/file/d/ks004-kuesioner/view",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "KS005",
    tanggalMulaiEvaluasi: "2024-07-05",
    tanggalAkhirEvaluasi: "2024-07-12",
    perwadagId: "PWD019",
    perwadagName: "Atdag New Delhi – India",
    aspek: "Tata Kelola Keuangan",
    linkDokumen: "https://drive.google.com/file/d/ks005-kuesioner/view",
    year: 2024,
    inspektorat: 3
  },
  {
    id: "KS006",
    tanggalMulaiEvaluasi: "2024-07-12",
    tanggalAkhirEvaluasi: "2024-07-19",
    perwadagId: "PWD020",
    perwadagName: "ITPC Mumbai – India",
    aspek: "Manajemen SDM",
    linkDokumen: "https://drive.google.com/file/d/ks006-kuesioner/view",
    year: 2024,
    inspektorat: 3
  },
  {
    id: "KS007",
    tanggalMulaiEvaluasi: "2024-08-08",
    tanggalAkhirEvaluasi: "2024-08-15",
    perwadagId: "PWD028",
    perwadagName: "Atdag Hamburg – Jerman",
    aspek: "Promosi Dagang",
    linkDokumen: "https://drive.google.com/file/d/ks007-kuesioner/view",
    year: 2024,
    inspektorat: 4
  },
  {
    id: "KS008",
    tanggalMulaiEvaluasi: "2024-08-15",
    tanggalAkhirEvaluasi: "2024-08-22",
    perwadagId: "PWD029",
    perwadagName: "ITPC Duesseldorf – Jerman",
    aspek: "Fasilitasi Ekspor",
    linkDokumen: "https://drive.google.com/file/d/ks008-kuesioner/view",
    year: 2024,
    inspektorat: 4
  },
  {
    id: "KS009",
    tanggalMulaiEvaluasi: "2023-12-10",
    tanggalAkhirEvaluasi: "2023-12-17",
    perwadagId: "PWD003",
    perwadagName: "Konsuldag Los Angeles – Amerika Serikat",
    aspek: "Tata Kelola Keuangan",
    linkDokumen: "https://drive.google.com/file/d/ks009-kuesioner/view",
    year: 2023,
    inspektorat: 1
  },
  {
    id: "KS010",
    tanggalMulaiEvaluasi: "2023-12-18",
    tanggalAkhirEvaluasi: "2023-12-25",
    perwadagId: "PWD004",
    perwadagName: "KDEI New York – Amerika Serikat",
    aspek: "Manajemen SDM",
    linkDokumen: "https://drive.google.com/file/d/ks010-kuesioner/view",
    year: 2023,
    inspektorat: 1
  },
  {
    id: "KS011",
    tanggalMulaiEvaluasi: "2023-01-05",
    tanggalAkhirEvaluasi: "2023-01-12",
    perwadagId: "PWD012",
    perwadagName: "Konsuldag Busan – Korea Selatan",
    aspek: "Promosi Dagang",
    linkDokumen: "https://drive.google.com/file/d/ks011-kuesioner/view",
    year: 2023,
    inspektorat: 2
  },
  {
    id: "KS012",
    tanggalMulaiEvaluasi: "2023-01-12",
    tanggalAkhirEvaluasi: "2023-01-19",
    perwadagId: "PWD013",
    perwadagName: "KDEI Seoul – Korea Selatan",
    aspek: "Fasilitasi Ekspor",
    linkDokumen: "https://drive.google.com/file/d/ks012-kuesioner/view",
    year: 2023,
    inspektorat: 2
  },
  {
    id: "KS013",
    tanggalMulaiEvaluasi: "2022-12-20",
    tanggalAkhirEvaluasi: "2022-12-27",
    perwadagId: "PWD021",
    perwadagName: "Konsuldag Karachi – Pakistan",
    aspek: "Tata Kelola Keuangan",
    linkDokumen: "https://drive.google.com/file/d/ks013-kuesioner/view",
    year: 2022,
    inspektorat: 3
  },
  {
    id: "KS014",
    tanggalMulaiEvaluasi: "2022-12-28",
    tanggalAkhirEvaluasi: "2023-01-04",
    perwadagId: "PWD022",
    perwadagName: "KDEI Islamabad – Pakistan",
    aspek: "Manajemen SDM",
    linkDokumen: "https://drive.google.com/file/d/ks014-kuesioner/view",
    year: 2022,
    inspektorat: 3
  },
  {
    id: "KS015",
    tanggalMulaiEvaluasi: "2022-01-15",
    tanggalAkhirEvaluasi: "2022-01-22",
    perwadagId: "PWD030",
    perwadagName: "Konsuldag Milan – Italia",
    aspek: "Promosi Dagang",
    linkDokumen: "https://drive.google.com/file/d/ks015-kuesioner/view",
    year: 2022,
    inspektorat: 4
  },
  {
    id: "KS016",
    tanggalMulaiEvaluasi: "2024-09-10",
    tanggalAkhirEvaluasi: "2024-09-17",
    perwadagId: "PWD005",
    perwadagName: "Atdag London – Inggris",
    aspek: "Fasilitasi Ekspor",
    linkDokumen: "https://drive.google.com/file/d/ks016-kuesioner/view",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "KS017",
    tanggalMulaiEvaluasi: "2024-09-15",
    tanggalAkhirEvaluasi: "2024-09-22",
    perwadagId: "PWD006",
    perwadagName: "ITPC Birmingham – Inggris",
    aspek: "Tata Kelola Keuangan",
    linkDokumen: "https://drive.google.com/file/d/ks017-kuesioner/view",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "KS018",
    tanggalMulaiEvaluasi: "2024-10-08",
    tanggalAkhirEvaluasi: "2024-10-15",
    perwadagId: "PWD014",
    perwadagName: "Konsuldag Singapore – Singapura",
    aspek: "Manajemen SDM",
    linkDokumen: "https://drive.google.com/file/d/ks018-kuesioner/view",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "KS019",
    tanggalMulaiEvaluasi: "2024-10-12",
    tanggalAkhirEvaluasi: "2024-10-19",
    perwadagId: "PWD015",
    perwadagName: "KDEI Singapore – Singapura",
    aspek: "Promosi Dagang",
    linkDokumen: "https://drive.google.com/file/d/ks019-kuesioner/view",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "KS020",
    tanggalMulaiEvaluasi: "2024-11-05",
    tanggalAkhirEvaluasi: "2024-11-12",
    perwadagId: "PWD023",
    perwadagName: "Atdag Riyadh – Arab Saudi",
    aspek: "Fasilitasi Ekspor",
    linkDokumen: "https://drive.google.com/file/d/ks020-kuesioner/view",
    year: 2024,
    inspektorat: 3
  }
];

export const YEARS_KUESIONER = Array.from(
  new Set(KUESIONER_DATA.map(item => item.year))
).sort((a, b) => b - a);