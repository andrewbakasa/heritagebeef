import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * Generates an Excel file from an array of objects
 * @param data - The array of records to export
 * @param fileName - Base name for the file
 */
export const exportToExcel = async (data: any[], fileName: string) => {
  if (!data || data.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Registry Data');

  // 1. Map columns based on data keys
  const columns = Object.keys(data[0]).map((key) => ({
    header: key.toUpperCase().replace(/_/g, ' '),
    key: key,
    width: 20,
  }));
  worksheet.columns = columns;

  // 2. Add data rows
  worksheet.addRows(data);

  // 3. Style the header row
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFF' }, size: 12 };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4A6741' }, // Brand Green
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // 4. Zebra striping for readability
  data.forEach((_, index) => {
    if (index % 2 === 0) {
      worksheet.getRow(index + 2).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F8F9FA' },
      };
    }
  });

  // 5. Write buffer and save
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  saveAs(blob, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};