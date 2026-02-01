const ExcelJS = require('exceljs');
const path = require('path');

async function checkUsers() {
  try {
    const wb = new ExcelJS.Workbook();
    const filePath = path.join(__dirname, 'data', 'BDD1.xlsx');
    await wb.xlsx.readFile(filePath);
    
    const ws = wb.getWorksheet('Utisers');
    console.log('Total rows:', ws.rowCount);
    
    let count = 0;
    ws.eachRow((row, rowNum) => {
      if (count < 10) {
        console.log(`Row ${rowNum}:`, row.values);
        count++;
      }
    });
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkUsers();
