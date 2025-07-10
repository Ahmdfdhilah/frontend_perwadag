export interface Kuesioner {
  id: string;
  tanggal: string;
  tanggalMulaiEvaluasi: string;
  tanggalAkhirEvaluasi: string;
  perwadagId: string;
  perwadagName: string;
  dokumen?: string;
  year: number;
  inspektorat: number;
}

export const KUESIONER_DATA: Kuesioner[] = [
  {
    id: "KS001",
    tanggal: "2024-05-16",
    tanggalMulaiEvaluasi: "2024-05-15",
    tanggalAkhirEvaluasi: "2024-05-22",
    perwadagId: "PWD001",
    perwadagName: "Atdag Moscow – Rusia",
    dokumen: "ks001-kuesioner.pdf",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "KS002",
    tanggal: "2024-05-21",
    tanggalMulaiEvaluasi: "2024-05-20",
    tanggalAkhirEvaluasi: "2024-05-27",
    perwadagId: "PWD002",
    perwadagName: "ITPC Vancouver – Canada",
    dokumen: "ks002-kuesioner.pdf",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "KS003",
    tanggal: "2024-06-11",
    tanggalMulaiEvaluasi: "2024-06-10",
    tanggalAkhirEvaluasi: "2024-06-17",
    perwadagId: "PWD010",
    perwadagName: "Atdag Beijing – Tiongkok",
    dokumen: "ks003-kuesioner.pdf",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "KS004",
    tanggal: "2024-06-16",
    tanggalMulaiEvaluasi: "2024-06-15",
    tanggalAkhirEvaluasi: "2024-06-22",
    perwadagId: "PWD011",
    perwadagName: "ITPC Osaka – Jepang",
    dokumen: "ks004-kuesioner.pdf",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "KS005",
    tanggal: "2024-07-06",
    tanggalMulaiEvaluasi: "2024-07-05",
    tanggalAkhirEvaluasi: "2024-07-12",
    perwadagId: "PWD019",
    perwadagName: "Atdag New Delhi – India",
    dokumen: "ks005-kuesioner.pdf",
    year: 2024,
    inspektorat: 3
  },
  {
    id: "KS006",
    tanggal: "2024-07-13",
    tanggalMulaiEvaluasi: "2024-07-12",
    tanggalAkhirEvaluasi: "2024-07-19",
    perwadagId: "PWD020",
    perwadagName: "ITPC Mumbai – India",
    dokumen: "ks006-kuesioner.pdf",
    year: 2024,
    inspektorat: 3
  },
  {
    id: "KS007",
    tanggal: "2024-08-09",
    tanggalMulaiEvaluasi: "2024-08-08",
    tanggalAkhirEvaluasi: "2024-08-15",
    perwadagId: "PWD028",
    perwadagName: "Atdag Hamburg – Jerman",
    dokumen: "ks007-kuesioner.pdf",
    year: 2024,
    inspektorat: 4
  },
  {
    id: "KS008",
    tanggal: "2024-08-16",
    tanggalMulaiEvaluasi: "2024-08-15",
    tanggalAkhirEvaluasi: "2024-08-22",
    perwadagId: "PWD029",
    perwadagName: "ITPC Duesseldorf – Jerman",
    dokumen: "ks008-kuesioner.pdf",
    year: 2024,
    inspektorat: 4
  },
  {
    id: "KS009",
    tanggal: "2023-12-11",
    tanggalMulaiEvaluasi: "2023-12-10",
    tanggalAkhirEvaluasi: "2023-12-17",
    perwadagId: "PWD003",
    perwadagName: "Konsuldag Los Angeles – Amerika Serikat",
    dokumen: "ks009-kuesioner.pdf",
    year: 2023,
    inspektorat: 1
  },
  {
    id: "KS010",
    tanggal: "2023-12-19",
    tanggalMulaiEvaluasi: "2023-12-18",
    tanggalAkhirEvaluasi: "2023-12-25",
    perwadagId: "PWD004",
    perwadagName: "KDEI New York – Amerika Serikat",
    dokumen: "ks010-kuesioner.pdf",
    year: 2023,
    inspektorat: 1
  },
  {
    id: "KS011",
    tanggal: "2023-01-06",
    tanggalMulaiEvaluasi: "2023-01-05",
    tanggalAkhirEvaluasi: "2023-01-12",
    perwadagId: "PWD012",
    perwadagName: "Konsuldag Busan – Korea Selatan",
    dokumen: "ks011-kuesioner.pdf",
    year: 2023,
    inspektorat: 2
  },
  {
    id: "KS012",
    tanggal: "2023-01-13",
    tanggalMulaiEvaluasi: "2023-01-12",
    tanggalAkhirEvaluasi: "2023-01-19",
    perwadagId: "PWD013",
    perwadagName: "KDEI Seoul – Korea Selatan",
    dokumen: "ks012-kuesioner.pdf",
    year: 2023,
    inspektorat: 2
  },
  {
    id: "KS013",
    tanggal: "2022-12-21",
    tanggalMulaiEvaluasi: "2022-12-20",
    tanggalAkhirEvaluasi: "2022-12-27",
    perwadagId: "PWD021",
    perwadagName: "Konsuldag Karachi – Pakistan",
    dokumen: "ks013-kuesioner.pdf",
    year: 2022,
    inspektorat: 3
  },
  {
    id: "KS014",
    tanggal: "2022-12-29",
    tanggalMulaiEvaluasi: "2022-12-28",
    tanggalAkhirEvaluasi: "2023-01-04",
    perwadagId: "PWD022",
    perwadagName: "KDEI Islamabad – Pakistan",
    dokumen: "ks014-kuesioner.pdf",
    year: 2022,
    inspektorat: 3
  },
  {
    id: "KS015",
    tanggal: "2022-01-16",
    tanggalMulaiEvaluasi: "2022-01-15",
    tanggalAkhirEvaluasi: "2022-01-22",
    perwadagId: "PWD030",
    perwadagName: "Konsuldag Milan – Italia",
    dokumen: "ks015-kuesioner.pdf",
    year: 2022,
    inspektorat: 4
  },
  {
    id: "KS016",
    tanggal: "2024-09-11",
    tanggalMulaiEvaluasi: "2024-09-10",
    tanggalAkhirEvaluasi: "2024-09-17",
    perwadagId: "PWD005",
    perwadagName: "Atdag London – Inggris",
    dokumen: "ks016-kuesioner.pdf",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "KS017",
    tanggal: "2024-09-16",
    tanggalMulaiEvaluasi: "2024-09-15",
    tanggalAkhirEvaluasi: "2024-09-22",
    perwadagId: "PWD006",
    perwadagName: "ITPC Birmingham – Inggris",
    dokumen: "ks017-kuesioner.pdf",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "KS018",
    tanggal: "2024-10-09",
    tanggalMulaiEvaluasi: "2024-10-08",
    tanggalAkhirEvaluasi: "2024-10-15",
    perwadagId: "PWD014",
    perwadagName: "Konsuldag Singapore – Singapura",
    dokumen: "ks018-kuesioner.pdf",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "KS019",
    tanggal: "2024-10-13",
    tanggalMulaiEvaluasi: "2024-10-12",
    tanggalAkhirEvaluasi: "2024-10-19",
    perwadagId: "PWD015",
    perwadagName: "KDEI Singapore – Singapura",
    dokumen: "ks019-kuesioner.pdf",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "KS020",
    tanggal: "2024-11-06",
    tanggalMulaiEvaluasi: "2024-11-05",
    tanggalAkhirEvaluasi: "2024-11-12",
    perwadagId: "PWD023",
    perwadagName: "Atdag Riyadh – Arab Saudi",
    dokumen: "ks020-kuesioner.pdf",
    year: 2024,
    inspektorat: 3
  }
];

export const YEARS_KUESIONER = Array.from(
  new Set(KUESIONER_DATA.map(item => item.year))
).sort((a, b) => b - a);

export const getKuesionerStatus = (item: Kuesioner): string => {
  const hasDokumen = !!item.dokumen;
  
  if (hasDokumen) {
    return 'Tersedia';
  } else {
    return 'Belum Upload';
  }
};