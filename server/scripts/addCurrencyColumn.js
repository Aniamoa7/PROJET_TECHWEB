const ExcelJS = require('exceljs');
const path = require('path');

async function addCurrencyColumn() {
  const filePath = path.join(__dirname, './data/BDD1.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet('Utisers');
  
  // ajouter le header colonnne pour la devise currrency quoi
  const headerRow = sheet.getRow(1);
  headerRow.getCell(19).value = 'currency';
  
  // Smetter de svaleurs par defaut
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    if (!row.getCell(19).value) {
      row.getCell(19).value = 'eur'; 
    }
  });
  
  await workbook.xlsx.writeFile(filePath);
  console.log('✓ Currency column added successfully!');
}

addCurrencyColumn().catch(err => console.error('Error:', err));
