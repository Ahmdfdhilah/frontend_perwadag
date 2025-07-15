// apps/vite-react-app/src/services/files/service.ts
import { BaseService } from "../base";
import {
  FileUploadParams,
  FileUploadResponse,
  MultipleFileUploadResponse,
  FileUrlParams,
  FileUrlResponse,
  FileDeleteParams,
  FileDeleteResponse,
  FileListResponse,
  FileFilterParams,
  StorageInfoResponse,
  FileCleanupResponse,
  FileStatistics,
  FileServiceOptions,
} from "./types";

class FileService extends BaseService {
  constructor() {
    super("/files");
  }

  async uploadFile(
    file: File,
    params?: FileUploadParams,
    options?: FileServiceOptions
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
    }

    return this.post(
      "/upload",
      formData,
      {
        title: "Success",
        description: "File uploaded successfully",
      },
      {
        title: "Upload Failed",
        description: "Failed to upload file",
      },
      options
    );
  }

  async uploadMultipleFiles(
    files: File[],
    params?: FileUploadParams,
    options?: FileServiceOptions
  ): Promise<MultipleFileUploadResponse> {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append("files", file);
    });
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
    }

    return this.post(
      "/upload-multiple",
      formData,
      {
        title: "Success",
        description: "Files uploaded successfully",
      },
      {
        title: "Upload Failed",
        description: "Failed to upload files",
      },
      options
    );
  }

  async getFiles(
    params?: FileFilterParams,
    options?: FileServiceOptions
  ): Promise<FileListResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = queryParams.toString() ? `/?${queryParams.toString()}` : "/";
    return this.get(
      endpoint,
      undefined,
      {
        title: "Error",
        description: "Failed to fetch files",
      },
      options
    );
  }

  async getMyFiles(
    params?: FileFilterParams,
    options?: FileServiceOptions
  ): Promise<FileListResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = queryParams.toString() ? `/my-files?${queryParams.toString()}` : "/my-files";
    return this.get(
      endpoint,
      undefined,
      {
        title: "Error",
        description: "Failed to fetch your files",
      },
      options
    );
  }

  async getFileById(
    fileId: string,
    options?: FileServiceOptions
  ): Promise<FileUploadResponse> {
    return this.get(
      `/${fileId}`,
      undefined,
      {
        title: "Error",
        description: "Failed to get file",
      },
      options
    );
  }

  async getFileUrl(
    fileId: string,
    params?: FileUrlParams,
    options?: FileServiceOptions
  ): Promise<FileUrlResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = queryParams.toString() ? `/${fileId}/url?${queryParams.toString()}` : `/${fileId}/url`;
    return this.get(
      endpoint,
      undefined,
      {
        title: "Error",
        description: "Failed to get file URL",
      },
      options
    );
  }

  async deleteFile(
    fileId: string,
    params?: FileDeleteParams,
    options?: FileServiceOptions
  ): Promise<FileDeleteResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = queryParams.toString() ? `/${fileId}?${queryParams.toString()}` : `/${fileId}`;
    return this.delete(
      endpoint,
      {
        title: "Success",
        description: "File deleted successfully",
      },
      {
        title: "Error",
        description: "Failed to delete file",
      },
      options
    );
  }

  // Admin methods
  async getFileStatistics(
    options?: FileServiceOptions
  ): Promise<FileStatistics> {
    return this.get(
      "/admin/stats",
      undefined,
      {
        title: "Error",
        description: "Failed to get file statistics",
      },
      options
    );
  }

  async cleanupExpiredFiles(
    options?: FileServiceOptions
  ): Promise<FileCleanupResponse> {
    return this.post(
      "/admin/cleanup",
      undefined,
      {
        title: "Success",
        description: "File cleanup completed",
      },
      {
        title: "Error",
        description: "Failed to cleanup files",
      },
      options
    );
  }

  async getStorageInfo(
    options?: FileServiceOptions
  ): Promise<StorageInfoResponse> {
    return this.get(
      "/admin/storage-info",
      undefined,
      {
        title: "Error",
        description: "Failed to get storage info",
      },
      options
    );
  }
}

export const fileService = new FileService();