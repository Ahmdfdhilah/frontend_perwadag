import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User } from '@/mocks/users';
import { ROLES, Role } from '@/mocks/roles';
import { PERWADAG_DATA } from '@/mocks/perwadag';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Switch } from '@workspace/ui/components/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Avatar, AvatarImage, AvatarFallback } from '@workspace/ui/components/avatar';
import { Upload, X } from 'lucide-react';

const userSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  nip: z.string().min(1, 'NIP is required').regex(/^\d{18}$/, 'NIP must be 18 digits'),
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(1, 'Phone is required').regex(/^\+?\d{10,15}$/, 'Please enter a valid phone number'),
  address: z.string().min(1, 'Address is required'),
  avatar: z.string().optional(),
  roles: z.array(z.string()).min(1, 'At least one role must be selected'),
  perwadagId: z.string().optional(),
  isActive: z.boolean().default(true),
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
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    initialData?.roles?.map(role => role.id) || []
  );
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(initialData?.avatar);
  const [showPerwadagSelect, setShowPerwadagSelect] = useState(
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
      avatar: initialData?.avatar || '',
      roles: initialData?.roles?.map(role => role.id) || [],
      perwadagId: initialData?.perwadagId || '',
      isActive: initialData?.isActive ?? true,
    }
  });

  useEffect(() => {
    const roles = form.watch('roles');
    const hasPerwadagRole = roles?.some(roleId => 
      ROLES.find(role => role.id === roleId)?.name === 'perwadag'
    );
    setShowPerwadagSelect(hasPerwadagRole);
    
    if (!hasPerwadagRole) {
      form.setValue('perwadagId', '');
    }
  }, [form.watch('roles')]);

  const handleRoleChange = (roleId: string, checked: boolean) => {
    let newRoles: string[];
    if (checked) {
      newRoles = [...selectedRoles, roleId];
    } else {
      newRoles = selectedRoles.filter(id => id !== roleId);
    }
    setSelectedRoles(newRoles);
    form.setValue('roles', newRoles);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        form.setValue('avatar', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(undefined);
    form.setValue('avatar', '');
  };

  const handleSubmit = (data: UserFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="w-20 h-20">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt="User avatar" />
              ) : (
                <AvatarFallback className="text-lg">
                  {form.watch('name')?.charAt(0)?.toUpperCase() || '?'}
                </AvatarFallback>
              )}
            </Avatar>
            {avatarPreview && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={removeAvatar}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div>
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50">
                <Upload className="h-4 w-4" />
                <span>Upload Avatar</span>
              </div>
            </Label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={loading}
            />
          </div>
        </div>

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

        {/* Roles */}
        <div className="space-y-3">
          <Label>Roles</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ROLES.map((role) => (
              <div key={role.id} className="flex items-center space-x-2">
                <Checkbox
                  id={role.id}
                  checked={selectedRoles.includes(role.id)}
                  onCheckedChange={(checked) => handleRoleChange(role.id, checked as boolean)}
                  disabled={loading}
                />
                <Label htmlFor={role.id} className="text-sm font-normal">
                  {role.label}
                </Label>
              </div>
            ))}
          </div>
          {form.formState.errors.roles && (
            <p className="text-sm text-red-500">{form.formState.errors.roles.message}</p>
          )}
        </div>

        {/* Perwadag Selection */}
        {showPerwadagSelect && (
          <FormField
            control={form.control}
            name="perwadagId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perwadag Assignment</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select perwadag office" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PERWADAG_DATA.map((perwadag) => (
                      <SelectItem key={perwadag.id} value={perwadag.id}>
                        {perwadag.name}
                      </SelectItem>
                    ))}
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