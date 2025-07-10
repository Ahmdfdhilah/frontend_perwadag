import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User } from '@/mocks/users';
import { ROLES } from '@/mocks/roles';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Switch } from '@workspace/ui/components/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';

const userSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  nip: z.string().min(1, 'NIP is required').regex(/^\d{18}$/, 'NIP must be 18 digits'),
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(1, 'Phone is required').regex(/^\+?\d{10,15}$/, 'Please enter a valid phone number'),
  address: z.string().min(1, 'Address is required'),
  roles: z.string().min(1, 'Please select a role'),
  perwadagId: z.string().optional(),
  inspektoratLevel: z.string().optional(),
  isActive: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  initialData?: Partial<User>;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [showPerwadagSelect, setShowPerwadagSelect] = useState(
    initialData?.roles?.some(role => role.name === 'perwadag') || false
  );
  const [showInspektoratSelect, setShowInspektoratSelect] = useState(
    initialData?.roles?.some(role => role.name === 'perwadag') || false
  );

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: initialData?.email || '',
      nip: initialData?.nip || '',
      name: initialData?.name || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      roles: initialData?.roles?.[0]?.id || '',
      perwadagId: initialData?.perwadagId || '',
      inspektoratLevel: initialData?.inspektoratLevel || '',
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    }
  });

  useEffect(() => {
    const roleId = form.watch('roles');
    const selectedRole = ROLES.find(role => role.id === roleId);
    const hasPerwadagRole = selectedRole?.name === 'perwadag';
    
    setShowPerwadagSelect(hasPerwadagRole);
    setShowInspektoratSelect(hasPerwadagRole);
    
    if (!hasPerwadagRole) {
      form.setValue('perwadagId', '');
      form.setValue('inspektoratLevel', '');
    }
  }, [form.watch('roles')]);


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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name" disabled={loading} {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email address" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIP</FormLabel>
                <FormControl>
                  <Input placeholder="Enter 18-digit NIP" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter address" disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role Selection */}
        <FormField
          control={form.control}
          name="roles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Perwadag Assignment */}
        {showPerwadagSelect && (
          <FormField
            control={form.control}
            name="perwadagId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Perwadag</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter perwadag name" 
                    disabled={loading} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Inspektorat Level Selection */}
        {showInspektoratSelect && (
          <FormField
            control={form.control}
            name="inspektoratLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inspektorat</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select inspektorat" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Inspektorat 1</SelectItem>
                    <SelectItem value="2">Inspektorat 2</SelectItem>
                    <SelectItem value="3">Inspektorat 3</SelectItem>
                    <SelectItem value="4">Inspektorat 4</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Active Status */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Enable or disable user access to the system
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={loading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </Form>
  );
};