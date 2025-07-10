export interface ExitMeeting {
  id: string;
  tanggal: string;
  tanggalMulaiEvaluasi: string;
  tanggalAkhirEvaluasi: string;
  perwadagId: string;
  perwadagName: string;
  linkZoom?: string;
  linkDaftarHadir?: string;
  buktiImages?: string[];
  buktiImageUrls?: string[];
  year: number;
  inspektorat: number;
}

export const EXIT_MEETING_DATA: ExitMeeting[] = [
  {
    id: "EXM001",
    tanggal: "2024-03-15",
    tanggalMulaiEvaluasi: "2024-03-15",
    tanggalAkhirEvaluasi: "2024-03-15",
    perwadagId: "PWD001",
    perwadagName: "Atdag Moscow – Rusia",
    
    linkZoom: "https://zoom.us/j/123456789",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-exit-atdag-moscow-2024",
    buktiImages: ["bukti-hadir-exit-atdag-moscow-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-exit-atdag-moscow-2024.jpg"],
    year: 2024,
    inspektorat: 1
  },
  {
    id: "EXM002",
    tanggal: "2024-03-20",
    tanggalMulaiEvaluasi: "2024-03-20",
    tanggalAkhirEvaluasi: "2024-03-20",
    perwadagId: "PWD002",
    perwadagName: "ITPC Vancouver – Canada",
    
    linkZoom: "https://zoom.us/j/987654321",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-exit-itpc-vancouver-2024",
    buktiImages: ["bukti-hadir-exit-itpc-vancouver-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-exit-itpc-vancouver-2024.jpg"],
    year: 2024,
    inspektorat: 1
  },
  {
    id: "EXM003",
    tanggal: "2024-04-10",
    tanggalMulaiEvaluasi: "2024-04-10",
    tanggalAkhirEvaluasi: "2024-04-12",
    perwadagId: "PWD010",
    perwadagName: "Atdag Beijing – Tiongkok",
    
    linkZoom: "https://zoom.us/j/456789123",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-exit-atdag-beijing-2024",
    buktiImages: ["bukti-hadir-exit-atdag-beijing-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-exit-atdag-beijing-2024.jpg"],
    year: 2024,
    inspektorat: 2
  },
  {
    id: "EXM004",
    tanggal: "2024-04-15",
    tanggalMulaiEvaluasi: "2024-04-15",
    tanggalAkhirEvaluasi: "2024-04-15",
    perwadagId: "PWD011",
    perwadagName: "ITPC Osaka – Jepang",
    
    linkZoom: "https://zoom.us/j/789123456",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-exit-itpc-osaka-2024",
    buktiImages: ["bukti-hadir-exit-itpc-osaka-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-exit-itpc-osaka-2024.jpg"],
    year: 2024,
    inspektorat: 2
  },
  {
    id: "EXM005",
    tanggal: "2024-05-05",
    tanggalMulaiEvaluasi: "2024-05-05",
    tanggalAkhirEvaluasi: "2024-05-05",
    perwadagId: "PWD019",
    perwadagName: "Atdag New Delhi – India",
    
    linkZoom: "https://zoom.us/j/321654987",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-exit-atdag-newdelhi-2024",
    buktiImages: ["bukti-hadir-exit-atdag-newdelhi-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-exit-atdag-newdelhi-2024.jpg"],
    year: 2024,
    inspektorat: 3
  },
  {
    id: "EXM006",
    tanggal: "2024-05-12",
    tanggalMulaiEvaluasi: "2024-05-12",
    tanggalAkhirEvaluasi: "2024-05-12",
    perwadagId: "PWD020",
    perwadagName: "ITPC Mumbai – India",
    
    linkZoom: "https://zoom.us/j/654987321",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-exit-itpc-mumbai-2024",
    buktiImages: ["bukti-hadir-exit-itpc-mumbai-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-exit-itpc-mumbai-2024.jpg"],
    year: 2024,
    inspektorat: 3
  },
  {
    id: "EXM007",
    tanggal: "2024-06-08",
    tanggalMulaiEvaluasi: "2024-06-08",
    tanggalAkhirEvaluasi: "2024-06-08",
    perwadagId: "PWD028",
    perwadagName: "Atdag Hamburg – Jerman",
    
    linkZoom: "https://zoom.us/j/147258369",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-exit-atdag-hamburg-2024",
    buktiImages: ["bukti-hadir-exit-atdag-hamburg-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-exit-atdag-hamburg-2024.jpg"],
    year: 2024,
    inspektorat: 4
  },
  {
    id: "EXM008",
    tanggal: "2024-06-15",
    tanggalMulaiEvaluasi: "2024-06-15",
    tanggalAkhirEvaluasi: "2024-06-15",
    perwadagId: "PWD029",
    perwadagName: "ITPC Duesseldorf – Jerman",
    
    linkZoom: "https://zoom.us/j/369258147",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-exit-itpc-duesseldorf-2024",
    buktiImages: ["bukti-hadir-exit-itpc-duesseldorf-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-exit-itpc-duesseldorf-2024.jpg"],
    year: 2024,
    inspektorat: 4
  },
  {
    id: "EXM009",
    tanggal: "2023-12-10",
    tanggalMulaiEvaluasi: "2023-12-10",
    tanggalAkhirEvaluasi: "2023-12-10",
    perwadagId: "PWD003",
    perwadagName: "Konsuldag Los Angeles – Amerika Serikat",
    
    linkZoom: "https://zoom.us/j/159357486",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-exit-konsuldag-losangeles-2023",
    buktiImages: ["bukti-hadir-exit-konsuldag-losangeles-2023.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-exit-konsuldag-losangeles-2023.jpg"],
    year: 2023,
    inspektorat: 1
  },
  {
    id: "EXM010",
    tanggal: "2023-12-18",
    tanggalMulaiEvaluasi: "2023-12-18",
    tanggalAkhirEvaluasi: "2023-12-18",
    perwadagId: "PWD004",
    perwadagName: "KDEI New York – Amerika Serikat",
    
    linkZoom: "https://zoom.us/j/486357159",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-exit-kdei-newyork-2023",
    buktiImages: ["bukti-hadir-exit-kdei-newyork-2023.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-exit-kdei-newyork-2023.jpg"],
    year: 2023,
    inspektorat: 1
  },
  {
    id: "EXM011",
    tanggal: "2023-01-05",
    tanggalMulaiEvaluasi: "2023-01-05",
    tanggalAkhirEvaluasi: "2023-01-05",
    perwadagId: "PWD012",
    perwadagName: "Konsuldag Busan – Korea Selatan",
    
    linkZoom: "https://zoom.us/j/753951864",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-exit-konsuldag-busan-2023",
    buktiImages: ["bukti-hadir-exit-konsuldag-busan-2023.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-exit-konsuldag-busan-2023.jpg"],
    year: 2023,
    inspektorat: 2
  },
  {
    id: "EXM012",
    tanggal: "2023-01-12",
    tanggalMulaiEvaluasi: "2023-01-12",
    tanggalAkhirEvaluasi: "2023-01-12",
    perwadagId: "PWD013",
    perwadagName: "KDEI Seoul – Korea Selatan",
    
    linkZoom: "https://zoom.us/j/864951753",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-exit-kdei-seoul-2023",
    buktiImages: ["bukti-hadir-exit-kdei-seoul-2023.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-exit-kdei-seoul-2023.jpg"],
    year: 2023,
    inspektorat: 2
  },
  {
    id: "EXM013",
    tanggal: "2022-12-20",
    tanggalMulaiEvaluasi: "2022-12-20",
    tanggalAkhirEvaluasi: "2022-12-20",
    perwadagId: "PWD021",
    perwadagName: "Konsuldag Karachi – Pakistan",
    
    linkZoom: "https://zoom.us/j/258147369",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-exit-konsuldag-karachi-2022",
    buktiImages: ["bukti-hadir-exit-konsuldag-karachi-2022.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-exit-konsuldag-karachi-2022.jpg"],
    year: 2022,
    inspektorat: 3
  },
  {
    id: "EXM014",
    tanggal: "2022-12-28",
    tanggalMulaiEvaluasi: "2022-12-28",
    tanggalAkhirEvaluasi: "2022-12-28",
    perwadagId: "PWD022",
    perwadagName: "KDEI Islamabad – Pakistan",
    
    linkZoom: "https://zoom.us/j/369147258",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-exit-kdei-islamabad-2022",
    buktiImages: ["bukti-hadir-exit-kdei-islamabad-2022.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-exit-kdei-islamabad-2022.jpg"],
    year: 2022,
    inspektorat: 3
  },
  {
    id: "EXM015",
    tanggal: "2022-01-15",
    tanggalMulaiEvaluasi: "2022-01-15",
    tanggalAkhirEvaluasi: "2022-01-15",
    perwadagId: "PWD030",
    perwadagName: "Konsuldag Milan – Italia",
    
    linkZoom: "https://zoom.us/j/741852963",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-exit-konsuldag-milan-2022",
    buktiImages: ["bukti-hadir-exit-konsuldag-milan-2022.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-exit-konsuldag-milan-2022.jpg"],
    year: 2022,
    inspektorat: 4
  }
];

export const YEARS_EXIT_MEETING = Array.from(
  new Set(EXIT_MEETING_DATA.map(item => item.year))
).sort((a, b) => b - a);

export const getExitMeetingStatus = (item: ExitMeeting): string => {
  const hasLinkDaftarHadir = !!item.linkDaftarHadir;
  const hasBuktiImages = !!item.buktiImages && item.buktiImages.length > 0;
  
  if (hasLinkDaftarHadir && hasBuktiImages) {
    return 'Lengkap';
  } else if (hasLinkDaftarHadir || hasBuktiImages) {
    return 'Sebagian';
  } else {
    return 'Belum Upload';
  }
};