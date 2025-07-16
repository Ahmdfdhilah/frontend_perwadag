import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import { ROLE_LABELS } from '@/lib/constants';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Label } from '@workspace/ui/components/label';
import { Separator } from '@workspace/ui/components/separator';
import { ArrowLeft, Edit, FileText } from 'lucide-react';
import {
  RISK_ASSESSMENTS,
  DUMMY_RISK_ASSESSMENT_DETAIL,
  RiskAssessmentDetail,
} from '@/mocks';

const RiskAssessmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentRole } = useRole();
  const [formData] = useState<RiskAssessmentDetail>(DUMMY_RISK_ASSESSMENT_DETAIL);

  // Calculate role values once to avoid hooks being called conditionally
  const userIsAdmin = currentRole === 'ADMIN';
  const userIsInspektorat = currentRole === 'INSPEKTORAT';
  const hasAccess = userIsAdmin || userIsInspektorat;

  // Check if user can access this specific assessment
  useEffect(() => {
    if (id && !userIsAdmin) {
      const assessment = RISK_ASSESSMENTS.find(item => item.id === id);
      if (assessment && userIsInspektorat) {
        // For inspektorat, only allow access to inspektorat 1 data (as example)
        if (assessment.inspektorat !== 1) {
          navigate('/penilaian-resiko');
          return;
        }
      }
    }
  }, [id, userIsAdmin, userIsInspektorat, navigate]);

  // Get basic assessment info
  const basicAssessment = RISK_ASSESSMENTS.find(item => item.id === id);

  const handleEdit = () => {
    navigate(`/penilaian-resiko/${id}/edit`);
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

  if (!basicAssessment) {
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
        title={`Detail Penilaian Risiko - ${basicAssessment.perwadagName}`}
        description={`Tahun ${basicAssessment.year} | Role: ${ROLE_LABELS[currentRole as keyof typeof ROLE_LABELS]}`}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/penilaian-resiko')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar
            </Button>
            <Button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Assessment
            </Button>
          </div>
        }
      />

      {/* Section 1: Tren Capaian */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            1. Tren Capaian Tahun 2024 vs 2023
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Capaian 2023 (%)</Label>
              <div className="mt-1 text-lg font-semibold">{formData.achievement2023}%</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Capaian 2024 (%)</Label>
              <div className="mt-1 text-lg font-semibold">{formData.achievement2024}%</div>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Tren Capaian (%)</Label>
            <div className="mt-1 text-lg font-semibold">{formData.trendAchievement}%</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Kategori</Label>
            <div className="mt-1 text-lg font-semibold">{formData.trendChoice}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Nilai</Label>
            <div className="mt-1 text-2xl font-bold text-blue-600">{formData.trendValue}</div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Realisasi Anggaran */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            2. Persentase Realisasi Anggaran 2024
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Realisasi 2024 (Rp)</Label>
              <div className="mt-1 text-lg font-semibold">{formData.budgetRealization2024.toLocaleString('id-ID')}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Pagu 2024 (Rp)</Label>
              <div className="mt-1 text-lg font-semibold">{formData.budgetPagu2024.toLocaleString('id-ID')}</div>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Persentase Realisasi (%)</Label>
            <div className="mt-1 text-lg font-semibold">{formData.budgetPercentage}%</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Kategori</Label>
            <div className="mt-1 text-lg font-semibold">{formData.budgetChoice}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Nilai</Label>
            <div className="mt-1 text-2xl font-bold text-blue-600">{formData.budgetValue}</div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Tren Nilai Ekspor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            3. Tren Nilai Ekspor ke Negara Akreditasi 5 Tahun Terakhir
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Deskripsi Tren</Label>
            <div className="mt-1 text-lg font-semibold">{formData.exportTrendDescription}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Kategori</Label>
            <div className="mt-1 text-lg font-semibold">{formData.exportChoice}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Nilai</Label>
            <div className="mt-1 text-2xl font-bold text-blue-600">{formData.exportValue}</div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Pelaksanaan Audit Itjen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            4. Pelaksanaan Audit Itjen Tahun Sebelumnya
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Deskripsi Audit</Label>
            <div className="mt-1 text-lg font-semibold">{formData.auditDescription}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Kategori</Label>
            <div className="mt-1 text-lg font-semibold">{formData.auditChoice}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Nilai</Label>
            <div className="mt-1 text-2xl font-bold text-blue-600">{formData.auditValue}</div>
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
            <Label className="text-sm font-medium text-muted-foreground">Deskripsi Perjanjian</Label>
            <div className="mt-1 text-lg font-semibold">{formData.tradeAgreementDescription}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Kategori</Label>
            <div className="mt-1 text-lg font-semibold">{formData.tradeAgreementChoice}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Nilai</Label>
            <div className="mt-1 text-2xl font-bold text-blue-600">{formData.tradeAgreementValue}</div>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Peringkat Nilai Ekspor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            6. Peringkat Nilai Ekspor Non Migas Tahun 2024
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Deskripsi Peringkat</Label>
            <div className="mt-1 text-lg font-semibold">{formData.exportRankingDescription}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Kategori</Label>
            <div className="mt-1 text-lg font-semibold">{formData.exportRankingChoice}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Nilai</Label>
            <div className="mt-1 text-2xl font-bold text-blue-600">{formData.exportRankingValue}</div>
          </div>
        </CardContent>
      </Card>

      {/* Section 7: Persentase IK */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            7. Persentase Jumlah IK yang Tidak Mencapai Target Tahun 2024
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">IK Tidak Tercapai</Label>
              <div className="mt-1 text-lg font-semibold">{formData.ikNotAchieved}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Total IK</Label>
              <div className="mt-1 text-lg font-semibold">{formData.ikTotal}</div>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Persentase IK Tidak Tercapai (%)</Label>
            <div className="mt-1 text-lg font-semibold">{formData.ikPercentage}%</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Kategori</Label>
            <div className="mt-1 text-lg font-semibold">{formData.ikChoice}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Nilai</Label>
            <div className="mt-1 text-2xl font-bold text-blue-600">{formData.ikValue}</div>
          </div>
        </CardContent>
      </Card>

      {/* Section 8: Nilai Transaksi TEI */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            8. Persentase Realisasi Nilai Transaksi TEI 2024
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Nilai Realisasi</Label>
              <div className="mt-1 text-lg font-semibold">{formData.teiRealizationValue.toLocaleString('id-ID')}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Nilai Potensi</Label>
              <div className="mt-1 text-lg font-semibold">{formData.teiPotentialValue.toLocaleString('id-ID')}</div>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Deskripsi</Label>
            <div className="mt-1 text-lg font-semibold">{formData.teiDescription}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Kategori</Label>
            <div className="mt-1 text-lg font-semibold">{formData.teiChoice}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Nilai</Label>
            <div className="mt-1 text-2xl font-bold text-blue-600">{formData.teiValue}</div>
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
          <Label className="text-sm font-medium text-muted-foreground">Total Nilai Risiko</Label>
          <div className="mt-1 text-4xl font-bold text-blue-600">{formData.totalRiskValue}</div>
          <Separator />
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Keterangan / Catatan</Label>
            <div className="mt-1 bg-gray-50 p-3 rounded-md">
              <p className="text-sm">{formData.notes || 'Tidak ada catatan'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessmentDetailPage;