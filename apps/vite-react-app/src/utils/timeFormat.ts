import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

export const formatRelativeTime = (dateString: string) => {
    try {
        const inputDate = new Date(dateString);

        // Offset untuk WIB (UTC+7) dalam milidetik
        const indonesiaOffset = 7 * 60 * 60 * 1000;

        // Konversi input date ke waktu Indonesia
        const indonesiaInputDate = new Date(inputDate.getTime() + indonesiaOffset);

        return formatDistanceToNow(indonesiaInputDate, {
            addSuffix: true,
            locale: enUS
        });
    } catch {
        return 'Unknown time';
    }
};

// Alternatif jika tidak menggunakan date-fns-tz
export const formatRelativeTimeSimple = (dateString: string) => {
    try {
        const inputDate = new Date(dateString);

        // Offset untuk WIB (UTC+7) dalam milidetik
        const indonesiaOffset = 7 * 60 * 60 * 1000;

        // Konversi input date ke waktu Indonesia
        const indonesiaInputDate = new Date(inputDate.getTime() + indonesiaOffset);

        return formatDistanceToNow(indonesiaInputDate, {
            addSuffix: true,
            locale: enUS
        });
    } catch {
        return 'Waktu tidak diketahui';
    }
};

// Format tanggal ke bahasa Indonesia
export const formatIndonesianDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${day} ${month} ${year}`;
    } catch {
        return 'Tanggal tidak valid';
    }
};

// Format tanggal meeting (datetime) ke bahasa Indonesia dengan waktu  
// Displays time in the viewer's local timezone
export const formatMeetingDate = (dateString: string): string => {
    try {
        const utcDate = new Date(dateString);
        
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        
        // Convert to viewer's local timezone
        const day = utcDate.getDate();
        const month = months[utcDate.getMonth()];
        const year = utcDate.getFullYear();
        const hours = String(utcDate.getHours()).padStart(2, '0');
        const minutes = String(utcDate.getMinutes()).padStart(2, '0');
        
        return `${day} ${month} ${year}, ${hours}:${minutes}`;
    } catch {
        return 'Tanggal tidak valid';
    }
};

// Format tanggal meeting showing the original time (UTC time as saved)
// Use this if you want to show the exact time that was saved, regardless of viewer's timezone
export const formatMeetingDateOriginal = (dateString: string): string => {
    try {
        const utcDate = new Date(dateString);
        
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        
        // Show UTC time as-is (the original saved time)
        const day = utcDate.getUTCDate();
        const month = months[utcDate.getUTCMonth()];
        const year = utcDate.getUTCFullYear();
        const hours = String(utcDate.getUTCHours()).padStart(2, '0');
        const minutes = String(utcDate.getUTCMinutes()).padStart(2, '0');
        
        return `${day} ${month} ${year}, ${hours}:${minutes}`;
    } catch {
        return 'Tanggal tidak valid';
    }
};

// Format range tanggal ke bahasa Indonesia
export const formatIndonesianDateRange = (startDate: string, endDate: string): string => {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        
        const startDay = start.getDate();
        const startMonth = months[start.getMonth()];
        const startYear = start.getFullYear();
        
        const endDay = end.getDate();
        const endMonth = months[end.getMonth()];
        const endYear = end.getFullYear();
        
        // Same month and year
        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
            return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
        }
        
        // Same year, different months
        if (start.getFullYear() === end.getFullYear()) {
            return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
        }
        
        // Different years
        return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
    } catch {
        return 'Rentang tanggal tidak valid';
    }
};

// Format date for API requests without timezone issues
export const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Format datetime for meeting API requests (with time component)
export const formatDateTimeForAPI = (date: Date): string => {
    // Send local datetime with timezone offset to backend
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    // Get timezone offset in minutes and convert to +HH:MM format
    const timezoneOffset = -date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const offsetMinutes = Math.abs(timezoneOffset) % 60;
    const offsetSign = timezoneOffset >= 0 ? '+' : '-';
    const offsetString = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetString}`;
};

// Convert UTC datetime from backend to user's local Date object for DateTimePicker
export const parseUTCDateTimeToLocal = (utcDateString: string | undefined): Date | undefined => {
    try {
        if (!utcDateString) return undefined;
        
        // Parse UTC datetime from backend - JavaScript Date constructor automatically converts to local timezone
        const localDate = new Date(utcDateString);
        
        // Check if date is valid
        if (isNaN(localDate.getTime())) {
            return undefined;
        }
        
        return localDate;
    } catch (error) {
        console.error('Error parsing UTC datetime to local:', error);
        return undefined;
    }
};

// Convert UTC date to Indonesian time (WIB/UTC+7) and format
export const formatIndonesianDateTime = (dateString: string): string => {
    try {
        // Parse the date string - handle both with and without 'Z' suffix
        let utcDate: Date;
        if (dateString.endsWith('Z')) {
            utcDate = new Date(dateString);
        } else {
            // If no timezone info, assume it's UTC
            utcDate = new Date(dateString + 'Z');
        }
        
        // Check if date is valid
        if (isNaN(utcDate.getTime())) {
            return 'Waktu tidak valid';
        }
        
        // Convert to Indonesian timezone using toLocaleString
        const indonesiaTime = utcDate.toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        
        // Format: "27/07/2025, 11:31" -> "27/07/2025 11:31"
        return indonesiaTime.replace(',', '');
        
    } catch (error) {
        console.error('Error formatting Indonesian datetime:', error);
        return 'Waktu tidak valid';
    }
};

// Alternative manual conversion for debugging
export const formatIndonesianDateTimeManual = (dateString: string): string => {
    try {
        let utcDate: Date;
        if (dateString.endsWith('Z')) {
            utcDate = new Date(dateString);
        } else {
            utcDate = new Date(dateString + 'Z');
        }
        
        // Manual offset calculation (UTC+7)
        const indonesiaOffset = 7 * 60 * 60 * 1000;
        const indonesiaDate = new Date(utcDate.getTime() + indonesiaOffset);
        
        const day = String(indonesiaDate.getUTCDate()).padStart(2, '0');
        const month = String(indonesiaDate.getUTCMonth() + 1).padStart(2, '0');
        const year = indonesiaDate.getUTCFullYear();
        const hours = String(indonesiaDate.getUTCHours()).padStart(2, '0');
        const minutes = String(indonesiaDate.getUTCMinutes()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
        return 'Waktu tidak valid';
    }
};
