import { useState, useEffect, useMemo } from 'react';
import { PeriodeEvaluasi } from '../services/periodeEvaluasi/types';
import { periodeEvaluasiService } from '../services/periodeEvaluasi/service';
import { 
  getYearsFromPeriodeEvaluasi, 
  getCurrentYear, 
  getYearRange 
} from '../utils/yearUtils';

interface UseYearOptionsReturn {
  yearOptions: { value: string; label: string }[];
  periodeEvaluasi: PeriodeEvaluasi[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useYearOptions = (): UseYearOptionsReturn => {
  const [periodeEvaluasi, setPeriodeEvaluasi] = useState<PeriodeEvaluasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await periodeEvaluasiService.getPeriodeEvaluasi({ 
        size: 100, 
        include_statistics: true 
      });
      
      setPeriodeEvaluasi(response.items);
    } catch (err) {
      console.error('Failed to fetch periode evaluasi for year options:', err);
      setError('Failed to fetch year options');
      
      // Set empty array to trigger fallback in yearOptions memoization
      setPeriodeEvaluasi([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data only once on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Memoize year options to prevent recalculation on every render
  const yearOptions = useMemo(() => {
    if (periodeEvaluasi.length > 0) {
      const years = getYearsFromPeriodeEvaluasi(periodeEvaluasi);
      return [
        { value: 'all', label: 'Semua Tahun' },
        ...years.map(year => ({
          value: year.toString(),
          label: year.toString()
        }))
      ];
    }
    
    // Fallback when no periode evaluasi data or error
    const currentYear = getCurrentYear();
    const years = getYearRange(currentYear - 2, currentYear);
    
    return [
      { value: 'all', label: 'Semua Tahun' },
      ...years.map(year => ({
        value: year.toString(),
        label: year.toString()
      }))
    ];
  }, [periodeEvaluasi]);

  return {
    yearOptions,
    periodeEvaluasi,
    loading,
    error,
    refetch: fetchData
  };
};