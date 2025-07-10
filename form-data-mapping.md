# Form Data Mapping - Perwadag Frontend

Dokumentasi lengkap form data dan struktur input untuk setiap halaman/dialog dalam sistem Perwadag Frontend.


## 1. Meeting Management Forms

### 1.1 Entry Meeting Form (EntryMeetingDialog.tsx)

**Form Data Structure:**

```typescript
interface EntryMeetingFormData {
  linkZoom?: string;            // Zoom meeting link (optional)
  daftarHadirFiles: File[];     // Upload daftar hadir files
  buktiHadirFiles: File[];      // Upload bukti hadir files
}
```

**File Upload Specs:**
- **Daftar Hadir**: `.pdf,.doc,.docx,.jpg,.jpeg,.png` (Max 5MB, 1 file)
- **Bukti Hadir**: `image/*` (Max 5MB, max 2 files)

**Read-Only Fields:**
- `perwadagName`: Nama perwadag (display only)
- `tanggalEvaluasi`: Date range evaluasi (display only)
- `tanggal`: Tanggal entry meeting (display only) // TODO: PR masukan ini ke form untuk input datenya ya

---

### 1.2 Exit Meeting Form (ExitMeetingDialog.tsx)

Struktur yang sama dengan Entry Meeting Form.

---

### 1.3 Konfirmasi Meeting Form (KonfirmasiMeetingDialog.tsx)

Struktur yang sama dengan Entry Meeting Form.

---

## 5. Document Management Forms

### 5.1 Surat Tugas Form (SuratTugasDialog.tsx)

**Form Data Structure:**

```typescript
interface SuratTugasFormData {
  nomor: string;                        // Nomor surat (required)
  perwadagId: string;                   // Perwadag ID (required)
  tanggalPelaksanaanEvaluasi: Date;     // Start date (required)
  tanggalSelesaiEvaluasi?: Date;        // End date (optional)
  pengendaliMutu: string;               // Nama pengendali mutu (required)
  pengendaliTeknis: string;             // Nama pengendali teknis (required)
  ketuaTim: string;                     // Nama ketua tim (required)
  uploadFiles: File[];                  // File upload
}
```

**Validation Rules:**
- All string fields except `tanggalSelesaiEvaluasi` are required
- Date validation: end date must be after start date
- Form is valid only when all required fields are filled

**File Upload Specs:**
- **Format**: `.pdf,.doc,.docx` (Max 10MB, 1 file)

**Computed Fields:**
- `perwadagName`: Auto-filled from selected perwadag
- `year`: Auto-calculated from tanggalPelaksanaanEvaluasi
- `inspektorat`: Auto-filled from selected perwadag

---

### 5.2 Laporan Hasil Evaluasi Form (LaporanHasilEvaluasiDialog.tsx)

**Form Data Structure:**

```typescript
interface LaporanHasilEvaluasiFormData {
  tanggal: Date;                        // Tanggal laporan (required)
  perwadagId: string;                   // Perwadag ID (required)
  nomorEvaluasi: string;                // Nomor evaluasi (required)
  matriks: string;                      // Matriks value (required)
  uploadFiles: File[];                  // File upload
}
```

**Dropdown Options:**
- `matriks`: ['Sangat Baik', 'Baik', 'Cukup', 'Kurang']

**File Upload Specs:**
- **Format**: `.pdf,.doc,.docx,.xls,.xlsx` (Max 10MB, 1 file)

---

### 5.3 Surat Pemberitahuan Form

Berdasarkan pattern yang sama dengan Surat Tugas, kemungkinan memiliki struktur serupa untuk dokumen pemberitahuan.

---


## 10. Form Modes

### Dialog Modes:
- **View Mode**: Read-only, semua fields disabled
- **Edit Mode**: Editable fields, validation active
- **Create Mode**: Empty form, full validation

### Access Control:
- Role-based field visibility // TODO: buka akses edit untuk admin dan inspektorat (hanya perwadag yang terafiliasi dengan inspektorat tsb) tanpa membatasi attribut tertentu (kecuali yang memang readonly karna Computed Fields. untuk role perwadag hak aksesnya untuk perwadag yang sesuai dengan current user: saya mapping per tipe form saja: (surat tugas hanya view, surat pemberitahuan hanya view, kuisioner view dan edit, matriks hanya view, laporan hasil hanya view))