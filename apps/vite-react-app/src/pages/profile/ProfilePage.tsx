import React, { useState } from 'react';
import { useToast } from '@workspace/ui/components/sonner';
import { USERS_DATA } from '@/mocks/users';
import { useRole } from '@/hooks/useRole';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@workspace/ui/components/avatar';
import { PageHeader } from '@/components/common/PageHeader';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import { ChangePasswordDialog } from '@/components/profile/ChangePasswordDialog';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  Mail,
  Phone,
  Building,
  Shield,
  User as UserIcon,
  Edit,
  Lock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  // Using dummy data - in real app this would come from auth context
  const user = USERS_DATA[0]; // Using first user as current user
  const { currentRole } = useRole();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  
  // Get current user info - in real app this would come from auth context
  const currentUser = {
    first_name: user.name.split(' ')[0],
    last_name: user.name.split(' ').slice(1).join(' ') || '',
    email: user.email,
    role: currentRole.label,
    phone: user.phone,
    address: user.address,
    avatar: user.avatar,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLogin: user.lastLogin,
    perwadagId: user.perwadagId
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Data pengguna tidak ditemukan</h2>
          <p className="text-muted-foreground">Silakan login kembali.</p>
        </div>
      </div>
    );
  }

  const getFullName = () => {
    return `${currentUser.first_name} ${currentUser.last_name}`.trim();
  };

  const getStatusIcon = () => {
    if (!user.isActive) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (!user.isActive) return 'Tidak Aktif';
    return 'Aktif';
  };

  const getStatusBadgeVariant = () => {
    if (!user.isActive) return 'destructive';
    return 'default';
  };

  const handleEditProfile = () => {
    setIsEditDialogOpen(true);
  };

  const handleChangePassword = () => {
    setIsPasswordDialogOpen(true);
  };

  const handleProfileUpdate = () => {
    toast({
      title: 'Profil berhasil diperbarui',
      description: 'Data profil Anda telah diperbarui.',
      variant: 'default'
    });
    setIsEditDialogOpen(false);
  };

  const handlePasswordChange = () => {
    toast({
      title: 'Password berhasil diubah',
      description: 'Password Anda telah berhasil diubah.',
      variant: 'default'
    });
    setIsPasswordDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profil Saya"
        description="Kelola informasi profil dan keamanan akun Anda"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEditProfile}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profil
            </Button>
            <Button onClick={handleChangePassword}>
              <Lock className="w-4 h-4 mr-2" />
              Ganti Password
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="w-24 h-24">
                {currentUser.avatar ? (
                  <AvatarImage src={currentUser.avatar} alt={getFullName()} />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {currentUser.first_name[0]}{currentUser.last_name ? currentUser.last_name[0] : ''}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <CardTitle className="text-xl">{getFullName()}</CardTitle>
            <div className="flex items-center justify-center gap-2 mt-2">
              {getStatusIcon()}
              <Badge variant={getStatusBadgeVariant()}>
                {getStatusText()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{currentUser.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{currentUser.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{currentUser.role}</span>
              </div>

              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Alamat: {currentUser.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Informasi Detail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                  Informasi Personal
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Nama Lengkap</label>
                    <p className="text-sm text-muted-foreground">{getFullName()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Telepon</label>
                    <p className="text-sm text-muted-foreground">{currentUser.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Jabatan</label>
                    <p className="text-sm text-muted-foreground">{currentUser.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Alamat</label>
                    <p className="text-sm text-muted-foreground">{currentUser.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tanggal Bergabung</label>
                    <p className="text-sm text-muted-foreground">
                      {format(currentUser.createdAt, 'dd MMMM yyyy', { locale: id })}
                    </p>
                  </div>
                </div>
              </div>

              {/* System Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                  Informasi Sistem
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Peran</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {currentUser.role}
                      </Badge>
                    </div>
                  </div>
                  {currentUser.perwadagId && (
                    <div>
                      <label className="text-sm font-medium">Perwadag ID</label>
                      <p className="text-sm text-muted-foreground">{currentUser.perwadagId}</p>
                    </div>
                  )}
                  {currentUser.lastLogin && (
                    <div>
                      <label className="text-sm font-medium">Login Terakhir</label>
                      <p className="text-sm text-muted-foreground">
                        {format(currentUser.lastLogin, 'dd MMMM yyyy, HH:mm', { locale: id })}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium">Password Terakhir Diubah</label>
                    <p className="text-sm text-muted-foreground">
                      {format(currentUser.updatedAt, 'dd MMMM yyyy, HH:mm', { locale: id })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Information */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Informasi Keamanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Verifikasi Email</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Email telah terverifikasi
                </p>
              </div>


              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Password Status</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password aman
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={user}
        onSave={handleProfileUpdate}
      />

      <ChangePasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        onSave={handlePasswordChange}
      />
    </div>
  );
};

export default ProfilePage;