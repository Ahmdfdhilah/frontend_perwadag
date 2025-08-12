import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Combobox } from '@workspace/ui/components/combobox';
import { userService } from '@/services/users';
import { UserSummary, UserFilterParams } from '@/services/users/types';

interface UserAssignmentComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  className?: string;
  inspektorat?: string; // Inspektorat to filter users
  roles?: string[]; // Roles to include (default: INSPEKTORAT,PIMPINAN)
  disabled?: boolean;
  excludeIds?: string[]; // User IDs to exclude from selection
}

export const UserAssignmentCombobox: React.FC<UserAssignmentComboboxProps> = ({
  value,
  onChange,
  placeholder = "Pilih user",
  includeAllOption = false,
  allOptionLabel = "Semua User",
  className,
  inspektorat,
  roles = ['INSPEKTORAT', 'PIMPINAN'],
  disabled = false,
  excludeIds = []
}) => {
  // Removed unused user destructuring
  const [availableUsers, setAvailableUsers] = useState<UserSummary[]>([]);
  const [userSearchValue, setUserSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const allUsersRef = useRef<UserSummary[]>([]); // Store all users for local filtering
  const [allUsers, setAllUsers] = useState<UserSummary[]>([]);
  
  // Debounced search value
  const debouncedSearchValue = useDebounce(userSearchValue, 500);

  // Memoize dependency strings to prevent infinite re-renders
  const rolesString = useMemo(() => roles.join(','), [roles]);
  const excludeIdsString = useMemo(() => excludeIds.join(','), [excludeIds]);

  // Fetch users when inspektorat or roles change (initial load)
  useEffect(() => {
    const fetchInitialUsers = async () => {
      if (!inspektorat) {
        setAllUsers([]);
        setAvailableUsers([]);
        return;
      }

      setLoading(true);
      try {
        const filterParams: UserFilterParams = {
          inspektorat: inspektorat,
          is_active: true,
          size: 50
        };

        // Filter by specific role if only one role is specified
        if (roles.length === 1) {
          filterParams.role = roles[0] as "ADMIN" | "INSPEKTORAT" | "PIMPINAN" | "PERWADAG";
        }

        const response = await userService.getUsers(filterParams);
        
        // If multiple roles specified, filter client-side
        let filteredUsers = response.items || [];
        if (roles.length > 1) {
          filteredUsers = filteredUsers.filter(user => 
            roles.includes(user.role)
          );
        }

        // Exclude users that are already selected
        filteredUsers = filteredUsers.filter(user => 
          !excludeIds.includes(user.id)
        );
        
        allUsersRef.current = filteredUsers;
        setAllUsers(filteredUsers);
        setAvailableUsers(filteredUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setAllUsers([]);
        setAvailableUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialUsers();
  }, [inspektorat, rolesString, excludeIdsString]);

  // Handle debounced search value changes
  useEffect(() => {
    const fetchSearchResults = async (searchTerm: string) => {
      if (!inspektorat) return;

      setLoading(true);
      try {
        const filterParams: UserFilterParams = {
          inspektorat: inspektorat,
          is_active: true,
          search: searchTerm.trim(),
          size: 50
        };

        // Filter by specific role if only one role is specified
        if (roles.length === 1) {
          filterParams.role = roles[0] as "ADMIN" | "INSPEKTORAT" | "PIMPINAN" | "PERWADAG";
        }

        const response = await userService.getUsers(filterParams);
        
        // If multiple roles specified, filter client-side
        let filteredUsers = response.items || [];
        if (roles.length > 1) {
          filteredUsers = filteredUsers.filter(user => 
            roles.includes(user.role)
          );
        }

        // Exclude users that are already selected
        filteredUsers = filteredUsers.filter(user => 
          !excludeIds.includes(user.id)
        );
        
        setAvailableUsers(filteredUsers);
      } catch (error) {
        console.error('Failed to search users:', error);
        // Fallback to local filtering if API search fails
        const localFiltered = allUsersRef.current.filter(user =>
          (user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.jabatan.toLowerCase().includes(searchTerm.toLowerCase())) &&
          !excludeIds.includes(user.id)
        );
        setAvailableUsers(localFiltered);
      } finally {
        setLoading(false);
      }
    };

    if (debouncedSearchValue.trim()) {
      fetchSearchResults(debouncedSearchValue);
    } else {
      // If search is cleared, show all cached users (excluding already selected)
      const filteredUsers = allUsersRef.current.filter(user => 
        !excludeIds.includes(user.id)
      );
      setAvailableUsers(filteredUsers);
    }
  }, [debouncedSearchValue, inspektorat, rolesString, excludeIdsString]);

  // Auto-fill pimpinan if this is for pimpinan role and only one pimpinan exists
  useEffect(() => {
    if (roles.length === 1 && roles[0] === 'PIMPINAN' && 
        allUsers.length === 1 && 
        (!value || value === '') && 
        !userSearchValue) { // Only auto-fill when not searching
      // Auto-select the only pimpinan available
      onChange(allUsers[0].id);
    }
  }, [allUsers, value, rolesString, onChange, userSearchValue]);

  // Prepare options (no client-side filtering since we do it in API/debounced search)
  const options = [
    ...(includeAllOption ? [{ value: 'all', label: allOptionLabel }] : []),
    ...availableUsers.map(user => ({
      value: user.id,
      label: user.nama,
      description: user.inspektorat
    }))
  ];

  return (
    <Combobox
      options={options}
      value={value || ''}
      onChange={(selectedValue) => onChange(selectedValue.toString())}
      placeholder={placeholder}
      searchPlaceholder="Cari user..."
      searchValue={userSearchValue}
      onSearchChange={setUserSearchValue}
      emptyMessage={!inspektorat ? "Pilih inspektorat terlebih dahulu" : userSearchValue ? "Tidak ada user yang cocok dengan pencarian" : "Tidak ada user yang ditemukan"}
      isLoading={loading}
      className={className}
      disabled={disabled || !inspektorat}
    />
  );
};

export default UserAssignmentCombobox;