const ExcelJS = require('exceljs');
const path = require('path');

async function addCurrencyColumn() {
  const filePath = path.join(__dirname, './data/BDD1.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet('Utisers');
  
  // Add the currency header at column 19
  const headerRow = sheet.getRow(1);
  headerRow.getCell(19).value = 'devise';
  
  // Set default value 'eur' for all existing users
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    row.getCell(19).value = 'eur'; // Default currency
  });
  
  await workbook.xlsx.writeFile(filePath);
  console.log('✓ Currency column added successfully!');
}

addCurrencyColumn().catch(err => console.error('Error:', err));
