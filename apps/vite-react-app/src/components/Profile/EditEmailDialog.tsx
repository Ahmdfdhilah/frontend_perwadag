import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, UserUpdate } from '@/services/users/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';

const editEmailSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Format email tidak valid'),
});

type EditEmailData = z.infer<typeof editEmailSchema>;

interface EditEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onSave: (data: UserUpdate) => void;
  loading?: boolean;
}

export const EditEmailDialog: React.FC<EditEmailDialogProps> = ({
  open,
  onOpenChange,
  user,
  onSave,
  loading = false
}) => {
  const form = useForm<EditEmailData>({
    resolver: zodResolver(editEmailSchema),
    defaultValues: {
      email: user.email || '',
    },
  });

  useEffect(() => {
    if (open && user) {
      form.reset({
        email: user.email || '',
      });
    }
  }, [open, user, form]);

  const onSubmit = (data: EditEmailData) => {
    const updateData: UserUpdate = {
      email: data.email !== undefined ? data.email : undefined,
    };
    onSave(updateData);
  };

  const getInitials = () => {
    const nameParts = user.nama.split(' ');
    if (nameParts.length >= 2) {
      return nameParts[0][0] + nameParts[1][0];
    }
    return nameParts[0][0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>Edit Email</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Avatar */}
              <div className="flex justify-center mb-6">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="text-2xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Masukkan email"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Read-only fields */}
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <div className="p-3 bg-muted rounded-md text-sm">
                    {user.nama}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Jabatan</Label>
                  <div className="p-3 bg-muted rounded-md text-sm">
                    {user.jabatan}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Username</Label>
                  <div className="p-3 bg-muted rounded-md text-sm">
                    {user.username}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="p-3 bg-muted rounded-md text-sm">
                    {user.role_display}
                  </div>
                </div>

                {user.inspektorat && (
                  <div className="space-y-2">
                    <Label>Inspektorat</Label>
                    <div className="p-3 bg-muted rounded-md text-sm">
                      {user.inspektorat}
                    </div>
                  </div>
                )}

              </div>
            </form>
          </Form>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};