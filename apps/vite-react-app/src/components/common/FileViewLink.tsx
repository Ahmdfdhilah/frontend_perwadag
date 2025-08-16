import React from 'react';
import { 
  ExternalLink, 
  Video, 
  FileText, 
  Users, 
  Calendar, 
  Link as LinkIcon,
  MessageCircle,
  Globe,
  Download,
  FileSpreadsheet,
  Image,
  Music,
  Play,
  Cloud,
  Github,
  Mail
} from 'lucide-react';
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
  className = "text-primary hover:text-primary/80 underline",
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
        <span className={getEmptyStateClasses(className)}>
          {emptyText || "Tidak ada link"}
        </span>
      );
    }

    const finalUrl = externalUrl.startsWith('http') ? externalUrl : `https://${externalUrl}`;
    const finalLinkText = linkText || getDefaultLinkText(externalUrl);
    const IconComponent = getIconForUrl(externalUrl);

    return (
      <a
        href={finalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 ${className}`}
        title={`Buka ${finalLinkText}`}
      >
        {showIcon && <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />}
        {finalLinkText}
      </a>
    );
  } else {
    // Handle file URL (original behavior)
    if (!hasFile || !fileUrls?.view_url) {
      return (
        <span className={getEmptyStateClasses(className)}>
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
        className={`inline-flex items-center gap-1.5 ${className}`}
        title={fileName ? `Lihat ${fileName}` : finalLinkText}
      >
        {showIcon && <FileText className="w-3.5 h-3.5 flex-shrink-0" />}
        {finalLinkText}
      </a>
    );
  }
};

// Helper function to get empty state classes (removes link-specific styling)
const getEmptyStateClasses = (className: string): string => {
  return className
    .split(' ')
    .filter(cls => 
      !cls.includes('text-primary') &&
      !cls.includes('hover:') &&
      !cls.includes('underline') &&
      !cls.includes('text-blue')
    )
    .concat(['text-muted-foreground'])
    .join(' ');
};

// Helper function to get appropriate icon based on URL
const getIconForUrl = (url: string) => {
  if (!url) return LinkIcon;
  
  const lowerUrl = url.toLowerCase();
  
  // Video conferencing & streaming
  if (lowerUrl.includes('zoom.us') || lowerUrl.includes('zoom.')) {
    return Video;
  }
  if (lowerUrl.includes('meet.google.com') || lowerUrl.includes('hangouts.google.com')) {
    return Video;
  }
  if (lowerUrl.includes('teams.microsoft.com') || lowerUrl.includes('teams.live.com')) {
    return Video;
  }
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || lowerUrl.includes('youtube-nocookie.com')) {
    return Play;
  }
  if (lowerUrl.includes('vimeo.com') || lowerUrl.includes('dailymotion.com') || lowerUrl.includes('twitch.tv')) {
    return Play;
  }
  if (lowerUrl.includes('webex.com') || lowerUrl.includes('gotomeeting.com') || lowerUrl.includes('whereby.com')) {
    return Video;
  }
  
  // Documents & Files
  if (lowerUrl.includes('drive.google.com') || lowerUrl.includes('docs.google.com')) {
    return FileText;
  }
  if (lowerUrl.includes('sheets.google.com') || lowerUrl.includes('excel') || lowerUrl.includes('.xlsx') || lowerUrl.includes('.xls')) {
    return FileSpreadsheet;
  }
  if (lowerUrl.includes('onedrive.live.com') || lowerUrl.includes('sharepoint.com') || lowerUrl.includes('office.com')) {
    return FileText;
  }
  if (lowerUrl.includes('dropbox.com') || lowerUrl.includes('box.com') || lowerUrl.includes('icloud.com')) {
    return Cloud;
  }
  if (lowerUrl.includes('.pdf') || lowerUrl.includes('.doc') || lowerUrl.includes('.docx')) {
    return FileText;
  }
  
  // Forms & Registration
  if (lowerUrl.includes('forms.google.com') || lowerUrl.includes('typeform.com') || lowerUrl.includes('surveymonkey.com')) {
    return Users;
  }
  if (lowerUrl.includes('daftar') || lowerUrl.includes('attendance') || lowerUrl.includes('absen') || lowerUrl.includes('presensi')) {
    return Users;
  }
  if (lowerUrl.includes('registration') || lowerUrl.includes('signup') || lowerUrl.includes('register')) {
    return Users;
  }
  
  // Calendar & Events
  if (lowerUrl.includes('calendar.google.com') || lowerUrl.includes('outlook.live.com/calendar')) {
    return Calendar;
  }
  if (lowerUrl.includes('calendar') || lowerUrl.includes('event') || lowerUrl.includes('schedule')) {
    return Calendar;
  }
  if (lowerUrl.includes('calendly.com') || lowerUrl.includes('acuityscheduling.com')) {
    return Calendar;
  }
  
  // Social Media & Communication
  if (lowerUrl.includes('whatsapp.com') || lowerUrl.includes('wa.me') || lowerUrl.includes('telegram.')) {
    return MessageCircle;
  }
  if (lowerUrl.includes('discord.')) {
    return MessageCircle;
  }
  if (lowerUrl.includes('slack.com')) {
    return MessageCircle;
  }
  
  // Development & Code
  if (lowerUrl.includes('github.com') || lowerUrl.includes('gitlab.com') || lowerUrl.includes('bitbucket.')) {
    return Github;
  }
  
  // Email
  if (lowerUrl.includes('mailto:') || lowerUrl.includes('gmail.com') || lowerUrl.includes('outlook.')) {
    return Mail;
  }
  
  // Media
  if (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg') || lowerUrl.includes('.png') || lowerUrl.includes('.gif')) {
    return Image;
  }
  if (lowerUrl.includes('.mp3') || lowerUrl.includes('.wav') || lowerUrl.includes('spotify.com') || lowerUrl.includes('soundcloud.com')) {
    return Music;
  }
  
  // Downloads
  if (lowerUrl.includes('download') || lowerUrl.includes('.zip') || lowerUrl.includes('.rar')) {
    return Download;
  }
  
  // General websites
  if (lowerUrl.includes('www.') || lowerUrl.startsWith('http')) {
    return Globe;
  }
  
  return ExternalLink;
};

// Helper function to get appropriate link text based on URL
const getDefaultLinkText = (url: string): string => {
  if (!url) return "Lihat Link";
  
  const lowerUrl = url.toLowerCase();
  
  // Video conferencing & streaming
  if (lowerUrl.includes('zoom.us') || lowerUrl.includes('zoom.')) return "Buka Zoom";
  if (lowerUrl.includes('meet.google.com') || lowerUrl.includes('hangouts.google.com')) return "Buka Google Meet";
  if (lowerUrl.includes('teams.microsoft.com') || lowerUrl.includes('teams.live.com')) return "Buka Teams";
  if (lowerUrl.includes('webex.com')) return "Buka Webex";
  if (lowerUrl.includes('gotomeeting.com')) return "Buka GoToMeeting";
  if (lowerUrl.includes('whereby.com')) return "Buka Whereby";
  
  // Video & Streaming platforms
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || lowerUrl.includes('youtube-nocookie.com')) return "Buka Video";
  if (lowerUrl.includes('vimeo.com')) return "Buka Vimeo";
  if (lowerUrl.includes('dailymotion.com')) return "Buka Video";
  if (lowerUrl.includes('twitch.tv')) return "Buka Twitch";
  
  // Documents & Cloud Storage
  if (lowerUrl.includes('drive.google.com')) return "Buka Google Drive";
  if (lowerUrl.includes('docs.google.com')) return "Buka Google Docs";
  if (lowerUrl.includes('sheets.google.com')) return "Buka Google Sheets";
  if (lowerUrl.includes('onedrive.live.com') || lowerUrl.includes('sharepoint.com')) return "Buka OneDrive";
  if (lowerUrl.includes('dropbox.com')) return "Buka Dropbox";
  if (lowerUrl.includes('box.com')) return "Buka Box";
  if (lowerUrl.includes('icloud.com')) return "Buka iCloud";
  
  // Forms & Surveys
  if (lowerUrl.includes('forms.google.com')) return "Buka Form";
  if (lowerUrl.includes('typeform.com')) return "Buka Typeform";
  if (lowerUrl.includes('surveymonkey.com')) return "Buka Survey";
  if (lowerUrl.includes('daftar') || lowerUrl.includes('attendance') || lowerUrl.includes('absen') || lowerUrl.includes('presensi')) return "Buka Daftar Hadir";
  if (lowerUrl.includes('registration') || lowerUrl.includes('signup') || lowerUrl.includes('register')) return "Buka Pendaftaran";
  
  // Calendar & Scheduling
  if (lowerUrl.includes('calendar.google.com')) return "Buka Google Calendar";
  if (lowerUrl.includes('outlook.live.com/calendar')) return "Buka Outlook Calendar";
  if (lowerUrl.includes('calendly.com')) return "Buka Calendly";
  if (lowerUrl.includes('calendar') || lowerUrl.includes('event') || lowerUrl.includes('schedule')) return "Buka Kalender";
  
  // Communication & Social
  if (lowerUrl.includes('whatsapp.com') || lowerUrl.includes('wa.me')) return "Buka WhatsApp";
  if (lowerUrl.includes('telegram.')) return "Buka Telegram";
  if (lowerUrl.includes('discord.')) return "Buka Discord";
  if (lowerUrl.includes('slack.com')) return "Buka Slack";
  
  // Development & Code
  if (lowerUrl.includes('github.com')) return "Buka GitHub";
  if (lowerUrl.includes('gitlab.com')) return "Buka GitLab";
  if (lowerUrl.includes('bitbucket.')) return "Buka Bitbucket";
  
  // Email
  if (lowerUrl.includes('mailto:')) return "Kirim Email";
  if (lowerUrl.includes('gmail.com')) return "Buka Gmail";
  if (lowerUrl.includes('outlook.')) return "Buka Outlook";
  
  // Media & Entertainment
  if (lowerUrl.includes('spotify.com')) return "Buka Spotify";
  if (lowerUrl.includes('soundcloud.com')) return "Buka SoundCloud";
  if (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg') || lowerUrl.includes('.png') || lowerUrl.includes('.gif')) return "Lihat Gambar";
  if (lowerUrl.includes('.mp3') || lowerUrl.includes('.wav')) return "Putar Audio";
  
  // File types
  if (lowerUrl.includes('.pdf')) return "Buka PDF";
  if (lowerUrl.includes('.doc') || lowerUrl.includes('.docx')) return "Buka Dokumen";
  if (lowerUrl.includes('.xlsx') || lowerUrl.includes('.xls')) return "Buka Spreadsheet";
  if (lowerUrl.includes('download') || lowerUrl.includes('.zip') || lowerUrl.includes('.rar')) return "Download File";
  
  // Office & Business
  if (lowerUrl.includes('office.com')) return "Buka Office 365";
  
  // Default fallbacks
  if (lowerUrl.includes('www.') || lowerUrl.startsWith('http')) return "Buka Website";
  
  return "Buka Link";
};

export default FileViewLink;