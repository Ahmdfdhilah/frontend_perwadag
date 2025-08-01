import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import { useFormPermissions } from '@/hooks/useFormPermissions';
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
import { Skeleton } from '@workspace/ui/components/skeleton';
import { ArrowLeft, Save, Calculator, Edit } from 'lucide-react';
import { formatNumber, handleNumberInput, parseFormattedNumber } from '@/utils/numberUtils';
import {
  calculateTrendChoice,
  calculateBudgetChoice,
  calculateExportTrendChoice,
  calculateAuditValue,
  calculateTradeAgreementValue,
  calculateExportRankingChoice,
  calculateIKChoice,
  calculateTEIChoice,
  calculateTotalRisk
} from '@/utils/riskCalculationUtils';
import { penilaianRisikoService } from '@/services/penilaianRisiko';
import { PenilaianRisiko, KriteriaData } from '@/services/penilaianRisiko/types';
import { useToast } from '@workspace/ui/components/sonner';
import { AUDIT_CHOICES, TRADE_AGREEMENT_CHOICES } from '@/lib/constants';
import { riskAssessmentStateManager } from '@/utils/urlStateUtils';

type PageMode = 'view' | 'edit';

interface RiskAssessmentPageProps {
  mode?: PageMode;
}

const RiskAssessmentSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-96" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      {/* Form Sections Skeleton */}
      <div className="grid grid-cols-1 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-80" />
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Form fields skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Final Result Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <Skeleton className="h-px w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons Skeleton */}
      <div className="flex justify-end gap-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
};

const RiskAssessmentPage: React.FC<RiskAssessmentPageProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole } = useRole();
  const { canEditForm } = useFormPermissions();
  const { toast } = useToast();
  
  // Determine mode from props or URL path
  const pageMode: PageMode = mode || (location.pathname.includes('/edit') ? 'edit' : 'view');
  const isEditMode = pageMode === 'edit';
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
  
  const handleEdit = () => {
    navigate(`/penilaian-resiko/${id}/edit`);
  };

  // Helper function to navigate back with preserved filters
  const navigateBack = riskAssessmentStateManager.createNavigateBack(navigate);

  // Load penilaian data from API
  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        navigateBack();
        return;
      }

      try {
        setIsLoading(true);

        const penilaianResponse = await penilaianRisikoService.getPenilaianRisikoById(id);
        setPenilaianData(penilaianResponse);

        // Initialize formatted values
        const kriteria = penilaianResponse.kriteria_data;
        setFormattedValues({
          budgetRealization2024: kriteria.realisasi_anggaran?.realisasi ? formatNumber(kriteria.realisasi_anggaran.realisasi) : '',
          budgetPagu2024: kriteria.realisasi_anggaran?.pagu ? formatNumber(kriteria.realisasi_anggaran.pagu) : '',
          teiRealizationValue: kriteria.realisasi_tei?.nilai_realisasi ? formatNumber(kriteria.realisasi_tei.nilai_realisasi) : '',
          teiPotentialValue: kriteria.realisasi_tei?.nilai_potensi ? formatNumber(kriteria.realisasi_tei.nilai_potensi) : '',
          ikNotAchieved: kriteria.persentase_ik?.ik_tidak_tercapai ? formatNumber(kriteria.persentase_ik.ik_tidak_tercapai) : '',
          ikTotal: kriteria.persentase_ik?.total_ik ? formatNumber(kriteria.persentase_ik.total_ik) : '',
        });
      } catch (error) {
        console.error('Error loading data:', error);
        navigateBack();
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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
      // If empty, set to null, otherwise parse the number
      const numericValue = formattedValue === '' ? null : parseFormattedNumber(formattedValue);
      handleInputChange(section, field, numericValue);
    });
  };

  // Auto-calculate trend values when input values change
  useEffect(() => {
    if (!penilaianData) return;

    const trenCapaian = penilaianData.kriteria_data.tren_capaian;
    const capaian1 = trenCapaian.capaian_tahun_1;
    const capaian2 = trenCapaian.capaian_tahun_2;

    // Reset values if either input is null or empty
    if (capaian1 === null || capaian1 === undefined || capaian2 === null || capaian2 === undefined) {
      setPenilaianData(prev => ({
        ...prev!,
        kriteria_data: {
          ...prev!.kriteria_data,
          tren_capaian: {
            ...prev!.kriteria_data.tren_capaian,
            tren: null,
            pilihan: null,
            nilai: null
          }
        }
      }));
      return;
    }

    // Calculate trend if capaian1 is greater than 0 (to avoid division by zero)
    if (capaian1 > 0) {
      const percentage = parseFloat((((capaian2 - capaian1) / capaian1) * 100).toFixed(2));
      const { pilihan, nilai } = calculateTrendChoice(percentage);
      
      setPenilaianData(prev => ({
        ...prev!,
        kriteria_data: {
          ...prev!.kriteria_data,
          tren_capaian: {
            ...prev!.kriteria_data.tren_capaian,
            tren: percentage,
            pilihan,
            nilai
          }
        }
      }));
    } else if (capaian1 === 0 && capaian2 === 0) {
      // Both values are 0, trend is 0%
      const { pilihan, nilai } = calculateTrendChoice(0);
      
      setPenilaianData(prev => ({
        ...prev!,
        kriteria_data: {
          ...prev!.kriteria_data,
          tren_capaian: {
            ...prev!.kriteria_data.tren_capaian,
            tren: 0,
            pilihan,
            nilai
          }
        }
      }));
    } else {
      // capaian1 is 0 but capaian2 is not, cannot calculate meaningful percentage
      setPenilaianData(prev => ({
        ...prev!,
        kriteria_data: {
          ...prev!.kriteria_data,
          tren_capaian: {
            ...prev!.kriteria_data.tren_capaian,
            tren: null,
            pilihan: null,
            nilai: null
          }
        }
      }));
    }
  }, [penilaianData?.kriteria_data.tren_capaian.capaian_tahun_1, penilaianData?.kriteria_data.tren_capaian.capaian_tahun_2]);


  // Auto-calculate budget values when input values change
  useEffect(() => {
    if (!penilaianData) return;

    const realisasiAnggaran = penilaianData.kriteria_data.realisasi_anggaran;
    const realisasi = realisasiAnggaran.realisasi;
    const pagu = realisasiAnggaran.pagu;

    // Reset values if either input is null or empty
    if (realisasi === null || realisasi === undefined || pagu === null || pagu === undefined) {
      setPenilaianData(prev => ({
        ...prev!,
        kriteria_data: {
          ...prev!.kriteria_data,
          realisasi_anggaran: {
            ...prev!.kriteria_data.realisasi_anggaran,
            persentase: null,
            pilihan: null,
            nilai: null
          }
        }
      }));
      return;
    }

    if (pagu > 0) {
      const percentage = parseFloat(((realisasi / pagu) * 100).toFixed(2));
      const { pilihan, nilai } = calculateBudgetChoice(percentage);
      
      setPenilaianData(prev => ({
        ...prev!,
        kriteria_data: {
          ...prev!.kriteria_data,
          realisasi_anggaran: {
            ...prev!.kriteria_data.realisasi_anggaran,
            persentase: percentage,
            pilihan,
            nilai
          }
        }
      }));
    } else {
      // Reset if pagu is 0 or negative
      setPenilaianData(prev => ({
        ...prev!,
        kriteria_data: {
          ...prev!.kriteria_data,
          realisasi_anggaran: {
            ...prev!.kriteria_data.realisasi_anggaran,
            persentase: null,
            pilihan: null,
            nilai: null
          }
        }
      }));
    }
  }, [penilaianData?.kriteria_data.realisasi_anggaran.realisasi, penilaianData?.kriteria_data.realisasi_anggaran.pagu]);


  // Auto-calculate export trend values when deskripsi changes
  useEffect(() => {
    if (!penilaianData) return;

    const trenEkspor = penilaianData.kriteria_data.tren_ekspor;
    const deskripsi = trenEkspor.deskripsi;

    if (deskripsi !== undefined && deskripsi !== null) {
      const { pilihan, nilai } = calculateExportTrendChoice(deskripsi);
      
      setPenilaianData(prev => ({
        ...prev!,
        kriteria_data: {
          ...prev!.kriteria_data,
          tren_ekspor: {
            ...prev!.kriteria_data.tren_ekspor,
            pilihan,
            nilai
          }
        }
      }));
    }
  }, [penilaianData?.kriteria_data.tren_ekspor.deskripsi]);

  // Auto-calculate audit nilai when pilihan changes
  useEffect(() => {
    if (!penilaianData) return;

    const auditItjen = penilaianData.kriteria_data.audit_itjen;
    const pilihan = auditItjen.pilihan;

    if (pilihan) {
      const nilai = calculateAuditValue(pilihan);
      
      setPenilaianData(prev => ({
        ...prev!,
        kriteria_data: {
          ...prev!.kriteria_data,
          audit_itjen: {
            ...prev!.kriteria_data.audit_itjen,
            nilai
          }
        }
      }));
    }
  }, [penilaianData?.kriteria_data.audit_itjen.pilihan]);

  // Auto-calculate trade agreement nilai when pilihan changes
  useEffect(() => {
    if (!penilaianData) return;

    const perjanjianPerdagangan = penilaianData.kriteria_data.perjanjian_perdagangan;
    const pilihan = perjanjianPerdagangan.pilihan;

    if (pilihan) {
      const nilai = calculateTradeAgreementValue(pilihan);
      
      setPenilaianData(prev => ({
        ...prev!,
        kriteria_data: {
          ...prev!.kriteria_data,
          perjanjian_perdagangan: {
            ...prev!.kriteria_data.perjanjian_perdagangan,
            nilai
          }
        }
      }));
    }
  }, [penilaianData?.kriteria_data.perjanjian_perdagangan.pilihan]);

  // Auto-calculate export ranking values when deskripsi changes
  useEffect(() => {
    if (!penilaianData) return;

    const peringkatEkspor = penilaianData.kriteria_data.peringkat_ekspor;
    const deskripsi = peringkatEkspor.deskripsi;

    if (deskripsi !== undefined && deskripsi !== null) {
      const { pilihan, nilai } = calculateExportRankingChoice(deskripsi);
      
      setPenilaianData(prev => ({
        ...prev!,
        kriteria_data: {
          ...prev!.kriteria_data,
          peringkat_ekspor: {
            ...prev!.kriteria_data.peringkat_ekspor,
            pilihan,
            nilai
          }
        }
      }));
    }
  }, [penilaianData?.kriteria_data.peringkat_ekspor.deskripsi]);

  // Auto-calculate IK values when input values change
  useEffect(() => {
    if (!penilaianData) return;

    const persentaseIk = penilaianData.kriteria_data.persentase_ik;
    const ikTidakTercapai = persentaseIk.ik_tidak_tercapai;
    const totalIk = persentaseIk.total_ik;

    // Reset values if either input is null or empty
    if (ikTidakTercapai === null || ikTidakTercapai === undefined || totalIk === null || totalIk === undefined) {
      setPenilaianData(prev => ({
        ...prev!,
        kriteria_data: {
          ...prev!.kriteria_data,
          persentase_ik: {
            ...prev!.kriteria_data.persentase_ik,
            persentase: null,
            pilihan: null,
            nilai: null
          }
        }
      }));
      return;
    }

    if (totalIk > 0) {
      const percentage = parseFloat(((ikTidakTercapai / totalIk) * 100).toFixed(2));
      const { pilihan, nilai } = calculateIKChoice(percentage);
      
      setPenilaianData(prev => ({
        ...prev!,
        kriteria_data: {
          ...prev!.kriteria_data,
          persentase_ik: {
            ...prev!.kriteria_data.persentase_ik,
            persentase: percentage,
            pilihan,
            nilai
          }
        }
      }));
    } else {
      // Reset if totalIk is 0 or negative
      setPenilaianData(prev => ({
        ...prev!,
        kriteria_data: {
          ...prev!.kriteria_data,
          persentase_ik: {
            ...prev!.kriteria_data.persentase_ik,
            persentase: null,
            pilihan: null,
            nilai: null
          }
        }
      }));
    }
  }, [penilaianData?.kriteria_data.persentase_ik.ik_tidak_tercapai, penilaianData?.kriteria_data.persentase_ik.total_ik]);

  // Auto-calculate TEI values when input values change
  useEffect(() => {
    if (!penilaianData) return;

    const realisasiTei = penilaianData.kriteria_data.realisasi_tei;
    const nilaiRealisasi = realisasiTei.nilai_realisasi;
    const nilaiPotensi = realisasiTei.nilai_potensi;

    // Reset values if either input is null or empty
    if (nilaiRealisasi === null || nilaiRealisasi === undefined || nilaiPotensi === null || nilaiPotensi === undefined) {
      setPenilaianData(prev => ({
        ...prev!,
        kriteria_data: {
          ...prev!.kriteria_data,
          realisasi_tei: {
            ...prev!.kriteria_data.realisasi_tei,
            deskripsi: null,
            pilihan: null,
            nilai: null
          }
        }
      }));
      return;
    }

    let percentage = 0;
    let isZeroDivision = false;

    if (nilaiPotensi > 0) {
      percentage = parseFloat(((nilaiRealisasi / nilaiPotensi) * 100).toFixed(2));
    } else if (nilaiRealisasi === 0 && nilaiPotensi === 0) {
      isZeroDivision = true;
    }

    const { pilihan, nilai } = calculateTEIChoice(percentage, isZeroDivision);

    setPenilaianData(prev => ({
      ...prev!,
      kriteria_data: {
        ...prev!.kriteria_data,
        realisasi_tei: {
          ...prev!.kriteria_data.realisasi_tei,
          deskripsi: percentage,
          pilihan,
          nilai
        }
      }
    }));
  }, [penilaianData?.kriteria_data.realisasi_tei.nilai_realisasi, penilaianData?.kriteria_data.realisasi_tei.nilai_potensi]);

  // Auto-calculate total risk when any nilai changes
  useEffect(() => {
    if (!penilaianData) return;

    const kriteria = penilaianData.kriteria_data;
    const totalRisk = calculateTotalRisk(
      kriteria.tren_capaian.nilai,
      kriteria.realisasi_anggaran.nilai,
      kriteria.tren_ekspor.nilai,
      kriteria.audit_itjen.nilai,
      kriteria.perjanjian_perdagangan.nilai,
      kriteria.peringkat_ekspor.nilai,
      kriteria.persentase_ik.nilai,
      kriteria.realisasi_tei.nilai
    );

    setPenilaianData(prev => ({
      ...prev!,
      total_nilai_risiko: totalRisk
    }));
  }, [
    penilaianData?.kriteria_data.tren_capaian.nilai,
    penilaianData?.kriteria_data.realisasi_anggaran.nilai,
    penilaianData?.kriteria_data.tren_ekspor.nilai,
    penilaianData?.kriteria_data.audit_itjen.nilai,
    penilaianData?.kriteria_data.perjanjian_perdagangan.nilai,
    penilaianData?.kriteria_data.peringkat_ekspor.nilai,
    penilaianData?.kriteria_data.persentase_ik.nilai,
    penilaianData?.kriteria_data.realisasi_tei.nilai
  ]);


  const triggerCalculation = () => {
    // Force re-calculation by updating a state that triggers all useEffects
    // This will recalculate all values based on current inputs
    if (!penilaianData) return;
    
    const kriteria = penilaianData.kriteria_data;
    
    // Check if any required data is missing
    const missingData = [];
    
    if (kriteria.tren_capaian.nilai === null || kriteria.tren_capaian.nilai === undefined) {
      missingData.push('Tren Capaian');
    }
    if (kriteria.realisasi_anggaran.nilai === null || kriteria.realisasi_anggaran.nilai === undefined) {
      missingData.push('Realisasi Anggaran');
    }
    if (kriteria.tren_ekspor.nilai === null || kriteria.tren_ekspor.nilai === undefined) {
      missingData.push('Tren Ekspor');
    }
    if (kriteria.audit_itjen.nilai === null || kriteria.audit_itjen.nilai === undefined) {
      missingData.push('Audit Itjen');
    }
    if (kriteria.perjanjian_perdagangan.nilai === null || kriteria.perjanjian_perdagangan.nilai === undefined) {
      missingData.push('Perjanjian Perdagangan');
    }
    if (kriteria.peringkat_ekspor.nilai === null || kriteria.peringkat_ekspor.nilai === undefined) {
      missingData.push('Peringkat Ekspor');
    }
    if (kriteria.persentase_ik.nilai === null || kriteria.persentase_ik.nilai === undefined) {
      missingData.push('Persentase IK');
    }
    if (kriteria.realisasi_tei.nilai === null || kriteria.realisasi_tei.nilai === undefined) {
      missingData.push('Realisasi TEI');
    }
    
    if (missingData.length > 0) {
      toast({
        title: 'Data Belum Lengkap',
        description: `Mohon lengkapi data berikut: ${missingData.join(', ')}`,
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'Berhasil',
      description: 'Nilai risiko berhasil dihitung ulang',
      variant: 'default'
    });
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
    } catch (error) {
      console.error('Error saving assessment:', error);
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
    return <RiskAssessmentSkeleton />;
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
        title={`${isEditMode ? 'Input' : 'Detail'} Penilaian Risiko - ${penilaianData.nama_perwadag}`}
        description={`Tahun ${penilaianData.tahun}${!isEditMode ? ` | Total Risiko: ${penilaianData.total_nilai_risiko !== null && penilaianData.total_nilai_risiko !== undefined ? Number(penilaianData.total_nilai_risiko).toFixed(2) : '-'}` : ''}`}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={navigateBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar
            </Button>
            {!isEditMode && canEditRecord() && (
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

      {/* Form Sections */}
      <div className="grid grid-cols-1  gap-6">

        {/* Section 1: Tren Capaian */}
        <Card>
          <CardHeader>
            <CardTitle>1. Tren Capaian Tahun {penilaianData.kriteria_data.tren_capaian.tahun_pembanding_2} vs {penilaianData.kriteria_data.tren_capaian.tahun_pembanding_1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Capaian {penilaianData.kriteria_data.tren_capaian.tahun_pembanding_1} (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={penilaianData.kriteria_data.tren_capaian.capaian_tahun_1 ?? ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? null : parseFloat(parseFloat(e.target.value).toFixed(2)) || null;
                    handleInputChange('tren_capaian', 'capaian_tahun_1', value);
                  }}
                  placeholder="Contoh: 85.5"
                  readOnly={!isEditMode}
                  className={!isEditMode ? 'bg-muted' : ''}
                />
              </div>
              <div>
                <Label>Capaian {penilaianData.kriteria_data.tren_capaian.tahun_pembanding_2} (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={penilaianData.kriteria_data.tren_capaian.capaian_tahun_2 ?? ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? null : parseFloat(parseFloat(e.target.value).toFixed(2)) || null;
                    handleInputChange('tren_capaian', 'capaian_tahun_2', value);
                  }}
                  placeholder="Contoh: 90.2"
                  readOnly={!isEditMode}
                  className={!isEditMode ? 'bg-muted' : ''}
                />
              </div>
            </div>
            <div>
              <Label>Tren Capaian (%) - Otomatis</Label>
              <Input
                type="number"
                step="0.01"
                value={penilaianData.kriteria_data.tren_capaian.tren !== null && penilaianData.kriteria_data.tren_capaian.tren !== undefined ? parseFloat(penilaianData.kriteria_data.tren_capaian.tren.toString()).toFixed(2) : ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Pilihan Kategori - Otomatis</Label>
              <Input
                value={penilaianData.kriteria_data.tren_capaian.pilihan || 'Belum dihitung'}
                disabled
                className="bg-muted"
                placeholder="Otomatis setelah input data"
              />
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={penilaianData.kriteria_data.tren_capaian.nilai ?? ''}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Realisasi Anggaran */}
        <Card>
          <CardHeader>
            <CardTitle>2. Persentase Realisasi Anggaran {penilaianData.kriteria_data.realisasi_anggaran.tahun_pembanding}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Realisasi {penilaianData.kriteria_data.realisasi_anggaran.tahun_pembanding} (Rp)</Label>
              <Input
                type="text"
                value={formattedValues.budgetRealization2024}
                onChange={(e) => handleNumberInputChange('realisasi_anggaran', 'realisasi', 'budgetRealization2024', e.target.value)}
                placeholder="Contoh: 15,000,000,000"
                readOnly={!isEditMode}
                className={!isEditMode ? 'bg-muted' : ''}
              />
            </div>
            <div>
              <Label>Pagu {penilaianData.kriteria_data.realisasi_anggaran.tahun_pembanding} (Rp)</Label>
              <Input
                type="text"
                value={formattedValues.budgetPagu2024}
                onChange={(e) => handleNumberInputChange('realisasi_anggaran', 'pagu', 'budgetPagu2024', e.target.value)}
                placeholder="Contoh: 20,000,000,000"
                readOnly={!isEditMode}
                className={!isEditMode ? 'bg-muted' : ''}
              />
            </div>
            <div>
              <Label>Persentase Realisasi (%) - Otomatis</Label>
              <Input
                type="number"
                step="0.1"
                value={penilaianData.kriteria_data.realisasi_anggaran.persentase !== null && penilaianData.kriteria_data.realisasi_anggaran.persentase !== undefined ? parseFloat(penilaianData.kriteria_data.realisasi_anggaran.persentase.toString()).toFixed(2) : ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Pilihan Kategori - Otomatis</Label>
              <Input
                value={penilaianData.kriteria_data.realisasi_anggaran.pilihan || 'Belum dihitung'}
                disabled
                className="bg-muted"
                placeholder="Otomatis setelah input data"
              />
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={penilaianData.kriteria_data.realisasi_anggaran.nilai ?? ''}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Tren Nilai Ekspor */}
        <Card>
          <CardHeader>
            <CardTitle>3. Tren Nilai Ekspor ke Negara Akreditasi (Tahun {penilaianData.kriteria_data.tren_ekspor.tahun_pembanding})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Deskripsi Tren (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={penilaianData.kriteria_data.tren_ekspor.deskripsi ?? ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? null : parseFloat(parseFloat(e.target.value).toFixed(2)) || null;
                  handleInputChange('tren_ekspor', 'deskripsi', value);
                }}
                placeholder="Contoh: 4.71"
                readOnly={!isEditMode}
                className={!isEditMode ? 'bg-muted' : ''}
              />
            </div>
            <div>
              <Label>Pilihan Kategori - Otomatis</Label>
              <Input
                value={penilaianData.kriteria_data.tren_ekspor.pilihan || 'Belum dihitung'}
                disabled
                className="bg-muted"
                placeholder="Otomatis setelah input data"
              />
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={penilaianData.kriteria_data.tren_ekspor.nilai ?? ''}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Pelaksanaan Audit Itjen */}
        <Card>
          <CardHeader>
            <CardTitle>4. Pelaksanaan Audit Itjen (Tahun {penilaianData.kriteria_data.audit_itjen.tahun_pembanding})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Status Audit</Label>
              {isEditMode ? (
                <Select
                  value={penilaianData.kriteria_data.audit_itjen.pilihan || ''}
                  onValueChange={(value) => handleInputChange('audit_itjen', 'pilihan', value)}
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
              ) : (
                <Input
                  value={penilaianData.kriteria_data.audit_itjen.pilihan || ''}
                  readOnly
                  className="bg-muted"
                />
              )}
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={penilaianData.kriteria_data.audit_itjen.nilai ?? ''}
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
              {isEditMode ? (
                <Select
                  value={penilaianData.kriteria_data.perjanjian_perdagangan.pilihan || ''}
                  onValueChange={(value) => handleInputChange('perjanjian_perdagangan', 'pilihan', value)}
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
              ) : (
                <Input
                  value={penilaianData.kriteria_data.perjanjian_perdagangan.pilihan || ''}
                  readOnly
                  className="bg-muted"
                />
              )}
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={penilaianData.kriteria_data.perjanjian_perdagangan.nilai ?? ''}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Peringkat Nilai Ekspor */}
        <Card>
          <CardHeader>
            <CardTitle>6. Peringkat Nilai Ekspor Non Migas Tahun {penilaianData.kriteria_data.peringkat_ekspor.tahun_pembanding}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Peringkat</Label>
              <Input
                type="number"
                value={penilaianData.kriteria_data.peringkat_ekspor.deskripsi ?? ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? null : parseFloat(parseFloat(e.target.value).toFixed(2)) || null;
                  handleInputChange('peringkat_ekspor', 'deskripsi', value);
                }}
                placeholder="Contoh: 27"
                readOnly={!isEditMode}
                className={!isEditMode ? 'bg-muted' : ''}
              />
            </div>
            <div>
              <Label>Pilihan Kategori - Otomatis</Label>
              <Input
                value={penilaianData.kriteria_data.peringkat_ekspor.pilihan || 'Belum dihitung'}
                disabled
                className="bg-muted"
                placeholder="Otomatis setelah input data"
              />
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={penilaianData.kriteria_data.peringkat_ekspor.nilai ?? ''}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 7: Persentase IK */}
        <Card>
          <CardHeader>
            <CardTitle>7. Persentase Jumlah IK yang Tidak Mencapai Target Tahun {penilaianData.kriteria_data.persentase_ik.tahun_pembanding}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>IK Tidak Tercapai</Label>
                <Input
                  type="text"
                  value={formattedValues.ikNotAchieved}
                  onChange={(e) => handleNumberInputChange('persentase_ik', 'ik_tidak_tercapai', 'ikNotAchieved', e.target.value)}
                  placeholder="Contoh: 5"
                  readOnly={!isEditMode}
                  className={!isEditMode ? 'bg-muted' : ''}
                />
              </div>
              <div>
                <Label>Total IK</Label>
                <Input
                  type="text"
                  value={formattedValues.ikTotal}
                  onChange={(e) => handleNumberInputChange('persentase_ik', 'total_ik', 'ikTotal', e.target.value)}
                  placeholder="Contoh: 25"
                  readOnly={!isEditMode}
                  className={!isEditMode ? 'bg-muted' : ''}
                />
              </div>
            </div>
            <div>
              <Label>Persentase IK Tidak Tercapai (%) - Otomatis</Label>
              <Input
                type="number"
                step="0.1"
                value={penilaianData.kriteria_data.persentase_ik.persentase !== null && penilaianData.kriteria_data.persentase_ik.persentase !== undefined ? parseFloat(penilaianData.kriteria_data.persentase_ik.persentase.toString()).toFixed(2) : ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Pilihan Kategori - Otomatis</Label>
              <Input
                value={penilaianData.kriteria_data.persentase_ik.pilihan || 'Belum dihitung'}
                disabled
                className="bg-muted"
                placeholder="Otomatis setelah input data"
              />
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={penilaianData.kriteria_data.persentase_ik.nilai ?? ''}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 8: Nilai Transaksi TEI */}
        <Card>
          <CardHeader>
            <CardTitle>8. Persentase Realisasi Nilai Transaksi TEI {penilaianData.kriteria_data.realisasi_tei.tahun_pembanding}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nilai Realisasi (Rp)</Label>
                <Input
                  type="text"
                  value={formattedValues.teiRealizationValue}
                  onChange={(e) => handleNumberInputChange('realisasi_tei', 'nilai_realisasi', 'teiRealizationValue', e.target.value)}
                  placeholder="Contoh: 1,500,000,000"
                  readOnly={!isEditMode}
                  className={!isEditMode ? 'bg-muted' : ''}
                />
              </div>
              <div>
                <Label>Nilai Potensi (Rp)</Label>
                <Input
                  type="text"
                  value={formattedValues.teiPotentialValue}
                  onChange={(e) => handleNumberInputChange('realisasi_tei', 'nilai_potensi', 'teiPotentialValue', e.target.value)}
                  placeholder="Contoh: 2,000,000,000"
                  readOnly={!isEditMode}
                  className={!isEditMode ? 'bg-muted' : ''}
                />
              </div>
            </div>
            <div>
              <Label>Deskripsi (%) - Otomatis</Label>
              <Input
                type="number"
                step="0.1"
                value={penilaianData.kriteria_data.realisasi_tei.deskripsi !== null && penilaianData.kriteria_data.realisasi_tei.deskripsi !== undefined ? parseFloat(penilaianData.kriteria_data.realisasi_tei.deskripsi.toString()).toFixed(2) : ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Pilihan Kategori - Otomatis</Label>
              <Input
                value={penilaianData.kriteria_data.realisasi_tei.pilihan || 'Belum dihitung'}
                disabled
                className="bg-muted"
                placeholder="Otomatis setelah input data"
              />
            </div>
            <div>
              <Label>Nilai</Label>
              <Input
                type="number"
                value={penilaianData.kriteria_data.realisasi_tei.nilai ?? ''}
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
            {isEditMode && (
              <Button
                type="button"
                variant="outline"
                onClick={triggerCalculation}
              >
                <Calculator className="mr-2 h-4 w-4" />
                Hitung Ulang Nilai Risiko
              </Button>
            )}
            <div className="flex items-center gap-2">
              <Label>Total Nilai Risiko:</Label>
              <Input
                type="number"
                step="0.01"
                value={penilaianData.total_nilai_risiko !== null && penilaianData.total_nilai_risiko !== undefined ? Number(penilaianData.total_nilai_risiko).toFixed(2) : ''}
                disabled
                className="w-32 bg-muted font-bold text-center"
                placeholder="-"
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
              readOnly={!isEditMode}
              className={!isEditMode ? 'bg-muted' : ''}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {isEditMode && (
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={navigateBack}
          >
            Kembali
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Menyimpan...' : 'Simpan Assessment'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RiskAssessmentPage;