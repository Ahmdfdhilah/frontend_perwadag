import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
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
import { Separator } from '@workspace/ui/components/separator';
import { ArrowLeft, Save, Calculator } from 'lucide-react';
import {
  RISK_ASSESSMENTS,
  DUMMY_RISK_ASSESSMENT_DETAIL,
  RiskAssessmentDetail,
  TREND_CHOICES,
  BUDGET_CHOICES,
  EXPORT_TREND_CHOICES,
  AUDIT_CHOICES,
  TRADE_AGREEMENT_CHOICES,
  EXPORT_RANKING_CHOICES,
  IK_CHOICES,
  TEI_CHOICES,
} from '@/mocks';

const RiskAssessmentInputPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentRole } = useRole();
  const [formData, setFormData] = useState<RiskAssessmentDetail>(DUMMY_RISK_ASSESSMENT_DETAIL);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate role values once to avoid hooks being called conditionally
  const userIsAdmin = currentRole.id === 'admin';
  const userIsInspektorat = currentRole.id === 'inspektorat';
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

  const handleInputChange = (field: keyof RiskAssessmentDetail, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotalRisk = () => {
    const totalValue =
      formData.trendValue +
      formData.budgetValue +
      formData.exportValue +
      formData.auditValue +
      formData.tradeAgreementValue +
      formData.exportRankingValue +
      formData.ikValue +
      formData.teiValue;

    setFormData(prev => ({
      ...prev,
      totalRiskValue: totalValue
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving assessment:', formData);
      // Show success message or navigate back
    } catch (error) {
      console.error('Error saving assessment:', error);
    } finally {
      setIsLoading(false);
    }
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
        title={`Input Penilaian Risiko - ${basicAssessment.perwadagName}`}
        description={`Tahun ${basicAssessment.year} | Role: ${currentRole.label}`}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate('/penilaian-resiko')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar
          </Button>
        }
      />

      {/* Form Sections */}
      <div className="grid grid-cols-1  gap-6">

        {/* Section 1: Tren Capaian */}
        <Card>
          <CardHeader>
            <CardTitle>1. Tren Capaian Tahun 2024 vs 2023</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Capaian 2023 (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.achievement2023}
                  onChange={(e) => handleInputChange('achievement2023', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Capaian 2024 (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.achievement2024}
                  onChange={(e) => handleInputChange('achievement2024', parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div>
              <Label>Tren Capaian (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.trendAchievement}
                onChange={(e) => handleInputChange('trendAchievement', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Pilihan Kategori</Label>
              <Select
                value={formData.trendChoice}
                onValueChange={(value) => {
                  const choice = TREND_CHOICES.find(c => c.label === value);
                  handleInputChange('trendChoice', value);
                  handleInputChange('trendValue', choice?.score || 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori tren" />
                </SelectTrigger>
                <SelectContent>
                  {TREND_CHOICES.map((choice) => (
                    <SelectItem key={choice.value} value={choice.label}>
                      {choice.label} (Nilai: {choice.score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={formData.trendValue}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Realisasi Anggaran */}
        <Card>
          <CardHeader>
            <CardTitle>2. Persentase Realisasi Anggaran 2024</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Realisasi 2024 (Rp)</Label>
              <Input
                type="number"
                value={formData.budgetRealization2024}
                onChange={(e) => handleInputChange('budgetRealization2024', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Pagu 2024 (Rp)</Label>
              <Input
                type="number"
                value={formData.budgetPagu2024}
                onChange={(e) => handleInputChange('budgetPagu2024', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Persentase Realisasi (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.budgetPercentage}
                onChange={(e) => handleInputChange('budgetPercentage', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Pilihan Kategori</Label>
              <Select
                value={formData.budgetChoice}
                onValueChange={(value) => {
                  const choice = BUDGET_CHOICES.find(c => c.label === value);
                  handleInputChange('budgetChoice', value);
                  handleInputChange('budgetValue', choice?.score || 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori anggaran" />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_CHOICES.map((choice) => (
                    <SelectItem key={choice.value} value={choice.label}>
                      {choice.label} (Nilai: {choice.score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={formData.budgetValue}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Tren Nilai Ekspor */}
        <Card>
          <CardHeader>
            <CardTitle>3. Tren Nilai Ekspor ke Negara Akreditasi 5 Tahun Terakhir</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Deskripsi Tren</Label>
              <Input
                value={formData.exportTrendDescription}
                onChange={(e) => handleInputChange('exportTrendDescription', e.target.value)}
                placeholder="Contoh: 4.71%"
              />
            </div>
            <div>
              <Label>Pilihan Kategori</Label>
              <Select
                value={formData.exportChoice}
                onValueChange={(value) => {
                  const choice = EXPORT_TREND_CHOICES.find(c => c.label === value);
                  handleInputChange('exportChoice', value);
                  handleInputChange('exportValue', choice?.score || 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori tren ekspor" />
                </SelectTrigger>
                <SelectContent>
                  {EXPORT_TREND_CHOICES.map((choice) => (
                    <SelectItem key={choice.value} value={choice.label}>
                      {choice.label} (Nilai: {choice.score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={formData.exportValue}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Pelaksanaan Audit Itjen */}
        <Card>
          <CardHeader>
            <CardTitle>4. Pelaksanaan Audit Itjen Tahun Sebelumnya</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Deskripsi Audit</Label>
              <Input
                value={formData.auditDescription}
                onChange={(e) => handleInputChange('auditDescription', e.target.value)}
                placeholder="Contoh: Belum pernah diaudit"
              />
            </div>
            <div>
              <Label>Pilihan Kategori</Label>
              <Select
                value={formData.auditChoice}
                onValueChange={(value) => {
                  const choice = AUDIT_CHOICES.find(c => c.label === value);
                  handleInputChange('auditChoice', value);
                  handleInputChange('auditValue', choice?.score || 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status audit" />
                </SelectTrigger>
                <SelectContent>
                  {AUDIT_CHOICES.map((choice) => (
                    <SelectItem key={choice.value} value={choice.label}>
                      {choice.label} (Nilai: {choice.score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={formData.auditValue}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Continue with more sections in next part */}
      <div className="grid grid-cols-1  gap-6">

        {/* Section 5: Perjanjian Perdagangan */}
        <Card>
          <CardHeader>
            <CardTitle>5. Perjanjian Perdagangan Indonesia dengan Negara Mitra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Deskripsi Perjanjian</Label>
              <Input
                value={formData.tradeAgreementDescription}
                onChange={(e) => handleInputChange('tradeAgreementDescription', e.target.value)}
                placeholder="Contoh: Tidak ada perjanjian internasional"
              />
            </div>
            <div>
              <Label>Pilihan Kategori</Label>
              <Select
                value={formData.tradeAgreementChoice}
                onValueChange={(value) => {
                  const choice = TRADE_AGREEMENT_CHOICES.find(c => c.label === value);
                  handleInputChange('tradeAgreementChoice', value);
                  handleInputChange('tradeAgreementValue', choice?.score || 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jumlah perjanjian" />
                </SelectTrigger>
                <SelectContent>
                  {TRADE_AGREEMENT_CHOICES.map((choice) => (
                    <SelectItem key={choice.value} value={choice.label}>
                      {choice.label} (Nilai: {choice.score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={formData.tradeAgreementValue}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Peringkat Nilai Ekspor */}
        <Card>
          <CardHeader>
            <CardTitle>6. Peringkat Nilai Ekspor Non Migas Tahun 2024</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Deskripsi Peringkat</Label>
              <Input
                value={formData.exportRankingDescription}
                onChange={(e) => handleInputChange('exportRankingDescription', e.target.value)}
                placeholder="Contoh: 27"
              />
            </div>
            <div>
              <Label>Pilihan Kategori</Label>
              <Select
                value={formData.exportRankingChoice}
                onValueChange={(value) => {
                  const choice = EXPORT_RANKING_CHOICES.find(c => c.label === value);
                  handleInputChange('exportRankingChoice', value);
                  handleInputChange('exportRankingValue', choice?.score || 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori peringkat" />
                </SelectTrigger>
                <SelectContent>
                  {EXPORT_RANKING_CHOICES.map((choice) => (
                    <SelectItem key={choice.value} value={choice.label}>
                      {choice.label} (Nilai: {choice.score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={formData.exportRankingValue}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 7: Persentase IK */}
        <Card>
          <CardHeader>
            <CardTitle>7. Persentase Jumlah IK yang Tidak Mencapai Target Tahun 2024</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>IK Tidak Tercapai</Label>
                <Input
                  type="number"
                  value={formData.ikNotAchieved}
                  onChange={(e) => handleInputChange('ikNotAchieved', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label>Total IK</Label>
                <Input
                  type="number"
                  value={formData.ikTotal}
                  onChange={(e) => handleInputChange('ikTotal', parseInt(e.target.value))}
                />
              </div>
            </div>
            <div>
              <Label>Persentase IK Tidak Tercapai (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.ikPercentage}
                onChange={(e) => handleInputChange('ikPercentage', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Pilihan Kategori</Label>
              <Select
                value={formData.ikChoice}
                onValueChange={(value) => {
                  const choice = IK_CHOICES.find(c => c.label === value);
                  handleInputChange('ikChoice', value);
                  handleInputChange('ikValue', choice?.score || 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori persentase IK" />
                </SelectTrigger>
                <SelectContent>
                  {IK_CHOICES.map((choice) => (
                    <SelectItem key={choice.value} value={choice.label}>
                      {choice.label} (Nilai: {choice.score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={formData.ikValue}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 8: Nilai Transaksi TEI */}
        <Card>
          <CardHeader>
            <CardTitle>8. Persentase Realisasi Nilai Transaksi TEI 2024</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nilai Realisasi</Label>
                <Input
                  type="number"
                  value={formData.teiRealizationValue}
                  onChange={(e) => handleInputChange('teiRealizationValue', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Nilai Potensi</Label>
                <Input
                  type="number"
                  value={formData.teiPotentialValue}
                  onChange={(e) => handleInputChange('teiPotentialValue', parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Input
                value={formData.teiDescription}
                onChange={(e) => handleInputChange('teiDescription', e.target.value)}
                placeholder="Contoh: tidak ada data realisasi dan nilai potensi"
              />
            </div>
            <div>
              <Label>Pilihan Kategori</Label>
              <Select
                value={formData.teiChoice}
                onValueChange={(value) => {
                  const choice = TEI_CHOICES.find(c => c.label === value);
                  handleInputChange('teiChoice', value);
                  handleInputChange('teiValue', choice?.score || 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori TEI" />
                </SelectTrigger>
                <SelectContent>
                  {TEI_CHOICES.map((choice) => (
                    <SelectItem key={choice.value} value={choice.label}>
                      {choice.label} (Nilai: {choice.score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={formData.teiValue}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Final Section: Total Risk and Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Hasil Penilaian Risiko</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={calculateTotalRisk}
            >
              <Calculator className="mr-2 h-4 w-4" />
              Hitung Total Nilai Risiko
            </Button>
            <div className="flex items-center gap-2">
              <Label>Total Nilai Risiko:</Label>
              <Input
                type="number"
                value={formData.totalRiskValue}
                disabled
                className="w-24 bg-muted font-bold"
              />
            </div>
          </div>
          <Separator />
          <div>
            <Label>Keterangan / Catatan</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Tambahkan catatan atau keterangan..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/penilaian-resiko')}
        >
          Batal
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Menyimpan...' : 'Simpan Assessment'}
        </Button>
      </div>
    </div>
  );
};

export default RiskAssessmentInputPage;