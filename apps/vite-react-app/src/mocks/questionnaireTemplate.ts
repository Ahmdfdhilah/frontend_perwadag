export interface QuestionnaireTemplate {
  id: string;
  no: number;
  nama: string;
  deskripsi: string;
  tahun: number;
  dokumen?: string;
}

export const QUESTIONNAIRE_TEMPLATE_DATA: QuestionnaireTemplate[] = [
  {
    id: "QT001",
    no: 1,
    nama: "Template Kuesioner Evaluasi Tata Kelola Keuangan",
    deskripsi: "Template evaluasi komprehensif terhadap sistem tata kelola keuangan dan pengendalian internal di perwakilan dagang luar negeri",
    tahun: 2024,
    dokumen: "template-keuangan-2024.pdf"
  },
  {
    id: "QT002", 
    no: 2,
    nama: "Template Kuesioner Evaluasi Manajemen SDM",
    deskripsi: "Template penilaian efektivitas pengelolaan sumber daya manusia dan pengembangan kapasitas pegawai",
    tahun: 2024,
    dokumen: "template-sdm-2024.pdf"
  },
  {
    id: "QT003",
    no: 3,
    nama: "Template Kuesioner Evaluasi Promosi Dagang",
    deskripsi: "Template evaluasi program promosi dan pengembangan pasar ekspor Indonesia di wilayah kerja",
    tahun: 2024,
    dokumen: "template-promosi-2024.pdf"
  },
  {
    id: "QT004",
    no: 4,
    nama: "Template Kuesioner Evaluasi Fasilitasi Ekspor",
    deskripsi: "Template penilaian layanan fasilitasi dan dukungan ekspor untuk pelaku usaha Indonesia",
    tahun: 2024,
    dokumen: "template-fasilitasi-2024.pdf"
  },
  {
    id: "QT005",
    no: 5,
    nama: "Template Kuesioner Evaluasi Sistem Informasi",
    deskripsi: "Template evaluasi efektivitas penggunaan dan pengelolaan sistem informasi dalam mendukung operasional",
    tahun: 2024,
    dokumen: "template-sistem-2024.pdf"
  },
  {
    id: "QT006",
    no: 6,
    nama: "Template Kuesioner Evaluasi Kinerja Organisasi",
    deskripsi: "Template penilaian komprehensif terhadap pencapaian target dan kinerja organisasi secara keseluruhan",
    tahun: 2023,
    dokumen: "template-kinerja-2023.pdf"
  },
  {
    id: "QT007",
    no: 7,
    nama: "Template Kuesioner Evaluasi Pelayanan Publik",
    deskripsi: "Template evaluasi kualitas pelayanan publik yang diberikan kepada masyarakat dan pelaku usaha",
    tahun: 2023,
    dokumen: "template-pelayanan-2023.pdf"
  },
  {
    id: "QT008",
    no: 8,
    nama: "Template Kuesioner Evaluasi Program Kemitraan",
    deskripsi: "Template penilaian efektivitas program kemitraan dengan berbagai pihak dalam mendukung perdagangan",
    tahun: 2023,
    dokumen: "template-kemitraan-2023.pdf"
  },
  {
    id: "QT009",
    no: 9,
    nama: "Template Kuesioner Evaluasi Inovasi dan Teknologi",
    deskripsi: "Template evaluasi penerapan inovasi dan teknologi dalam meningkatkan efisiensi operasional",
    tahun: 2022,
    dokumen: "template-inovasi-2022.pdf"
  },
  {
    id: "QT010",
    no: 10,
    nama: "Template Kuesioner Evaluasi Kepuasan Stakeholder",
    deskripsi: "Template penilaian tingkat kepuasan stakeholder terhadap layanan dan program yang dilaksanakan",
    tahun: 2022,
    dokumen: "template-stakeholder-2022.pdf"
  }
];

export const YEARS_QUESTIONNAIRE = Array.from(
  new Set(QUESTIONNAIRE_TEMPLATE_DATA.map(item => item.tahun))
).sort((a, b) => b - a);

export const getQuestionnaireTemplateStatus = (item: QuestionnaireTemplate): string => {
  const hasDokumen = !!item.dokumen;
  
  if (hasDokumen) {
    return 'Tersedia';
  } else {
    return 'Belum Upload';
  }
};