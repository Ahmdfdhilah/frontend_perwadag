import React, { useState, useEffect } from 'react';
import { userService } from '@/services/users';
import { UserSummary } from '@/services/users/types';
import { X } from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';
import { UserAssignmentCombobox } from './UserAssignmentCombobox';

interface MultiUserAssignmentComboboxProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  inspektorat?: string;
  roles?: string[];
  disabled?: boolean;
}

export const MultiUserAssignmentCombobox: React.FC<MultiUserAssignmentComboboxProps> = ({
  value = [],
  onChange,
  placeholder = "Pilih anggota tim",
  className,
  inspektorat,
  roles = ['INSPEKTORAT', 'PIMPINAN'],
  disabled = false
}) => {
  const [selectedUsers, setSelectedUsers] = useState<UserSummary[]>([]);

  // Fetch user details for selected IDs
  useEffect(() => {
    const fetchSelectedUsers = async () => {
      if (value.length === 0) {
        setSelectedUsers([]);
        return;
      }

      try {
        // Fetch user details for each selected ID
        const userPromises = value.map(async (userId) => {
          const response = await userService.getUsers({
            size: 1,
            search: '', // We'll search by other means if needed
          });
          return response.items?.find(user => user.id === userId);
        });

        const users = await Promise.all(userPromises);
        setSelectedUsers(users.filter(Boolean) as UserSummary[]);
      } catch (error) {
        console.error('Failed to fetch selected users:', error);
      }
    };

    fetchSelectedUsers();
  }, [value]);

  // Remove user from selection
  const handleRemoveUser = (userId: string) => {
    const newValue = value.filter(id => id !== userId);
    onChange(newValue);
  };

  // Add user to selection
  const handleAddUser = (userId: string) => {
    if (!value.includes(userId)) {
      onChange([...value, userId]);
    }
  };

  return (
    <div className={className}>
      {/* Selected Users Display */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedUsers.map((user) => (
            <Badge
              key={user.id}
              variant="secondary"
              className="flex items-center gap-1 pr-1"
            >
              <span className="text-xs">
                {user.nama} - {user.role_display}
              </span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveUser(user.id)}
                  className="h-4 w-4 rounded-full bg-secondary-foreground/20 hover:bg-secondary-foreground/40 flex items-center justify-center"
                >
                  <X className="h-2 w-2" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* User Selection Combobox */}
      <UserAssignmentCombobox
        value="" // Always empty to allow new selections
        onChange={handleAddUser}
        placeholder={selectedUsers.length > 0 ? "Tambah anggota tim lain" : placeholder}
        inspektorat={inspektorat}
        roles={roles}
        disabled={disabled}
      />

      {/* Helper text */}
      {selectedUsers.length === 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          Pilih anggota tim untuk ditugaskan
        </p>
      )}
    </div>
  );
};

export default MultiUserAssignmentCombobox;