export interface SuratTugas {
  id: string;
  nomor: string;
  tanggal: string;
  perwadagId: string;
  perwadagName: string;
  pengendaliMutu: string;
  pengendaliTeknis: string;
  ketuaTim: string;
  linkDrive: string;
  year: number;
  inspektorat: number;
}

export const SURAT_TUGAS_DATA: SuratTugas[] = [
  {
    id: 'ST001',
    nomor: 'ST/001/I/2024',
    tanggal: '2024-01-15',
    perwadagId: 'PWD001',
    perwadagName: 'Atdag Moscow – Rusia',
    pengendaliMutu: 'Dr. Ahmad Sutanto',
    pengendaliTeknis: 'Ir. Budi Setiawan',
    ketuaTim: 'Drs. Chandra Kusuma',
    linkDrive: 'https://drive.google.com/file/d/1example1',
    year: 2024,
    inspektorat: 1
  },
  {
    id: 'ST002',
    nomor: 'ST/002/I/2024',
    tanggal: '2024-01-20',
    perwadagId: 'PWD002',
    perwadagName: 'Atdag Washington DC – AS',
    pengendaliMutu: 'Dr. Dewi Sartika',
    pengendaliTeknis: 'Ir. Eko Prasetyo',
    ketuaTim: 'Drs. Fajar Hidayat',
    linkDrive: 'https://drive.google.com/file/d/1example2',
    year: 2024,
    inspektorat: 1
  },
  {
    id: 'ST003',
    nomor: 'ST/003/I/2024',
    tanggal: '2024-01-25',
    perwadagId: 'PWD003',
    perwadagName: 'ITPC Vancouver – Canada',
    pengendaliMutu: 'Dr. Gita Maharani',
    pengendaliTeknis: 'Ir. Hadi Wijaya',
    ketuaTim: 'Drs. Indra Gunawan',
    linkDrive: 'https://drive.google.com/file/d/1example3',
    year: 2024,
    inspektorat: 1
  },
  {
    id: 'ST004',
    nomor: 'ST/004/II/2024',
    tanggal: '2024-02-15',
    perwadagId: 'PWD009',
    perwadagName: 'Atdag Paris – Perancis',
    pengendaliMutu: 'Dr. Joko Santoso',
    pengendaliTeknis: 'Ir. Kartika Sari',
    ketuaTim: 'Drs. Lukman Hakim',
    linkDrive: 'https://drive.google.com/file/d/1example4',
    year: 2024,
    inspektorat: 2
  },
  {
    id: 'ST005',
    nomor: 'ST/005/II/2024',
    tanggal: '2024-02-20',
    perwadagId: 'PWD010',
    perwadagName: 'ITPC Lagos – Nigeria',
    pengendaliMutu: 'Dr. Maya Sari',
    pengendaliTeknis: 'Ir. Nur Rahman',
    ketuaTim: 'Drs. Omar Bakri',
    linkDrive: 'https://drive.google.com/file/d/1example5',
    year: 2024,
    inspektorat: 2
  },
  {
    id: 'ST006',
    nomor: 'ST/006/III/2024',
    tanggal: '2024-03-12',
    perwadagId: 'PWD018',
    perwadagName: 'ITPC Sao Paulo – Brasil',
    pengendaliMutu: 'Dr. Putri Andini',
    pengendaliTeknis: 'Ir. Qomar Zaman',
    ketuaTim: 'Drs. Rudi Hartono',
    linkDrive: 'https://drive.google.com/file/d/1example6',
    year: 2024,
    inspektorat: 3
  },
  {
    id: 'ST007',
    nomor: 'ST/007/III/2024',
    tanggal: '2024-03-18',
    perwadagId: 'PWD019',
    perwadagName: 'Konsuldag Hongkong',
    pengendaliMutu: 'Dr. Sari Melati',
    pengendaliTeknis: 'Ir. Taufik Hidayat',
    ketuaTim: 'Drs. Usman Ali',
    linkDrive: 'https://drive.google.com/file/d/1example7',
    year: 2024,
    inspektorat: 3
  },
  {
    id: 'ST008',
    nomor: 'ST/008/IV/2024',
    tanggal: '2024-04-08',
    perwadagId: 'PWD027',
    perwadagName: 'ITPC Santiago – Chile',
    pengendaliMutu: 'Dr. Vina Kumala',
    pengendaliTeknis: 'Ir. Wahyu Utomo',
    ketuaTim: 'Drs. Xavier Pratama',
    linkDrive: 'https://drive.google.com/file/d/1example8',
    year: 2024,
    inspektorat: 4
  },
  {
    id: 'ST009',
    nomor: 'ST/009/IV/2024',
    tanggal: '2024-04-18',
    perwadagId: 'PWD028',
    perwadagName: 'Atdag Hanoi – Vietnam',
    pengendaliMutu: 'Dr. Yanti Susilo',
    pengendaliTeknis: 'Ir. Zainal Abidin',
    ketuaTim: 'Drs. Ali Mahmud',
    linkDrive: 'https://drive.google.com/file/d/1example9',
    year: 2024,
    inspektorat: 4
  },
  {
    id: 'ST010',
    nomor: 'ST/010/I/2023',
    tanggal: '2023-01-25',
    perwadagId: 'PWD004',
    perwadagName: 'Atdag Madrid – Spanyol',
    pengendaliMutu: 'Dr. Bambang Irawan',
    pengendaliTeknis: 'Ir. Citra Dewi',
    ketuaTim: 'Drs. Dedi Kurniawan',
    linkDrive: 'https://drive.google.com/file/d/1example10',
    year: 2023,
    inspektorat: 1
  },
  {
    id: 'ST011',
    nomor: 'ST/011/II/2023',
    tanggal: '2023-02-20',
    perwadagId: 'PWD011',
    perwadagName: 'ITPC Barcelona – Spanyol',
    pengendaliMutu: 'Dr. Eko Widodo',
    pengendaliTeknis: 'Ir. Fitri Handayani',
    ketuaTim: 'Drs. Gunawan Wijaya',
    linkDrive: 'https://drive.google.com/file/d/1example11',
    year: 2023,
    inspektorat: 2
  },
  {
    id: 'ST012',
    nomor: 'ST/012/III/2023',
    tanggal: '2023-03-15',
    perwadagId: 'PWD020',
    perwadagName: 'Atdag Tokyo – Jepang',
    pengendaliMutu: 'Dr. Hendra Pratama',
    pengendaliTeknis: 'Ir. Indira Sari',
    ketuaTim: 'Drs. Joko Santoso',
    linkDrive: 'https://drive.google.com/file/d/1example12',
    year: 2023,
    inspektorat: 3
  },
  {
    id: 'ST013',
    nomor: 'ST/013/IV/2023',
    tanggal: '2023-04-10',
    perwadagId: 'PWD030',
    perwadagName: 'Atdag Singapura – Singapura',
    pengendaliMutu: 'Dr. Kartika Dewi',
    pengendaliTeknis: 'Ir. Lukman Hakim',
    ketuaTim: 'Drs. Mulyadi Rahman',
    linkDrive: 'https://drive.google.com/file/d/1example13',
    year: 2023,
    inspektorat: 4
  },
  {
    id: 'ST014',
    nomor: 'ST/014/I/2022',
    tanggal: '2022-01-12',
    perwadagId: 'PWD005',
    perwadagName: 'ITPC Johannesburg – Afrika Selatan',
    pengendaliMutu: 'Dr. Nuri Handayani',
    pengendaliTeknis: 'Ir. Omar Sutrisno',
    ketuaTim: 'Drs. Pandu Wibowo',
    linkDrive: 'https://drive.google.com/file/d/1example14',
    year: 2022,
    inspektorat: 1
  },
  {
    id: 'ST015',
    nomor: 'ST/015/II/2022',
    tanggal: '2022-02-18',
    perwadagId: 'PWD014',
    perwadagName: 'ITPC Jeddah – Arab Saudi',
    pengendaliMutu: 'Dr. Qori Andini',
    pengendaliTeknis: 'Ir. Randi Kurniawan',
    ketuaTim: 'Drs. Satrio Nugroho',
    linkDrive: 'https://drive.google.com/file/d/1example15',
    year: 2022,
    inspektorat: 2
  }
];

export const YEARS_SURAT_TUGAS = [2024, 2023, 2022, 2021, 2020];

export const getSuratTugas = (id: string): SuratTugas | undefined => {
  return SURAT_TUGAS_DATA.find(st => st.id === id);
};

export const getSuratTugasByInspektorat = (inspektorat: number): SuratTugas[] => {
  return SURAT_TUGAS_DATA.filter(st => st.inspektorat === inspektorat);
};

export const getSuratTugasByPerwadag = (perwadagId: string): SuratTugas[] => {
  return SURAT_TUGAS_DATA.filter(st => st.perwadagId === perwadagId);
};