export interface EntryMeeting {
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

export const ENTRY_MEETING_DATA: EntryMeeting[] = [
  {
    id: "EM001",
    tanggal: "2024-01-15",
    tanggalMulaiEvaluasi: "2024-01-15",
    tanggalAkhirEvaluasi: "2024-01-15",
    perwadagId: "PWD001",
    perwadagName: "Atdag Moscow – Rusia",
    linkZoom: "https://zoom.us/j/123456789",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-atdag-moscow-2024",
    buktiImages: ["bukti-hadir-1-atdag-moscow-2024.jpg", "bukti-hadir-2-atdag-moscow-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-1-atdag-moscow-2024.jpg", "blob:http://localhost:3000/bukti-hadir-2-atdag-moscow-2024.jpg"],
    year: 2024,
    inspektorat: 1
  },
  {
    id: "EM002",
    tanggal: "2024-01-20",
    tanggalMulaiEvaluasi: "2024-01-20",
    tanggalAkhirEvaluasi: "2024-01-20",
    perwadagId: "PWD002",
    perwadagName: "ITPC Vancouver – Canada",
    linkZoom: "https://zoom.us/j/987654321",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-itpc-vancouver-2024",
    buktiImages: ["bukti-hadir-1-itpc-vancouver-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-1-itpc-vancouver-2024.jpg"],
    year: 2024,
    inspektorat: 1
  },
  {
    id: "EM003",
    tanggal: "2024-02-10",
    tanggalMulaiEvaluasi: "2024-02-10",
    tanggalAkhirEvaluasi: "2024-02-12",
    perwadagId: "PWD010",
    perwadagName: "Atdag Beijing – Tiongkok",
    
    linkZoom: "https://zoom.us/j/456789123",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-atdag-beijing-2024",
    buktiImages: ["bukti-hadir-atdag-beijing-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-atdag-beijing-2024.jpg"],
    year: 2024,
    inspektorat: 2
  },
  {
    id: "EM004",
    tanggal: "2024-02-15",
    tanggalMulaiEvaluasi: "2024-02-15",
    tanggalAkhirEvaluasi: "2024-02-15",
    perwadagId: "PWD011",
    perwadagName: "ITPC Osaka – Jepang",
    
    linkZoom: "https://zoom.us/j/789123456",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-itpc-osaka-2024",
    buktiImages: ["bukti-hadir-itpc-osaka-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-itpc-osaka-2024.jpg"],
    year: 2024,
    inspektorat: 2
  },
  {
    id: "EM005",
    tanggal: "2024-03-05",
    tanggalMulaiEvaluasi: "2024-03-05",
    tanggalAkhirEvaluasi: "2024-03-07",
    perwadagId: "PWD019",
    perwadagName: "Atdag New Delhi – India",
    
    linkZoom: "https://zoom.us/j/321654987",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-atdag-newdelhi-2024",
    buktiImages: ["bukti-hadir-atdag-newdelhi-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-atdag-newdelhi-2024.jpg"],
    year: 2024,
    inspektorat: 3
  },
  {
    id: "EM006",
    tanggal: "2024-03-12",
    tanggalMulaiEvaluasi: "2024-03-12",
    tanggalAkhirEvaluasi: "2024-03-12",
    perwadagId: "PWD020",
    perwadagName: "ITPC Mumbai – India",
    
    linkZoom: "https://zoom.us/j/654987321",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-itpc-mumbai-2024",
    buktiImages: ["bukti-hadir-itpc-mumbai-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-itpc-mumbai-2024.jpg"],
    year: 2024,
    inspektorat: 3
  },
  {
    id: "EM007",
    tanggal: "2024-04-08",
    tanggalMulaiEvaluasi: "2024-04-08",
    tanggalAkhirEvaluasi: "2024-04-10",
    perwadagId: "PWD028",
    perwadagName: "Atdag Hamburg – Jerman",
    
    linkZoom: "https://zoom.us/j/147258369",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-atdag-hamburg-2024",
    buktiImages: ["bukti-hadir-atdag-hamburg-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-atdag-hamburg-2024.jpg"],
    year: 2024,
    inspektorat: 4
  },
  {
    id: "EM008",
    tanggal: "2024-04-15",
    tanggalMulaiEvaluasi: "2024-04-15",
    tanggalAkhirEvaluasi: "2024-04-15",
    perwadagId: "PWD029",
    perwadagName: "ITPC Duesseldorf – Jerman",
    
    linkZoom: "https://zoom.us/j/369258147",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-itpc-duesseldorf-2024",
    buktiImages: ["bukti-hadir-itpc-duesseldorf-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-itpc-duesseldorf-2024.jpg"],
    year: 2024,
    inspektorat: 4
  },
  {
    id: "EM009",
    tanggal: "2023-11-10",
    tanggalMulaiEvaluasi: "2023-11-10",
    tanggalAkhirEvaluasi: "2023-11-10",
    perwadagId: "PWD003",
    perwadagName: "Konsuldag Los Angeles – Amerika Serikat",
    
    linkZoom: "https://zoom.us/j/159357486",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-konsuldag-losangeles-2023",
    buktiImages: ["bukti-hadir-konsuldag-losangeles-2023.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-konsuldag-losangeles-2023.jpg"],
    year: 2023,
    inspektorat: 1
  },
  {
    id: "EM010",
    tanggal: "2023-11-18",
    tanggalMulaiEvaluasi: "2023-11-18",
    tanggalAkhirEvaluasi: "2023-11-20",
    perwadagId: "PWD004",
    perwadagName: "KDEI New York – Amerika Serikat",
    
    linkZoom: "https://zoom.us/j/486357159",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-kdei-newyork-2023",
    buktiImages: ["bukti-hadir-kdei-newyork-2023.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-kdei-newyork-2023.jpg"],
    year: 2023,
    inspektorat: 1
  },
  {
    id: "EM011",
    tanggal: "2023-12-05",
    tanggalMulaiEvaluasi: "2023-12-05",
    tanggalAkhirEvaluasi: "2023-12-05",
    perwadagId: "PWD012",
    perwadagName: "Konsuldag Busan – Korea Selatan",
    
    linkZoom: "https://zoom.us/j/753951864",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-konsuldag-busan-2023",
    buktiImages: ["bukti-hadir-konsuldag-busan-2023.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-konsuldag-busan-2023.jpg"],
    year: 2023,
    inspektorat: 2
  },
  {
    id: "EM012",
    tanggal: "2023-12-12",
    tanggalMulaiEvaluasi: "2023-12-12",
    tanggalAkhirEvaluasi: "2023-12-14",
    perwadagId: "PWD013",
    perwadagName: "KDEI Seoul – Korea Selatan",
    
    linkZoom: "https://zoom.us/j/864951753",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-kdei-seoul-2023",
    buktiImages: ["bukti-hadir-kdei-seoul-2023.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-kdei-seoul-2023.jpg"],
    year: 2023,
    inspektorat: 2
  },
  {
    id: "EM013",
    tanggal: "2022-10-20",
    tanggalMulaiEvaluasi: "2022-10-20",
    tanggalAkhirEvaluasi: "2022-10-20",
    perwadagId: "PWD021",
    perwadagName: "Konsuldag Karachi – Pakistan",
    
    linkZoom: "https://zoom.us/j/258147369",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-konsuldag-karachi-2022",
    buktiImages: ["bukti-hadir-konsuldag-karachi-2022.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-konsuldag-karachi-2022.jpg"],
    year: 2022,
    inspektorat: 3
  },
  {
    id: "EM014",
    tanggal: "2022-10-28",
    tanggalMulaiEvaluasi: "2022-10-28",
    tanggalAkhirEvaluasi: "2022-10-30",
    perwadagId: "PWD022",
    perwadagName: "KDEI Islamabad – Pakistan",
    
    linkZoom: "https://zoom.us/j/369147258",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-kdei-islamabad-2022",
    buktiImages: ["bukti-hadir-kdei-islamabad-2022.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-kdei-islamabad-2022.jpg"],
    year: 2022,
    inspektorat: 3
  },
  {
    id: "EM015",
    tanggal: "2022-11-15",
    tanggalMulaiEvaluasi: "2022-11-15",
    tanggalAkhirEvaluasi: "2022-11-15",
    perwadagId: "PWD030",
    perwadagName: "Konsuldag Milan – Italia",
    
    linkZoom: "https://zoom.us/j/741852963",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-konsuldag-milan-2022",
    buktiImages: ["bukti-hadir-konsuldag-milan-2022.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-hadir-konsuldag-milan-2022.jpg"],
    year: 2022,
    inspektorat: 4
  }
];

export const YEARS_ENTRY_MEETING = Array.from(
  new Set(ENTRY_MEETING_DATA.map(item => item.year))
).sort((a, b) => b - a);

export const getEntryMeetingStatus = (item: EntryMeeting): string => {
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