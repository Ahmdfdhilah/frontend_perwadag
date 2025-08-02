import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Badge } from '@workspace/ui/components/badge';
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import { User } from '@/services/users/types';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import { USER_ROLES, ROLE_LABELS, INSPEKTORAT_OPTIONS } from '@/lib/constants';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  Mail, 
  Calendar, 
  CreditCard,
  Building,
  Shield,
  User as UserIcon
} from 'lucide-react';

const createUserSchema = z.object({
  nama: z.string().min(1, 'Nama is required').min(2, 'Nama must be at least 2 characters').max(200),
  jabatan: z.string().min(1, 'Jabatan is required').max(200),
  email: z.string().optional().refine((val) => !val || val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: 'Please enter a valid email address',
  }),
  is_active: z.boolean().optional(),
  role: z.enum([USER_ROLES.ADMIN, USER_ROLES.INSPEKTORAT, USER_ROLES.PERWADAG], {
    required_error: 'Please select a role',
  }),
  inspektorat: z.string().optional(),
}).refine((data) => {
  if (data.role === USER_ROLES.INSPEKTORAT || data.role === USER_ROLES.PERWADAG) {
    return data.inspektorat && data.inspektorat.trim().length > 0;
  }
  return true;
}, {
  message: 'Inspektorat is required for this role',
  path: ['inspektorat'],
});

const editUserSchema = z.object({
  nama: z.string().min(1, 'Nama is required').min(2, 'Nama must be at least 2 characters').max(200),
  jabatan: z.string().min(1, 'Jabatan is required').max(200),
  email: z.string().optional().refine((val) => !val || val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: 'Please enter a valid email address',
  }),
  is_active: z.boolean().optional(),
  role: z.enum([USER_ROLES.ADMIN, USER_ROLES.INSPEKTORAT, USER_ROLES.PERWADAG], {
    required_error: 'Please select a role',
  }),
  inspektorat: z.string().optional(),
}).refine((data) => {
  if (data.role === USER_ROLES.INSPEKTORAT || data.role === USER_ROLES.PERWADAG) {
    return data.inspektorat && data.inspektorat.trim().length > 0;
  }
  return true;
}, {
  message: 'Inspektorat is required for this role',
  path: ['inspektorat'],
});

type UserFormData = z.infer<typeof createUserSchema> | z.infer<typeof editUserSchema>;

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  mode: 'view' | 'edit' | 'create';
  onSave?: (userData: any) => void;
}

const UserDialog: React.FC<UserDialogProps> = ({
  open,
  onOpenChange,
  user,
  mode,
  onSave
}) => {
  const { canEditForm } = useFormPermissions();
  const isEditable = mode !== 'view';
  const canEdit = canEditForm('user_management') && isEditable;
  const [loading, setLoading] = useState(false);
  const [showInspektoratSelect, setShowInspektoratSelect] = useState(
    user?.role === USER_ROLES.INSPEKTORAT || user?.role === USER_ROLES.PERWADAG || false
  );

  const isEditMode = mode === 'edit' && user;
  const schema = isEditMode ? editUserSchema : createUserSchema;
  
  const form = useForm<UserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nama: user?.nama || '',
      jabatan: user?.jabatan || '',
      email: user?.email || '',
      is_active: user?.is_active ?? true,
      role: user?.role || USER_ROLES.PERWADAG,
      inspektorat: user?.inspektorat || '',
    }
  });

  useEffect(() => {
    if (user && open) {
      form.reset({
        nama: user.nama || '',
        jabatan: user.jabatan || '',
        email: user.email || '',
        is_active: user.is_active ?? true,
        role: user.role || USER_ROLES.PERWADAG,
        inspektorat: user.inspektorat || '',
      });
    } else if (!user && open && mode === 'create') {
      form.reset({
        nama: '',
        jabatan: '',
        email: '',
        is_active: true,
        role: USER_ROLES.PERWADAG,
        inspektorat: '',
      });
    }
  }, [user, open, mode, form]);

  useEffect(() => {
    const role = form.watch('role');
    setShowInspektoratSelect(role === USER_ROLES.INSPEKTORAT || role === USER_ROLES.PERWADAG);
    if (role === USER_ROLES.ADMIN) {
      form.setValue('inspektorat', '');
    }
  }, [form.watch('role')]);

  const handleSubmit = async (data: UserFormData) => {
    if (!onSave) return;
    
    setLoading(true);
    try {
      const transformedData = {
        nama: data.nama,
        jabatan: data.jabatan,
        email: data.email && data.email.trim() !== '' ? data.email : null,
        is_active: data.is_active,
        role: data.role,
        inspektorat: data.inspektorat && data.inspektorat.trim() !== '' ? data.inspektorat : undefined,
      };
      onSave(transformedData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'destructive'}>
        {isActive ? 'Aktif' : 'Tidak Aktif'}
      </Badge>
    );
  };

  const getRoleBadge = (role: User['role']) => {
    return (
      <Badge variant="secondary">
        {ROLE_LABELS[role] || role}
      </Badge>
    );
  };

  const { formState: { isValid } } = form;
  const isFormValid = isValid && !loading && canEdit;

  const getDialogTitle = () => {
    switch (mode) {
      case 'view': return 'Detail User';
      case 'edit': return 'Edit User';
      case 'create': return 'Create New User';
      default: return 'User';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle className="text-lg sm:text-xl">
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {mode === 'view' && user ? (
            // View Mode - Display user information
            <div className="space-y-4 sm:space-y-6">
              {/* User Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                  <AvatarFallback className="text-sm sm:text-lg">
                    {user.nama.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-semibold break-words">{user.nama}</h2>
                  <div className="flex justify-center sm:justify-start items-center gap-2 mt-2">
                    {getStatusBadge(user.is_active)}
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {/* Basic Info */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                    <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    Informasi Dasar
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium">ID</p>
                        <p className="text-xs sm:text-sm text-muted-foreground break-all">{user.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <UserIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium">Username</p>
                        <p className="text-xs sm:text-sm text-muted-foreground break-all">@{user.username}</p>
                      </div>
                    </div>

                    {user.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium">Email</p>
                          <p className="text-xs sm:text-sm text-muted-foreground break-all">{user.email}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <Building className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium">Jabatan</p>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">{user.jabatan}</p>
                      </div>
                    </div>

                    {user.inspektorat && (
                      <div className="flex items-center space-x-3">
                        <Building className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium">Inspektorat</p>
                          <p className="text-xs sm:text-sm text-muted-foreground break-words">{user.inspektorat}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* System Info */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                    Informasi Sistem
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs sm:text-sm font-medium mb-1">Peran</p>
                      {getRoleBadge(user.role)}
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium">Dibuat</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {format(new Date(user.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium">Diperbarui</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {user.updated_at ? format(new Date(user.updated_at), 'dd MMM yyyy, HH:mm', { locale: id }) : '-'}
                        </p>
                      </div>
                    </div>

                    {user.last_login && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium">Login Terakhir</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {format(new Date(user.last_login), 'dd MMM yyyy, HH:mm', { locale: id })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Edit/Create Mode - Form
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap *</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan nama lengkap" disabled={loading || !canEdit} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jabatan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jabatan *</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan jabatan" disabled={loading || !canEdit} {...field} />
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
                          <Input type="email" placeholder="Masukkan alamat email" disabled={loading || !canEdit} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Role and Status */}
                <div className="grid grid-cols-1 gap-4">
                  {mode !== 'edit' && (
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading || !canEdit}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={USER_ROLES.ADMIN}>{ROLE_LABELS[USER_ROLES.ADMIN]}</SelectItem>
                              <SelectItem value={USER_ROLES.INSPEKTORAT}>{ROLE_LABELS[USER_ROLES.INSPEKTORAT]}</SelectItem>
                              <SelectItem value={USER_ROLES.PERWADAG}>{ROLE_LABELS[USER_ROLES.PERWADAG]}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Inspektorat Selection */}
                {showInspektoratSelect && (
                  <FormField
                    control={form.control}
                    name="inspektorat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inspektorat *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading || !canEdit}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih inspektorat" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {INSPEKTORAT_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading || !canEdit}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Status Aktif
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            {mode === 'view' ? 'Tutup' : 'Batal'}
          </Button>
          {mode !== 'view' && canEdit && (
            <Button onClick={form.handleSubmit(handleSubmit)} disabled={!isFormValid}>
              {loading ? 'Menyimpan...' : user ? 'Update User' : 'Buat User'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;