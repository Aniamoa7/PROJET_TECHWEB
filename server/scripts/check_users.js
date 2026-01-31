const ExcelJS = require('exceljs');
const path = require('path');

(async () => {
  try {
    const filePath = path.join(__dirname, 'data', 'BDD1.xlsx');
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(filePath);
    const sh = wb.getWorksheet('Utisers');
    
    const totalUsers = sh.lastRow.number - 1; // Subtract 1 for header
    console.log('=== EXCEL DATABASE SUMMARY ===');
    console.log('Total users saved: ' + totalUsers);
    console.log('');
    
    const lastRow = sh.getRow(sh.lastRow.number).values.slice(1);
    console.log('Most recent user:');
    console.log('  Email: ' + lastRow[3]);
    console.log('  Name: ' + lastRow[1] + ' ' + lastRow[2]);
    console.log('  Created: ' + lastRow[8]);
    
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
