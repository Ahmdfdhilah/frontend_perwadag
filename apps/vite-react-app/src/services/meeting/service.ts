import { BaseService } from "../base";
import {
  MeetingUpdate,
  MeetingResponse,
  MeetingListResponse,
  MeetingFilterParams,
  MeetingFileUploadRequest,
  MeetingFileUploadResponse,
  MeetingFileDeleteResponse,
  MeetingServiceOptions,
} from "./types";

class MeetingService extends BaseService {
  constructor() {
    super("/meeting");
  }

  // Get all meetings with filters
  async getMeetingList(
    params?: MeetingFilterParams,
    options?: MeetingServiceOptions
  ): Promise<MeetingListResponse> {
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
        description: "Failed to fetch meeting list",
      },
      options
    );
  }

  // Get meeting by ID
  async getMeetingById(
    meetingId: string,
    options?: MeetingServiceOptions
  ): Promise<MeetingResponse> {
    return this.get(
      `/${meetingId}`,
      undefined,
      {
        title: "Error",
        description: "Failed to get meeting details",
      },
      options
    );
  }

  // Get meeting by surat tugas ID and type
  async getMeetingBySuratTugasAndType(
    suratTugasId: string,
    meetingType: "entry" | "konfirmasi" | "exit",
    options?: MeetingServiceOptions
  ): Promise<MeetingResponse> {
    return this.get(
      `/surat-tugas/${suratTugasId}/type/${meetingType}`,
      undefined,
      {
        title: "Error",
        description: "Failed to get meeting by surat tugas and type",
      },
      options
    );
  }

  // Get all meetings for a surat tugas
  async getMeetingsBySuratTugasId(
    suratTugasId: string,
    options?: MeetingServiceOptions
  ): Promise<MeetingResponse[]> {
    return this.get(
      `/surat-tugas/${suratTugasId}`,
      undefined,
      {
        title: "Error",
        description: "Failed to get meetings by surat tugas",
      },
      options
    );
  }

  // Update meeting
  async updateMeeting(
    meetingId: string,
    data: MeetingUpdate,
    options?: MeetingServiceOptions
  ): Promise<MeetingResponse> {
    return this.put(
      `/${meetingId}`,
      data,
      {
        title: "Success",
        description: "Meeting updated successfully",
      },
      {
        title: "Update Failed",
        description: "Failed to update meeting",
      },
      options
    );
  }

  // Upload multiple files for meeting
  async uploadFiles(
    meetingId: string,
    files: File[],
    uploadOptions?: MeetingFileUploadRequest,
    options?: MeetingServiceOptions
  ): Promise<MeetingFileUploadResponse> {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append("files", file);
    });

    if (uploadOptions?.replace_existing !== undefined) {
      formData.append("replace_existing", uploadOptions.replace_existing.toString());
    }

    return this.post(
      `/${meetingId}/upload-files`,
      formData,
      {
        title: "Success",
        description: "Meeting files uploaded successfully",
      },
      {
        title: "Upload Failed",
        description: "Failed to upload meeting files",
      },
      options
    );
  }

  // Delete specific file from meeting
  async deleteFile(
    meetingId: string,
    filename: string,
    options?: MeetingServiceOptions
  ): Promise<MeetingFileDeleteResponse> {
    return this.delete(
      `/${meetingId}/files/${filename}`,
      {
        title: "Success",
        description: "Meeting file deleted successfully",
      },
      {
        title: "Error",
        description: "Failed to delete meeting file",
      },
      options
    );
  }

  // Download specific file from meeting
  async downloadFile(
    meetingId: string,
    filename: string,
    options?: MeetingServiceOptions
  ): Promise<Blob> {
    return this.get(
      `/${meetingId}/files/${filename}/download`,
      undefined,
      {
        title: "Error",
        description: "Failed to download meeting file",
      },
      options
    );
  }

  // View specific file from meeting in browser
  async viewFile(
    meetingId: string,
    filename: string,
    options?: MeetingServiceOptions
  ): Promise<Blob> {
    return this.get(
      `/${meetingId}/files/${filename}/view`,
      undefined,
      {
        title: "Error",
        description: "Failed to view meeting file",
      },
      options
    );
  }

  // Download all files as ZIP
  async downloadAllFiles(
    meetingId: string,
    options?: MeetingServiceOptions
  ): Promise<Blob> {
    return this.get(
      `/${meetingId}/files/download-all`,
      undefined,
      {
        title: "Error",
        description: "Failed to download all meeting files",
      },
      options
    );
  }
}

export const meetingService = new MeetingService();