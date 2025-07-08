export interface Perwadag {
  id: string;
  name: string;
  address: string;
  inspektorat: number;
}

export const PERWADAG_DATA: Perwadag[] = [
  // Inspektorat 1
  {
    id: 'PWD001',
    name: 'Atdag Moscow – Rusia',
    address: 'Moscow, Russia',
    inspektorat: 1
  },
  {
    id: 'PWD002',
    name: 'Atdag Washington DC – AS',
    address: 'Washington DC, United States',
    inspektorat: 1
  },
  {
    id: 'PWD003',
    name: 'ITPC Vancouver – Canada',
    address: 'Vancouver, Canada',
    inspektorat: 1
  },
  {
    id: 'PWD004',
    name: 'Atdag Madrid – Spanyol',
    address: 'Madrid, Spain',
    inspektorat: 1
  },
  {
    id: 'PWD005',
    name: 'ITPC Johannesburg – Afrika Selatan',
    address: 'Johannesburg, South Africa',
    inspektorat: 1
  },
  {
    id: 'PWD006',
    name: 'Atdag Kairo – Mesir',
    address: 'Cairo, Egypt',
    inspektorat: 1
  },
  {
    id: 'PWD007',
    name: 'ITPC Osaka – Jepang',
    address: 'Osaka, Japan',
    inspektorat: 1
  },
  {
    id: 'PWD008',
    name: 'ITPC Dubai – Uni Emirat Arab',
    address: 'Dubai, UAE',
    inspektorat: 1
  },
  
  // Inspektorat 2
  {
    id: 'PWD009',
    name: 'Atdag Paris – Perancis',
    address: 'Paris, France',
    inspektorat: 2
  },
  {
    id: 'PWD010',
    name: 'ITPC Lagos – Nigeria',
    address: 'Lagos, Nigeria',
    inspektorat: 2
  },
  {
    id: 'PWD011',
    name: 'ITPC Barcelona – Spanyol',
    address: 'Barcelona, Spain',
    inspektorat: 2
  },
  {
    id: 'PWD012',
    name: 'ITPC Budapest - Hungaria',
    address: 'Budapest, Hungary',
    inspektorat: 2
  },
  {
    id: 'PWD013',
    name: 'Atdag Beijing – RRT',
    address: 'Beijing, China',
    inspektorat: 2
  },
  {
    id: 'PWD014',
    name: 'ITPC Jeddah – Arab Saudi',
    address: 'Jeddah, Saudi Arabia',
    inspektorat: 2
  },
  {
    id: 'PWD015',
    name: 'Atdag Ankara – Turki',
    address: 'Ankara, Turkey',
    inspektorat: 2
  },
  {
    id: 'PWD016',
    name: 'Atdag Canberra – Australia',
    address: 'Canberra, Australia',
    inspektorat: 2
  },
  {
    id: 'PWD017',
    name: 'ITPC Chicago – Amerika Serikat',
    address: 'Chicago, United States',
    inspektorat: 2
  },
  
  // Inspektorat 3
  {
    id: 'PWD018',
    name: 'ITPC Sao Paulo – Brasil',
    address: 'Sao Paulo, Brazil',
    inspektorat: 3
  },
  {
    id: 'PWD019',
    name: 'Konsuldag Hongkong',
    address: 'Hong Kong',
    inspektorat: 3
  },
  {
    id: 'PWD020',
    name: 'Atdag Tokyo – Jepang',
    address: 'Tokyo, Japan',
    inspektorat: 3
  },
  {
    id: 'PWD021',
    name: 'Atdag Seoul – Korea Selatan',
    address: 'Seoul, South Korea',
    inspektorat: 3
  },
  {
    id: 'PWD022',
    name: 'ITPC Sydney – Australia',
    address: 'Sydney, Australia',
    inspektorat: 3
  },
  {
    id: 'PWD023',
    name: 'Atdag Denhaag – Belanda',
    address: 'The Hague, Netherlands',
    inspektorat: 3
  },
  {
    id: 'PWD024',
    name: 'Atdag Jenewa – Swiss',
    address: 'Geneva, Switzerland',
    inspektorat: 3
  },
  {
    id: 'PWD025',
    name: 'ITPC Los Angeles – Amerika Serikat',
    address: 'Los Angeles, United States',
    inspektorat: 3
  },
  {
    id: 'PWD026',
    name: 'Atdag Kuala Lumpur – Malaysia',
    address: 'Kuala Lumpur, Malaysia',
    inspektorat: 3
  },
  
  // Inspektorat 4
  {
    id: 'PWD027',
    name: 'ITPC Santiago – Chile',
    address: 'Santiago, Chile',
    inspektorat: 4
  },
  {
    id: 'PWD028',
    name: 'Atdag Hanoi – Vietnam',
    address: 'Hanoi, Vietnam',
    inspektorat: 4
  },
  {
    id: 'PWD029',
    name: 'Atdag Brussel – Belgia',
    address: 'Brussels, Belgium',
    inspektorat: 4
  },
  {
    id: 'PWD030',
    name: 'Atdag Singapura – Singapura',
    address: 'Singapore',
    inspektorat: 4
  },
  {
    id: 'PWD031',
    name: 'Atdag Berlin – Jerman',
    address: 'Berlin, Germany',
    inspektorat: 4
  },
  {
    id: 'PWD032',
    name: 'ITPC Busan – Korea Selatan',
    address: 'Busan, South Korea',
    inspektorat: 4
  },
  {
    id: 'PWD033',
    name: 'Atdag Bangkok – Thailand',
    address: 'Bangkok, Thailand',
    inspektorat: 4
  },
  {
    id: 'PWD034',
    name: 'ITPC Milan – Italia',
    address: 'Milan, Italy',
    inspektorat: 4
  },
  {
    id: 'PWD035',
    name: 'KDEI Taipei – Taiwan',
    address: 'Taipei, Taiwan',
    inspektorat: 4
  },
  {
    id: 'PWD036',
    name: 'ITPC Hamburg - Jerman',
    address: 'Hamburg, Germany',
    inspektorat: 4
  }
];

export const getPerwadag = (id: string): Perwadag | undefined => {
  return PERWADAG_DATA.find(p => p.id === id);
};

export const getPerwadagByInspektorat = (inspektorat: number): Perwadag[] => {
  return PERWADAG_DATA.filter(p => p.inspektorat === inspektorat);
};