import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Upload, Download, File, X, Eye } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import { API_BASE_URL } from '@/config/api';
import { useToast } from '@workspace/ui/components/sonner';

export interface FileUploadProps {
  id?: string;
  label?: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  files?: File[];
  existingFiles?: Array<{
    name: string;
    url?: string;
    viewUrl?: string;
    size?: number;
  }>;
  mode?: 'input' | 'view' | 'edit';
  disabled?: boolean;
  required?: boolean;
  dragAndDrop?: boolean;
  showPreview?: boolean;
  allowRemove?: boolean;
  className?: string;
  internalErrorHandling?: boolean; // New prop to enable internal error handling
  onFilesChange?: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
  onExistingFileRemove?: (index: number) => void;
  onFileDownload?: (file: { name: string; url?: string; viewUrl?: string }, index: number) => void;
  onFileView?: (file: { name: string; url?: string; viewUrl?: string }, index: number) => void;
  onError?: (error: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  description,
  accept = '*/*',
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  files = [],
  existingFiles = [],
  mode = 'input',
  disabled = false,
  required = false,
  dragAndDrop = true,
  showPreview = true,
  allowRemove = true,
  className,
  internalErrorHandling = true,
  onFilesChange,
  onFileRemove,
  onExistingFileRemove,
  onFileDownload,
  onFileView,
  onError,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentFiles, setCurrentFiles] = useState<File[]>(files);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleError = (error: string, isInfo = false) => {
    if (internalErrorHandling) {
      toast({
        title: isInfo ? 'Informasi File' : 'Error File',
        description: error,
        variant: isInfo ? 'default' : 'destructive'
      });
    } else {
      onError?.(error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File ${file.name} terlalu besar. Ukuran maksimal ${formatFileSize(maxSize)}.`;
    }

    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type;

      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return type === fileExtension;
        }
        return mimeType.match(type.replace('*', '.*'));
      });

      if (!isValidType) {
        return `File ${file.name} memiliki format yang tidak didukung. Format yang diterima: ${accept}`;
      }
    }

    return null;
  };

  const handleFileSelection = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Check if current files alone exceed limit
    if (currentFiles.length + existingFiles.length >= maxFiles) {
      errors.push(`Maksimal ${maxFiles} file sudah tercapai. Silakan hapus beberapa file sebelum menambahkan yang baru.`);
      handleError(errors.join('\n'));
      return;
    }

    // Calculate remaining slots and limit files to process
    const remainingSlots = maxFiles - currentFiles.length - existingFiles.length;
    const filesToProcess = newFiles.slice(0, remainingSlots);
    
    // Show info if some files were skipped due to limit
    if (newFiles.length > remainingSlots) {
      errors.push(`Hanya ${remainingSlots} file lagi yang dapat ditambahkan. Mengambil ${remainingSlots} file pertama dari ${newFiles.length} file yang dipilih.`);
    }

    // Validate each file
    filesToProcess.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    // Only stop if no valid files and there are errors (not including the "taking first X files" message)
    const criticalErrors = errors.filter(error => !error.includes('Taking first'));
    if (criticalErrors.length > 0 && validFiles.length === 0) {
      handleError(criticalErrors.join('\n'));
      return;
    }

    const updatedFiles = multiple ? [...currentFiles, ...validFiles] : validFiles;
    setCurrentFiles(updatedFiles);
    onFilesChange?.(updatedFiles);

    // Show info/warning messages
    if (errors.length > 0) {
      const hasInfoMessages = errors.some(error => error.includes('Mengambil'));
      const hasErrorMessages = errors.some(error => !error.includes('Mengambil'));
      
      if (hasInfoMessages && !hasErrorMessages) {
        handleError(errors.join('\n'), true); // Info message
      } else {
        handleError(errors.join('\n'), false); // Error message
      }
    }
  }, [currentFiles, existingFiles, maxFiles, maxSize, accept, multiple, onFilesChange, onError]);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(event.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled && dragAndDrop && (currentFiles.length + existingFiles.length < maxFiles)) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    if (disabled || !dragAndDrop) return;

    handleFileSelection(event.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    if (!allowRemove) return;

    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    setCurrentFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
    onFileRemove?.(index);
  };

  const handleRemoveExistingFile = (index: number) => {
    if (!allowRemove) return;
    onExistingFileRemove?.(index);
  };

  const handleDownloadFile = (file: { name: string; url?: string; viewUrl?: string }, index: number) => {
    // Use custom download handler if provided
    if (onFileDownload) {
      onFileDownload(file, index);
      return;
    }

    // Fallback to direct URL download
    if (file.url) {
      // Construct full URL if url is relative
      const fullUrl = file.url.startsWith('http') ? file.url : `${API_BASE_URL}${file.url}`;
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = file.name;
      link.click();
    }
  };

  const handleViewFile = (file: { name: string; url?: string; viewUrl?: string }, index: number) => {
    // Use custom view handler if provided
    if (onFileView) {
      onFileView(file, index);
      return;
    }

    // Fallback to direct URL view
    const viewUrl = file.viewUrl || file.url;
    if (viewUrl) {
      // Construct full URL if viewUrl is relative
      const fullUrl = viewUrl.startsWith('http') ? viewUrl : `${API_BASE_URL}${viewUrl}`;
      window.open(fullUrl, '_blank');
    }
  };

  const triggerFileInput = () => {
    if (!disabled && fileInputRef.current && (currentFiles.length + existingFiles.length < maxFiles)) {
      fileInputRef.current.click();
    }
  };

  const renderFileItem = (file: File, index: number, isExisting = false) => {
    const fileSize = formatFileSize(file.size);
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    const isDocument = file.type.includes('document') || file.type.includes('word') || file.type.includes('text');
    const isExcel = file.name.match(/\.(xls|xlsx)$/i);

    return (
      <div
        key={`${isExisting ? 'existing' : 'new'}-${index}`}
        className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800"
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {isImage ? (
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            ) : isPDF ? (
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded flex items-center justify-center">
                <File className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
            ) : isDocument ? (
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center">
                <File className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            ) : isExcel ? (
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded flex items-center justify-center">
                <File className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                <File className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">
              {file.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {fileSize}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0 sm:ml-auto">
          {mode === 'view' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDownloadFile(file as any, index)}
              className="h-8 w-8 p-0"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
          {allowRemove && (mode === 'input' || mode === 'edit') && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => isExisting ? handleRemoveExistingFile(index) : handleRemoveFile(index)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderExistingFileItem = (file: { name: string; url?: string; viewUrl?: string; size?: number }, index: number) => {
    const fileSize = file.size ? formatFileSize(file.size) : 'Unknown size';
    const fileName = file.name;
    const isImage = fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    const isPDF = fileName.match(/\.pdf$/i);
    const isDocument = fileName.match(/\.(doc|docx|txt|rtf)$/i);
    const isExcel = fileName.match(/\.(xls|xlsx)$/i);

    return (
      <div
        key={`existing-${index}`}
        className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-lg bg-blue-50 dark:bg-blue-900/20"
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {isImage ? (
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            ) : isPDF ? (
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded flex items-center justify-center">
                <File className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
            ) : isDocument ? (
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center">
                <File className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            ) : isExcel ? (
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded flex items-center justify-center">
                <File className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                <File className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">
              {fileName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {fileSize} • File yang ada
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0 sm:ml-auto">
          {(file.viewUrl || file.url) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleViewFile(file, index)}
              className="h-8 w-8 p-0"
              title="View file"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
          {/* //jangan ada download */}
          {/* {file.url && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDownloadFile(file, index)}
              className="h-8 w-8 p-0"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </Button>
          )} */}
          {allowRemove && (mode === 'input' || mode === 'edit') && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleRemoveExistingFile(index)}
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (mode === 'view' && currentFiles.length === 0 && existingFiles.length === 0) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label htmlFor={id} className="text-sm font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Tidak ada file yang diupload
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 break-words">
          {description}
        </p>
      )}

      {/* File Upload Area */}
      {(mode === 'input' || mode === 'edit') && (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-colors",
            isDragOver
              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
            (disabled || (currentFiles.length + existingFiles.length >= maxFiles)) && "cursor-not-allowed opacity-50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-4 text-gray-400" />
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2 px-2">
            {(currentFiles.length + existingFiles.length >= maxFiles) ? (
              `Maksimal ${maxFiles} file tercapai`
            ) : dragAndDrop ? (
              "Seret & lepas file di sini, atau klik untuk memilih"
            ) : (
              "Klik untuk memilih file"
            )}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 break-words px-2">
            {accept !== '*/*' && (
              <span className="block sm:inline">
                Format yang diterima: {accept}
              </span>
            )}
            {maxSize && (
              <span className="block sm:inline">
                {accept !== '*/*' && ' • '}Ukuran maks: {formatFileSize(maxSize)}
              </span>
            )}
            {multiple && (
              <span className="block sm:inline">
                {(accept !== '*/*' || maxSize) && ' • '}File: {currentFiles.length + existingFiles.length}/{maxFiles}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <Input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
        disabled={disabled}
        className="hidden"
        {...(maxSize && { 'data-max-size': maxSize })}
      />

      {/* File Lists */}
      {showPreview && (
        <div className="space-y-2">
          {/* Existing Files */}
          {existingFiles.map((file, index) => renderExistingFileItem(file, index))}

          {/* New Files */}
          {currentFiles.map((file, index) => renderFileItem(file, index))}
        </div>
      )}

      {/* Upload Button (Alternative to drag & drop) */}
      {(mode === 'input' || mode === 'edit') && !dragAndDrop && (
        <Button
          type="button"
          variant="outline"
          onClick={triggerFileInput}
          disabled={disabled || (currentFiles.length + existingFiles.length >= maxFiles)}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {(currentFiles.length + existingFiles.length >= maxFiles) 
            ? `Maksimal ${maxFiles} file tercapai`
            : multiple ? 'Pilih File' : 'Pilih File'
          }
        </Button>
      )}
    </div>
  );
};

export default FileUpload;