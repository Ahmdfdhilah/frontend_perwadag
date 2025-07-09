import React, { useState } from 'react';
import { useToast } from '@workspace/ui/components/sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { User } from '@/mocks/users';
import { ROLES } from '@/mocks/roles';
import { UserForm } from './UserForm';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: User | null;
  onSave: (userData: any) => void;
}

export const UserDialog: React.FC<UserDialogProps> = ({
  open,
  onOpenChange,
  editingUser,
  onSave
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);

    try {
      // Transform roles from string IDs to Role objects
      const transformedData = {
        ...data,
        roles: data.roles.map((roleId: string) =>
          ROLES.find(role => role.id === roleId)!
        ),
        id: editingUser?.id || `USR${Date.now()}`,
        createdAt: editingUser?.createdAt || new Date(),
        updatedAt: new Date(),
        lastLogin: editingUser?.lastLogin || undefined
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onSave(transformedData);
      onOpenChange(false);

    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: 'Terjadi kesalahan',
        description: 'Gagal menyimpan data user. Silakan coba lagi.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingUser ? 'Edit User' : 'Create New User'}
          </DialogTitle>
        </DialogHeader>

        <UserForm
          initialData={editingUser || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};