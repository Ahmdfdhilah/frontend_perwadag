export interface KonfirmasiMeeting {
  id: string;
  no: number;
  perwadagId: string;
  perwadagName: string;
  tanggalEvaluasi: string;
  tanggalMulaiEvaluasi: string;
  tanggalAkhirEvaluasi: string;
  tanggalKonfirmasi: string;
  linkZoom?: string;
  status: 'pending' | 'confirmed' | 'completed';
  linkDaftarHadir?: string;
  buktiImages?: string[];
  buktiImageUrls?: string[];
  year: number;
  inspektorat: number;
}

export const KONFIRMASI_MEETING_DATA: KonfirmasiMeeting[] = [
  {
    id: "KM001",
    no: 1,
    perwadagId: "PWD001",
    perwadagName: "Atdag Moscow – Rusia",
    tanggalEvaluasi: "2024-01-15",
    tanggalMulaiEvaluasi: "2024-01-15",
    tanggalAkhirEvaluasi: "2024-01-22",
    tanggalKonfirmasi: "2024-01-20",
    linkZoom: "https://zoom.us/j/123456789",
    status: "completed",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-konfirmasi-atdag-moscow-2024",
    buktiImages: ["bukti-konfirmasi-1-atdag-moscow-2024.jpg", "bukti-konfirmasi-2-atdag-moscow-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-konfirmasi-1-atdag-moscow-2024.jpg", "blob:http://localhost:3000/bukti-konfirmasi-2-atdag-moscow-2024.jpg"],
    year: 2024,
    inspektorat: 1
  },
  {
    id: "KM002",
    no: 2,
    perwadagId: "PWD002",
    perwadagName: "ITPC Vancouver – Canada",
    tanggalEvaluasi: "2024-02-10",
    tanggalMulaiEvaluasi: "2024-02-10",
    tanggalAkhirEvaluasi: "2024-02-17",
    tanggalKonfirmasi: "2024-02-15",
    linkZoom: "https://zoom.us/j/234567890",
    status: "confirmed",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-konfirmasi-itpc-vancouver-2024",
    buktiImages: ["bukti-konfirmasi-1-itpc-vancouver-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-konfirmasi-1-itpc-vancouver-2024.jpg"],
    year: 2024,
    inspektorat: 1
  },
  {
    id: "KM003",
    no: 3,
    perwadagId: "PWD010",
    perwadagName: "Atdag Beijing – Tiongkok",
    tanggalEvaluasi: "2024-03-05",
    tanggalMulaiEvaluasi: "2024-03-05",
    tanggalAkhirEvaluasi: "2024-03-12",
    tanggalKonfirmasi: "2024-03-10",
    linkZoom: "https://zoom.us/j/345678901",
    status: "pending",
    year: 2024,
    inspektorat: 2
  },
  {
    id: "KM004",
    no: 4,
    perwadagId: "PWD011",
    perwadagName: "ITPC Osaka – Jepang",
    tanggalEvaluasi: "2024-03-15",
    tanggalMulaiEvaluasi: "2024-03-15",
    tanggalAkhirEvaluasi: "2024-03-22",
    tanggalKonfirmasi: "2024-03-20",
    linkZoom: "https://zoom.us/j/456789012",
    status: "completed",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-konfirmasi-itpc-osaka-2024",
    buktiImages: ["bukti-konfirmasi-1-itpc-osaka-2024.jpg", "bukti-konfirmasi-2-itpc-osaka-2024.jpg", "bukti-konfirmasi-3-itpc-osaka-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-konfirmasi-1-itpc-osaka-2024.jpg", "blob:http://localhost:3000/bukti-konfirmasi-2-itpc-osaka-2024.jpg", "blob:http://localhost:3000/bukti-konfirmasi-3-itpc-osaka-2024.jpg"],
    year: 2024,
    inspektorat: 2
  },
  {
    id: "KM005",
    no: 5,
    perwadagId: "PWD019",
    perwadagName: "Atdag New Delhi – India",
    tanggalEvaluasi: "2024-04-08",
    tanggalMulaiEvaluasi: "2024-04-08",
    tanggalAkhirEvaluasi: "2024-04-15",
    tanggalKonfirmasi: "2024-04-12",
    linkZoom: "https://zoom.us/j/567890123",
    status: "confirmed",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-konfirmasi-atdag-newdelhi-2024",
    year: 2024,
    inspektorat: 3
  },
  {
    id: "KM006",
    no: 6,
    perwadagId: "PWD020",
    perwadagName: "ITPC Mumbai – India",
    tanggalEvaluasi: "2024-04-20",
    tanggalMulaiEvaluasi: "2024-04-20",
    tanggalAkhirEvaluasi: "2024-04-27",
    tanggalKonfirmasi: "2024-04-25",
    linkZoom: "https://zoom.us/j/678901234",
    status: "pending",
    year: 2024,
    inspektorat: 3
  },
  {
    id: "KM007",
    no: 7,
    perwadagId: "PWD028",
    perwadagName: "Atdag Hamburg – Jerman",
    tanggalEvaluasi: "2024-05-10",
    tanggalMulaiEvaluasi: "2024-05-10",
    tanggalAkhirEvaluasi: "2024-05-17",
    tanggalKonfirmasi: "2024-05-15",
    linkZoom: "https://zoom.us/j/789012345",
    status: "completed",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-konfirmasi-atdag-hamburg-2024",
    buktiImages: ["bukti-konfirmasi-1-atdag-hamburg-2024.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-konfirmasi-1-atdag-hamburg-2024.jpg"],
    year: 2024,
    inspektorat: 4
  },
  {
    id: "KM008",
    no: 8,
    perwadagId: "PWD029",
    perwadagName: "ITPC Duesseldorf – Jerman",
    tanggalEvaluasi: "2024-05-25",
    tanggalMulaiEvaluasi: "2024-05-25",
    tanggalAkhirEvaluasi: "2024-06-01",
    tanggalKonfirmasi: "2024-05-30",
    linkZoom: "https://zoom.us/j/890123456",
    status: "confirmed",
    year: 2024,
    inspektorat: 4
  },
  {
    id: "KM009",
    no: 9,
    perwadagId: "PWD003",
    perwadagName: "Konsuldag Los Angeles – Amerika Serikat",
    tanggalEvaluasi: "2023-11-15",
    tanggalMulaiEvaluasi: "2023-11-15",
    tanggalAkhirEvaluasi: "2023-11-22",
    tanggalKonfirmasi: "2023-11-20",
    linkZoom: "https://zoom.us/j/901234567",
    status: "completed",
    linkDaftarHadir: "https://forms.google.com/daftar-hadir-konfirmasi-konsuldag-la-2023",
    buktiImages: ["bukti-konfirmasi-1-konsuldag-la-2023.jpg", "bukti-konfirmasi-2-konsuldag-la-2023.jpg"],
    buktiImageUrls: ["blob:http://localhost:3000/bukti-konfirmasi-1-konsuldag-la-2023.jpg", "blob:http://localhost:3000/bukti-konfirmasi-2-konsuldag-la-2023.jpg"],
    year: 2023,
    inspektorat: 1
  },
  {
    id: "KM010",
    no: 10,
    perwadagId: "PWD004",
    perwadagName: "KDEI New York – Amerika Serikat",
    tanggalEvaluasi: "2023-12-10",
    tanggalMulaiEvaluasi: "2023-12-10",
    tanggalAkhirEvaluasi: "2023-12-17",
    tanggalKonfirmasi: "2023-12-15",
    linkZoom: "https://zoom.us/j/012345678",
    status: "pending",
    year: 2023,
    inspektorat: 1
  }
];

export const YEARS_KONFIRMASI_MEETING = Array.from(
  new Set(KONFIRMASI_MEETING_DATA.map(item => item.year))
).sort((a, b) => b - a);