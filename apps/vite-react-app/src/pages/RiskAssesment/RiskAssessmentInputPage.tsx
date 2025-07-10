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
import { formatNumber, handleNumberInput, parseFormattedNumber } from '@/utils/numberUtils';

const RiskAssessmentInputPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentRole } = useRole();
  const [formData, setFormData] = useState<RiskAssessmentDetail>(DUMMY_RISK_ASSESSMENT_DETAIL);
  const [isLoading, setIsLoading] = useState(false);
  const [formattedValues, setFormattedValues] = useState({
    budgetRealization2024: formatNumber(DUMMY_RISK_ASSESSMENT_DETAIL.budgetRealization2024),
    budgetPagu2024: formatNumber(DUMMY_RISK_ASSESSMENT_DETAIL.budgetPagu2024),
    teiRealizationValue: formatNumber(DUMMY_RISK_ASSESSMENT_DETAIL.teiRealizationValue),
    teiPotentialValue: formatNumber(DUMMY_RISK_ASSESSMENT_DETAIL.teiPotentialValue),
    ikNotAchieved: formatNumber(DUMMY_RISK_ASSESSMENT_DETAIL.ikNotAchieved),
    ikTotal: formatNumber(DUMMY_RISK_ASSESSMENT_DETAIL.ikTotal),
  });

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

  const handleNumberInputChange = (field: keyof RiskAssessmentDetail, value: string) => {
    handleNumberInput(value, (formattedValue) => {
      setFormattedValues(prev => ({
        ...prev,
        [field]: formattedValue
      }));
      setFormData(prev => ({
        ...prev,
        [field]: parseFormattedNumber(formattedValue)
      }));
    });
  };

  // Auto-calculate category selections based on values
  useEffect(() => {
    // Auto-calculate trend percentage based on achievement values
    if (formData.achievement2023 > 0) {
      const percentage = ((formData.achievement2024 - formData.achievement2023) / formData.achievement2023) * 100;
      setFormData(prev => ({
        ...prev,
        trendAchievement: percentage
      }));
    }
  }, [formData.achievement2023, formData.achievement2024]);

  useEffect(() => {
    // Auto-calculate trend category based on trendAchievement - Updated rules
    const trendPercentage = formData.trendAchievement;
    let trendChoice = '';
    if (trendPercentage >= 41) trendChoice = 'Naik >=41%';
    else if (trendPercentage >= 21 && trendPercentage <= 40) trendChoice = 'Naik 21% - 40%';
    else if (trendPercentage >= 0 && trendPercentage <= 20) trendChoice = 'Naik 0% - 20%';
    else if (trendPercentage < 0 && trendPercentage > -25) trendChoice = 'Turun < 25%';
    else if (trendPercentage <= -25) trendChoice = 'Turun >= 25%';
    
    if (trendChoice) {
      const choice = TREND_CHOICES.find(c => c.label === trendChoice);
      if (choice) {
        setFormData(prev => ({
          ...prev,
          trendChoice: trendChoice,
          trendValue: choice.score
        }));
      }
    }
  }, [formData.trendAchievement]);

  useEffect(() => {
    // Auto-calculate budget percentage based on realization and pagu values
    if (formData.budgetPagu2024 > 0) {
      const percentage = (formData.budgetRealization2024 / formData.budgetPagu2024) * 100;
      setFormData(prev => ({
        ...prev,
        budgetPercentage: percentage
      }));
    }
  }, [formData.budgetRealization2024, formData.budgetPagu2024]);

  useEffect(() => {
    // Auto-calculate budget category based on budgetPercentage - Updated rules
    const percentage = formData.budgetPercentage;
    let budgetChoice = '';
    if (percentage > 98) budgetChoice = '> 98%';
    else if (percentage >= 95 && percentage <= 97) budgetChoice = '95% - 97%';
    else if (percentage >= 90 && percentage <= 94) budgetChoice = '90% - 94%';
    else if (percentage >= 85 && percentage <= 89) budgetChoice = '85% - 89%';
    else if (percentage < 85) budgetChoice = '<85%';
    
    if (budgetChoice) {
      const choice = BUDGET_CHOICES.find(c => c.label === budgetChoice);
      if (choice) {
        setFormData(prev => ({
          ...prev,
          budgetChoice: budgetChoice,
          budgetValue: choice.score
        }));
      }
    }
  }, [formData.budgetPercentage]);

  useEffect(() => {
    // Auto-calculate IK percentage based on not achieved and total values
    if (formData.ikTotal > 0) {
      const percentage = (formData.ikNotAchieved / formData.ikTotal) * 100;
      setFormData(prev => ({
        ...prev,
        ikPercentage: percentage
      }));
    }
  }, [formData.ikNotAchieved, formData.ikTotal]);

  useEffect(() => {
    // Auto-calculate IK category based on ikPercentage - Updated rules
    const percentage = formData.ikPercentage;
    let ikChoice = '';
    if (percentage < 5) ikChoice = '< 5%';
    else if (percentage >= 6 && percentage <= 10) ikChoice = '6% - 10%';
    else if (percentage >= 11 && percentage <= 15) ikChoice = '11% - 15%';
    else if (percentage >= 16 && percentage <= 20) ikChoice = '16% - 20%';
    else if (percentage > 20) ikChoice = '> 20%';
    
    if (ikChoice) {
      const choice = IK_CHOICES.find(c => c.label === ikChoice);
      if (choice) {
        setFormData(prev => ({
          ...prev,
          ikChoice: ikChoice,
          ikValue: choice.score
        }));
      }
    }
  }, [formData.ikPercentage]);

  useEffect(() => {
    // Auto-calculate TEI percentage based on realization and potential values
    if (formData.teiPotentialValue > 0) {
      const percentage = (formData.teiRealizationValue / formData.teiPotentialValue) * 100;
      setFormData(prev => ({
        ...prev,
        teiPercentage: percentage
      }));
    } else if (formData.teiRealizationValue === 0 && formData.teiPotentialValue === 0) {
      setFormData(prev => ({
        ...prev,
        teiPercentage: 0
      }));
    }
  }, [formData.teiRealizationValue, formData.teiPotentialValue]);

  useEffect(() => {
    // Auto-calculate TEI category based on teiPercentage - Updated rules
    const percentage = formData.teiPercentage;
    let teiChoice = '';
    if (percentage === 0) teiChoice = 'Belum Ada Realisasi';
    else if (percentage > 70) teiChoice = '> 70%';
    else if (percentage >= 50 && percentage <= 70) teiChoice = '50% - 70%';
    else if (percentage >= 25 && percentage <= 49) teiChoice = '25% - 49%';
    else if (percentage < 25) teiChoice = '< 25%';
    
    if (teiChoice) {
      const choice = TEI_CHOICES.find(c => c.label === teiChoice);
      if (choice) {
        setFormData(prev => ({
          ...prev,
          teiChoice: teiChoice,
          teiValue: choice.score
        }));
      }
    }
  }, [formData.teiPercentage]);

  // Auto-calculate export trend category based on description percentage
  useEffect(() => {
    if (formData.exportTrendDescription) {
      const percentage = parseFloat(formData.exportTrendDescription.replace('%', ''));
      let exportChoice = '';
      if (percentage >= 35) exportChoice = 'Naik >= 35 %';
      else if (percentage >= 20 && percentage <= 34) exportChoice = 'Naik 20% - 34%';
      else if (percentage >= 0 && percentage <= 19) exportChoice = 'Naik 0% - 19%';
      else if (percentage < 0 && percentage > -25) exportChoice = 'Turun < 25%';
      else if (percentage <= -25) exportChoice = 'Turun >= 25%';
      
      if (exportChoice) {
        const choice = EXPORT_TREND_CHOICES.find(c => c.label === exportChoice);
        if (choice) {
          setFormData(prev => ({
            ...prev,
            exportChoice: exportChoice,
            exportValue: choice.score
          }));
        }
      }
    }
  }, [formData.exportTrendDescription]);

  // Auto-calculate export ranking category based on ranking number
  useEffect(() => {
    if (formData.exportRankingDescription) {
      const ranking = parseInt(formData.exportRankingDescription);
      let exportRankingChoice = '';
      if (ranking >= 1 && ranking <= 6) exportRankingChoice = 'Peringkat 1 - 6';
      else if (ranking >= 7 && ranking <= 12) exportRankingChoice = 'Peringkat 7 - 12';
      else if (ranking >= 13 && ranking <= 18) exportRankingChoice = 'Peringkat 13 - 18';
      else if (ranking >= 19 && ranking <= 23) exportRankingChoice = 'Peringkat 19 - 23';
      else if (ranking > 23) exportRankingChoice = 'Peringkat diatas 23';
      
      if (exportRankingChoice) {
        const choice = EXPORT_RANKING_CHOICES.find(c => c.label === exportRankingChoice);
        if (choice) {
          setFormData(prev => ({
            ...prev,
            exportRankingChoice: exportRankingChoice,
            exportRankingValue: choice.score
          }));
        }
      }
    }
  }, [formData.exportRankingDescription]);

  // Auto-calculate audit category based on audit description
  useEffect(() => {
    if (formData.auditDescription) {
      const choice = AUDIT_CHOICES.find(c => c.label === formData.auditDescription);
      if (choice) {
        setFormData(prev => ({
          ...prev,
          auditChoice: formData.auditDescription,
          auditValue: choice.score
        }));
      }
    }
  }, [formData.auditDescription]);

  // Auto-calculate trade agreement category based on trade agreement description
  useEffect(() => {
    if (formData.tradeAgreementDescription) {
      const choice = TRADE_AGREEMENT_CHOICES.find(c => c.label === formData.tradeAgreementDescription);
      if (choice) {
        setFormData(prev => ({
          ...prev,
          tradeAgreementChoice: formData.tradeAgreementDescription,
          tradeAgreementValue: choice.score
        }));
      }
    }
  }, [formData.tradeAgreementDescription]);

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
              <Label>Tren Capaian (%) - Otomatis</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.trendAchievement}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Pilihan Kategori (Otomatis)</Label>
              <Input
                value={formData.trendChoice || 'Kategori akan dipilih otomatis'}
                disabled
                className="bg-muted"
              />
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
                type="text"
                value={formattedValues.budgetRealization2024}
                onChange={(e) => handleNumberInputChange('budgetRealization2024', e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Pagu 2024 (Rp)</Label>
              <Input
                type="text"
                value={formattedValues.budgetPagu2024}
                onChange={(e) => handleNumberInputChange('budgetPagu2024', e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Persentase Realisasi (%) - Otomatis</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.budgetPercentage}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Pilihan Kategori (Otomatis)</Label>
              <Input
                value={formData.budgetChoice || 'Kategori akan dipilih otomatis'}
                disabled
                className="bg-muted"
              />
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
              <Label>Deskripsi Tren (%)</Label>
              <Input
                value={formData.exportTrendDescription}
                onChange={(e) => handleInputChange('exportTrendDescription', e.target.value)}
                placeholder="Contoh: 4.71"
              />
            </div>
            <div>
              <Label>Pilihan Kategori (Otomatis)</Label>
              <Input
                value={formData.exportChoice || 'Kategori akan dipilih otomatis'}
                disabled
                className="bg-muted"
              />
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
              <Label>Status Audit</Label>
              <Select
                value={formData.auditDescription}
                onValueChange={(value) => handleInputChange('auditDescription', value)}
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
              <Label>Pilihan Kategori (Otomatis)</Label>
              <Input
                value={formData.auditChoice || 'Kategori akan dipilih otomatis'}
                disabled
                className="bg-muted"
              />
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
              <Label>Status Perjanjian</Label>
              <Select
                value={formData.tradeAgreementDescription}
                onValueChange={(value) => handleInputChange('tradeAgreementDescription', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status perjanjian" />
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
              <Label>Pilihan Kategori (Otomatis)</Label>
              <Input
                value={formData.tradeAgreementChoice || 'Kategori akan dipilih otomatis'}
                disabled
                className="bg-muted"
              />
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
              <Label>Peringkat</Label>
              <Input
                type="number"
                value={formData.exportRankingDescription}
                onChange={(e) => handleInputChange('exportRankingDescription', e.target.value)}
                placeholder="Contoh: 27"
              />
            </div>
            <div>
              <Label>Pilihan Kategori (Otomatis)</Label>
              <Input
                value={formData.exportRankingChoice || 'Kategori akan dipilih otomatis'}
                disabled
                className="bg-muted"
              />
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
                  type="text"
                  value={formattedValues.ikNotAchieved}
                  onChange={(e) => handleNumberInputChange('ikNotAchieved', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Total IK</Label>
                <Input
                  type="text"
                  value={formattedValues.ikTotal}
                  onChange={(e) => handleNumberInputChange('ikTotal', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label>Persentase IK Tidak Tercapai (%) - Otomatis</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.ikPercentage}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Pilihan Kategori (Otomatis)</Label>
              <Input
                value={formData.ikChoice || 'Kategori akan dipilih otomatis'}
                disabled
                className="bg-muted"
              />
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
                <Label>Nilai Realisasi (Rp)</Label>
                <Input
                  type="text"
                  value={formattedValues.teiRealizationValue}
                  onChange={(e) => handleNumberInputChange('teiRealizationValue', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Nilai Potensi (Rp)</Label>
                <Input
                  type="text"
                  value={formattedValues.teiPotentialValue}
                  onChange={(e) => handleNumberInputChange('teiPotentialValue', e.target.value)}
                  placeholder="0"
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
              <Label>Persentase Realisasi TEI (%) - Otomatis</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.teiPercentage}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Pilihan Kategori (Otomatis)</Label>
              <Input
                value={formData.teiChoice || 'Kategori akan dipilih otomatis'}
                disabled
                className="bg-muted"
              />
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