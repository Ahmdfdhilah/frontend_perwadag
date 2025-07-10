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
  budgetValue: 2,
  
  // Section 3: Tren Nilai Ekspor
  exportTrendDescription: '4.71%',
  exportChoice: 'Naik 0% - 19%',
  exportValue: 3,
  
  // Section 4: Audit Itjen
  auditDescription: 'Belum pernah diaudit',
  auditChoice: 'Belum pernah diaudit',
  auditValue: 5,
  
  // Section 5: Perjanjian Perdagangan
  tradeAgreementDescription: 'Tidak ada perjanjian internasional',
  tradeAgreementChoice: 'Tidak ada perjanjian internasional',
  tradeAgreementValue: 1,
  
  // Section 6: Peringkat Nilai Ekspor
  exportRankingDescription: '27',
  exportRankingChoice: 'Peringkat diatas 23',
  exportRankingValue: 5,
  
  // Section 7: IK Target
  ikNotAchieved: 4,
  ikTotal: 16,
  ikPercentage: 25.0,
  ikChoice: '> 20%',
  ikValue: 5,
  
  // Section 8: Nilai Transaksi TEI
  teiRealizationValue: 0,
  teiPotentialValue: 0,
  teiPercentage: 0,
  teiDescription: 'tidak ada data realisasi dan nilai potensi',
  teiChoice: 'Belum Ada Realisasi',
  teiValue: 0,
  
  // Final
  totalRiskValue: 24,
  notes: 'Assessment lengkap untuk tahun 2024'
};

// Options untuk dropdown
export const TREND_CHOICES = [
  { value: 'turun-lebih-20', label: 'Turun > 20%', score: 5 },
  { value: 'turun-10-20', label: 'Turun 10% - 20%', score: 4 },
  { value: 'naik-0-20', label: 'Naik 0% - 20%', score: 3 },
  { value: 'naik-20-50', label: 'Naik 20% - 50%', score: 2 },
  { value: 'naik-lebih-50', label: 'Naik > 50%', score: 1 }
];

export const BUDGET_CHOICES = [
  { value: 'kurang-80', label: '< 80%', score: 5 },
  { value: '80-90', label: '80% - 90%', score: 4 },
  { value: '90-95', label: '90% - 95%', score: 3 },
  { value: '95-97', label: '95% - 97%', score: 2 },
  { value: 'lebih-97', label: '> 97%', score: 1 }
];

export const EXPORT_TREND_CHOICES = [
  { value: 'turun-lebih-20', label: 'Turun > 20%', score: 5 },
  { value: 'turun-0-20', label: 'Turun 0% - 20%', score: 4 },
  { value: 'naik-0-19', label: 'Naik 0% - 19%', score: 3 },
  { value: 'naik-20-50', label: 'Naik 20% - 50%', score: 2 },
  { value: 'naik-lebih-50', label: 'Naik > 50%', score: 1 }
];

export const AUDIT_CHOICES = [
  { value: 'belum-pernah', label: 'Belum pernah diaudit', score: 5 },
  { value: 'lebih-5-tahun', label: '> 5 tahun yang lalu', score: 4 },
  { value: '3-5-tahun', label: '3 - 5 tahun yang lalu', score: 3 },
  { value: '1-2-tahun', label: '1 - 2 tahun yang lalu', score: 2 },
  { value: 'tahun-lalu', label: 'Tahun lalu', score: 1 }
];

export const TRADE_AGREEMENT_CHOICES = [
  { value: 'tidak-ada', label: 'Tidak ada perjanjian internasional', score: 1 },
  { value: 'ada-1', label: '1 perjanjian', score: 2 },
  { value: 'ada-2-3', label: '2 - 3 perjanjian', score: 3 },
  { value: 'ada-4-5', label: '4 - 5 perjanjian', score: 4 },
  { value: 'ada-lebih-5', label: '> 5 perjanjian', score: 5 }
];

export const EXPORT_RANKING_CHOICES = [
  { value: 'peringkat-1-5', label: 'Peringkat 1 - 5', score: 1 },
  { value: 'peringkat-6-10', label: 'Peringkat 6 - 10', score: 2 },
  { value: 'peringkat-11-15', label: 'Peringkat 11 - 15', score: 3 },
  { value: 'peringkat-16-23', label: 'Peringkat 16 - 23', score: 4 },
  { value: 'peringkat-diatas-23', label: 'Peringkat diatas 23', score: 5 }
];

export const IK_CHOICES = [
  { value: '0', label: '0%', score: 1 },
  { value: '0-5', label: '0% - 5%', score: 2 },
  { value: '5-10', label: '5% - 10%', score: 3 },
  { value: '10-20', label: '10% - 20%', score: 4 },
  { value: 'lebih-20', label: '> 20%', score: 5 }
];

export const TEI_CHOICES = [
  { value: 'belum-ada', label: 'Belum Ada Realisasi', score: 0 },
  { value: 'kurang-50', label: '< 50%', score: 5 },
  { value: '50-70', label: '50% - 70%', score: 4 },
  { value: '70-85', label: '70% - 85%', score: 3 },
  { value: '85-95', label: '85% - 95%', score: 2 },
  { value: 'lebih-95', label: '> 95%', score: 1 }
];