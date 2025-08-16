/**
 * URL Validation Utilities
 * Provides consistent URL validation across the application
 */

export interface UrlValidationResult {
  isValid: boolean;
  formattedUrl?: string;
  error?: string;
}

/**
 * Validates if a string is a valid URL format
 * @param url - URL string to validate
 * @returns boolean indicating if URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return true; // Empty is valid (optional field)
  
  const trimmedUrl = url.trim();
  
  try {
    new URL(trimmedUrl);
    return true;
  } catch {
    // Check if it starts with http/https but is malformed
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return false; // Invalid URL with protocol
    }
    // Check if it looks like a domain
    if (trimmedUrl.includes('.') && !trimmedUrl.includes(' ') && trimmedUrl.split('.').length >= 2) {
      return true; // Valid domain-like string
    }
    return false;
  }
};

/**
 * Formats and validates URL, adding protocol if needed
 * @param url - URL string to format
 * @returns formatted URL or null if invalid
 */
export const formatDokumenUrl = (url?: string): string | null => {
  if (!url || url.trim() === '') return null;
  
  const trimmedUrl = url.trim();
  
  // Check if it's a valid URL format
  try {
    new URL(trimmedUrl);
    return trimmedUrl;
  } catch {
    // If not a valid full URL, check if it starts with http/https
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return trimmedUrl;
    }
    // If it looks like a domain without protocol, add https://
    if (trimmedUrl.includes('.') && !trimmedUrl.includes(' ')) {
      return `https://${trimmedUrl}`;
    }
    return null;
  }
};

/**
 * Validates URL and returns detailed result with formatting
 * @param url - URL string to validate
 * @returns UrlValidationResult with validation status and formatted URL
 */
export const validateAndFormatUrl = (url: string): UrlValidationResult => {
  if (!url || url.trim() === '') {
    return { isValid: true };
  }

  const trimmedUrl = url.trim();
  
  try {
    new URL(trimmedUrl);
    return { 
      isValid: true, 
      formattedUrl: trimmedUrl 
    };
  } catch {
    // Check if it starts with http/https but is malformed
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return { 
        isValid: false, 
        error: 'URL tidak valid. Periksa format URL Anda.' 
      };
    }
    
    // Check if it looks like a domain
    if (trimmedUrl.includes('.') && !trimmedUrl.includes(' ') && trimmedUrl.split('.').length >= 2) {
      return { 
        isValid: true, 
        formattedUrl: `https://${trimmedUrl}` 
      };
    }
    
    return { 
      isValid: false, 
      error: 'Format URL tidak valid. Gunakan format seperti: https://example.com atau example.com' 
    };
  }
};

/**
 * Common error messages for URL validation
 */
export const URL_VALIDATION_MESSAGES = {
  INVALID: 'URL tidak valid. Gunakan format yang benar seperti: https://example.com',
  EXAMPLE: 'Masukkan URL dokumen. Format yang diterima: https://example.com atau example.com',
  PLACEHOLDER: 'Masukkan URL (contoh: https://example.com)'
} as const;