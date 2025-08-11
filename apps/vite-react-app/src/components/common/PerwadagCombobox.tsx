import React, { useState, useEffect } from 'react';
import { useRole } from '@/hooks/useRole';
import { Combobox } from '@workspace/ui/components/combobox';
import { userService } from '@/services/users';
import { PerwadagSummary, PerwadagSearchParams } from '@/services/users/types';

interface PerwadagComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  className?: string;
  inspektoratFilter?: string; // New prop to filter by inspektorat
}

export const PerwadagCombobox: React.FC<PerwadagComboboxProps> = ({
  value,
  onChange,
  placeholder = "Pilih perwadag",
  includeAllOption = true,
  allOptionLabel = "Semua Perwadag",
  className,
  inspektoratFilter
}) => {
  const { isInspektorat, isPimpinan, user } = useRole();
  const [availablePerwadag, setAvailablePerwadag] = useState<PerwadagSummary[]>([]);
  const [perwadagSearchValue, setPerwadagSearchValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch available perwadag
  const fetchAvailablePerwadag = async () => {
    setLoading(true);
    try {
      const params: PerwadagSearchParams = {
        size: 100
      };

      // Apply inspektorat filter priority:
      // 1. If inspektoratFilter prop is provided and not 'all', use it
      // 2. If current user is inspektorat, filter by their inspektorat
      if (inspektoratFilter && inspektoratFilter !== 'all') {
        params.inspektorat = inspektoratFilter;
      } else if ((isInspektorat() || isPimpinan()) && user?.inspektorat) {
        params.inspektorat = user.inspektorat;
      }

      const response = await userService.getPerwadagList(params);
      setAvailablePerwadag(response.items || []);
    } catch (error) {
      console.error('Failed to fetch perwadag list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailablePerwadag();
  }, [inspektoratFilter]); // Re-fetch when inspektoratFilter changes

  // Prepare options
  const options = [
    ...(includeAllOption ? [{ value: 'all', label: allOptionLabel }] : []),
    ...availablePerwadag
      .filter(perwadag =>
        perwadagSearchValue === '' ||
        perwadag.nama.toLowerCase().includes(perwadagSearchValue.toLowerCase()) ||
        perwadag.inspektorat?.toLowerCase().includes(perwadagSearchValue.toLowerCase())
      )
      .map(perwadag => ({
        value: perwadag.id,
        label: perwadag.nama,
        description: perwadag.inspektorat || ''
      }))
  ];

  return (
    <Combobox
      options={options}
      value={value}
      onChange={(selectedValue) => onChange(selectedValue.toString())}
      placeholder={placeholder}
      searchPlaceholder="Cari perwadag..."
      searchValue={perwadagSearchValue}
      onSearchChange={setPerwadagSearchValue}
      emptyMessage="Tidak ada perwadag yang ditemukan"
      isLoading={loading}
      className={className}
    />
  );
};