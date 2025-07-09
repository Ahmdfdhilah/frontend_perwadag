export interface EntryMeeting {
  id: string;
  tanggal: string;
  perwadagId: string;
  perwadagName: string;
  rincian: string;
  linkZoom?: string;
  daftarHadir?: string;
  daftarHadirUrl?: string;
  buktiHadir?: string;
  buktiHadirUrl?: string;
  year: number;
  inspektorat: number;
}

export const ENTRY_MEETING_DATA: EntryMeeting[] = [
  {
    id: "EM001",
    tanggal: "2024-01-15",
    perwadagId: "PWD001",
    perwadagName: "Atdag Moscow – Rusia",
    rincian: "Entry Meeting Audit Kinerja 2024",
    linkZoom: "https://zoom.us/j/123456789",
    daftarHadir: "daftar-hadir-atdag-moscow-2024.pdf",
    daftarHadirUrl: "blob:http://localhost:3000/daftar-hadir-atdag-moscow-2024.pdf",
    buktiHadir: "bukti-hadir-atdag-moscow-2024.jpg",
    buktiHadirUrl: "blob:http://localhost:3000/bukti-hadir-atdag-moscow-2024.jpg",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "EM002",
    tanggal: "2024-01-20",
    perwadagId: "PWD002",
    perwadagName: "ITPC Vancouver – Canada",
    rincian: "Entry Meeting Audit Kinerja 2024",
    linkZoom: "https://zoom.us/j/987654321",
    daftarHadir: "daftar-hadir-itpc-vancouver-2024.pdf",
    daftarHadirUrl: "blob:http://localhost:3000/daftar-hadir-itpc-vancouver-2024.pdf",
    buktiHadir: "bukti-hadir-itpc-vancouver-2024.jpg",
    buktiHadirUrl: "blob:http://localhost:3000/bukti-hadir-itpc-vancouver-2024.jpg",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "EM003",
    tanggal: "2024-02-10",
    perwadagId: "PWD010",
    perwadagName: "Atdag Beijing – Tiongkok",
    rincian: "Entry Meeting Audit Kinerja 2024",
    linkZoom: "https://zoom.us/j/456789123",
    daftarHadir: "daftar-hadir-atdag-beijing-2024.pdf",
    daftarHadirUrl: "blob:http://localhost:3000/daftar-hadir-atdag-beijing-2024.pdf",
    buktiHadir: "bukti-hadir-atdag-beijing-2024.jpg",
    buktiHadirUrl: "blob:http://localhost:3000/bukti-hadir-atdag-beijing-2024.jpg",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "EM004",
    tanggal: "2024-02-15",
    perwadagId: "PWD011",
    perwadagName: "ITPC Osaka – Jepang",
    rincian: "Entry Meeting Audit Kinerja 2024",
    linkZoom: "https://zoom.us/j/789123456",
    daftarHadir: "daftar-hadir-itpc-osaka-2024.pdf",
    daftarHadirUrl: "blob:http://localhost:3000/daftar-hadir-itpc-osaka-2024.pdf",
    buktiHadir: "bukti-hadir-itpc-osaka-2024.jpg",
    buktiHadirUrl: "blob:http://localhost:3000/bukti-hadir-itpc-osaka-2024.jpg",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "EM005",
    tanggal: "2024-03-05",
    perwadagId: "PWD019",
    perwadagName: "Atdag New Delhi – India",
    rincian: "Entry Meeting Audit Kinerja 2024",
    linkZoom: "https://zoom.us/j/321654987",
    daftarHadir: "daftar-hadir-atdag-newdelhi-2024.pdf",
    daftarHadirUrl: "blob:http://localhost:3000/daftar-hadir-atdag-newdelhi-2024.pdf",
    buktiHadir: "bukti-hadir-atdag-newdelhi-2024.jpg",
    buktiHadirUrl: "blob:http://localhost:3000/bukti-hadir-atdag-newdelhi-2024.jpg",
    year: 2024,
    inspektorat: 3
  },
  {
    id: "EM006",
    tanggal: "2024-03-12",
    perwadagId: "PWD020",
    perwadagName: "ITPC Mumbai – India",
    rincian: "Entry Meeting Audit Kinerja 2024",
    linkZoom: "https://zoom.us/j/654987321",
    daftarHadir: "daftar-hadir-itpc-mumbai-2024.pdf",
    daftarHadirUrl: "blob:http://localhost:3000/daftar-hadir-itpc-mumbai-2024.pdf",
    buktiHadir: "bukti-hadir-itpc-mumbai-2024.jpg",
    buktiHadirUrl: "blob:http://localhost:3000/bukti-hadir-itpc-mumbai-2024.jpg",
    year: 2024,
    inspektorat: 3
  },
  {
    id: "EM007",
    tanggal: "2024-04-08",
    perwadagId: "PWD028",
    perwadagName: "Atdag Hamburg – Jerman",
    rincian: "Entry Meeting Audit Kinerja 2024",
    linkZoom: "https://zoom.us/j/147258369",
    daftarHadir: "daftar-hadir-atdag-hamburg-2024.pdf",
    daftarHadirUrl: "blob:http://localhost:3000/daftar-hadir-atdag-hamburg-2024.pdf",
    buktiHadir: "bukti-hadir-atdag-hamburg-2024.jpg",
    buktiHadirUrl: "blob:http://localhost:3000/bukti-hadir-atdag-hamburg-2024.jpg",
    year: 2024,
    inspektorat: 4
  },
  {
    id: "EM008",
    tanggal: "2024-04-15",
    perwadagId: "PWD029",
    perwadagName: "ITPC Duesseldorf – Jerman",
    rincian: "Entry Meeting Audit Kinerja 2024",
    linkZoom: "https://zoom.us/j/369258147",
    daftarHadir: "daftar-hadir-itpc-duesseldorf-2024.pdf",
    daftarHadirUrl: "blob:http://localhost:3000/daftar-hadir-itpc-duesseldorf-2024.pdf",
    buktiHadir: "bukti-hadir-itpc-duesseldorf-2024.jpg",
    buktiHadirUrl: "blob:http://localhost:3000/bukti-hadir-itpc-duesseldorf-2024.jpg",
    year: 2024,
    inspektorat: 4
  },
  {
    id: "EM009",
    tanggal: "2023-11-10",
    perwadagId: "PWD003",
    perwadagName: "Konsuldag Los Angeles – Amerika Serikat",
    rincian: "Entry Meeting Audit Kinerja 2023",
    linkZoom: "https://zoom.us/j/159357486",
    daftarHadir: "daftar-hadir-konsuldag-losangeles-2023.pdf",
    daftarHadirUrl: "blob:http://localhost:3000/daftar-hadir-konsuldag-losangeles-2023.pdf",
    buktiHadir: "bukti-hadir-konsuldag-losangeles-2023.jpg",
    buktiHadirUrl: "blob:http://localhost:3000/bukti-hadir-konsuldag-losangeles-2023.jpg",
    year: 2023,
    inspektorat: 1
  },
  {
    id: "EM010",
    tanggal: "2023-11-18",
    perwadagId: "PWD004",
    perwadagName: "KDEI New York – Amerika Serikat",
    rincian: "Entry Meeting Audit Kinerja 2023",
    linkZoom: "https://zoom.us/j/486357159",
    daftarHadir: "daftar-hadir-kdei-newyork-2023.pdf",
    daftarHadirUrl: "blob:http://localhost:3000/daftar-hadir-kdei-newyork-2023.pdf",
    buktiHadir: "bukti-hadir-kdei-newyork-2023.jpg",
    buktiHadirUrl: "blob:http://localhost:3000/bukti-hadir-kdei-newyork-2023.jpg",
    year: 2023,
    inspektorat: 1
  },
  {
    id: "EM011",
    tanggal: "2023-12-05",
    perwadagId: "PWD012",
    perwadagName: "Konsuldag Busan – Korea Selatan",
    rincian: "Entry Meeting Audit Kinerja 2023",
    linkZoom: "https://zoom.us/j/753951864",
    daftarHadir: "daftar-hadir-konsuldag-busan-2023.pdf",
    daftarHadirUrl: "blob:http://localhost:3000/daftar-hadir-konsuldag-busan-2023.pdf",
    buktiHadir: "bukti-hadir-konsuldag-busan-2023.jpg",
    buktiHadirUrl: "blob:http://localhost:3000/bukti-hadir-konsuldag-busan-2023.jpg",
    year: 2023,
    inspektorat: 2
  },
  {
    id: "EM012",
    tanggal: "2023-12-12",
    perwadagId: "PWD013",
    perwadagName: "KDEI Seoul – Korea Selatan",
    rincian: "Entry Meeting Audit Kinerja 2023",
    linkZoom: "https://zoom.us/j/864951753",
    daftarHadir: "daftar-hadir-kdei-seoul-2023.pdf",
    daftarHadirUrl: "blob:http://localhost:3000/daftar-hadir-kdei-seoul-2023.pdf",
    buktiHadir: "bukti-hadir-kdei-seoul-2023.jpg",
    buktiHadirUrl: "blob:http://localhost:3000/bukti-hadir-kdei-seoul-2023.jpg",
    year: 2023,
    inspektorat: 2
  },
  {
    id: "EM013",
    tanggal: "2022-10-20",
    perwadagId: "PWD021",
    perwadagName: "Konsuldag Karachi – Pakistan",
    rincian: "Entry Meeting Audit Kinerja 2022",
    linkZoom: "https://zoom.us/j/258147369",
    daftarHadir: "daftar-hadir-konsuldag-karachi-2022.pdf",
    daftarHadirUrl: "blob:http://localhost:3000/daftar-hadir-konsuldag-karachi-2022.pdf",
    buktiHadir: "bukti-hadir-konsuldag-karachi-2022.jpg",
    buktiHadirUrl: "blob:http://localhost:3000/bukti-hadir-konsuldag-karachi-2022.jpg",
    year: 2022,
    inspektorat: 3
  },
  {
    id: "EM014",
    tanggal: "2022-10-28",
    perwadagId: "PWD022",
    perwadagName: "KDEI Islamabad – Pakistan",
    rincian: "Entry Meeting Audit Kinerja 2022",
    linkZoom: "https://zoom.us/j/369147258",
    daftarHadir: "daftar-hadir-kdei-islamabad-2022.pdf",
    daftarHadirUrl: "blob:http://localhost:3000/daftar-hadir-kdei-islamabad-2022.pdf",
    buktiHadir: "bukti-hadir-kdei-islamabad-2022.jpg",
    buktiHadirUrl: "blob:http://localhost:3000/bukti-hadir-kdei-islamabad-2022.jpg",
    year: 2022,
    inspektorat: 3
  },
  {
    id: "EM015",
    tanggal: "2022-11-15",
    perwadagId: "PWD030",
    perwadagName: "Konsuldag Milan – Italia",
    rincian: "Entry Meeting Audit Kinerja 2022",
    linkZoom: "https://zoom.us/j/741852963",
    daftarHadir: "daftar-hadir-konsuldag-milan-2022.pdf",
    daftarHadirUrl: "blob:http://localhost:3000/daftar-hadir-konsuldag-milan-2022.pdf",
    buktiHadir: "bukti-hadir-konsuldag-milan-2022.jpg",
    buktiHadirUrl: "blob:http://localhost:3000/bukti-hadir-konsuldag-milan-2022.jpg",
    year: 2022,
    inspektorat: 4
  }
];

export const YEARS_ENTRY_MEETING = Array.from(
  new Set(ENTRY_MEETING_DATA.map(item => item.year))
).sort((a, b) => b - a);