export interface Kuesioner {
  id: string;
  tanggal: string;
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
    tanggal: "2024-05-15",
    perwadagId: "PWD001",
    perwadagName: "Atdag Moscow – Rusia",
    aspek: "Tata Kelola Keuangan",
    linkDokumen: "https://drive.google.com/file/d/ks001-kuesioner/view",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "KS002",
    tanggal: "2024-05-20",
    perwadagId: "PWD002",
    perwadagName: "ITPC Vancouver – Canada",
    aspek: "Manajemen SDM",
    linkDokumen: "https://drive.google.com/file/d/ks002-kuesioner/view",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "KS003",
    tanggal: "2024-06-10",
    perwadagId: "PWD010",
    perwadagName: "Atdag Beijing – Tiongkok",
    aspek: "Promosi Dagang",
    linkDokumen: "https://drive.google.com/file/d/ks003-kuesioner/view",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "KS004",
    tanggal: "2024-06-15",
    perwadagId: "PWD011",
    perwadagName: "ITPC Osaka – Jepang",
    aspek: "Fasilitasi Ekspor",
    linkDokumen: "https://drive.google.com/file/d/ks004-kuesioner/view",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "KS005",
    tanggal: "2024-07-05",
    perwadagId: "PWD019",
    perwadagName: "Atdag New Delhi – India",
    aspek: "Tata Kelola Keuangan",
    linkDokumen: "https://drive.google.com/file/d/ks005-kuesioner/view",
    year: 2024,
    inspektorat: 3
  },
  {
    id: "KS006",
    tanggal: "2024-07-12",
    perwadagId: "PWD020",
    perwadagName: "ITPC Mumbai – India",
    aspek: "Manajemen SDM",
    linkDokumen: "https://drive.google.com/file/d/ks006-kuesioner/view",
    year: 2024,
    inspektorat: 3
  },
  {
    id: "KS007",
    tanggal: "2024-08-08",
    perwadagId: "PWD028",
    perwadagName: "Atdag Hamburg – Jerman",
    aspek: "Promosi Dagang",
    linkDokumen: "https://drive.google.com/file/d/ks007-kuesioner/view",
    year: 2024,
    inspektorat: 4
  },
  {
    id: "KS008",
    tanggal: "2024-08-15",
    perwadagId: "PWD029",
    perwadagName: "ITPC Duesseldorf – Jerman",
    aspek: "Fasilitasi Ekspor",
    linkDokumen: "https://drive.google.com/file/d/ks008-kuesioner/view",
    year: 2024,
    inspektorat: 4
  },
  {
    id: "KS009",
    tanggal: "2023-12-10",
    perwadagId: "PWD003",
    perwadagName: "Konsuldag Los Angeles – Amerika Serikat",
    aspek: "Tata Kelola Keuangan",
    linkDokumen: "https://drive.google.com/file/d/ks009-kuesioner/view",
    year: 2023,
    inspektorat: 1
  },
  {
    id: "KS010",
    tanggal: "2023-12-18",
    perwadagId: "PWD004",
    perwadagName: "KDEI New York – Amerika Serikat",
    aspek: "Manajemen SDM",
    linkDokumen: "https://drive.google.com/file/d/ks010-kuesioner/view",
    year: 2023,
    inspektorat: 1
  },
  {
    id: "KS011",
    tanggal: "2023-01-05",
    perwadagId: "PWD012",
    perwadagName: "Konsuldag Busan – Korea Selatan",
    aspek: "Promosi Dagang",
    linkDokumen: "https://drive.google.com/file/d/ks011-kuesioner/view",
    year: 2023,
    inspektorat: 2
  },
  {
    id: "KS012",
    tanggal: "2023-01-12",
    perwadagId: "PWD013",
    perwadagName: "KDEI Seoul – Korea Selatan",
    aspek: "Fasilitasi Ekspor",
    linkDokumen: "https://drive.google.com/file/d/ks012-kuesioner/view",
    year: 2023,
    inspektorat: 2
  },
  {
    id: "KS013",
    tanggal: "2022-12-20",
    perwadagId: "PWD021",
    perwadagName: "Konsuldag Karachi – Pakistan",
    aspek: "Tata Kelola Keuangan",
    linkDokumen: "https://drive.google.com/file/d/ks013-kuesioner/view",
    year: 2022,
    inspektorat: 3
  },
  {
    id: "KS014",
    tanggal: "2022-12-28",
    perwadagId: "PWD022",
    perwadagName: "KDEI Islamabad – Pakistan",
    aspek: "Manajemen SDM",
    linkDokumen: "https://drive.google.com/file/d/ks014-kuesioner/view",
    year: 2022,
    inspektorat: 3
  },
  {
    id: "KS015",
    tanggal: "2022-01-15",
    perwadagId: "PWD030",
    perwadagName: "Konsuldag Milan – Italia",
    aspek: "Promosi Dagang",
    linkDokumen: "https://drive.google.com/file/d/ks015-kuesioner/view",
    year: 2022,
    inspektorat: 4
  },
  {
    id: "KS016",
    tanggal: "2024-09-10",
    perwadagId: "PWD005",
    perwadagName: "Atdag London – Inggris",
    aspek: "Fasilitasi Ekspor",
    linkDokumen: "https://drive.google.com/file/d/ks016-kuesioner/view",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "KS017",
    tanggal: "2024-09-15",
    perwadagId: "PWD006",
    perwadagName: "ITPC Birmingham – Inggris",
    aspek: "Tata Kelola Keuangan",
    linkDokumen: "https://drive.google.com/file/d/ks017-kuesioner/view",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "KS018",
    tanggal: "2024-10-08",
    perwadagId: "PWD014",
    perwadagName: "Konsuldag Singapore – Singapura",
    aspek: "Manajemen SDM",
    linkDokumen: "https://drive.google.com/file/d/ks018-kuesioner/view",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "KS019",
    tanggal: "2024-10-12",
    perwadagId: "PWD015",
    perwadagName: "KDEI Singapore – Singapura",
    aspek: "Promosi Dagang",
    linkDokumen: "https://drive.google.com/file/d/ks019-kuesioner/view",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "KS020",
    tanggal: "2024-11-05",
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

export const ASPEK_OPTIONS = [
  "Tata Kelola Keuangan",
  "Manajemen SDM",
  "Promosi Dagang",
  "Fasilitasi Ekspor",
  "Pelayanan Konsular",
  "Administrasi Umum"
] as const;