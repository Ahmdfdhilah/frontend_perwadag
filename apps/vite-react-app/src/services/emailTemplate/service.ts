// apps/vite-react-app/src/services/emailTemplate/service.ts

import { BaseService } from "../base";
import {
  EmailTemplateCreateRequest,
  EmailTemplateUpdateRequest,
  EmailTemplateResponse,
  EmailTemplateListResponse,
  EmailComposedResponse,
  EmailVariablesResponse,
  MessageResponse
} from "./types";

class EmailTemplateService extends BaseService {
  constructor() {
    super("/email-templates");
  }

  // Get all email templates (admin only)
  async getAllTemplates(params?: { page?: number; size?: number }): Promise<EmailTemplateListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    
    const query = queryParams.toString();
    return this.get(query ? `/?${query}` : "/");
  }

  // Get active email template (any user)
  async getActiveTemplate(): Promise<EmailTemplateResponse> {
    return this.get("/active");
  }

  // Get available variables for template creation (admin only)
  async getAvailableVariables(): Promise<EmailVariablesResponse> {
    return this.get("/variables");
  }

  // Get email template by ID (admin only)
  async getTemplateById(templateId: string): Promise<EmailTemplateResponse> {
    return this.get(`/${templateId}`);
  }

  // Create new email template (admin only)
  async createTemplate(
    templateData: EmailTemplateCreateRequest
  ): Promise<EmailTemplateResponse> {
    return this.post("/", templateData);
  }

  // Update email template (admin only)
  async updateTemplate(
    templateId: string,
    templateData: EmailTemplateUpdateRequest
  ): Promise<EmailTemplateResponse> {
    return this.put(`/${templateId}`, templateData);
  }

  // Activate email template (admin only)
  async activateTemplate(templateId: string): Promise<EmailTemplateResponse> {
    return this.post(`/${templateId}/activate`);
  }

  // Delete email template (admin only)
  async deleteTemplate(templateId: string): Promise<MessageResponse> {
    return this.delete(`/${templateId}`);
  }

  // Compose email for laporan hasil (any user)
  async composeEmailForLaporanHasil(
    laporanHasilId: string
  ): Promise<EmailComposedResponse> {
    return this.post(`/compose-email/${laporanHasilId}`);
  }

  // Helper method to insert variable into template text
  insertVariable(template: string, variable: string, cursorPosition?: number): string {
    const variableText = `{{${variable}}}`;
    
    if (cursorPosition !== undefined) {
      // Insert at specific cursor position
      return template.substring(0, cursorPosition) + 
             variableText + 
             template.substring(cursorPosition);
    } else {
      // Append at the end
      return template + variableText;
    }
  }

  // Helper method to validate template variables
  validateTemplate(template: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check for unmatched braces
    const openBraces = (template.match(/\{\{/g) || []).length;
    const closeBraces = (template.match(/\}\}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      errors.push("Template memiliki kurung kurawal yang tidak seimbang");
    }

    // Check for empty variables
    const emptyVariables = template.match(/\{\{\s*\}\}/g);
    if (emptyVariables) {
      errors.push("Template mengandung variabel kosong");
    }

    // Check for malformed variables
    const malformedVariables = template.match(/\{[^{]|[^}]\}/g);
    if (malformedVariables) {
      errors.push("Template mengandung format variabel yang salah");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Helper method to preview template with sample data
  previewTemplate(subject: string, body: string): { subject: string; body: string } {
    const sampleData = {
      nama_perwadag: "Contoh Perwadag",
      inspektorat: "Inspektorat 1",
      tahun_evaluasi: "2025",
      nomor_laporan: "LHE/001/2025",
      tanggal_laporan: "20/01/2025",
      tanggal_mulai: "15/01/2025",
      tanggal_selesai: "25/01/2025",
      durasi_evaluasi: "10",
      evaluation_status: "active",
      status_kelengkapan: "✅ Lengkap",
      persentase: "100",
      file_status: "✅ File dokumen tersedia",
      file_url: "🔗 Link Download: http://example.com/file.pdf",
      user_nama: "Administrator"
    };

    let previewSubject = subject;
    let previewBody = body;

    // Replace variables with sample data
    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      previewSubject = previewSubject.replace(regex, value);
      previewBody = previewBody.replace(regex, value);
    });

    return {
      subject: previewSubject,
      body: previewBody
    };
  }
}

export const emailTemplateService = new EmailTemplateService();