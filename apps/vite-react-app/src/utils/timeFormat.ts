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
