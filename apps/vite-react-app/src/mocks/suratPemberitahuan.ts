export interface SuratPemberitahuan {
  id: string;
  tanggalEvaluasi: string;
  tanggalSuratPemberitahuan: string;
  perwadagId: string;
  perwadagName: string;
  fileName?: string;
  fileUrl?: string;
  status: 'uploaded' | 'not_uploaded';
  year: number;
  inspektorat: number;
}

export const SURAT_PEMBERITAHUAN_DATA: SuratPemberitahuan[] = [
  // 2024 Data
  {
    id: 'SP001',
    tanggalEvaluasi: '2024-01-15',
    tanggalSuratPemberitahuan: '2024-01-10',
    perwadagId: 'PWD001',
    perwadagName: 'Atdag Moscow – Rusia',
    fileName: 'surat-pemberitahuan-atdag-moscow-2024.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-atdag-moscow-2024.pdf',
    status: 'uploaded',
    year: 2024,
    inspektorat: 1
  },
  {
    id: 'SP002',
    tanggalEvaluasi: '2024-01-20',
    tanggalSuratPemberitahuan: '2024-01-15',
    perwadagId: 'PWD002',
    perwadagName: 'Atdag Washington DC – AS',
    fileName: 'surat-pemberitahuan-atdag-washington-2024.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-atdag-washington-2024.pdf',
    status: 'uploaded',
    year: 2024,
    inspektorat: 1
  },
  {
    id: 'SP003',
    tanggalEvaluasi: '2024-01-25',
    tanggalSuratPemberitahuan: '2024-01-20',
    perwadagId: 'PWD003',
    perwadagName: 'ITPC Vancouver – Canada',
    status: 'not_uploaded',
    year: 2024,
    inspektorat: 1
  },
  {
    id: 'SP004',
    tanggalEvaluasi: '2024-02-10',
    tanggalSuratPemberitahuan: '2024-02-05',
    perwadagId: 'PWD004',
    perwadagName: 'Atdag Madrid – Spanyol',
    fileName: 'surat-pemberitahuan-atdag-madrid-2024.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-atdag-madrid-2024.pdf',
    status: 'uploaded',
    year: 2024,
    inspektorat: 1
  },
  {
    id: 'SP005',
    tanggalEvaluasi: '2024-02-15',
    tanggalSuratPemberitahuan: '2024-02-10',
    perwadagId: 'PWD009',
    perwadagName: 'Atdag Paris – Perancis',
    status: 'not_uploaded',
    year: 2024,
    inspektorat: 2
  },
  {
    id: 'SP006',
    tanggalEvaluasi: '2024-02-20',
    tanggalSuratPemberitahuan: '2024-02-15',
    perwadagId: 'PWD010',
    perwadagName: 'ITPC Lagos – Nigeria',
    fileName: 'surat-pemberitahuan-itpc-lagos-2024.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-itpc-lagos-2024.pdf',
    status: 'uploaded',
    year: 2024,
    inspektorat: 2
  },
  {
    id: 'SP007',
    tanggalEvaluasi: '2024-02-25',
    tanggalSuratPemberitahuan: '2024-02-20',
    perwadagId: 'PWD011',
    perwadagName: 'ITPC Barcelona – Spanyol',
    status: 'not_uploaded',
    year: 2024,
    inspektorat: 2
  },
  {
    id: 'SP008',
    tanggal: '2024-03-01',
    perwadagId: 'PWD013',
    perwadagName: 'Atdag Beijing – RRT',
    fileName: 'surat-pemberitahuan-atdag-beijing-2024.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-atdag-beijing-2024.pdf',
    year: 2024,
    inspektorat: 2
  },
  {
    id: 'SP009',
    tanggal: '2024-03-05',
    perwadagId: 'PWD018',
    perwadagName: 'ITPC Sao Paulo – Brasil',
    fileName: 'surat-pemberitahuan-itpc-saopaulo-2024.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-itpc-saopaulo-2024.pdf',
    year: 2024,
    inspektorat: 3
  },
  {
    id: 'SP010',
    tanggal: '2024-03-10',
    perwadagId: 'PWD019',
    perwadagName: 'Konsuldag Hongkong',
    fileName: 'surat-pemberitahuan-konsuldag-hongkong-2024.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-konsuldag-hongkong-2024.pdf',
    year: 2024,
    inspektorat: 3
  },
  {
    id: 'SP011',
    tanggal: '2024-03-15',
    perwadagId: 'PWD020',
    perwadagName: 'Atdag Tokyo – Jepang',
    fileName: 'surat-pemberitahuan-atdag-tokyo-2024.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-atdag-tokyo-2024.pdf',
    year: 2024,
    inspektorat: 3
  },
  {
    id: 'SP012',
    tanggal: '2024-04-01',
    perwadagId: 'PWD021',
    perwadagName: 'Atdag Seoul – Korea Selatan',
    fileName: 'surat-pemberitahuan-atdag-seoul-2024.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-atdag-seoul-2024.pdf',
    year: 2024,
    inspektorat: 3
  },
  {
    id: 'SP013',
    tanggal: '2024-04-05',
    perwadagId: 'PWD027',
    perwadagName: 'ITPC Santiago – Chile',
    fileName: 'surat-pemberitahuan-itpc-santiago-2024.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-itpc-santiago-2024.pdf',
    year: 2024,
    inspektorat: 4
  },
  {
    id: 'SP014',
    tanggal: '2024-04-10',
    perwadagId: 'PWD028',
    perwadagName: 'Atdag Hanoi – Vietnam',
    fileName: 'surat-pemberitahuan-atdag-hanoi-2024.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-atdag-hanoi-2024.pdf',
    year: 2024,
    inspektorat: 4
  },
  {
    id: 'SP015',
    tanggal: '2024-04-15',
    perwadagId: 'PWD029',
    perwadagName: 'Atdag Brussel – Belgia',
    fileName: 'surat-pemberitahuan-atdag-brussel-2024.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-atdag-brussel-2024.pdf',
    year: 2024,
    inspektorat: 4
  },
  {
    id: 'SP016',
    tanggal: '2024-04-20',
    perwadagId: 'PWD030',
    perwadagName: 'Atdag Singapura – Singapura',
    fileName: 'surat-pemberitahuan-atdag-singapura-2024.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-atdag-singapura-2024.pdf',
    year: 2024,
    inspektorat: 4
  },

  // 2023 Data
  {
    id: 'SP017',
    tanggal: '2023-01-12',
    perwadagId: 'PWD005',
    perwadagName: 'ITPC Johannesburg – Afrika Selatan',
    fileName: 'surat-pemberitahuan-itpc-johannesburg-2023.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-itpc-johannesburg-2023.pdf',
    year: 2023,
    inspektorat: 1
  },
  {
    id: 'SP018',
    tanggal: '2023-01-18',
    perwadagId: 'PWD006',
    perwadagName: 'Atdag Kairo – Mesir',
    fileName: 'surat-pemberitahuan-atdag-kairo-2023.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-atdag-kairo-2023.pdf',
    year: 2023,
    inspektorat: 1
  },
  {
    id: 'SP019',
    tanggal: '2023-02-08',
    perwadagId: 'PWD014',
    perwadagName: 'ITPC Jeddah – Arab Saudi',
    fileName: 'surat-pemberitahuan-itpc-jeddah-2023.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-itpc-jeddah-2023.pdf',
    year: 2023,
    inspektorat: 2
  },
  {
    id: 'SP020',
    tanggal: '2023-02-14',
    perwadagId: 'PWD015',
    perwadagName: 'Atdag Ankara – Turki',
    fileName: 'surat-pemberitahuan-atdag-ankara-2023.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-atdag-ankara-2023.pdf',
    year: 2023,
    inspektorat: 2
  },
  {
    id: 'SP021',
    tanggal: '2023-03-10',
    perwadagId: 'PWD022',
    perwadagName: 'ITPC Sydney – Australia',
    fileName: 'surat-pemberitahuan-itpc-sydney-2023.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-itpc-sydney-2023.pdf',
    year: 2023,
    inspektorat: 3
  },
  {
    id: 'SP022',
    tanggal: '2023-03-16',
    perwadagId: 'PWD023',
    perwadagName: 'Atdag Denhaag – Belanda',
    fileName: 'surat-pemberitahuan-atdag-denhaag-2023.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-atdag-denhaag-2023.pdf',
    year: 2023,
    inspektorat: 3
  },
  {
    id: 'SP023',
    tanggal: '2023-04-05',
    perwadagId: 'PWD031',
    perwadagName: 'Atdag Berlin – Jerman',
    fileName: 'surat-pemberitahuan-atdag-berlin-2023.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-atdag-berlin-2023.pdf',
    year: 2023,
    inspektorat: 4
  },
  {
    id: 'SP024',
    tanggal: '2023-04-12',
    perwadagId: 'PWD032',
    perwadagName: 'ITPC Busan – Korea Selatan',
    fileName: 'surat-pemberitahuan-itpc-busan-2023.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-itpc-busan-2023.pdf',
    year: 2023,
    inspektorat: 4
  },

  // 2022 Data
  {
    id: 'SP025',
    tanggal: '2022-01-15',
    perwadagId: 'PWD007',
    perwadagName: 'ITPC Osaka – Jepang',
    fileName: 'surat-pemberitahuan-itpc-osaka-2022.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-itpc-osaka-2022.pdf',
    year: 2022,
    inspektorat: 1
  },
  {
    id: 'SP026',
    tanggal: '2022-02-10',
    perwadagId: 'PWD016',
    perwadagName: 'Atdag Canberra – Australia',
    fileName: 'surat-pemberitahuan-atdag-canberra-2022.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-atdag-canberra-2022.pdf',
    year: 2022,
    inspektorat: 2
  },
  {
    id: 'SP027',
    tanggal: '2022-03-08',
    perwadagId: 'PWD024',
    perwadagName: 'Atdag Jenewa – Swiss',
    fileName: 'surat-pemberitahuan-atdag-jenewa-2022.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-atdag-jenewa-2022.pdf',
    year: 2022,
    inspektorat: 3
  },
  {
    id: 'SP028',
    tanggal: '2022-04-15',
    perwadagId: 'PWD033',
    perwadagName: 'Atdag Bangkok – Thailand',
    fileName: 'surat-pemberitahuan-atdag-bangkok-2022.pdf',
    fileUrl: 'blob:http://localhost:3000/surat-pemberitahuan-atdag-bangkok-2022.pdf',
    year: 2022,
    inspektorat: 4
  }
];

export const YEARS_SURAT_PEMBERITAHUAN = [2024, 2023, 2022, 2021, 2020];

export const getSuratPemberitahuan = (id: string): SuratPemberitahuan | undefined => {
  return SURAT_PEMBERITAHUAN_DATA.find(sp => sp.id === id);
};

export const getSuratPemberitahuanByInspektorat = (inspektorat: number): SuratPemberitahuan[] => {
  return SURAT_PEMBERITAHUAN_DATA.filter(sp => sp.inspektorat === inspektorat);
};

export const getSuratPemberitahuanByPerwadag = (perwadagId: string): SuratPemberitahuan[] => {
  return SURAT_PEMBERITAHUAN_DATA.filter(sp => sp.perwadagId === perwadagId);
};