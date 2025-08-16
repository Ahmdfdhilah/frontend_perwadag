import React from 'react';
import { ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';
import { isValidUrl } from '@/utils/urlValidation';

interface FileUrls {
  view_url?: string;
  file_url?: string;
  download_url?: string;
}

type LinkType = 'file' | 'external' | 'auto';

interface FileViewLinkProps {
  hasFile?: boolean;
  fileUrls?: FileUrls;
  fileName?: string;
  className?: string;
  linkText?: string;
  showIcon?: boolean;
  // New props for external URL support
  externalUrl?: string;
  linkType?: LinkType;
  emptyText?: string;
}

const FileViewLink: React.FC<FileViewLinkProps> = ({
  hasFile = false,
  fileUrls,
  fileName,
  className = "text-blue-600 hover:text-blue-800 underline dark:text-blue-300 dark:hover:text-blue-100",
  linkText,
  showIcon = true,
  externalUrl,
  linkType = 'auto',
  emptyText,
}) => {
  // Auto-detect link type if not specified
  const actualLinkType = linkType === 'auto' 
    ? (externalUrl ? 'external' : 'file')
    : linkType;

  // Determine what to show based on link type
  if (actualLinkType === 'external') {
    // Handle external URL
    if (!externalUrl || !isValidUrl(externalUrl)) {
      return (
        <span className="text-muted-foreground">
          {emptyText || "Tidak ada link"}
        </span>
      );
    }

    const finalUrl = externalUrl.startsWith('http') ? externalUrl : `https://${externalUrl}`;
    const finalLinkText = linkText || getDefaultLinkText(externalUrl);

    return (
      <a
        href={finalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1 ${className}`}
        title={`Buka ${finalLinkText}`}
      >
        {finalLinkText}
        {showIcon && <ExternalLink className="w-3 h-3" />}
      </a>
    );
  } else {
    // Handle file URL (original behavior)
    if (!hasFile || !fileUrls?.view_url) {
      return (
        <span className="text-muted-foreground">
          {emptyText || "Tidak ada file"}
        </span>
      );
    }

    const finalLinkText = linkText || "Lihat Dokumen";

    return (
      <a
        href={`${API_BASE_URL}${fileUrls.file_url}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1 ${className}`}
        title={fileName ? `Lihat ${fileName}` : finalLinkText}
      >
        {finalLinkText}
        {showIcon && <ExternalLink className="w-3 h-3" />}
      </a>
    );
  }
};

// Helper function to get appropriate link text based on URL
const getDefaultLinkText = (url: string): string => {
  if (!url) return "Lihat Link";
  
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('zoom.us')) return "Buka Zoom";
  if (lowerUrl.includes('meet.google.com')) return "Buka Google Meet";
  if (lowerUrl.includes('teams.microsoft.com')) return "Buka Teams";
  if (lowerUrl.includes('drive.google.com') || lowerUrl.includes('docs.google.com')) return "Buka Google Drive";
  if (lowerUrl.includes('forms.google.com')) return "Buka Form";
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return "Buka Video";
  
  return "Buka Link";
};

export default FileViewLink;