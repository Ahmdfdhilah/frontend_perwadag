import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Calendar } from '@workspace/ui/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { CalendarIcon, ArrowLeft, Save, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@workspace/ui/lib/utils';
import { Kuesioner, KUESIONER_DATA, ASPEK_OPTIONS } from '@/mocks/kuesioner';
import { PERWADAG_DATA } from '@/mocks/perwadag';
import { PageHeader } from '@/components/common/PageHeader';
import { toast } from 'sonner';

const KuesionerEditPage: React.FC = () => {
  const { id: kuesionerId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, isInspektorat, isPerwadag } = useRole();
  
  const [formData, setFormData] = useState<Partial<Kuesioner>>({});
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get kuesioner data
  const kuesioner = useMemo(() => {
    return KUESIONER_DATA.find(item => item.id === kuesionerId);
  }, [kuesionerId]);

  // Get available perwadag based on role
  const availablePerwadag = useMemo(() => {
    if (isAdmin()) {
      return PERWADAG_DATA;
    }
    if (isInspektorat()) {
      // For demo, assume inspektorat 1
      return PERWADAG_DATA.filter(p => p.inspektorat === 1);
    }
    if (isPerwadag()) {
      // For demo, assume current user is PWD001
      return PERWADAG_DATA.filter(p => p.id === 'PWD001');
    }
    return [];
  }, [isAdmin, isInspektorat, isPerwadag]);

  // Check access and edit permission
  const canEdit = useMemo(() => {
    if (!kuesioner) return false;
    if (isAdmin()) return true;
    if (isInspektorat()) return kuesioner.inspektorat === 1;
    if (isPerwadag()) return kuesioner.perwadagId === 'PWD001';
    return false;
  }, [kuesioner, isAdmin, isInspektorat, isPerwadag]);

  // Initialize form data
  useEffect(() => {
    if (kuesioner) {
      setFormData(kuesioner);
      setSelectedDate(new Date(kuesioner.tanggal));
    }
  }, [kuesioner]);

  // Check access
  if (!isAdmin() && !isInspektorat() && !isPerwadag()) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Akses Ditolak</h2>
          <p className="text-muted-foreground">
            Anda tidak memiliki akses untuk melihat halaman ini.
          </p>
        </div>
      </div>
    );
  }

  // Check if kuesioner exists
  if (!kuesioner) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Data Tidak Ditemukan</h2>
          <p className="text-muted-foreground">
            Kuesioner yang Anda cari tidak ditemukan.
          </p>
          <Button 
            onClick={() => navigate('/kuesioner')} 
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  // Check edit permission
  if (!canEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Akses Ditolak</h2>
          <p className="text-muted-foreground">
            Anda tidak memiliki izin untuk mengedit kuesioner ini.
          </p>
          <Button 
            onClick={() => navigate('/kuesioner')} 
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!selectedDate) {
      toast.error('Tanggal kuesioner harus diisi');
      return;
    }

    if (!formData.aspek) {
      toast.error('Aspek harus diisi');
      return;
    }

    if (!formData.linkDokumen) {
      toast.error('Link dokumen harus diisi');
      return;
    }

    setIsLoading(true);

    try {
      const dataToSave = {
        ...formData,
        tanggal: selectedDate.toISOString().split('T')[0],
      };

      // Implement save logic here
      console.log('Save kuesioner:', dataToSave);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Kuesioner berhasil disimpan');
      navigate('/kuesioner');
    } catch (error) {
      toast.error('Gagal menyimpan kuesioner');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/kuesioner');
  };

  const handleOpenLink = () => {
    if (formData.linkDokumen) {
      window.open(formData.linkDokumen, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Kuesioner"
        description="Edit data kuesioner audit"
      />

      <Card>
        <CardHeader>
          <CardTitle>Informasi Kuesioner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tanggal">Tanggal Kuesioner</Label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "dd MMMM yyyy", { locale: id })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setIsDatePickerOpen(false);
                  }}
                  initialFocus
                  locale={id}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="perwadag">Nama Perwadag</Label>
            <Select
              value={formData.perwadagId || ''}
              onValueChange={(value) => {
                const selected = availablePerwadag.find(p => p.id === value);
                setFormData({
                  ...formData,
                  perwadagId: value,
                  perwadagName: selected?.name || '',
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih perwadag" />
              </SelectTrigger>
              <SelectContent>
                {availablePerwadag.map((perwadag) => (
                  <SelectItem key={perwadag.id} value={perwadag.id}>
                    {perwadag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aspek">Aspek</Label>
            <Select
              value={formData.aspek || ''}
              onValueChange={(value) => setFormData({ ...formData, aspek: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih aspek" />
              </SelectTrigger>
              <SelectContent>
                {ASPEK_OPTIONS.map((aspek) => (
                  <SelectItem key={aspek} value={aspek}>
                    {aspek}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkDokumen">Link Dokumen</Label>
            <div className="flex gap-2">
              <Input
                id="linkDokumen"
                value={formData.linkDokumen || ''}
                onChange={(e) => setFormData({ ...formData, linkDokumen: e.target.value })}
                placeholder="https://drive.google.com/file/..."
                className="flex-1"
              />
              {formData.linkDokumen && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleOpenLink}
                  title="Buka Link"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KuesionerEditPage;