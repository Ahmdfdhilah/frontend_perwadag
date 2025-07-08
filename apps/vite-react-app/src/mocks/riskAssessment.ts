export interface RiskAssessment {
  id: string;
  year: number;
  perwadagName: string;
  score: number;
  riskProfile: string;
  total: number;
  inspektorat: number;
}

export const RISK_ASSESSMENTS: RiskAssessment[] = [
  {
    id: '1',
    year: 2024,
    perwadagName: 'Perwadag Jakarta Pusat',
    score: 85,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 1
  },
  {
    id: '2',
    year: 2024,
    perwadagName: 'Perwadag Jakarta Utara',
    score: 72,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 2
  },
  {
    id: '3',
    year: 2024,
    perwadagName: 'Perwadag Jakarta Selatan',
    score: 91,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 1
  },
  {
    id: '4',
    year: 2024,
    perwadagName: 'Perwadag Jakarta Barat',
    score: 68,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 3
  },
  {
    id: '5',
    year: 2024,
    perwadagName: 'Perwadag Jakarta Timur',
    score: 95,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 2
  },
  {
    id: '6',
    year: 2023,
    perwadagName: 'Perwadag Jakarta Pusat',
    score: 78,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 1
  },
  {
    id: '7',
    year: 2023,
    perwadagName: 'Perwadag Jakarta Utara',
    score: 82,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 2
  },
  {
    id: '8',
    year: 2023,
    perwadagName: 'Perwadag Jakarta Selatan',
    score: 65,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 1
  },
  {
    id: '9',
    year: 2023,
    perwadagName: 'Perwadag Jakarta Barat',
    score: 88,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 3
  },
  {
    id: '10',
    year: 2023,
    perwadagName: 'Perwadag Jakarta Timur',
    score: 71,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 2
  },
  {
    id: '11',
    year: 2022,
    perwadagName: 'Perwadag Jakarta Pusat',
    score: 89,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 1
  },
  {
    id: '12',
    year: 2022,
    perwadagName: 'Perwadag Jakarta Utara',
    score: 76,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 2
  },
  {
    id: '13',
    year: 2022,
    perwadagName: 'Perwadag Jakarta Selatan',
    score: 93,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 1
  },
  {
    id: '14',
    year: 2022,
    perwadagName: 'Perwadag Jakarta Barat',
    score: 64,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 3
  },
  {
    id: '15',
    year: 2022,
    perwadagName: 'Perwadag Jakarta Timur',
    score: 87,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 2
  }
];

export const YEARS = [2022, 2023, 2024];
export const INSPEKTORATS = [
  { value: 1, label: 'Inspektorat 1' },
  { value: 2, label: 'Inspektorat 2' },
  { value: 3, label: 'Inspektorat 3' },
  { value: 4, label: 'Inspektorat 4' }
];

export const RISK_PROFILES = ['Tinggi', 'Sedang', 'Rendah'];