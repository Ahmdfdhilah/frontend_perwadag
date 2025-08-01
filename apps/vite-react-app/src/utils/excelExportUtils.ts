export interface ExcelColumn {
  width: number;
  key?: string;
  header: string;
}

export interface ExcelHeaderInfo {
  label: string;
  value: string;
}

export interface ExcelExportConfig {
  title: string;
  fileName: string;
  columns: ExcelColumn[];
  headerInfo?: ExcelHeaderInfo[];
  data: any[];
  sheetName?: string;
  noDataMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

export interface ToastFunction {
  (options: {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
  }): void;
}

export interface ExcelStyles {
  title?: {
    font?: any;
    alignment?: any;
    fill?: any;
    border?: any;
    height?: number;
  };
  headerInfo?: {
    font?: any;
    alignment?: any;
    fill?: any;
    border?: any;
    height?: number;
  };
  tableHeader?: {
    font?: any;
    alignment?: any;
    fill?: any;
    border?: any;
    height?: number;
  };
  tableData?: {
    font?: any;
    alignment?: any;
    border?: any;
    wrapText?: boolean;
  };
  noData?: {
    font?: any;
    alignment?: any;
  };
}

const defaultStyles: ExcelStyles = {
  title: {
    font: { bold: true, size: 18, color: { argb: 'FF1565C0' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE3F2FD' } },
    height: 35
  },
  headerInfo: {
    font: { bold: true, size: 12, color: { argb: 'FF424242' } },
    alignment: { horizontal: 'left', vertical: 'middle' },
    height: 25
  },
  tableHeader: {
    font: { bold: true, size: 13, color: { argb: 'FFFFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1976D2' } },
    border: {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    },
    height: 30
  },
  tableData: {
    font: { size: 11, color: { argb: 'FF212121' } },
    alignment: { horizontal: 'left', vertical: 'top', wrapText: true },
    border: {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    },
    wrapText: true
  },
  noData: {
    font: { italic: true, size: 11 },
    alignment: { horizontal: 'center', vertical: 'middle' }
  }
};

export const exportToExcel = async (config: ExcelExportConfig, toastFn: ToastFunction, customStyles?: ExcelStyles): Promise<void> => {
  try {
    const ExcelJS = await import('exceljs');
    const styles = { ...defaultStyles, ...customStyles };
    
    const {
      title,
      fileName,
      columns,
      headerInfo = [],
      data,
      sheetName = 'Sheet1',
      noDataMessage = 'Tidak ada data',
      successMessage = 'Data berhasil diekspor ke Excel.'
    } = config;

    // Create new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Set column widths
    worksheet.columns = columns.map(col => ({ width: col.width }));

    let currentRow = 1;

    // Add title (merged cell)
    const titleRange = `A${currentRow}:${String.fromCharCode(64 + columns.length)}${currentRow}`;
    worksheet.mergeCells(titleRange);
    const titleCell = worksheet.getCell(`A${currentRow}`);
    titleCell.value = title;
    
    if (styles.title) {
      titleCell.font = styles.title.font;
      titleCell.alignment = styles.title.alignment;
      titleCell.fill = styles.title.fill;
      if (styles.title.height) {
        worksheet.getRow(currentRow).height = styles.title.height;
      }
    }

    currentRow++;

    // Add empty row
    worksheet.addRow([]);
    currentRow++;

    // Add header information
    if (headerInfo.length > 0) {
      headerInfo.forEach((info) => {
        const headerRange = `A${currentRow}:${String.fromCharCode(64 + columns.length)}${currentRow}`;
        worksheet.mergeCells(headerRange);
        const cell = worksheet.getCell(`A${currentRow}`);
        cell.value = `${info.label}: ${info.value}`;
        
        if (styles.headerInfo) {
          cell.font = styles.headerInfo.font;
          cell.alignment = styles.headerInfo.alignment;
          if (styles.headerInfo.height) {
            worksheet.getRow(currentRow).height = styles.headerInfo.height;
          }
        }
        
        currentRow++;
      });

      // Add empty row
      worksheet.addRow([]);
      currentRow++;
    }

    if (data.length > 0) {
      // Add table headers
      const headerRow = worksheet.addRow(columns.map(col => col.header));
      
      if (styles.tableHeader) {
        if (styles.tableHeader.height) {
          headerRow.height = styles.tableHeader.height;
        }
        
        headerRow.eachCell((cell: any) => {
          cell.font = styles.tableHeader?.font;
          cell.alignment = styles.tableHeader?.alignment;
          cell.fill = styles.tableHeader?.fill;
          cell.border = styles.tableHeader?.border;
        });
      }

      // Add data rows
      data.forEach((rowData, index) => {
        const dataRow = worksheet.addRow(
          columns.map((col, colIndex) => {
            if (col.key) {
              return rowData[col.key];
            }
            // For numbered columns or custom mapping
            if (colIndex === 0 && col.header.toLowerCase().includes('no')) {
              return index + 1;
            }
            return rowData[colIndex] || '';
          })
        );

        // Style data cells
        if (styles.tableData) {
          dataRow.eachCell((cell: any, colNumber: any) => {
            cell.font = styles.tableData?.font;
            cell.alignment = {
              ...styles.tableData?.alignment,
              horizontal: colNumber === 1 ? 'center' : styles.tableData?.alignment?.horizontal || 'left'
            };
            cell.border = styles.tableData?.border;
            if (styles.tableData?.wrapText) {
              cell.alignment = { ...cell.alignment, wrapText: true };
            }
          });
        }
      });
    } else {
      // Add no data message
      const noDataRow = worksheet.addRow([noDataMessage]);
      const noDataRange = `A${noDataRow.number}:${String.fromCharCode(64 + columns.length)}${noDataRow.number}`;
      worksheet.mergeCells(noDataRange);
      const cell = worksheet.getCell(`A${noDataRow.number}`);
      
      if (styles.noData) {
        cell.alignment = styles.noData.alignment;
        cell.font = styles.noData.font;
      }
    }

    // Set workbook properties
    workbook.creator = 'Sistem Evaluasi';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);

    toastFn({
      title: 'Export Berhasil',
      description: successMessage,
      variant: 'default'
    });

  } catch (error) {
    console.error('Failed to export Excel:', error);
    toastFn({
      title: 'Export Gagal',
      description: 'Gagal mengekspor data ke Excel. Silakan coba lagi.',
      variant: 'destructive'
    });
  }
};

// Specific utility for Matriks export
export const exportMatriksToExcel = async (item: any, formatIndonesianDateRange: (start: string, end: string) => string, toastFn: ToastFunction): Promise<void> => {
  const temuanRekomendasi = item.temuan_rekomendasi_summary?.data || [];
  const tanggalEvaluasi = formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai);
  
  const config: ExcelExportConfig = {
    title: `Matriks Kondisi Kriteria Rekomendasi ${item.nama_perwadag} ${tanggalEvaluasi}`,
    fileName: `Matriks_Kondisi_Kriteria_Rekomendasi_${item.nama_perwadag.replace(/\s+/g, '_')}_${item.tahun_evaluasi}.xlsx`,
    sheetName: 'Matriks Kondisi Kriteria Rekomendasi',
    columns: [
      { width: 5, header: 'No' },
      { width: 40, header: 'Kondisi', key: 'kondisi' },
      { width: 40, header: 'Kriteria', key: 'kriteria' },
      { width: 40, header: 'Rekomendasi', key: 'rekomendasi' }
    ],
    headerInfo: [
      { label: 'Nama Perwadag', value: item.nama_perwadag },
      { label: 'Inspektorat', value: item.inspektorat },
      { label: 'Tanggal Evaluasi', value: tanggalEvaluasi },
      { label: 'Tahun Evaluasi', value: item.tahun_evaluasi.toString() }
    ],
    data: temuanRekomendasi,
    noDataMessage: 'Tidak ada kondisi, kriteria dan rekomendasi',
    successMessage: `Data matriks ${item.nama_perwadag} berhasil diekspor ke Excel.`,
    errorMessage: 'Gagal mengekspor data ke Excel. Silakan coba lagi.'
  };

  await exportToExcel(config, toastFn);
};

// New function for exporting all matriks data with merged cells and separate sheets per year
export const exportAllMatriksToExcel = async (
  items: any[], 
  formatIndonesianDateRange: (start: string, end: string) => string,
  toastFn: ToastFunction,
  selectedYear: string
): Promise<void> => {
  try {
    const ExcelJS = await import('exceljs');
    
    // Create new workbook
    const workbook = new ExcelJS.Workbook();
    
    // Group items by year
    const itemsByYear = items.reduce((acc: any, item: any) => {
      const year = item.tahun_evaluasi.toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(item);
      return acc;
    }, {});

    // Sort years in descending order
    const sortedYears = Object.keys(itemsByYear).sort((a, b) => parseInt(b) - parseInt(a));
    
    // If specific year is selected, only export that year
    const yearsToExport = selectedYear !== 'all' ? [selectedYear] : sortedYears;

    for (const year of yearsToExport) {
      if (!itemsByYear[year]) continue;
      
      const yearItems = itemsByYear[year];
      const worksheet = workbook.addWorksheet(`Matriks ${year}`);

      // Set column widths
      worksheet.columns = [
        { width: 5 },   // No
        { width: 15 },  // Inspektorat
        { width: 30 },  // Nama Perwadag
        { width: 20 },  // No Surat Tugas
        { width: 25 },  // Tanggal Evaluasi
        { width: 40 },  // Kondisi
        { width: 40 },  // Kriteria
        { width: 40 }   // Rekomendasi
      ];

      let currentRow = 1;

      // Add title
      const titleRange = `A${currentRow}:H${currentRow}`;
      worksheet.mergeCells(titleRange);
      const titleCell = worksheet.getCell(`A${currentRow}`);
      titleCell.value = `Matriks Kondisi Kriteria Rekomendasi Tahun ${year}`;
      titleCell.font = { bold: true, size: 18, color: { argb: 'FF1565C0' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE3F2FD' } };
      worksheet.getRow(currentRow).height = 35;
      currentRow += 2;

      // Add table headers
      const headerRow = worksheet.addRow(['No', 'Inspektorat', 'Nama Perwadag', 'No Surat Tugas', 'Tanggal Evaluasi', 'Kondisi', 'Kriteria', 'Rekomendasi']);
      headerRow.height = 30;
      
      headerRow.eachCell((cell: any) => {
        cell.font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1976D2' } };
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      let rowIndex = 1;
      
      // Group items by inspektorat first
      const itemsByInspektorat = yearItems.reduce((acc: any, item: any) => {
        const inspektorat = item.inspektorat;
        if (!acc[inspektorat]) {
          acc[inspektorat] = [];
        }
        acc[inspektorat].push(item);
        return acc;
      }, {});

      // Sort inspektorat keys (1, 2, 3, 4) - ensure numeric sorting
      const sortedInspektorat = Object.keys(itemsByInspektorat).sort((a, b) => {
        // Extract numeric value from inspektorat string, handle various formats
        let numA, numB;
        
        // If already contains "Inspektorat", extract the number
        if (a.toString().toLowerCase().includes('inspektorat')) {
          numA = parseInt(a.toString().match(/\d+/)?.[0] || '0');
        } else {
          numA = parseInt(a) || 0;
        }
        
        if (b.toString().toLowerCase().includes('inspektorat')) {
          numB = parseInt(b.toString().match(/\d+/)?.[0] || '0');
        } else {
          numB = parseInt(b) || 0;
        }
        
        return numA - numB;
      });
      
      // Sort perwadag within each inspektorat alphabetically
      sortedInspektorat.forEach(inspektorat => {
        itemsByInspektorat[inspektorat].sort((a: any, b: any) => 
          a.nama_perwadag.localeCompare(b.nama_perwadag, 'id', { sensitivity: 'base' })
        );
      });
      
      // Process each inspektorat
      for (const inspektorat of sortedInspektorat) {
        const inspektoratItems = itemsByInspektorat[inspektorat];
        let inspektoratStartRow: number | null = null;
        let inspektoratEndRow: number | null = null;
        let totalRowsForInspektorat = 0;
        
        // Calculate total rows needed for this inspektorat
        for (const item of inspektoratItems) {
          const temuanRekomendasi = item.temuan_rekomendasi_summary?.data || [];
          totalRowsForInspektorat += Math.max(1, temuanRekomendasi.length);
        }
        
        // Process each item in this inspektorat
        for (let itemIndex = 0; itemIndex < inspektoratItems.length; itemIndex++) {
          const item = inspektoratItems[itemIndex];
          const temuanRekomendasi = item.temuan_rekomendasi_summary?.data || [];
          
          if (temuanRekomendasi.length === 0) {
            // If no temuan/rekomendasi, add single row
            const dataRow = worksheet.addRow([
              rowIndex,
              itemIndex === 0 ? (item.inspektorat.toString().includes('Inspektorat') ? item.inspektorat : `Inspektorat ${item.inspektorat}`) : '', // Only show inspektorat on first item
              item.nama_perwadag,
              item.surat_tugas_info?.no_surat || '-',
              formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai),
              'Tidak ada kondisi',
              'Tidak ada kriteria',
              'Tidak ada rekomendasi'
            ]);
            
            if (inspektoratStartRow === null) {
              inspektoratStartRow = dataRow.number;
            }
            inspektoratEndRow = dataRow.number;
            
            // Style the row
            dataRow.eachCell((cell: any, colNumber: any) => {
              cell.font = { size: 11, color: { argb: 'FF212121' } };
              cell.alignment = { 
                horizontal: colNumber === 1 ? 'center' : 'left', // No column is column 1
                vertical: 'top', 
                wrapText: true 
              };
              cell.border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
            
            rowIndex++;
          } else {
            // Multiple temuan/rekomendasi
            const startRow = worksheet.lastRow ? worksheet.lastRow.number + 1 : currentRow + 1;
            
            for (let i = 0; i < temuanRekomendasi.length; i++) {
              const tr = temuanRekomendasi[i];
              const dataRow = worksheet.addRow([
                i === 0 ? rowIndex : '', // Only show number on first row
                (itemIndex === 0 && i === 0) ? (item.inspektorat.toString().includes('Inspektorat') ? item.inspektorat : `Inspektorat ${item.inspektorat}`) : '', // Only show inspektorat on first item's first row
                i === 0 ? item.nama_perwadag : '', // Only show nama_perwadag on first row
                i === 0 ? (item.surat_tugas_info?.no_surat || '-') : '', // Only show no_surat on first row
                i === 0 ? formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai) : '', // Only show date on first row
                tr.kondisi || '',
                tr.kriteria || '',
                tr.rekomendasi || ''
              ]);
              
              if (inspektoratStartRow === null) {
                inspektoratStartRow = dataRow.number;
              }
              inspektoratEndRow = dataRow.number;
              
              // Style the row
              dataRow.eachCell((cell: any, colNumber: any) => {
                cell.font = { size: 11, color: { argb: 'FF212121' } };
                cell.alignment = { 
                  horizontal: colNumber === 1 ? 'center' : 'left', // No column is column 1
                  vertical: 'top', 
                  wrapText: true 
                };
                cell.border = {
                  top: { style: 'thin' },
                  bottom: { style: 'thin' },
                  left: { style: 'thin' },
                  right: { style: 'thin' }
                };
              });
            }
            
            const endRow = worksheet.lastRow ? worksheet.lastRow.number : startRow;
            
            // Merge cells for no, nama_perwadag, no_surat_tugas, and tanggal_evaluasi if multiple rows
            if (temuanRekomendasi.length > 1) {
              worksheet.mergeCells(`A${startRow}:A${endRow}`); // No column (column A)
              worksheet.mergeCells(`C${startRow}:C${endRow}`); // Nama Perwadag column (column C)
              worksheet.mergeCells(`D${startRow}:D${endRow}`); // No Surat Tugas column (column D)
              worksheet.mergeCells(`E${startRow}:E${endRow}`); // Tanggal Evaluasi column (column E)
              
              // Center align merged cells
              worksheet.getCell(`A${startRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
              worksheet.getCell(`C${startRow}`).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
              worksheet.getCell(`D${startRow}`).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
              worksheet.getCell(`E${startRow}`).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            }
            
            rowIndex++;
          }
        }
        
        // Merge inspektorat column for all rows of this inspektorat (column B)
        if (inspektoratStartRow !== null && inspektoratEndRow !== null && inspektoratStartRow !== inspektoratEndRow) {
          worksheet.mergeCells(`B${inspektoratStartRow}:B${inspektoratEndRow}`);
          worksheet.getCell(`B${inspektoratStartRow}`).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        }
      }
    }

    // Set workbook properties
    workbook.creator = 'Sistem Evaluasi';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Generate filename
    const yearSuffix = selectedYear !== 'all' ? `_${selectedYear}` : '_Semua_Tahun';
    const fileName = `Matriks_Kondisi_Kriteria_Rekomendasi${yearSuffix}_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);

    toastFn({
      title: 'Export Berhasil',
      description: `Data matriks berhasil diekspor ke Excel dengan ${yearsToExport.length} sheet.`,
      variant: 'default'
    });

  } catch (error) {
    console.error('Failed to export all matriks Excel:', error);
    toastFn({
      title: 'Export Gagal',
      description: 'Gagal mengekspor data matriks ke Excel. Silakan coba lagi.',
      variant: 'destructive'
    });
  }
};