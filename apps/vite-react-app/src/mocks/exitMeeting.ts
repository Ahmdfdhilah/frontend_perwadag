export interface ExitMeeting {
  id: string;
  tanggal: string;
  perwadagId: string;
  perwadagName: string;
  rincian: string;
  linkZoom?: string;
  daftarHadir?: string;
  buktiHadir?: string;
  year: number;
  inspektorat: number;
}

export const EXIT_MEETING_DATA: ExitMeeting[] = [
  {
    id: "EXM001",
    tanggal: "2024-03-15",
    perwadagId: "PWD001",
    perwadagName: "Atdag Moscow – Rusia",
    rincian: "Exit Meeting Audit Kinerja 2024",
    linkZoom: "https://zoom.us/j/123456789",
    daftarHadir: "https://drive.google.com/file/d/exit1-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/exit1-bukti-hadir/view",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "EXM002",
    tanggal: "2024-03-20",
    perwadagId: "PWD002",
    perwadagName: "ITPC Vancouver – Canada",
    rincian: "Exit Meeting Audit Kinerja 2024",
    linkZoom: "https://zoom.us/j/987654321",
    daftarHadir: "https://drive.google.com/file/d/exit2-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/exit2-bukti-hadir/view",
    year: 2024,
    inspektorat: 1
  },
  {
    id: "EXM003",
    tanggal: "2024-04-10",
    perwadagId: "PWD010",
    perwadagName: "Atdag Beijing – Tiongkok",
    rincian: "Exit Meeting Audit Kinerja 2024",
    linkZoom: "https://zoom.us/j/456789123",
    daftarHadir: "https://drive.google.com/file/d/exit3-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/exit3-bukti-hadir/view",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "EXM004",
    tanggal: "2024-04-15",
    perwadagId: "PWD011",
    perwadagName: "ITPC Osaka – Jepang",
    rincian: "Exit Meeting Audit Kinerja 2024",
    linkZoom: "https://zoom.us/j/789123456",
    daftarHadir: "https://drive.google.com/file/d/exit4-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/exit4-bukti-hadir/view",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "EXM005",
    tanggal: "2024-05-05",
    perwadagId: "PWD019",
    perwadagName: "Atdag New Delhi – India",
    rincian: "Exit Meeting Audit Kinerja 2024",
    linkZoom: "https://zoom.us/j/321654987",
    daftarHadir: "https://drive.google.com/file/d/exit5-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/exit5-bukti-hadir/view",
    year: 2024,
    inspektorat: 3
  },
  {
    id: "EXM006",
    tanggal: "2024-05-12",
    perwadagId: "PWD020",
    perwadagName: "ITPC Mumbai – India",
    rincian: "Exit Meeting Audit Kinerja 2024",
    linkZoom: "https://zoom.us/j/654987321",
    daftarHadir: "https://drive.google.com/file/d/exit6-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/exit6-bukti-hadir/view",
    year: 2024,
    inspektorat: 3
  },
  {
    id: "EXM007",
    tanggal: "2024-06-08",
    perwadagId: "PWD028",
    perwadagName: "Atdag Hamburg – Jerman",
    rincian: "Exit Meeting Audit Kinerja 2024",
    linkZoom: "https://zoom.us/j/147258369",
    daftarHadir: "https://drive.google.com/file/d/exit7-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/exit7-bukti-hadir/view",
    year: 2024,
    inspektorat: 4
  },
  {
    id: "EXM008",
    tanggal: "2024-06-15",
    perwadagId: "PWD029",
    perwadagName: "ITPC Duesseldorf – Jerman",
    rincian: "Exit Meeting Audit Kinerja 2024",
    linkZoom: "https://zoom.us/j/369258147",
    daftarHadir: "https://drive.google.com/file/d/exit8-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/exit8-bukti-hadir/view",
    year: 2024,
    inspektorat: 4
  },
  {
    id: "EXM009",
    tanggal: "2023-12-10",
    perwadagId: "PWD003",
    perwadagName: "Konsuldag Los Angeles – Amerika Serikat",
    rincian: "Exit Meeting Audit Kinerja 2023",
    linkZoom: "https://zoom.us/j/159357486",
    daftarHadir: "https://drive.google.com/file/d/exit9-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/exit9-bukti-hadir/view",
    year: 2023,
    inspektorat: 1
  },
  {
    id: "EXM010",
    tanggal: "2023-12-18",
    perwadagId: "PWD004",
    perwadagName: "KDEI New York – Amerika Serikat",
    rincian: "Exit Meeting Audit Kinerja 2023",
    linkZoom: "https://zoom.us/j/486357159",
    daftarHadir: "https://drive.google.com/file/d/exit10-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/exit10-bukti-hadir/view",
    year: 2023,
    inspektorat: 1
  },
  {
    id: "EXM011",
    tanggal: "2023-01-05",
    perwadagId: "PWD012",
    perwadagName: "Konsuldag Busan – Korea Selatan",
    rincian: "Exit Meeting Audit Kinerja 2023",
    linkZoom: "https://zoom.us/j/753951864",
    daftarHadir: "https://drive.google.com/file/d/exit11-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/exit11-bukti-hadir/view",
    year: 2023,
    inspektorat: 2
  },
  {
    id: "EXM012",
    tanggal: "2023-01-12",
    perwadagId: "PWD013",
    perwadagName: "KDEI Seoul – Korea Selatan",
    rincian: "Exit Meeting Audit Kinerja 2023",
    linkZoom: "https://zoom.us/j/864951753",
    daftarHadir: "https://drive.google.com/file/d/exit12-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/exit12-bukti-hadir/view",
    year: 2023,
    inspektorat: 2
  },
  {
    id: "EXM013",
    tanggal: "2022-12-20",
    perwadagId: "PWD021",
    perwadagName: "Konsuldag Karachi – Pakistan",
    rincian: "Exit Meeting Audit Kinerja 2022",
    linkZoom: "https://zoom.us/j/258147369",
    daftarHadir: "https://drive.google.com/file/d/exit13-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/exit13-bukti-hadir/view",
    year: 2022,
    inspektorat: 3
  },
  {
    id: "EXM014",
    tanggal: "2022-12-28",
    perwadagId: "PWD022",
    perwadagName: "KDEI Islamabad – Pakistan",
    rincian: "Exit Meeting Audit Kinerja 2022",
    linkZoom: "https://zoom.us/j/369147258",
    daftarHadir: "https://drive.google.com/file/d/exit14-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/exit14-bukti-hadir/view",
    year: 2022,
    inspektorat: 3
  },
  {
    id: "EXM015",
    tanggal: "2022-01-15",
    perwadagId: "PWD030",
    perwadagName: "Konsuldag Milan – Italia",
    rincian: "Exit Meeting Audit Kinerja 2022",
    linkZoom: "https://zoom.us/j/741852963",
    daftarHadir: "https://drive.google.com/file/d/exit15-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/exit15-bukti-hadir/view",
    year: 2022,
    inspektorat: 4
  }
];

export const YEARS_EXIT_MEETING = Array.from(
  new Set(EXIT_MEETING_DATA.map(item => item.year))
).sort((a, b) => b - a);