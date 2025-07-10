export interface RiskAssessmentDetail {
  id: string;
  year: number;
  perwadagName: string;
  inspektorat: number;
  
  // Section 1: Tren Capaian
  achievement2023: number;
  achievement2024: number;
  trendAchievement: number;
  trendChoice: string;
  trendValue: number;
  
  // Section 2: Realisasi Anggaran
  budgetRealization2024: number;
  budgetPagu2024: number;
  budgetPercentage: number;
  budgetChoice: string;
  budgetValue: number;
  
  // Section 3: Tren Nilai Ekspor
  exportTrendDescription: string;
  exportChoice: string;
  exportValue: number;
  
  // Section 4: Audit Itjen
  auditDescription: string;
  auditChoice: string;
  auditValue: number;
  
  // Section 5: Perjanjian Perdagangan
  tradeAgreementDescription: string;
  tradeAgreementChoice: string;
  tradeAgreementValue: number;
  
  // Section 6: Peringkat Nilai Ekspor
  exportRankingDescription: string;
  exportRankingChoice: string;
  exportRankingValue: number;
  
  // Section 7: IK Target
  ikNotAchieved: number;
  ikTotal: number;
  ikPercentage: number;
  ikChoice: string;
  ikValue: number;
  
  // Section 8: Nilai Transaksi TEI
  teiRealizationValue: number;
  teiPotentialValue: number;
  teiPercentage: number;
  teiDescription: string;
  teiChoice: string;
  teiValue: number;
  
  // Final
  totalRiskValue: number;
  notes: string;
}

// Dummy data untuk satu assessment detail (Atdag Moscow – Rusia)
export const DUMMY_RISK_ASSESSMENT_DETAIL: RiskAssessmentDetail = {
  id: '1',
  year: 2024,
  perwadagName: 'Atdag Moscow – Rusia',
  inspektorat: 1,
  
  // Section 1: Tren Capaian
  achievement2023: 84.97,
  achievement2024: 90.21,
  trendAchievement: 6.17,
  trendChoice: 'Naik 0% - 20%',
  trendValue: 3,
  
  // Section 2: Realisasi Anggaran
  budgetRealization2024: 2138365547,
  budgetPagu2024: 2192642000,
  budgetPercentage: 97.5,
  budgetChoice: '95% - 97%',
  budgetValue: 4,
  
  // Section 3: Tren Nilai Ekspor
  exportTrendDescription: '4.71%',
  exportChoice: 'Naik 0% - 19%',
  exportValue: 3,
  
  // Section 4: Audit Itjen
  auditDescription: 'Belum pernah diaudit',
  auditChoice: 'Belum pernah diaudit',
  auditValue: 1,
  
  // Section 5: Perjanjian Perdagangan
  tradeAgreementDescription: 'Tidak ada perjanjian internasional',
  tradeAgreementChoice: 'Tidak ada perjanjian internasional',
  tradeAgreementValue: 1,
  
  // Section 6: Peringkat Nilai Ekspor
  exportRankingDescription: '27',
  exportRankingChoice: 'Peringkat diatas 23',
  exportRankingValue: 1,
  
  // Section 7: IK Target
  ikNotAchieved: 4,
  ikTotal: 16,
  ikPercentage: 25.0,
  ikChoice: '> 20%',
  ikValue: 1,
  
  // Section 8: Nilai Transaksi TEI
  teiRealizationValue: 0,
  teiPotentialValue: 0,
  teiPercentage: 0,
  teiDescription: 'tidak ada data realisasi dan nilai potensi',
  teiChoice: 'Belum Ada Realisasi',
  teiValue: 1,
  
  // Final
  totalRiskValue: 14,
  notes: 'Assessment lengkap untuk tahun 2024'
};

// Options untuk dropdown
export const TREND_CHOICES = [
  { value: 'naik-41-plus', label: 'Naik >=41%', score: 5 },
  { value: 'naik-21-40', label: 'Naik 21% - 40%', score: 4 },
  { value: 'naik-0-20', label: 'Naik 0% - 20%', score: 3 },
  { value: 'turun-kurang-25', label: 'Turun < 25%', score: 2 },
  { value: 'turun-25-plus', label: 'Turun >= 25%', score: 1 }
];

export const BUDGET_CHOICES = [
  { value: 'lebih-98', label: '> 98%', score: 5 },
  { value: '95-97', label: '95% - 97%', score: 4 },
  { value: '90-94', label: '90% - 94%', score: 3 },
  { value: '85-89', label: '85% - 89%', score: 2 },
  { value: 'kurang-85', label: '<85%', score: 1 }
];

export const EXPORT_TREND_CHOICES = [
  { value: 'naik-35-plus', label: 'Naik >= 35 %', score: 5 },
  { value: 'naik-20-34', label: 'Naik 20% - 34%', score: 4 },
  { value: 'naik-0-19', label: 'Naik 0% - 19%', score: 3 },
  { value: 'turun-kurang-25', label: 'Turun < 25%', score: 2 },
  { value: 'turun-25-plus', label: 'Turun >= 25%', score: 1 }
];

export const AUDIT_CHOICES = [
  { value: '1-tahun', label: '1 Tahun', score: 5 },
  { value: '2-tahun', label: '2 Tahun', score: 4 },
  { value: '3-tahun', label: '3 Tahun', score: 3 },
  { value: '4-tahun', label: '4 Tahun', score: 2 },
  { value: 'belum-pernah', label: 'Belum pernah diaudit', score: 1 }
];

export const TRADE_AGREEMENT_CHOICES = [
  { value: 'sudah-implementasi', label: 'Sudah diimplementasikan', score: 5 },
  { value: 'sudah-sepakat-belum-ratifikasi', label: 'Sudah disepakati namun belum diratifikasi', score: 4 },
  { value: 'masih-proses', label: 'Masih berproses/ on going', score: 3 },
  { value: 'sedang-diusulkan', label: 'Sedang diusulkan/ Being Proposed', score: 2 },
  { value: 'tidak-ada', label: 'Tidak ada perjanjian internasional', score: 1 }
];

export const EXPORT_RANKING_CHOICES = [
  { value: 'peringkat-1-6', label: 'Peringkat 1 - 6', score: 5 },
  { value: 'peringkat-7-12', label: 'Peringkat 7 - 12', score: 4 },
  { value: 'peringkat-13-18', label: 'Peringkat 13 - 18', score: 3 },
  { value: 'peringkat-19-23', label: 'Peringkat 19 - 23', score: 2 },
  { value: 'peringkat-diatas-23', label: 'Peringkat diatas 23', score: 1 }
];

export const IK_CHOICES = [
  { value: 'kurang-5', label: '< 5%', score: 5 },
  { value: '6-10', label: '6% - 10%', score: 4 },
  { value: '11-15', label: '11% - 15%', score: 3 },
  { value: '16-20', label: '16% - 20%', score: 2 },
  { value: 'lebih-20', label: '> 20%', score: 1 }
];

export const TEI_CHOICES = [
  { value: 'lebih-70', label: '> 70%', score: 5 },
  { value: '50-70', label: '50% - 70%', score: 4 },
  { value: '25-49', label: '25% - 49%', score: 3 },
  { value: 'kurang-25', label: '< 25%', score: 2 },
  { value: 'belum-ada', label: 'Belum Ada Realisasi', score: 1 }
];