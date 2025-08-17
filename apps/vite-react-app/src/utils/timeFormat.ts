
// Format tanggal ke bahasa Indonesia
export const formatIndonesianDate = (dateString: string): string => {
    try {
        // Check if it's a date-only string (YYYY-MM-DD) or datetime string
        if (dateString.includes('T') || dateString.includes(' ')) {
            // It's a datetime string, use Date constructor
            const date = new Date(dateString);
            
            const months = [
                'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
            ];
            
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            
            return `${day} ${month} ${year}`;
        } else {
            // It's a date-only string, use manual parsing to avoid timezone issues
            const parsed = parseDateSafe(dateString);
            
            const months = [
                'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
            ];
            
            return `${parsed.day} ${months[parsed.month]} ${parsed.year}`;
        }
    } catch {
        return 'Tanggal tidak valid';
    }
};

// Format tanggal (datetime) ke bahasa Indonesia dengan waktu  
// Displays time in the viewer's local timezone with timezone indicator
export const formatDateWithHoursFromAPI = (dateString: string): string => {
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
        
        // Get timezone info
        const timezoneOffset = -utcDate.getTimezoneOffset();
        const offsetHours = Math.floor(timezoneOffset / 60);
        const offsetMinutes = Math.abs(timezoneOffset % 60);
        
        // Format timezone - only show minutes if not zero
        let timezoneStr;
        if (offsetMinutes === 0) {
            // Most common case: +7, -5, +0
            timezoneStr = offsetHours >= 0 ? `+${offsetHours}` : `${offsetHours}`;
        } else {
            // Rare case with minutes: +5:30, +9:30
            timezoneStr = `${offsetHours >= 0 ? '+' : ''}${offsetHours}:${String(offsetMinutes).padStart(2, '0')}`;
        }
        
        return `${day} ${month} ${year}, ${hours}:${minutes} (GMT${timezoneStr})`;
    } catch {
        return 'Tanggal tidak valid';
    }
};


// Parse date string safely without timezone issues
const parseDateSafe = (dateString: string): { day: number; month: number; year: number } => {
    // Manually parse YYYY-MM-DD format to avoid timezone issues
    const parts = dateString.split('-');
    if (parts.length !== 3) {
        throw new Error('Invalid date format');
    }
    
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-based
    const day = parseInt(parts[2], 10);
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error('Invalid date values');
    }
    
    return { day, month, year };
};

// Format range tanggal ke bahasa Indonesia
export const formatIndonesianDateRange = (startDate: string, endDate: string): string => {
    try {
        // Parse dates manually to avoid timezone issues completely
        const start = parseDateSafe(startDate);
        const end = parseDateSafe(endDate);
        
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        
        const startDay = start.day;
        const startMonth = months[start.month];
        const startYear = start.year;
        
        const endDay = end.day;
        const endMonth = months[end.month];
        const endYear = end.year;
        
        // Same month and year
        if (start.month === end.month && start.year === end.year) {
            return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
        }
        
        // Same year, different months
        if (start.year === end.year) {
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

