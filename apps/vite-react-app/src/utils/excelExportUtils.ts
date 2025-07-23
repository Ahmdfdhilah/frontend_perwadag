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
    title: `Matriks Temuan Rekomendasi ${item.nama_perwadag} ${tanggalEvaluasi}`,
    fileName: `Matriks_Temuan_Rekomendasi_${item.nama_perwadag.replace(/\s+/g, '_')}_${item.tahun_evaluasi}.xlsx`,
    sheetName: 'Matriks Temuan Rekomendasi',
    columns: [
      { width: 5, header: 'No' },
      { width: 50, header: 'Temuan', key: 'temuan' },
      { width: 50, header: 'Rekomendasi', key: 'rekomendasi' }
    ],
    headerInfo: [
      { label: 'Nama Perwadag', value: item.nama_perwadag },
      { label: 'Inspektorat', value: item.inspektorat },
      { label: 'Tanggal Evaluasi', value: tanggalEvaluasi },
      { label: 'Tahun Evaluasi', value: item.tahun_evaluasi.toString() }
    ],
    data: temuanRekomendasi,
    noDataMessage: 'Tidak ada temuan dan rekomendasi',
    successMessage: `Data matriks ${item.nama_perwadag} berhasil diekspor ke Excel.`,
    errorMessage: 'Gagal mengekspor data ke Excel. Silakan coba lagi.'
  };

  await exportToExcel(config, toastFn);
};

// New function for exporting all matriks data with merged cells and separate sheets per year
export const exportAllMatriksToExcel = async (
  items: any[], 
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
        { width: 30 },  // Nama Perwadag
        { width: 20 },  // No Surat Tugas
        { width: 50 },  // Temuan
        { width: 50 }   // Rekomendasi
      ];

      let currentRow = 1;

      // Add title
      const titleRange = `A${currentRow}:E${currentRow}`;
      worksheet.mergeCells(titleRange);
      const titleCell = worksheet.getCell(`A${currentRow}`);
      titleCell.value = `Matriks Temuan Rekomendasi Tahun ${year}`;
      titleCell.font = { bold: true, size: 18, color: { argb: 'FF1565C0' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE3F2FD' } };
      worksheet.getRow(currentRow).height = 35;
      currentRow += 2;

      // Add table headers
      const headerRow = worksheet.addRow(['No', 'Nama Perwadag', 'No Surat Tugas', 'Temuan', 'Rekomendasi']);
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
      
      // Process each item
      for (const item of yearItems) {
        const temuanRekomendasi = item.temuan_rekomendasi_summary?.data || [];
        
        if (temuanRekomendasi.length === 0) {
          // If no temuan/rekomendasi, add single row
          const dataRow = worksheet.addRow([
            rowIndex,
            item.nama_perwadag,
            item.surat_tugas_info?.no_surat || '-',
            'Tidak ada temuan',
            'Tidak ada rekomendasi'
          ]);
          
          // Style the row
          dataRow.eachCell((cell: any, colNumber: any) => {
            cell.font = { size: 11, color: { argb: 'FF212121' } };
            cell.alignment = { 
              horizontal: colNumber === 1 ? 'center' : 'left', 
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
          // Multiple temuan/rekomendasi - merge nama_perwadag and no_surat_tugas cells
          const startRow = worksheet.lastRow ? worksheet.lastRow.number + 1 : currentRow + 1;
          
          for (let i = 0; i < temuanRekomendasi.length; i++) {
            const tr = temuanRekomendasi[i];
            const dataRow = worksheet.addRow([
              i === 0 ? rowIndex : '', // Only show number on first row
              i === 0 ? item.nama_perwadag : '', // Only show nama_perwadag on first row
              i === 0 ? (item.surat_tugas_info?.no_surat || '-') : '', // Only show no_surat on first row
              tr.temuan || '',
              tr.rekomendasi || ''
            ]);
            
            // Style the row
            dataRow.eachCell((cell: any, colNumber: any) => {
              cell.font = { size: 11, color: { argb: 'FF212121' } };
              cell.alignment = { 
                horizontal: colNumber === 1 ? 'center' : 'left', 
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
          
          // Merge cells for nama_perwadag and no_surat_tugas if multiple rows
          if (temuanRekomendasi.length > 1) {
            worksheet.mergeCells(`A${startRow}:A${endRow}`); // No column
            worksheet.mergeCells(`B${startRow}:B${endRow}`); // Nama Perwadag column
            worksheet.mergeCells(`C${startRow}:C${endRow}`); // No Surat Tugas column
            
            // Center align merged cells
            worksheet.getCell(`A${startRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
            worksheet.getCell(`B${startRow}`).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
            worksheet.getCell(`C${startRow}`).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
          }
          
          rowIndex++;
        }
      }
    }

    // Set workbook properties
    workbook.creator = 'Sistem Evaluasi';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Generate filename
    const yearSuffix = selectedYear !== 'all' ? `_${selectedYear}` : '_Semua_Tahun';
    const fileName = `Matriks_Temuan_Rekomendasi${yearSuffix}_${new Date().toISOString().split('T')[0]}.xlsx`;

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