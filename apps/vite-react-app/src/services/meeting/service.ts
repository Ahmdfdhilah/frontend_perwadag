import { BaseService } from "../base";
import {
  MeetingUpdate,
  MeetingResponse,
  MeetingListResponse,
  MeetingFilterParams,
  MeetingFileUploadRequest,
  MeetingFileUploadResponse,
  MeetingFileDeleteResponse,
} from "./types";

class MeetingService extends BaseService {
  constructor() {
    super("/evaluasi/meeting");
  }

  // Get all meetings with filters
  async getMeetingList(
    params?: MeetingFilterParams
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
    return this.get(endpoint);
  }

  // Get meeting by ID
  async getMeetingById(
    meetingId: string
  ): Promise<MeetingResponse> {
    return this.get(`/${meetingId}`);
  }

  // Get meeting by surat tugas ID and type
  async getMeetingBySuratTugasAndType(
    suratTugasId: string,
    meetingType: "ENTRY" | "KONFIRMASI" | "EXIT"
  ): Promise<MeetingResponse> {
    return this.get(`/surat-tugas/${suratTugasId}/type/${meetingType}`);
  }

  // Get all meetings for a surat tugas
  async getMeetingsBySuratTugasId(
    suratTugasId: string
  ): Promise<MeetingResponse[]> {
    return this.get(`/surat-tugas/${suratTugasId}`);
  }

  // Update meeting
  async updateMeeting(
    meetingId: string,
    data: MeetingUpdate
  ): Promise<MeetingResponse> {
    return this.put(`/${meetingId}`, data);
  }

  // Upload multiple files for meeting
  async uploadFiles(
    meetingId: string,
    files: File[],
    uploadOptions?: MeetingFileUploadRequest
  ): Promise<MeetingFileUploadResponse> {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append("files", file);
    });

    if (uploadOptions?.replace_existing !== undefined) {
      formData.append("replace_existing", uploadOptions.replace_existing.toString());
    }

    return this.post(`/${meetingId}/upload-files`, formData);
  }

  // Delete specific file from meeting
  async deleteFile(
    meetingId: string,
    filename: string
  ): Promise<MeetingFileDeleteResponse> {
    return this.delete(`/${meetingId}/files/${filename}`);
  }

  // Download specific file from meeting
  async downloadFile(
    meetingId: string,
    filename: string
  ): Promise<Blob> {
    return this.get(`/${meetingId}/files/${filename}/download`);
  }

  // View specific file from meeting in browser
  async viewFile(
    meetingId: string,
    filename: string
  ): Promise<Blob> {
    return this.get(`/${meetingId}/files/${filename}/view`);
  }

  // Download all files as ZIP
  async downloadAllFiles(
    meetingId: string
  ): Promise<Blob> {
    return this.get(`/${meetingId}/files/download-all`);
  }
}

export const meetingService = new MeetingService();