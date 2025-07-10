# Data Structure Mapping - Perwadag Frontend

Dokumentasi lengkap struktur data mocking untuk setiap 'table' atau entitas dalam sistem Perwadag Frontend.

## 1. Users (users.ts)

**Interface:** `User`

```typescript
interface User {
  id: string;                    // Primary key (contoh: "USR001")
  email: string;                 // Email unik pengguna
  nip: string;                   // Nomor Induk Pegawai
  name: string;                  // Nama lengkap
  phone: string;                 // Nomor telepon (format: +62xxx)
  address: string;               // Alamat lengkap
  avatar?: string;               // URL foto profil (optional)
  roles: Role[];                 // Array role yang dimiliki
  perwadagId?: string;          // ID Perwadag (optional, untuk role perwadag)
  inspektoratLevel?: string;     // Level inspektorat (optional)
  isActive: boolean;             // Status aktif pengguna
  lastLogin?: Date;              // Waktu login terakhir (optional)
  createdAt: Date;               // Waktu pembuatan akun
  updatedAt: Date;               // Waktu update terakhir
}
```

**Relationships:**
- One-to-Many dengan `Role`
- Many-to-One dengan `Perwadag` (melalui `perwadagId`)

---

## 2. Roles (roles.ts)

**Interface:** `Role`

```typescript
interface Role {
  id: string;          // Primary key (admin, inspektorat, perwadag)
  name: string;        // Nama role
  label: string;       // Label tampilan
  description: string; // Deskripsi role
}
```

**Data Options:**
- `admin`: Administrator dengan akses penuh
- `inspektorat`: Role untuk tim inspektorat
- `perwadag`: Role untuk perwakilan dagang

---

## 3. Perwadag (perwadag.ts)

**Interface:** `Perwadag`

```typescript
interface Perwadag {
  id: string;          // Primary key (contoh: "PWD001")
  name: string;        // Nama perwakilan dagang
  address: string;     // Alamat/lokasi
  inspektorat: number; // Level inspektorat (1-4)
}
```

**Grouping:**
- Inspektorat 1: 8 perwakilan (PWD001-PWD008)
- Inspektorat 2: 9 perwakilan (PWD009-PWD017)
- Inspektorat 3: 9 perwakilan (PWD018-PWD026)
- Inspektorat 4: 10 perwakilan (PWD027-PWD036)

---

## 4. Entry Meeting (entryMeeting.ts)

**Interface:** `EntryMeeting`

```typescript
interface EntryMeeting {
  id: string;                    // Primary key (contoh: "EM001")
  tanggal: string;               // Tanggal meeting (YYYY-MM-DD)
  tanggalMulaiEvaluasi: string;  // Tanggal mulai evaluasi
  tanggalAkhirEvaluasi: string;  // Tanggal akhir evaluasi
  perwadagId: string;            // Foreign key ke Perwadag
  perwadagName: string;          // Nama perwadag (denormalized)
  linkZoom?: string;             // URL meeting Zoom (optional)
  linkDaftarHadir?: string;      // URL daftar hadir (optional)
  buktiImages?: string[];        // Array nama file bukti (optional)
  buktiImageUrls?: string[];     // Array URL bukti (optional)
  year: number;                  // Tahun meeting
  inspektorat: number;           // Level inspektorat
}
```

**Status Logic:**
- `Lengkap`: Ada linkDaftarHadir DAN buktiImages
- `Sebagian`: Ada salah satu dari linkDaftarHadir ATAU buktiImages
- `Belum Upload`: Tidak ada keduanya

---

## 5. Exit Meeting (exitMeeting.ts)

**Interface:** `ExitMeeting`

```typescript
interface ExitMeeting {
  id: string;                    // Primary key (contoh: "EXM001")
  tanggal: string;               // Tanggal meeting (YYYY-MM-DD)
  tanggalMulaiEvaluasi: string;  // Tanggal mulai evaluasi
  tanggalAkhirEvaluasi: string;  // Tanggal akhir evaluasi
  perwadagId: string;            // Foreign key ke Perwadag
  perwadagName: string;          // Nama perwadag (denormalized)
  linkZoom?: string;             // URL meeting Zoom (optional)
  linkDaftarHadir?: string;      // URL daftar hadir (optional)
  buktiImages?: string[];        // Array nama file bukti (optional)
  buktiImageUrls?: string[];     // Array URL bukti (optional)
  year: number;                  // Tahun meeting
  inspektorat: number;           // Level inspektorat
}
```

**Note:** Struktur sama dengan EntryMeeting, hanya berbeda ID prefix (EXM vs EM)

---

## 6. Konfirmasi Meeting (konfirmasiMeeting.ts)

**Interface:** `KonfirmasiMeeting`

```typescript
interface KonfirmasiMeeting {
  status?: string;               // Status tambahan (optional)
  id: string;                    // Primary key (contoh: "KM001")
  no: number;                    // Nomor urut
  perwadagId: string;            // Foreign key ke Perwadag
  perwadagName: string;          // Nama perwadag (denormalized)
  tanggalEvaluasi: string;       // Tanggal evaluasi (YYYY-MM-DD)
  tanggalMulaiEvaluasi: string;  // Tanggal mulai evaluasi
  tanggalAkhirEvaluasi: string;  // Tanggal akhir evaluasi
  tanggalKonfirmasi: string;     // Tanggal konfirmasi
  linkZoom?: string;             // URL meeting Zoom (optional)
  linkDaftarHadir?: string;      // URL daftar hadir (optional)
  buktiImages?: string[];        // Array nama file bukti (optional)
  buktiImageUrls?: string[];     // Array URL bukti (optional)
  year: number;                  // Tahun meeting
  inspektorat: number;           // Level inspektorat
}
```

---

## 7. Kuesioner (kuesioner.ts)

**Interface:** `Kuesioner`

```typescript
interface Kuesioner {
  id: string;                    // Primary key (contoh: "KS001")
  tanggal: string;               // Tanggal (YYYY-MM-DD)
  tanggalMulaiEvaluasi: string;  // Tanggal mulai evaluasi
  tanggalAkhirEvaluasi: string;  // Tanggal akhir evaluasi
  perwadagId: string;            // Foreign key ke Perwadag
  perwadagName: string;          // Nama perwadag (denormalized)
  dokumen?: string;              // Nama file dokumen (optional)
  year: number;                  // Tahun
  inspektorat: number;           // Level inspektorat
}
```

**Status Logic:**
- `Tersedia`: Ada dokumen
- `Belum Upload`: Tidak ada dokumen

---

## 8. Laporan Hasil Evaluasi (laporanHasilEvaluasi.ts)

**Interface:** `LaporanHasilEvaluasi`

```typescript
interface LaporanHasilEvaluasi {
  id: string;                    // Primary key (contoh: "LHE001")
  tanggal: string;               // Tanggal (YYYY-MM-DD)
  tanggalMulaiEvaluasi: string;  // Tanggal mulai evaluasi
  tanggalAkhirEvaluasi: string;  // Tanggal akhir evaluasi
  perwadagId: string;            // Foreign key ke Perwadag
  perwadagName: string;          // Nama perwadag (denormalized)
  nomorEvaluasi: string;         // Nomor evaluasi (contoh: "LHE/001/2024")
  matriks: string;               // Nilai matriks (Sangat Baik, Baik, Cukup, Kurang)
  uploadFile?: string;           // Nama file upload (optional)
  uploadFileUrl?: string;        // URL file upload (optional)
  status: 'uploaded' | 'not_uploaded';  // Status upload
  year: number;                  // Tahun
  inspektorat: number;           // Level inspektorat
}
```

**Matriks Options:**
- `Sangat Baik`
- `Baik`
- `Cukup`
- `Kurang`

---

## 9. Surat Tugas (suratTugas.ts)

**Interface:** `SuratTugas`

```typescript
interface SuratTugas {
  id: string;                           // Primary key (contoh: "ST001")
  nomor: string;                        // Nomor surat (contoh: "ST/001/I/2024")
  tanggalPelaksanaanEvaluasi: string;   // Tanggal pelaksanaan (YYYY-MM-DD)
  tanggalSelesaiEvaluasi?: string;      // Tanggal selesai (optional)
  tanggalMulaiEvaluasi: string;         // Tanggal mulai evaluasi
  tanggalAkhirEvaluasi: string;         // Tanggal akhir evaluasi
  perwadagId: string;                   // Foreign key ke Perwadag
  perwadagName: string;                 // Nama perwadag (denormalized)
  pengendaliMutu: string;               // Nama pengendali mutu
  pengendaliTeknis: string;             // Nama pengendali teknis
  ketuaTim: string;                     // Nama ketua tim
  fileName: string;                     // Nama file surat
  fileUrl: string;                      // URL file surat
  year: number;                         // Tahun
  inspektorat: number;                  // Level inspektorat
  uploadFiles?: File[];                 // File uploads (optional)
}
```

---

## 10. Surat Pemberitahuan (suratPemberitahuan.ts)

**Interface:** `SuratPemberitahuan`

```typescript
interface SuratPemberitahuan {
  id: string;                        // Primary key (contoh: "SP001")
  tanggalEvaluasi: string;           // Tanggal evaluasi (YYYY-MM-DD)
  tanggalSuratPemberitahuan: string; // Tanggal surat (YYYY-MM-DD)
  tanggalMulaiEvaluasi: string;      // Tanggal mulai evaluasi
  tanggalAkhirEvaluasi: string;      // Tanggal akhir evaluasi
  perwadagId: string;                // Foreign key ke Perwadag
  perwadagName: string;              // Nama perwadag (denormalized)
  fileName?: string;                 // Nama file (optional)
  fileUrl?: string;                  // URL file (optional)
  status: 'uploaded' | 'not_uploaded';  // Status upload
  year: number;                      // Tahun
  inspektorat: number;               // Level inspektorat
}
```

---

## 11. Matriks (matriks.ts)

**Interface:** `Matriks`

```typescript
interface Matriks {
  id: string;                    // Primary key (contoh: "MTX001")
  tanggal: string;               // Tanggal (YYYY-MM-DD)
  tanggalMulaiEvaluasi: string;  // Tanggal mulai evaluasi
  tanggalAkhirEvaluasi: string;  // Tanggal akhir evaluasi
  perwadagId: string;            // Foreign key ke Perwadag
  perwadagName: string;          // Nama perwadag (denormalized)
  status: 'Diisi' | 'Belum Diisi';  // Status pengisian
  temuan: string;                // Temuan evaluasi
  rekomendasi: string;           // Rekomendasi
  uploadFile?: string;           // Nama file upload (optional)
  uploadFileUrl?: string;        // URL file upload (optional)
  year: number;                  // Tahun
  inspektorat: number;           // Level inspektorat
}
```

---

## 12. Questionnaire Template (questionnaireTemplate.ts)

**Interface:** `QuestionnaireTemplate`

```typescript
interface QuestionnaireTemplate {
  id: string;          // Primary key (contoh: "QT001")
  no: number;          // Nomor urut
  nama: string;        // Nama template
  deskripsi: string;   // Deskripsi template
  tahun: number;       // Tahun template
  dokumen?: string;    // Nama file dokumen (optional)
}
```

**Categories:**
- Template Kuesioner Evaluasi Tata Kelola Keuangan
- Template Kuesioner Evaluasi Manajemen SDM
- Template Kuesioner Evaluasi Promosi Dagang
- Template Kuesioner Evaluasi Fasilitasi Ekspor
- Template Kuesioner Evaluasi Sistem Informasi
- Template Kuesioner Evaluasi Kinerja Organisasi
- Template Kuesioner Evaluasi Pelayanan Publik
- Template Kuesioner Evaluasi Program Kemitraan
- Template Kuesioner Evaluasi Inovasi dan Teknologi
- Template Kuesioner Evaluasi Kepuasan Stakeholder

---

## 13. Risk Assessment (riskAssessment.ts)

**Interface:** `RiskAssessment`

```typescript
interface RiskAssessment {
  id: string;            // Primary key
  year: number;          // Tahun assessment
  perwadagName: string;  // Nama perwadag
  score: number;         // Skor risiko (0-100)
  riskProfile: string;   // Profil risiko (Tinggi, Sedang, Rendah)
  total: number;         // Total maksimal (100)
  inspektorat: number;   // Level inspektorat
}
```

**Risk Profiles:**
- `Tinggi`: Skor tinggi
- `Sedang`: Skor menengah  
- `Rendah`: Skor rendah

---

## 14. Risk Assessment Detail (riskAssessmentDetail.ts)

**Interface:** `RiskAssessmentDetail`

```typescript
interface RiskAssessmentDetail {
  id: string;
  year: number;
  perwadagName: string;
  inspektorat: number;
  
  // Section 1: Tren Capaian
  achievement2023: number;           // Capaian 2023
  achievement2024: number;           // Capaian 2024
  trendAchievement: number;          // Tren persentase
  trendChoice: string;               // Pilihan kategori tren
  trendValue: number;                // Nilai skor (1-5)
  
  // Section 2: Realisasi Anggaran
  budgetRealization2024: number;     // Realisasi anggaran
  budgetPagu2024: number;           // Pagu anggaran
  budgetPercentage: number;         // Persentase realisasi
  budgetChoice: string;             // Pilihan kategori budget
  budgetValue: number;              // Nilai skor (1-5)
  
  // Section 3: Tren Nilai Ekspor
  exportTrendDescription: string;    // Deskripsi tren ekspor
  exportChoice: string;             // Pilihan kategori ekspor
  exportValue: number;              // Nilai skor (1-5)
  
  // Section 4: Audit Itjen
  auditDescription: string;         // Deskripsi audit
  auditChoice: string;              // Pilihan kategori audit
  auditValue: number;               // Nilai skor (1-5)
  
  // Section 5: Perjanjian Perdagangan
  tradeAgreementDescription: string; // Deskripsi perjanjian
  tradeAgreementChoice: string;     // Pilihan kategori perjanjian
  tradeAgreementValue: number;      // Nilai skor (1-5)
  
  // Section 6: Peringkat Nilai Ekspor
  exportRankingDescription: string;  // Deskripsi peringkat
  exportRankingChoice: string;      // Pilihan kategori peringkat
  exportRankingValue: number;       // Nilai skor (1-5)
  
  // Section 7: IK Target
  ikNotAchieved: number;            // Jumlah IK tidak tercapai
  ikTotal: number;                  // Total IK
  ikPercentage: number;             // Persentase tidak tercapai
  ikChoice: string;                 // Pilihan kategori IK
  ikValue: number;                  // Nilai skor (1-5)
  
  // Section 8: Nilai Transaksi TEI
  teiRealizationValue: number;      // Nilai realisasi TEI
  teiPotentialValue: number;        // Nilai potensi TEI
  teiPercentage: number;            // Persentase TEI
  teiDescription: string;           // Deskripsi TEI
  teiChoice: string;                // Pilihan kategori TEI
  teiValue: number;                 // Nilai skor (1-5)
  
  // Final
  totalRiskValue: number;           // Total nilai risiko
  notes: string;                    // Catatan
}
```

**Scoring System:**
- Setiap section memiliki skor 1-5
- Pilihan dropdown dengan skor yang sudah ditentukan
- Total skor dihitung dari semua section

---

## Data Relationships Overview

### Primary Relationships:
1. **User** ↔ **Role** (Many-to-Many)
2. **User** ↔ **Perwadag** (Many-to-One via perwadagId)
3. **Perwadag** ↔ **All Meeting/Document Entities** (One-to-Many)

### Common Fields Across Entities:
- `id`: Primary key dengan format spesifik per tabel
- `year`: Tahun untuk filtering
- `inspektorat`: Level inspektorat (1-4) 
- `perwadagId`/`perwadagName`: Referensi ke Perwadag
- `tanggalMulaiEvaluasi`/`tanggalAkhirEvaluasi`: Periode evaluasi

### File/Document Management:
- Banyak entitas menggunakan pattern `fileName`, `fileUrl`, `uploadFile`, `uploadFileUrl`
- Status upload umumnya: `'uploaded' | 'not_uploaded'` atau logic berbasis keberadaan file
- File images: pattern `buktiImages[]` dan `buktiImageUrls[]`

### Yearly Data Pattern:
- Semua data memiliki field `year` untuk filtering temporal
- Years tersedia: 2022, 2023, 2024 (berbeda per entitas)
- Data terdistribusi berdasarkan inspektorat level