export interface EntryMeeting {
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

export const ENTRY_MEETING_DATA: EntryMeeting[] = [
  {
    id: "EM001",
    tanggal: "2024-01-15",
    perwadagId: "PWD001",
    perwadagName: "Atdag Moscow – Rusia",
    rincian: "Entry Meeting Audit Kinerja 2024",
    linkZoom: "https://zoom.us/j/123456789",
    daftarHadir: "https://drive.google.com/file/d/1abcd-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/1efgh-bukti-hadir/view",
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
    daftarHadir: "https://drive.google.com/file/d/2abcd-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/2efgh-bukti-hadir/view",
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
    daftarHadir: "https://drive.google.com/file/d/3abcd-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/3efgh-bukti-hadir/view",
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
    daftarHadir: "https://drive.google.com/file/d/4abcd-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/4efgh-bukti-hadir/view",
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
    daftarHadir: "https://drive.google.com/file/d/5abcd-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/5efgh-bukti-hadir/view",
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
    daftarHadir: "https://drive.google.com/file/d/6abcd-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/6efgh-bukti-hadir/view",
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
    daftarHadir: "https://drive.google.com/file/d/7abcd-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/7efgh-bukti-hadir/view",
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
    daftarHadir: "https://drive.google.com/file/d/8abcd-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/8efgh-bukti-hadir/view",
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
    daftarHadir: "https://drive.google.com/file/d/9abcd-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/9efgh-bukti-hadir/view",
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
    daftarHadir: "https://drive.google.com/file/d/10abcd-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/10efgh-bukti-hadir/view",
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
    daftarHadir: "https://drive.google.com/file/d/11abcd-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/11efgh-bukti-hadir/view",
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
    daftarHadir: "https://drive.google.com/file/d/12abcd-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/12efgh-bukti-hadir/view",
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
    daftarHadir: "https://drive.google.com/file/d/13abcd-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/13efgh-bukti-hadir/view",
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
    daftarHadir: "https://drive.google.com/file/d/14abcd-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/14efgh-bukti-hadir/view",
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
    daftarHadir: "https://drive.google.com/file/d/15abcd-daftar-hadir/view",
    buktiHadir: "https://drive.google.com/file/d/15efgh-bukti-hadir/view",
    year: 2022,
    inspektorat: 4
  }
];

export const YEARS_ENTRY_MEETING = Array.from(
  new Set(ENTRY_MEETING_DATA.map(item => item.year))
).sort((a, b) => b - a);