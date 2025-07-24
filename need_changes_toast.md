# API Methods Requiring Error Toast Improvements

## Summary
This document lists all API fetch methods that currently only use `console.error()` and need to be updated to show user-friendly toast error messages from backend `detail` responses.

## Base Service Layer - CRITICAL UPDATE NEEDED

### `/src/services/base/service.ts:line 46-55`
**Method**: `handleRequest<T>()`  
**Current**: Throws generic Error objects  
**Needed**: Add toast error messages with backend detail  
**Impact**: ALL service methods inherit this - fixing this fixes most issues  

```typescript
// Current problematic code:
catch (error: any) {
  const errorMessage = error.response?.data?.detail || error.message || "An error occurred";
  throw new Error(errorMessage);
}
```

## Pages Requiring Error Toast Updates

### 1. Users Page - `/src/pages/users/UsersPage.tsx`
**Methods requiring toast updates:**
- Line 94: `fetchUsers()` - API fetch failure
- Line 136: `handleDeleteUser()` - Delete operation failure  
- Line 169: `handleSaveUser()` - Create/update operation failure

**Current**: All use `console.error()` only  
**Backend Response**: `{ "detail": "Error message here" }`

### 2. Kuesioner Page - `/src/pages/KuesionerPage.tsx`
**Methods requiring toast updates:**
- Line 85: `fetchKuisionerList()` - Initial data fetch failure
- Line 97: `fetchKuisionerList()` - Refresh data failure
- Line 153: `handleSaveKuisioner()` - Save operation failure
- Line 208: `handleFileUpload()` - File upload failure

**Current**: Mix of `console.error()` and one toast error (fetch only)  
**Note**: Save failures need toast like: "Tidak dapat mengubah data kuisioner karena periode evaluasi telah berakhir pada 22 July 2025"

### 3. Laporan Hasil Evaluasi Page - `/src/pages/LaporanHasilEvaluasiPage.tsx`
**Methods requiring toast updates:**
- Data fetch failures
- Report generation failures
- Export operation failures

**Current**: Only `console.error()` used

### 4. Surat Tugas Page - `/src/pages/SuratTugasPage.tsx`
**Methods requiring toast updates:**
- Data fetch failures (line ~80-90)
- Create/update operation failures (line ~120-140)
- Delete operation failures (line ~160-180)

**Current**: Mix of `console.error()` and `console.log()` only

### 5. Surat Pemberitahuan Page - `/src/pages/SuratPemberitahuanPage.tsx`
**Methods requiring toast updates:**
- Data fetch failures
- CRUD operation failures
- File upload failures

**Current**: Only console logging

### 6. Entry Meeting Page - `/src/pages/EntryMeetingPage.tsx`
**Methods requiring toast updates:**
- Meeting data fetch failures
- Meeting creation failures
- Meeting update failures

**Current**: Only console logging

### 7. Exit Meeting Page - `/src/pages/ExitMeetingPage.tsx`
**Methods requiring toast updates:**
- Meeting data fetch failures
- Meeting update failures
- Meeting completion failures

**Current**: Only console logging

### 8. Konfirmasi Meeting Page - `/src/pages/KonfirmasiMeetingPage.tsx`
**Methods requiring toast updates:**
- Meeting data fetch failures
- Confirmation operation failures
- Status update failures

**Current**: Only console logging

### 9. Matriks Page - `/src/pages/MatriksPage.tsx`
**Methods requiring toast updates:**
- Matrix data fetch failures
- Matrix calculation failures
- Matrix save failures

**Current**: Only console logging

### 10. Questionnaire Template Page - `/src/pages/QuestionnaireTemplatePage.tsx`
**Methods requiring toast updates:**
- Template fetch failures
- Template create/update failures
- Template delete failures

**Current**: Only console logging

### 11. Risk Assessment Pages - `/src/pages/RiskAssesment/`
**Files requiring updates:**
- `RiskAssessmentPage.tsx`
- `RiskAssessmentInputPage.tsx` 
- `RiskAssessmentDetailPage.tsx`

**Methods requiring toast updates:**
- Risk data fetch failures
- Risk calculation failures
- Risk assessment save failures

**Current**: Only console logging

## Component-Level Updates Needed

### 1. Kuesioner Dialog - `/src/components/Kuesioner/KuesionerDialog.tsx`
**Method**: Line 106 - `handleDownloadFile()`  
**Current**: `console.error()` only  
**Needed**: Toast error for file download failures

### 2. All Dialog Components
**Pattern**: Most dialogs handle success toasts but not error toasts  
**Files to check:**
- `/src/components/Users/UserDialog.tsx` (partially done)
- `/src/components/SuratTugas/SuratTugasDialog.tsx`
- `/src/components/SuratPemberitahuan/SuratPemberitahuanDialog.tsx`
- `/src/components/EntryMeeting/EntryMeetingDialog.tsx`
- `/src/components/ExitMeeting/ExitMeetingDialog.tsx`
- `/src/components/KonfirmasiMeeting/KonfirmasiMeetingDialog.tsx`
- `/src/components/Matriks/MatriksDialog.tsx`
- `/src/components/QuestionnaireTemplate/QuestionnaireDialog.tsx`

## Implementation Strategy

### Option 1: Fix Base Service (RECOMMENDED)
Update `/src/services/base/service.ts` to automatically show toast errors:
```typescript
import { toast } from "sonner";

protected async handleRequest<T>(requestFn: () => Promise<AxiosResponse<T>>): Promise<T> {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail || error.message || "Terjadi kesalahan";
    
    // Show toast error message
    toast.error("Error", {
      description: errorMessage,
    });
    
    throw new Error(errorMessage);
  }
}
```
**Impact**: Fixes ~80% of cases automatically

### Option 2: Individual Page Updates
Update each page's catch blocks to show toast errors individually.
**Impact**: More granular control but more work

## Expected Backend Error Response Format
```json
{
  "detail": "Tidak dapat mengubah data kuisioner karena periode evaluasi telah berakhir pada 22 July 2025"
}
```

## Toast Implementation Pattern
```typescript
// In try-catch blocks:
catch (error: any) {
  console.error('Operation failed:', error);
  
  const errorMessage = error.response?.data?.detail || 
                      error.message || 
                      "Terjadi kesalahan saat memproses permintaan";
  
  toast.error("Error", {
    description: errorMessage,
  });
}
```

## Files Currently With Good Error Toast Handling ✅
- `/src/components/Auth/AuthProvider.tsx` - Auth errors
- `/src/pages/KuesionerPage.tsx` - Fetch errors only (line 130-135)
- All login/auth related flows

## Priority Order
1. **HIGH**: Base Service fix (affects all API calls)
2. **HIGH**: User management operations (most critical business operations)
3. **MEDIUM**: Kuesioner and evaluation-related operations
4. **MEDIUM**: Meeting management operations  
5. **LOW**: Component-level dialog improvements

## Total Methods Needing Updates: ~50+ methods across 15+ files