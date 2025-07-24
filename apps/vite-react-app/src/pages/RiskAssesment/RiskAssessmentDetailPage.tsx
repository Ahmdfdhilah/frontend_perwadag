import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import { useFormPermissions } from '@/hooks/useFormPermissions';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Label } from '@workspace/ui/components/label';
import { Separator } from '@workspace/ui/components/separator';
import { ArrowLeft, Edit, FileText, Loader2 } from 'lucide-react';
import { penilaianRisikoService } from '@/services/penilaianRisiko';
import { PenilaianRisiko } from '@/services/penilaianRisiko/types';
import { useToast } from '@workspace/ui/components/sonner';

const RiskAssessmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentRole } = useRole();
  const { canEditForm } = useFormPermissions();
  const { toast } = useToast();
  const [penilaianData, setPenilaianData] = useState<PenilaianRisiko | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate role values once to avoid hooks being called conditionally
  const userIsAdmin = currentRole === 'ADMIN';
  const userIsInspektorat = currentRole === 'INSPEKTORAT';
  const hasAccess = userIsAdmin || userIsInspektorat;

  // Load penilaian data from API
  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        navigate('/penilaian-resiko');
        return;
      }

      try {
        setIsLoading(true);
        const response = await penilaianRisikoService.getPenilaianRisikoById(id);
        setPenilaianData(response);
      } catch (error) {
        console.error('Error loading penilaian data:', error);
        toast({
          title: 'Error',
          description: 'Gagal memuat data penilaian risiko',
          variant: 'destructive'
        });
        navigate('/penilaian-resiko');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/penilaian-resiko/${id}/edit`);
  };

  // Helper function to check if a record can be edited based on periode status
  const canEditRecord = () => {
    if (!penilaianData) return false;
    if (!canEditForm('risk_assessment')) return false;
    
    // Check if the periode is locked or status is "tutup"
    if (penilaianData.periode_info?.is_locked || penilaianData.periode_info?.status === 'tutup') {
      return false;
    }
    
    return true;
  };

  // Check access after all hooks have been called
  if (!hasAccess) {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat data penilaian risiko...</p>
        </div>
      </div>
    );
  }

  if (!penilaianData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Data Tidak Ditemukan</h2>
          <p className="text-muted-foreground">
            Assessment dengan ID {id} tidak ditemukan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Detail Penilaian Risiko - ${penilaianData.nama_perwadag}`}
        description={`Tahun ${penilaianData.tahun} | Total Risiko: ${penilaianData.total_nilai_risiko ? Number(penilaianData.total_nilai_risiko).toFixed(2) : '-'}`}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/penilaian-resiko')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar
            </Button>
            {canEditRecord() && (
              <Button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Assessment
              </Button>
            )}
          </div>
        }
      />

      {/* Section 1: Tren Capaian */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            1. Tren Capaian Tahun {penilaianData.kriteria_data.tren_capaian.tahun_pembanding_2} vs {penilaianData.kriteria_data.tren_capaian.tahun_pembanding_1}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Capaian {penilaianData.kriteria_data.tren_capaian.tahun_pembanding_1} (%)</Label>
              <div className="mt-1 text-lg font-semibold">{penilaianData.kriteria_data.tren_capaian.capaian_tahun_1 || '-'}%</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Capaian {penilaianData.kriteria_data.tren_capaian.tahun_pembanding_2} (%)</Label>
              <div className="mt-1 text-lg font-semibold">{penilaianData.kriteria_data.tren_capaian.capaian_tahun_2 || '-'}%</div>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Tren Capaian (%)</Label>
            <div className="mt-1 text-lg font-semibold">{penilaianData.kriteria_data.tren_capaian.tren ? Number(penilaianData.kriteria_data.tren_capaian.tren).toFixed(2) : '-'}%</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Kategori</Label>
            <div className="mt-1 text-lg font-semibold">{penilaianData.kriteria_data.tren_capaian.pilihan || 'Belum dihitung'}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Nilai</Label>
            <div className="mt-1 text-2xl font-bold text-blue-600">{penilaianData.kriteria_data.tren_capaian.nilai || '-'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Realisasi Anggaran */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            2. Persentase Realisasi Anggaran {penilaianData.kriteria_data.realisasi_anggaran.tahun_pembanding}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Realisasi {penilaianData.kriteria_data.realisasi_anggaran.tahun_pembanding} (Rp)</Label>
              <div className="mt-1 text-lg font-semibold">{(penilaianData.kriteria_data.realisasi_anggaran.realisasi || 0).toLocaleString('id-ID')}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Pagu {penilaianData.kriteria_data.realisasi_anggaran.tahun_pembanding} (Rp)</Label>
              <div className="mt-1 text-lg font-semibold">{(penilaianData.kriteria_data.realisasi_anggaran.pagu || 0).toLocaleString('id-ID')}</div>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Persentase Realisasi (%)</Label>
            <div className="mt-1 text-lg font-semibold">{penilaianData.kriteria_data.realisasi_anggaran.persentase ? Number(penilaianData.kriteria_data.realisasi_anggaran.persentase).toFixed(2) : '-'}%</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Kategori</Label>
            <div className="mt-1 text-lg font-semibold">{penilaianData.kriteria_data.realisasi_anggaran.pilihan || 'Belum dihitung'}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Nilai</Label>
            <div className="mt-1 text-2xl font-bold text-blue-600">{penilaianData.kriteria_data.realisasi_anggaran.nilai || '-'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Tren Nilai Ekspor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            3. Tren Nilai Ekspor ke Negara Akreditasi (Tahun {penilaianData.kriteria_data.tren_ekspor.tahun_pembanding})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Deskripsi Tren (%)</Label>
            <div className="mt-1 text-lg font-semibold">{penilaianData.kriteria_data.tren_ekspor.deskripsi || '-'}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Kategori</Label>
            <div className="mt-1 text-lg font-semibold">{penilaianData.kriteria_data.tren_ekspor.pilihan || 'Belum dihitung'}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Nilai</Label>
            <div className="mt-1 text-2xl font-bold text-blue-600">{penilaianData.kriteria_data.tren_ekspor.nilai || '-'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Pelaksanaan Audit Itjen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            4. Pelaksanaan Audit Itjen (Tahun {penilaianData.kriteria_data.audit_itjen.tahun_pembanding})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Status Audit</Label>
            <div className="mt-1 text-lg font-semibold">{penilaianData.kriteria_data.audit_itjen.pilihan || 'Belum dipilih'}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Nilai</Label>
            <div className="mt-1 text-2xl font-bold text-blue-600">{penilaianData.kriteria_data.audit_itjen.nilai || '-'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Perjanjian Perdagangan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            5. Perjanjian Perdagangan Indonesia dengan Negara Mitra
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Status Perjanjian</Label>
            <div className="mt-1 text-lg font-semibold">{penilaianData.kriteria_data.perjanjian_perdagangan.pilihan || 'Belum dipilih'}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Nilai</Label>
            <div className="mt-1 text-2xl font-bold text-blue-600">{penilaianData.kriteria_data.perjanjian_perdagangan.nilai || '-'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Peringkat Nilai Ekspor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            6. Peringkat Nilai Ekspor Non Migas Tahun {penilaianData.kriteria_data.peringkat_ekspor.tahun_pembanding}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Peringkat</Label>
            <div className="mt-1 text-lg font-semibold">{penilaianData.kriteria_data.peringkat_ekspor.deskripsi || '-'}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Kategori</Label>
            <div className="mt-1 text-lg font-semibold">{penilaianData.kriteria_data.peringkat_ekspor.pilihan || 'Belum dihitung'}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Nilai</Label>
            <div className="mt-1 text-2xl font-bold text-blue-600">{penilaianData.kriteria_data.peringkat_ekspor.nilai || '-'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Section 7: Persentase IK */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            7. Persentase Jumlah IK yang Tidak Mencapai Target Tahun {penilaianData.kriteria_data.persentase_ik.tahun_pembanding}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">IK Tidak Tercapai</Label>
              <div className="mt-1 text-lg font-semibold">{(penilaianData.kriteria_data.persentase_ik.ik_tidak_tercapai || 0).toLocaleString('id-ID')}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Total IK</Label>
              <div className="mt-1 text-lg font-semibold">{(penilaianData.kriteria_data.persentase_ik.total_ik || 0).toLocaleString('id-ID')}</div>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Persentase IK Tidak Tercapai (%)</Label>
            <div className="mt-1 text-lg font-semibold">{penilaianData.kriteria_data.persentase_ik.persentase ? Number(penilaianData.kriteria_data.persentase_ik.persentase).toFixed(2) : '-'}%</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Kategori</Label>
            <div className="mt-1 text-lg font-semibold">{penilaianData.kriteria_data.persentase_ik.pilihan || 'Belum dihitung'}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Nilai</Label>
            <div className="mt-1 text-2xl font-bold text-blue-600">{penilaianData.kriteria_data.persentase_ik.nilai || '-'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Section 8: Nilai Transaksi TEI */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            8. Persentase Realisasi Nilai Transaksi TEI {penilaianData.kriteria_data.realisasi_tei.tahun_pembanding}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Nilai Realisasi (Rp)</Label>
              <div className="mt-1 text-lg font-semibold">{(penilaianData.kriteria_data.realisasi_tei.nilai_realisasi || 0).toLocaleString('id-ID')}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Nilai Potensi (Rp)</Label>
              <div className="mt-1 text-lg font-semibold">{(penilaianData.kriteria_data.realisasi_tei.nilai_potensi || 0).toLocaleString('id-ID')}</div>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Deskripsi (%)</Label>
            <div className="mt-1 text-lg font-semibold">{penilaianData.kriteria_data.realisasi_tei.deskripsi ? Number(penilaianData.kriteria_data.realisasi_tei.deskripsi).toFixed(2) : '-'}%</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Kategori</Label>
            <div className="mt-1 text-lg font-semibold">{penilaianData.kriteria_data.realisasi_tei.pilihan || 'Belum dihitung'}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Nilai</Label>
            <div className="mt-1 text-2xl font-bold text-blue-600">{penilaianData.kriteria_data.realisasi_tei.nilai || '-'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Final Section: Total Risk and Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Hasil Penilaian Risiko
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Total Nilai Risiko</Label>
            <div className="mt-1 text-4xl font-bold text-blue-600">{penilaianData.total_nilai_risiko ? Number(penilaianData.total_nilai_risiko).toFixed(2) : '-'}</div>
          </div>
          <Separator />
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Keterangan / Catatan</Label>
            <div className="mt-1 bg-gray-50 p-3 rounded-md">
              <p className="text-sm">{penilaianData.catatan || 'Tidak ada catatan'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessmentDetailPage;