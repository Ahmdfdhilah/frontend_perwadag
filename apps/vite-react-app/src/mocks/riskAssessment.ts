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
  // 2024 Data
  {
    id: '1',
    year: 2024,
    perwadagName: 'Atdag Moscow – Rusia',
    score: 85,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 1
  },
  {
    id: '2',
    year: 2024,
    perwadagName: 'Atdag Washington DC – AS',
    score: 72,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 1
  },
  {
    id: '3',
    year: 2024,
    perwadagName: 'ITPC Vancouver – Canada',
    score: 91,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 1
  },
  {
    id: '4',
    year: 2024,
    perwadagName: 'Atdag Paris – Perancis',
    score: 68,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 2
  },
  {
    id: '5',
    year: 2024,
    perwadagName: 'ITPC Lagos – Nigeria',
    score: 95,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 2
  },
  {
    id: '6',
    year: 2024,
    perwadagName: 'ITPC Barcelona – Spanyol',
    score: 78,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 2
  },
  {
    id: '7',
    year: 2024,
    perwadagName: 'ITPC Sao Paulo – Brasil',
    score: 82,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 3
  },
  {
    id: '8',
    year: 2024,
    perwadagName: 'Konsuldag Hongkong',
    score: 65,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 3
  },
  {
    id: '9',
    year: 2024,
    perwadagName: 'Atdag Tokyo – Jepang',
    score: 88,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 3
  },
  {
    id: '10',
    year: 2024,
    perwadagName: 'ITPC Santiago – Chile',
    score: 71,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 4
  },
  {
    id: '11',
    year: 2024,
    perwadagName: 'Atdag Hanoi – Vietnam',
    score: 89,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 4
  },
  {
    id: '12',
    year: 2024,
    perwadagName: 'Atdag Brussel – Belgia',
    score: 76,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 4
  },

  // 2023 Data
  {
    id: '13',
    year: 2023,
    perwadagName: 'Atdag Moscow – Rusia',
    score: 93,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 1
  },
  {
    id: '14',
    year: 2023,
    perwadagName: 'Atdag Washington DC – AS',
    score: 64,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 1
  },
  {
    id: '15',
    year: 2023,
    perwadagName: 'ITPC Vancouver – Canada',
    score: 87,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 1
  },
  {
    id: '16',
    year: 2023,
    perwadagName: 'Atdag Madrid – Spanyol',
    score: 73,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 1
  },
  {
    id: '17',
    year: 2023,
    perwadagName: 'Atdag Paris – Perancis',
    score: 79,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 2
  },
  {
    id: '18',
    year: 2023,
    perwadagName: 'ITPC Lagos – Nigeria',
    score: 84,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 2
  },
  {
    id: '19',
    year: 2023,
    perwadagName: 'ITPC Budapest - Hungaria',
    score: 69,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 2
  },
  {
    id: '20',
    year: 2023,
    perwadagName: 'Atdag Beijing – RRT',
    score: 92,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 2
  },
  {
    id: '21',
    year: 2023,
    perwadagName: 'Konsuldag Hongkong',
    score: 66,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 3
  },
  {
    id: '22',
    year: 2023,
    perwadagName: 'Atdag Seoul – Korea Selatan',
    score: 81,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 3
  },
  {
    id: '23',
    year: 2023,
    perwadagName: 'ITPC Sydney – Australia',
    score: 75,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 3
  },
  {
    id: '24',
    year: 2023,
    perwadagName: 'Atdag Singapura – Singapura',
    score: 90,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 4
  },
  {
    id: '25',
    year: 2023,
    perwadagName: 'Atdag Berlin – Jerman',
    score: 77,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 4
  },
  {
    id: '26',
    year: 2023,
    perwadagName: 'ITPC Busan – Korea Selatan',
    score: 86,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 4
  },

  // 2022 Data
  {
    id: '27',
    year: 2022,
    perwadagName: 'ITPC Johannesburg – Afrika Selatan',
    score: 74,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 1
  },
  {
    id: '28',
    year: 2022,
    perwadagName: 'Atdag Kairo – Mesir',
    score: 88,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 1
  },
  {
    id: '29',
    year: 2022,
    perwadagName: 'ITPC Osaka – Jepang',
    score: 67,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 1
  },
  {
    id: '30',
    year: 2022,
    perwadagName: 'ITPC Dubai – Uni Emirat Arab',
    score: 91,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 1
  },
  {
    id: '31',
    year: 2022,
    perwadagName: 'ITPC Jeddah – Arab Saudi',
    score: 72,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 2
  },
  {
    id: '32',
    year: 2022,
    perwadagName: 'Atdag Ankara – Turki',
    score: 85,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 2
  },
  {
    id: '33',
    year: 2022,
    perwadagName: 'Atdag Canberra – Australia',
    score: 78,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 2
  },
  {
    id: '34',
    year: 2022,
    perwadagName: 'ITPC Chicago – Amerika Serikat',
    score: 93,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 2
  },
  {
    id: '35',
    year: 2022,
    perwadagName: 'Atdag Denhaag – Belanda',
    score: 68,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 3
  },
  {
    id: '36',
    year: 2022,
    perwadagName: 'Atdag Jenewa – Swiss',
    score: 82,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 3
  },
  {
    id: '37',
    year: 2022,
    perwadagName: 'ITPC Los Angeles – Amerika Serikat',
    score: 76,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 3
  },
  {
    id: '38',
    year: 2022,
    perwadagName: 'Atdag Kuala Lumpur – Malaysia',
    score: 89,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 3
  },
  {
    id: '39',
    year: 2022,
    perwadagName: 'Atdag Bangkok – Thailand',
    score: 71,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 4
  },
  {
    id: '40',
    year: 2022,
    perwadagName: 'ITPC Milan – Italia',
    score: 87,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 4
  },
  {
    id: '41',
    year: 2022,
    perwadagName: 'KDEI Taipei – Taiwan',
    score: 64,
    riskProfile: 'Sedang',
    total: 100,
    inspektorat: 4
  },
  {
    id: '42',
    year: 2022,
    perwadagName: 'ITPC Hamburg - Jerman',
    score: 80,
    riskProfile: 'Tinggi',
    total: 100,
    inspektorat: 4
  }
];

export const YEARS = [2022, 2023, 2024];
export const INSPEKTORATS = [
  { value: 1, label: 'Inspektorat I' },
  { value: 2, label: 'Inspektorat II' },
  { value: 3, label: 'Inspektorat III' },
  { value: 4, label: 'Inspektorat IV' }
];

export const RISK_PROFILES = ['Tinggi', 'Sedang', 'Rendah'];