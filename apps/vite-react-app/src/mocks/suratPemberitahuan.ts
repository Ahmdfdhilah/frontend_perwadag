export interface SuratPemberitahuan {
  id: string;
  tanggal: string;
  perwadagId: string;
  perwadagName: string;
  linkDrive: string;
  year: number;
  inspektorat: number;
}

export const SURAT_PEMBERITAHUAN_DATA: SuratPemberitahuan[] = [
  // 2024 Data
  {
    id: 'SP001',
    tanggal: '2024-01-10',
    perwadagId: 'PWD001',
    perwadagName: 'Atdag Moscow – Rusia',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan001',
    year: 2024,
    inspektorat: 1
  },
  {
    id: 'SP002',
    tanggal: '2024-01-15',
    perwadagId: 'PWD002',
    perwadagName: 'Atdag Washington DC – AS',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan002',
    year: 2024,
    inspektorat: 1
  },
  {
    id: 'SP003',
    tanggal: '2024-01-20',
    perwadagId: 'PWD003',
    perwadagName: 'ITPC Vancouver – Canada',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan003',
    year: 2024,
    inspektorat: 1
  },
  {
    id: 'SP004',
    tanggal: '2024-02-05',
    perwadagId: 'PWD004',
    perwadagName: 'Atdag Madrid – Spanyol',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan004',
    year: 2024,
    inspektorat: 1
  },
  {
    id: 'SP005',
    tanggal: '2024-02-10',
    perwadagId: 'PWD009',
    perwadagName: 'Atdag Paris – Perancis',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan005',
    year: 2024,
    inspektorat: 2
  },
  {
    id: 'SP006',
    tanggal: '2024-02-15',
    perwadagId: 'PWD010',
    perwadagName: 'ITPC Lagos – Nigeria',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan006',
    year: 2024,
    inspektorat: 2
  },
  {
    id: 'SP007',
    tanggal: '2024-02-20',
    perwadagId: 'PWD011',
    perwadagName: 'ITPC Barcelona – Spanyol',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan007',
    year: 2024,
    inspektorat: 2
  },
  {
    id: 'SP008',
    tanggal: '2024-03-01',
    perwadagId: 'PWD013',
    perwadagName: 'Atdag Beijing – RRT',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan008',
    year: 2024,
    inspektorat: 2
  },
  {
    id: 'SP009',
    tanggal: '2024-03-05',
    perwadagId: 'PWD018',
    perwadagName: 'ITPC Sao Paulo – Brasil',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan009',
    year: 2024,
    inspektorat: 3
  },
  {
    id: 'SP010',
    tanggal: '2024-03-10',
    perwadagId: 'PWD019',
    perwadagName: 'Konsuldag Hongkong',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan010',
    year: 2024,
    inspektorat: 3
  },
  {
    id: 'SP011',
    tanggal: '2024-03-15',
    perwadagId: 'PWD020',
    perwadagName: 'Atdag Tokyo – Jepang',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan011',
    year: 2024,
    inspektorat: 3
  },
  {
    id: 'SP012',
    tanggal: '2024-04-01',
    perwadagId: 'PWD021',
    perwadagName: 'Atdag Seoul – Korea Selatan',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan012',
    year: 2024,
    inspektorat: 3
  },
  {
    id: 'SP013',
    tanggal: '2024-04-05',
    perwadagId: 'PWD027',
    perwadagName: 'ITPC Santiago – Chile',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan013',
    year: 2024,
    inspektorat: 4
  },
  {
    id: 'SP014',
    tanggal: '2024-04-10',
    perwadagId: 'PWD028',
    perwadagName: 'Atdag Hanoi – Vietnam',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan014',
    year: 2024,
    inspektorat: 4
  },
  {
    id: 'SP015',
    tanggal: '2024-04-15',
    perwadagId: 'PWD029',
    perwadagName: 'Atdag Brussel – Belgia',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan015',
    year: 2024,
    inspektorat: 4
  },
  {
    id: 'SP016',
    tanggal: '2024-04-20',
    perwadagId: 'PWD030',
    perwadagName: 'Atdag Singapura – Singapura',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan016',
    year: 2024,
    inspektorat: 4
  },

  // 2023 Data
  {
    id: 'SP017',
    tanggal: '2023-01-12',
    perwadagId: 'PWD005',
    perwadagName: 'ITPC Johannesburg – Afrika Selatan',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan017',
    year: 2023,
    inspektorat: 1
  },
  {
    id: 'SP018',
    tanggal: '2023-01-18',
    perwadagId: 'PWD006',
    perwadagName: 'Atdag Kairo – Mesir',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan018',
    year: 2023,
    inspektorat: 1
  },
  {
    id: 'SP019',
    tanggal: '2023-02-08',
    perwadagId: 'PWD014',
    perwadagName: 'ITPC Jeddah – Arab Saudi',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan019',
    year: 2023,
    inspektorat: 2
  },
  {
    id: 'SP020',
    tanggal: '2023-02-14',
    perwadagId: 'PWD015',
    perwadagName: 'Atdag Ankara – Turki',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan020',
    year: 2023,
    inspektorat: 2
  },
  {
    id: 'SP021',
    tanggal: '2023-03-10',
    perwadagId: 'PWD022',
    perwadagName: 'ITPC Sydney – Australia',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan021',
    year: 2023,
    inspektorat: 3
  },
  {
    id: 'SP022',
    tanggal: '2023-03-16',
    perwadagId: 'PWD023',
    perwadagName: 'Atdag Denhaag – Belanda',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan022',
    year: 2023,
    inspektorat: 3
  },
  {
    id: 'SP023',
    tanggal: '2023-04-05',
    perwadagId: 'PWD031',
    perwadagName: 'Atdag Berlin – Jerman',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan023',
    year: 2023,
    inspektorat: 4
  },
  {
    id: 'SP024',
    tanggal: '2023-04-12',
    perwadagId: 'PWD032',
    perwadagName: 'ITPC Busan – Korea Selatan',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan024',
    year: 2023,
    inspektorat: 4
  },

  // 2022 Data
  {
    id: 'SP025',
    tanggal: '2022-01-15',
    perwadagId: 'PWD007',
    perwadagName: 'ITPC Osaka – Jepang',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan025',
    year: 2022,
    inspektorat: 1
  },
  {
    id: 'SP026',
    tanggal: '2022-02-10',
    perwadagId: 'PWD016',
    perwadagName: 'Atdag Canberra – Australia',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan026',
    year: 2022,
    inspektorat: 2
  },
  {
    id: 'SP027',
    tanggal: '2022-03-08',
    perwadagId: 'PWD024',
    perwadagName: 'Atdag Jenewa – Swiss',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan027',
    year: 2022,
    inspektorat: 3
  },
  {
    id: 'SP028',
    tanggal: '2022-04-15',
    perwadagId: 'PWD033',
    perwadagName: 'Atdag Bangkok – Thailand',
    linkDrive: 'https://drive.google.com/file/d/1pemberitahuan028',
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