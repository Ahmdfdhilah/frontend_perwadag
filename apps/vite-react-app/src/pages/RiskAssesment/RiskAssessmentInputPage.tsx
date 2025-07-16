import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import { ROLE_LABELS } from '@/lib/constants';
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
import { ArrowLeft, Save, Calculator, Loader2 } from 'lucide-react';
import {
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
import { penilaianRisikoService } from '@/services/penilaianRisiko';
import { PenilaianRisiko, KriteriaData } from '@/services/penilaianRisiko/types';
import { useToast } from '@workspace/ui/components/sonner';

const RiskAssessmentInputPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentRole } = useRole();
  const { toast } = useToast();
  const [penilaianData, setPenilaianData] = useState<PenilaianRisiko | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formattedValues, setFormattedValues] = useState({
    budgetRealization2024: '0',
    budgetPagu2024: '0',
    teiRealizationValue: '0',
    teiPotentialValue: '0',
    ikNotAchieved: '0',
    ikTotal: '0',
  });

  // Calculate role values once to avoid hooks being called conditionally
  const userIsAdmin = currentRole === 'ADMIN';
  const userIsInspektorat = currentRole === 'INSPEKTORAT';
  const hasAccess = userIsAdmin || userIsInspektorat;

  // Load penilaian data from API
  useEffect(() => {
    const loadPenilaianData = async () => {
      if (!id) {
        navigate('/penilaian-resiko');
        return;
      }

      try {
        setIsLoading(true);
        const response = await penilaianRisikoService.getPenilaianRisikoById(id);
        setPenilaianData(response);
        
        // Initialize formatted values
        const kriteria = response.kriteria_data;
        setFormattedValues({
          budgetRealization2024: formatNumber(kriteria.realisasi_anggaran?.realisasi || 0),
          budgetPagu2024: formatNumber(kriteria.realisasi_anggaran?.pagu || 0),
          teiRealizationValue: formatNumber(kriteria.realisasi_tei?.nilai_realisasi || 0),
          teiPotentialValue: formatNumber(kriteria.realisasi_tei?.nilai_potensi || 0),
          ikNotAchieved: formatNumber(kriteria.persentase_ik?.ik_tidak_tercapai || 0),
          ikTotal: formatNumber(kriteria.persentase_ik?.total_ik || 0),
        });
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

    loadPenilaianData();
  }, [id, navigate]);

  const handleInputChange = (section: keyof KriteriaData, field: string, value: any) => {
    if (!penilaianData) return;
    
    setPenilaianData(prev => ({
      ...prev!,
      kriteria_data: {
        ...prev!.kriteria_data,
        [section]: {
          ...prev!.kriteria_data[section],
          [field]: value
        }
      }
    }));
  };

  const handleNumberInputChange = (section: keyof KriteriaData, field: string, displayField: string, value: string) => {
    handleNumberInput(value, (formattedValue) => {
      setFormattedValues(prev => ({
        ...prev,
        [displayField]: formattedValue
      }));
      handleInputChange(section, field, parseFormattedNumber(formattedValue));
    });
  };

  // Auto-calculate category selections based on values
  useEffect(() => {
    if (!penilaianData) return;
    
    // Auto-calculate trend percentage based on achievement values
    const trenCapaian = penilaianData.kriteria_data.tren_capaian;
    const capaian1 = trenCapaian.capaian_tahun_1 || 0;
    const capaian2 = trenCapaian.capaian_tahun_2 || 0;
    
    if (capaian1 > 0) {
      const percentage = ((capaian2 - capaian1) / capaian1) * 100;
      handleInputChange('tren_capaian', 'tren', percentage);
    }
  }, [penilaianData?.kriteria_data.tren_capaian.capaian_tahun_1, penilaianData?.kriteria_data.tren_capaian.capaian_tahun_2]);

  useEffect(() => {
    if (!penilaianData) return;
    
    // Auto-calculate trend category based on trendAchievement - Updated rules
    const trendPercentage = penilaianData.kriteria_data.tren_capaian.tren || 0;
    let trendChoice = '';
    if (trendPercentage >= 41) trendChoice = 'Naik >=41%';
    else if (trendPercentage >= 21 && trendPercentage <= 40) trendChoice = 'Naik 21% - 40%';
    else if (trendPercentage >= 0 && trendPercentage <= 20) trendChoice = 'Naik 0% - 20%';
    else if (trendPercentage < 0 && trendPercentage > -25) trendChoice = 'Turun < 25%';
    else if (trendPercentage <= -25) trendChoice = 'Turun >= 25%';
    
    if (trendChoice) {
      const choice = TREND_CHOICES.find(c => c.label === trendChoice);
      if (choice) {
        handleInputChange('tren_capaian', 'pilihan', trendChoice);
        handleInputChange('tren_capaian', 'nilai', choice.score);
      }
    }
  }, [penilaianData?.kriteria_data.tren_capaian.tren]);

  useEffect(() => {
    if (!penilaianData) return;
    
    // Auto-calculate budget percentage based on realization and pagu values
    const realisasiAnggaran = penilaianData.kriteria_data.realisasi_anggaran;
    const realisasi = realisasiAnggaran.realisasi || 0;
    const pagu = realisasiAnggaran.pagu || 0;
    
    if (pagu > 0) {
      const percentage = (realisasi / pagu) * 100;
      handleInputChange('realisasi_anggaran', 'persentase', percentage);
    }
  }, [penilaianData?.kriteria_data.realisasi_anggaran.realisasi, penilaianData?.kriteria_data.realisasi_anggaran.pagu]);

  useEffect(() => {
    if (!penilaianData) return;
    
    // Auto-calculate budget category based on budgetPercentage - Updated rules
    const percentage = penilaianData.kriteria_data.realisasi_anggaran.persentase || 0;
    let budgetChoice = '';
    if (percentage > 98) budgetChoice = '> 98%';
    else if (percentage >= 95 && percentage <= 97) budgetChoice = '95% - 97%';
    else if (percentage >= 90 && percentage <= 94) budgetChoice = '90% - 94%';
    else if (percentage >= 85 && percentage <= 89) budgetChoice = '85% - 89%';
    else if (percentage < 85) budgetChoice = '<85%';
    
    if (budgetChoice) {
      const choice = BUDGET_CHOICES.find(c => c.label === budgetChoice);
      if (choice) {
        handleInputChange('realisasi_anggaran', 'pilihan', budgetChoice);
        handleInputChange('realisasi_anggaran', 'nilai', choice.score);
      }
    }
  }, [penilaianData?.kriteria_data.realisasi_anggaran.persentase]);

  useEffect(() => {
    if (!penilaianData) return;
    
    // Auto-calculate IK percentage based on not achieved and total values
    const persentaseIk = penilaianData.kriteria_data.persentase_ik;
    const ikTidakTercapai = persentaseIk.ik_tidak_tercapai || 0;
    const totalIk = persentaseIk.total_ik || 0;
    
    if (totalIk > 0) {
      const percentage = (ikTidakTercapai / totalIk) * 100;
      handleInputChange('persentase_ik', 'persentase', percentage);
    }
  }, [penilaianData?.kriteria_data.persentase_ik.ik_tidak_tercapai, penilaianData?.kriteria_data.persentase_ik.total_ik]);

  useEffect(() => {
    if (!penilaianData) return;
    
    // Auto-calculate IK category based on ikPercentage - Updated rules
    const percentage = penilaianData.kriteria_data.persentase_ik.persentase || 0;
    let ikChoice = '';
    if (percentage < 5) ikChoice = '< 5%';
    else if (percentage >= 6 && percentage <= 10) ikChoice = '6% - 10%';
    else if (percentage >= 11 && percentage <= 15) ikChoice = '11% - 15%';
    else if (percentage >= 16 && percentage <= 20) ikChoice = '16% - 20%';
    else if (percentage > 20) ikChoice = '> 20%';
    
    if (ikChoice) {
      const choice = IK_CHOICES.find(c => c.label === ikChoice);
      if (choice) {
        handleInputChange('persentase_ik', 'pilihan', ikChoice);
        handleInputChange('persentase_ik', 'nilai', choice.score);
      }
    }
  }, [penilaianData?.kriteria_data.persentase_ik.persentase]);

  useEffect(() => {
    if (!penilaianData) return;
    
    // Auto-calculate TEI percentage based on realization and potential values
    const realisasiTei = penilaianData.kriteria_data.realisasi_tei;
    const nilaiRealisasi = realisasiTei.nilai_realisasi || 0;
    const nilaiPotensi = realisasiTei.nilai_potensi || 0;
    
    if (nilaiPotensi > 0) {
      const percentage = (nilaiRealisasi / nilaiPotensi) * 100;
      handleInputChange('realisasi_tei', 'deskripsi', percentage);
    } else if (nilaiRealisasi === 0 && nilaiPotensi === 0) {
      handleInputChange('realisasi_tei', 'deskripsi', 0);
    }
  }, [penilaianData?.kriteria_data.realisasi_tei.nilai_realisasi, penilaianData?.kriteria_data.realisasi_tei.nilai_potensi]);

  useEffect(() => {
    if (!penilaianData) return;
    
    // Auto-calculate TEI category based on teiPercentage - Updated rules
    const percentage = penilaianData.kriteria_data.realisasi_tei.deskripsi || 0;
    let teiChoice = '';
    if (percentage === 0) teiChoice = 'Belum Ada Realisasi';
    else if (percentage > 70) teiChoice = '> 70%';
    else if (percentage >= 50 && percentage <= 70) teiChoice = '50% - 70%';
    else if (percentage >= 25 && percentage <= 49) teiChoice = '25% - 49%';
    else if (percentage < 25) teiChoice = '< 25%';
    
    if (teiChoice) {
      const choice = TEI_CHOICES.find(c => c.label === teiChoice);
      if (choice) {
        handleInputChange('realisasi_tei', 'pilihan', teiChoice);
        handleInputChange('realisasi_tei', 'nilai', choice.score);
      }
    }
  }, [penilaianData?.kriteria_data.realisasi_tei.deskripsi]);

  // Auto-calculate export trend category based on description percentage
  useEffect(() => {
    if (!penilaianData) return;
    
    const trenEkspor = penilaianData.kriteria_data.tren_ekspor;
    const deskripsi = trenEkspor.deskripsi;
    
    if (deskripsi) {
      const percentage = deskripsi;
      let exportChoice = '';
      if (percentage >= 35) exportChoice = 'Naik >= 35 %';
      else if (percentage >= 20 && percentage <= 34) exportChoice = 'Naik 20% - 34%';
      else if (percentage >= 0 && percentage <= 19) exportChoice = 'Naik 0% - 19%';
      else if (percentage < 0 && percentage > -25) exportChoice = 'Turun < 25%';
      else if (percentage <= -25) exportChoice = 'Turun >= 25%';
      
      if (exportChoice) {
        const choice = EXPORT_TREND_CHOICES.find(c => c.label === exportChoice);
        if (choice) {
          handleInputChange('tren_ekspor', 'pilihan', exportChoice);
          handleInputChange('tren_ekspor', 'nilai', choice.score);
        }
      }
    }
  }, [penilaianData?.kriteria_data.tren_ekspor.deskripsi]);

  // Auto-calculate export ranking category based on ranking number
  useEffect(() => {
    if (!penilaianData) return;
    
    const peringkatEkspor = penilaianData.kriteria_data.peringkat_ekspor;
    const deskripsi = peringkatEkspor.deskripsi;
    
    if (deskripsi) {
      const ranking = deskripsi;
      let exportRankingChoice = '';
      if (ranking >= 1 && ranking <= 6) exportRankingChoice = 'Peringkat 1 - 6';
      else if (ranking >= 7 && ranking <= 12) exportRankingChoice = 'Peringkat 7 - 12';
      else if (ranking >= 13 && ranking <= 18) exportRankingChoice = 'Peringkat 13 - 18';
      else if (ranking >= 19 && ranking <= 23) exportRankingChoice = 'Peringkat 19 - 23';
      else if (ranking > 23) exportRankingChoice = 'Peringkat diatas 23';
      
      if (exportRankingChoice) {
        const choice = EXPORT_RANKING_CHOICES.find(c => c.label === exportRankingChoice);
        if (choice) {
          handleInputChange('peringkat_ekspor', 'pilihan', exportRankingChoice);
          handleInputChange('peringkat_ekspor', 'nilai', choice.score);
        }
      }
    }
  }, [penilaianData?.kriteria_data.peringkat_ekspor.deskripsi]);

  // Auto-calculate audit category based on audit description
  useEffect(() => {
    if (!penilaianData) return;
    
    const auditItjen = penilaianData.kriteria_data.audit_itjen;
    const deskripsi = auditItjen.deskripsi;
    
    if (deskripsi) {
      const choice = AUDIT_CHOICES.find(c => c.label === deskripsi);
      if (choice) {
        handleInputChange('audit_itjen', 'pilihan', deskripsi);
        handleInputChange('audit_itjen', 'nilai', choice.score);
      }
    }
  }, [penilaianData?.kriteria_data.audit_itjen.deskripsi]);

  // Auto-calculate trade agreement category based on trade agreement description
  useEffect(() => {
    if (!penilaianData) return;
    
    const perjanjianPerdagangan = penilaianData.kriteria_data.perjanjian_perdagangan;
    const deskripsi = perjanjianPerdagangan.deskripsi;
    
    if (deskripsi) {
      const choice = TRADE_AGREEMENT_CHOICES.find(c => c.label === deskripsi);
      if (choice) {
        handleInputChange('perjanjian_perdagangan', 'pilihan', deskripsi);
        handleInputChange('perjanjian_perdagangan', 'nilai', choice.score);
      }
    }
  }, [penilaianData?.kriteria_data.perjanjian_perdagangan.deskripsi]);

  const calculateTotalRisk = () => {
    if (!penilaianData) return;
    
    const kriteria = penilaianData.kriteria_data;
    const totalValue =
      (kriteria.tren_capaian.nilai || 0) +
      (kriteria.realisasi_anggaran.nilai || 0) +
      (kriteria.tren_ekspor.nilai || 0) +
      (kriteria.audit_itjen.nilai || 0) +
      (kriteria.perjanjian_perdagangan.nilai || 0) +
      (kriteria.peringkat_ekspor.nilai || 0) +
      (kriteria.persentase_ik.nilai || 0) +
      (kriteria.realisasi_tei.nilai || 0);

    setPenilaianData(prev => ({
      ...prev!,
      total_nilai_risiko: totalValue
    }));
  };

  const handleSave = async () => {
    if (!penilaianData) return;
    
    setIsSaving(true);
    try {
      const updateData = {
        kriteria_data: penilaianData.kriteria_data,
        catatan: penilaianData.catatan,
        auto_calculate: true
      };
      
      const response = await penilaianRisikoService.updatePenilaianRisiko(penilaianData.id, updateData);
      setPenilaianData(response);
      
      toast({
        title: 'Berhasil',
        description: 'Data penilaian risiko berhasil disimpan',
        variant: 'default'
      });
      navigate('/penilaian-resiko');
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan data penilaian risiko',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
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
        title={`Input Penilaian Risiko - ${penilaianData.nama_perwadag}`}
        description={`Tahun ${penilaianData.tahun} | Role: ${ROLE_LABELS[currentRole as keyof typeof ROLE_LABELS]}`}
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
                  value={penilaianData.kriteria_data.tren_capaian.capaian_tahun_1 || ''}
                  onChange={(e) => handleInputChange('tren_capaian', 'capaian_tahun_1', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Capaian 2024 (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={penilaianData.kriteria_data.tren_capaian.capaian_tahun_2 || ''}
                  onChange={(e) => handleInputChange('tren_capaian', 'capaian_tahun_2', parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div>
              <Label>Tren Capaian (%) - Otomatis</Label>
              <Input
                type="number"
                step="0.01"
                value={penilaianData.kriteria_data.tren_capaian.tren || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Pilihan Kategori (Otomatis)</Label>
              <Input
                value={penilaianData.kriteria_data.tren_capaian.pilihan || 'Kategori akan dipilih otomatis'}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={penilaianData.kriteria_data.tren_capaian.nilai || ''}
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
                onChange={(e) => handleNumberInputChange('realisasi_anggaran', 'realisasi', 'budgetRealization2024', e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Pagu 2024 (Rp)</Label>
              <Input
                type="text"
                value={formattedValues.budgetPagu2024}
                onChange={(e) => handleNumberInputChange('realisasi_anggaran', 'pagu', 'budgetPagu2024', e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Persentase Realisasi (%) - Otomatis</Label>
              <Input
                type="number"
                step="0.1"
                value={penilaianData.kriteria_data.realisasi_anggaran.persentase || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Pilihan Kategori (Otomatis)</Label>
              <Input
                value={penilaianData.kriteria_data.realisasi_anggaran.pilihan || 'Kategori akan dipilih otomatis'}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={penilaianData.kriteria_data.realisasi_anggaran.nilai || ''}
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
                type="number"
                step="0.01"
                value={penilaianData.kriteria_data.tren_ekspor.deskripsi || ''}
                onChange={(e) => handleInputChange('tren_ekspor', 'deskripsi', parseFloat(e.target.value))}
                placeholder="Contoh: 4.71"
              />
            </div>
            <div>
              <Label>Pilihan Kategori (Otomatis)</Label>
              <Input
                value={penilaianData.kriteria_data.tren_ekspor.pilihan || 'Kategori akan dipilih otomatis'}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={penilaianData.kriteria_data.tren_ekspor.nilai || ''}
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
                value={penilaianData.kriteria_data.audit_itjen.deskripsi || ''}
                onValueChange={(value) => handleInputChange('audit_itjen', 'deskripsi', value)}
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
                value={penilaianData.kriteria_data.audit_itjen.pilihan || 'Kategori akan dipilih otomatis'}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={penilaianData.kriteria_data.audit_itjen.nilai || ''}
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
                value={penilaianData.kriteria_data.perjanjian_perdagangan.deskripsi || ''}
                onValueChange={(value) => handleInputChange('perjanjian_perdagangan', 'deskripsi', value)}
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
                value={penilaianData.kriteria_data.perjanjian_perdagangan.pilihan || 'Kategori akan dipilih otomatis'}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={penilaianData.kriteria_data.perjanjian_perdagangan.nilai || ''}
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
                value={penilaianData.kriteria_data.peringkat_ekspor.deskripsi || ''}
                onChange={(e) => handleInputChange('peringkat_ekspor', 'deskripsi', parseFloat(e.target.value))}
                placeholder="Contoh: 27"
              />
            </div>
            <div>
              <Label>Pilihan Kategori (Otomatis)</Label>
              <Input
                value={penilaianData.kriteria_data.peringkat_ekspor.pilihan || 'Kategori akan dipilih otomatis'}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={penilaianData.kriteria_data.peringkat_ekspor.nilai || ''}
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
                  onChange={(e) => handleNumberInputChange('persentase_ik', 'ik_tidak_tercapai', 'ikNotAchieved', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Total IK</Label>
                <Input
                  type="text"
                  value={formattedValues.ikTotal}
                  onChange={(e) => handleNumberInputChange('persentase_ik', 'total_ik', 'ikTotal', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label>Persentase IK Tidak Tercapai (%) - Otomatis</Label>
              <Input
                type="number"
                step="0.1"
                value={penilaianData.kriteria_data.persentase_ik.persentase || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Pilihan Kategori (Otomatis)</Label>
              <Input
                value={penilaianData.kriteria_data.persentase_ik.pilihan || 'Kategori akan dipilih otomatis'}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={penilaianData.kriteria_data.persentase_ik.nilai || ''}
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
                  onChange={(e) => handleNumberInputChange('realisasi_tei', 'nilai_realisasi', 'teiRealizationValue', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Nilai Potensi (Rp)</Label>
                <Input
                  type="text"
                  value={formattedValues.teiPotentialValue}
                  onChange={(e) => handleNumberInputChange('realisasi_tei', 'nilai_potensi', 'teiPotentialValue', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Input
                value={''}
                onChange={() => {}}
                placeholder="Deskripsi TEI (informasi saja)"
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Persentase Realisasi TEI (%) - Otomatis</Label>
              <Input
                type="number"
                step="0.1"
                value={penilaianData.kriteria_data.realisasi_tei.deskripsi || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Pilihan Kategori (Otomatis)</Label>
              <Input
                value={penilaianData.kriteria_data.realisasi_tei.pilihan || 'Kategori akan dipilih otomatis'}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={penilaianData.kriteria_data.realisasi_tei.nilai || ''}
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
                value={penilaianData.total_nilai_risiko || ''}
                disabled
                className="w-24 bg-muted font-bold"
              />
            </div>
          </div>
          <Separator />
          <div>
            <Label>Keterangan / Catatan</Label>
            <Textarea
              value={penilaianData.catatan || ''}
              onChange={(e) => setPenilaianData(prev => ({ ...prev!, catatan: e.target.value }))}
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
          disabled={isSaving}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Menyimpan...' : 'Simpan Assessment'}
        </Button>
      </div>
    </div>
  );
};

export default RiskAssessmentInputPage;