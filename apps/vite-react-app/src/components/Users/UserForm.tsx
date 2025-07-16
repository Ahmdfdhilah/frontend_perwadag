import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User } from '@/services/users/types';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';

const userSchema = z.object({
  nama: z.string().min(1, 'Nama is required').min(2, 'Nama must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  role: z.enum(['ADMIN', 'INSPEKTORAT', 'PERWADAG'], {
    required_error: 'Please select a role',
  }),
  inspektorat: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  initialData?: Partial<User>;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  disabled?: boolean;
  mode?: 'view' | 'edit' | 'create';
}

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  disabled = false,
}) => {
  const [showInspektoratSelect, setShowInspektoratSelect] = useState(
    initialData?.role === 'INSPEKTORAT' || false
  );

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nama: initialData?.nama || '',
      email: initialData?.email || '',
      role: initialData?.role || 'PERWADAG',
      inspektorat: initialData?.inspektorat || '',
    }
  });

  useEffect(() => {
    const role = form.watch('role');
    
    setShowInspektoratSelect(role === 'INSPEKTORAT');
    
    if (role !== 'INSPEKTORAT') {
      form.setValue('inspektorat', '');
    }
  }, [form.watch('role')]);


  const handleSubmit = (data: UserFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama lengkap" disabled={loading || disabled} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Opsional)</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Masukkan alamat email" disabled={loading || disabled} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>


        {/* Role Selection */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading || disabled}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="INSPEKTORAT">Inspektorat</SelectItem>
                  <SelectItem value="PERWADAG">Perwadag</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* Inspektorat Selection */}
        {showInspektoratSelect && (
          <FormField
            control={form.control}
            name="inspektorat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inspektorat</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Masukkan nama inspektorat" 
                    disabled={loading || disabled} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading || disabled}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || disabled}>
            {loading ? 'Menyimpan...' : initialData ? 'Update User' : 'Buat User'}
          </Button>
        </div>
      </form>
    </Form>
  );
};