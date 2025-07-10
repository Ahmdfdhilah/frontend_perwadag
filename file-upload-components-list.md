# File Upload Components List

## Dialog Components dengan Fitur File Upload

Berikut adalah daftar komponen dialog yang memiliki atribut file upload:


### 2. **KonfirmasiMeetingDialog**
- **File**: `apps/vite-react-app/src/components/KonfirmasiMeeting/KonfirmasiMeetingDialog.tsx`
- **Upload Types**: 
  - Daftar Hadir file upload
  - Bukti Foto upload (maksimal 2 gambar)
- **Features**:
  - Handler: `handleDaftarHadirFileChange`, `handleBuktiHadirFileChange`
  - Multiple file support untuk bukti foto
  - UI: Upload button dengan Upload icon

### 3. **SuratPemberitahuanDialog**
- **File**: `apps/vite-react-app/src/components/SuratPemberitahuan/SuratPemberitahuanDialog.tsx`
- **Upload Type**: Surat Pemberitahuan file
- **Features**:
  - Handler: `handleFileUpload`
  - Accept: PDF, DOC, DOCX
  - UI: Upload button dengan informasi file support
  - Download feature untuk file yang sudah diupload

### 4. **EntryMeetingDialog**
- **File**: `apps/vite-react-app/src/components/EntryMeeting/EntryMeetingDialog.tsx`
- **Upload Types**:
  - Daftar Hadir file upload
  - Bukti Hadir upload (maksimal 2 gambar)
- **Features**:
  - Handler: `handleDaftarHadirFileChange`, `handleBuktiHadirFileChange`
  - Multiple file support untuk bukti hadir
  - UI: Upload button dengan Upload icon

### 5. **ExitMeetingDialog**
- **File**: `apps/vite-react-app/src/components/ExitMeeting/ExitMeetingDialog.tsx`
- **Upload Types**:
  - Daftar Hadir file upload
  - Bukti Hadir upload (maksimal 2 gambar)
- **Features**:
  - Handler: `handleDaftarHadirFileChange`, `handleBuktiHadirFileChange`
  - Multiple file support untuk bukti hadir
  - UI: Upload button dengan Upload icon

### 6. **LaporanHasilEvaluasiDialog**
- **File**: `apps/vite-react-app/src/components/LaporanHasilEvaluasi/LaporanHasilEvaluasiDialog.tsx`
- **Upload Type**: File upload untuk laporan
- **Features**:
  - Handler: `handleFileUpload`
  - Download feature untuk file yang sudah diupload
  - UI: Upload button dengan Upload icon
  - File management dengan preview

### 7. **QuestionnaireDialog**
- **File**: `apps/vite-react-app/src/components/QuestionnaireTemplate/QuestionnaireDialog.tsx`
- **Upload Type**: Dokumen template upload
- **Features**:
  - Handler: `handleDokumenFileChange`
  - UI: Upload button dengan Upload icon
  - Download feature

### 8. **SuratTugasDialog**
- **File**: `apps/vite-react-app/src/components/SuratTugas/SuratTugasDialog.tsx`
- **Upload Type**: Surat Tugas file
- **Features**:
  - Handler: `handleFileUpload`
  - Accept: PDF, DOC, DOCX
  - UI: Upload button dengan informasi file support
  - Download feature untuk file yang sudah diupload

### 9. **MatriksDialog**
- **File**: `apps/vite-react-app/src/components/Matriks/MatriksDialog.tsx`
- **Upload Type**: Dokumen Matriks upload
- **Features**:
  - Handler: `handleFileSelect`
  - UI: Upload area dengan drag-and-drop style
  - File preview dengan download link
  - Remove file functionality

## Ringkasan Fitur Upload

- **Total Dialog dengan File Upload**: 9 komponen
- **Jenis Upload**:
  - Document files (PDF, DOC, DOCX)
  - Attendance files (Daftar Hadir)
  - Photo evidence (Bukti Foto/Hadir)
  - Template documents
  - Matrix documents
  - Report files

- **Fitur Umum**:
  - Input type="file" dengan handler functions
  - Upload icon dari lucide-react
  - File preview dan download functionality
  - Multiple file support (untuk bukti foto)
  - File type validation
  - Upload status indication




intruksi cara penggunaan file upload components:
I've created a comprehensive reusable FileUpload component at apps/vite-react-app/src/components/common/FileUpload.tsx. Here's what it     
   includes:

  Key Features:

  📁 File Handling
  - Single and multiple file support
  - File type validation with accept parameter
  - File size limits with user-friendly error messages
  - Maximum file count limits

  🎨 Upload Modes
  - Input mode: Full upload functionality with drag & drop
  - View mode: Read-only display with download options
  - Edit mode: Modification capabilities with remove/add functions

  🖱️ Interaction Methods
  - Drag & drop interface (optional)
  - Click to select files
  - Traditional file input button

  📋 File Management
  - File preview with type-specific icons
  - Remove functionality for individual files
  - Support for existing files with download links
  - File size display and formatting

  ⚡ TypeScript Safety
  - Comprehensive prop interfaces
  - Type-safe event handlers
  - Proper error handling with callbacks

  Usage Examples:

  // Basic single file upload
  <FileUpload
    label="Document Upload"
    accept=".pdf,.doc,.docx"
    onFilesChange={(files) => console.log(files)}
  />

  // Multiple image upload with preview
  <FileUpload
    label="Photo Evidence"
    accept="image/*"
    multiple
    maxFiles={5}
    maxSize={5 * 1024 * 1024} // 5MB
    onFilesChange={(files) => setImages(files)}
  />

  // View mode with existing files
  <FileUpload
    mode="view"
    label="Uploaded Documents"
    existingFiles={[
      { name: "document.pdf", url: "/api/files/document.pdf" }
    ]}
    onFileDownload={(file) => window.open(file.url)}
  />

  // Edit mode with existing and new files
  <FileUpload
    mode="edit"
    label="Meeting Files"
    existingFiles={existingFiles}
    onFilesChange={(newFiles) => setNewFiles(newFiles)}
    onExistingFileRemove={(index) => removeExistingFile(index)}
  />