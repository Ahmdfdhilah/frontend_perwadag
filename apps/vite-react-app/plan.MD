A.	Umum ✅
    1.	Untuk kode user di profil bisa diubah menjadi Inspektorat I, Atdag Tokyo ,dll //di user dropdown dan di halaman profile ✅

B.	Penilaian Risiko: apps\vite-react-app\src\pages\RiskAssesment\* ✅
    1.	Menghilangkan filter urutkan tahun terbaru dan tahun terlama: apps\vite-react-app\src\pages\RiskAssesment\RiskAssessmentPage.tsx ✅
    2.	Menambahkan kolom Inspektorat xx: apps\vite-react-app\src\pages\RiskAssesment\RiskAssessmentPage.tsx ✅
    3.	Menghilangkan kolom total: apps\vite-react-app\src\pages\RiskAssesment\RiskAssessmentPage.tsx ✅
    4.	Setting pilihan kategori dalam penilaian risiko menjadi automatic dan di disable \\hitung otomatis apps\vite-react-app\src\pages\RiskAssesment\RiskAssessmentInputPage.tsx ✅
    5.	Menambahkan keterangan (Rp) pada Indikator 8 ini belum di apps\vite-react-app\src\pages\RiskAssesment\RiskAssessmentInputPage.tsx dan apps\vite-react-app\src\pages\RiskAssesment\RiskAssessmentDetailPage.tsx ✅

C.	Surat Tugas apps\vite-react-app\src\pages\SuratTugasPage.tsx✅
    1.	Tanggal disesuaikan menjadi tanggal pelaksanaan evaluasi.✅
    2.	Inputan tanggal diubah menjadi range.✅

D.	Surat Pemberitahuan apps\vite-react-app\src\pages\SuratPemberitahuanPage.tsx✅
    1.	Menyesuaikan kolom menjadi No, Tanggal Evaluasi, Tanggal Surat Pemberitahuan, Nama Perwadag, Status (apakah sudah upload dokumen belum)✅


E.	Entry Meeting apps\vite-react-app\src\pages\EntryMeetingPage.tsx
    1.	Menyesuaikan kolom menjadi No, Nama Perwadag, Tanggal Evaluasi, Tanggal Entry Meeting, Link Zoom, Status (apakah sudah upload daftar hadir dan bukti)
    2.	Akses edit link zoom, daftar hadir, dan bukti yaitu admin dan inspektorat.
    3.	Bukti diubah menjadi upload image maksimal 2 gambar
    4.	Mengahpus menu rincian

F.	Exit Meeting apps\vite-react-app\src\pages\ExitMeetingPage.tsx
    1.	Memindahkan icon exit meeting menjadi urutan ke 6
    2.	Menyesuaikan kolom menjadi No, Nama Perwadag, Tanggal Evaluasi, Tanggal Exit Meeting, Link Zoom, Status (apakah sudah upload daftar hadir dan bukti)
    3.	Akses edit link zoom, daftar hadir, dan bukti yaitu admin dan inspektorat.
    4.	Bukti diubah menjadi upload image maksimal 2 gambar
    5.	Mengahpus menu rincian

G.	Kuisioner apps\vite-react-app\src\pages\KuesionerPage.tsx
    1.	Mengubah isian rekomendasi menjadi upload dokumen
    2.	Menambah tabel  No, Nama Perwadag, Tanggal Evaluasi, Matriks (di klik bisa preview)

H.	Laporan Hasil apps\vite-react-app\src\pages\LaporanHasilEvaluasiPage.tsx
    1.	Mengubah tabel  menjadi No, Nama Perwadag, Tanggal Evaluasi, Nomor Laporan, Tanggal Laporan, Laporan Hasil Evaluasi





ruichard
    1. Nama lengkap, email, role untuk di profile
2. Bisa ngunci edit per periode oleh admin di semua menu (one click)
3. Penilaian risiko, tambah heading inspektorat sesuai parameter, hapus filter tahun terbaru/terlama, di kolom tabel tambah nama inspektorat, kolom total dihapus
4. Edit penilaian risiko, grup 1 : "tren capaian", "pilihan kategori" disable, grup 2 : tambah separator ribuan untuk nominal uang,  Grup 8 tambahin keterangan satuan Rp.
5. aksi DELETE itu cuma ngapus semmua value-nya
6. Surat tugas, tanggal diubah jadi tanggal pelaksanaan evaluasi (range), logic bisa updatenya berdasarkan hari, ubah jadi menu upload file
7. Surat pemberitahuan, no, tanggal pelaksanaan, tanggal surat tugas, nama perwadag, status (berdasarkan eksistensi file)
8. Entry meeting, no, nama perwadag, tanggal evaluasi, tanggal entry meeting, link zoom, status (daftar hadir bentuknya link gform (admin/inspektorat) dan bukti pelaksanaan maks 2 (inspektorat)), aksi
9. Entry meeting, rincian diapus
10. Exit meeting, dipindah setelah matriks
11. Tambah menu Konfirmasi, 
12. Urutan > Entry meeting > Konfirmasi > Kuesioner > Exit Meeting > Matriks > Laporan
13. Matriks jadi upload dokumen, kolomnya (no, nama perwadag, tanggal evaluasi, dokumen (tombol preview))
14. Kuesioner, kasih format kuesioner buat donlot dan upload, kolom aspek dihapus
15. Tambahin manajemen kuesioner
16. Laporan hasil, ada di docs...
17. Filter perwadag by abjad
18. Menu menambah perwadag, required (nama perwadag)


Meet 9 Juli 2025) - Review Tampilan Prototype
- Untuk Kode User di profil bisa diubah menjadi inspektorat 1, atdag tokyo dll
- Hak akses admin bikin periode window. Periode Penllaian ada cut off tapi dari auditor ada ngerubah2 data nah itu yang perlu di handle. Jadi ada close periode 
- Admin itu dikasih menu untuk menambah atau mengurangkan data perwadag (role)
- 1 perwadag 1 akun
- Upload bukan ke drive tapi langsung server
- Trigger utama surat tugas
- Filter perwadag bisa diurutkan by abc

- Halaman Penilaian Resiko 
- 1. Hilangkan filter filter tahun terbaru dan terlama
- 2. Menambahkan kolom inspektorat xx
- 3. Hilangkan Total
- 4. Di tren capaian hanya tahun 2023 dan 2024 yang input, presentase realisasi perbaiki angka nya pakai saparator dan keterangan (rp) begitu juga di point lain

- Halaman surat tugas
- 1. Tanggal dirubah jadi tanggal pelaksanaan evaluasi
- 2. Akses buka tutup penilaian untuk semua perwadag by admin.
- 3. Inputan tanggal ganti jadi range

- Halaman surat pemberitahuan
- 1. Tambahkan kolom no, tanggal pelaksanaan evaluasi, tanggal surat pemberitahuan, nama perwadag, status (apakah sudah upload dokumen atau belum)

- Halaman entry meeting
- 1. Tabel (no, nama perwadag, tanggal evaluasi, tanggal entry meeting, link zoom, status mengecek apakah sudah upload daftar hadir dan bukti hadir )
- 2. Yang bisa input link zoom (admin dan inspektorat)
- 3. Daftar hadir itu gform (admin dan inspektorat)
- 3. Bukti (inspektorat dan admin), diubah menjadi upload image maksimal 2 gambar
- 4. Menu rincian dihapus

- Halaman exit meeting
- 1. Sama kaya entry meeting
- 2. Lokasiya pindahin ke urutan 6

- Halaman Konfirmasi (Halaman baru) 
- 1. Tabel (no, nama perwadag, tanggal konfirmasi, tanggal entry meeting, link zoom, status) sama kaya entry meeting

- Halaman Matriks
- 1. Admin bisa view dan edit
- 2. isian rekomendasiku menjadi upload dokument
- 3. Tabel (no, nama perwadag, tanggal evaluasi, matriks)

- Halman kuisioner
- 1. Tambah tombol unduh format matriks
- 2. Proses bisnisnya (perwadag unduh format -> upload dokument kusiner)
- 3. Management kuisioner (untuk upload format yang beda2)
- 4. Kolom aspek dihapus

- Halaman Laporan hasil