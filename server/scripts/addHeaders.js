const ExcelJS = require('exceljs');
const path = require('path');

async function addHeaderColumns() {
  const filePath = path.join(__dirname, './data/BDD1.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet('Utisers');
  
  // bref wigi cest pour les colonnes ni que jai oublié
  const headerRow = sheet.getRow(1);
  headerRow.getCell(11).value = 'adresse';
  headerRow.getCell(12).value = 'ville';
  headerRow.getCell(13).value = 'codepostal';
  headerRow.getCell(14).value = 'pays';
  headerRow.getCell(15).value = 'nomcarte';
  headerRow.getCell(16).value = 'numcarte';
  headerRow.getCell(17).value = 'dateexp';
  headerRow.getCell(18).value = 'cvv';
  
  await workbook.xlsx.writeFile(filePath);
  console.log('✓ Headers added successfully!');
  
  // Verification
  const updatedSheet = workbook.getWorksheet('Utisers');
  const verifyHeaderRow = updatedSheet.getRow(1);
  console.log('\nUpdated headers:');
  for (let i = 1; i <= 18; i++) {
    const cell = verifyHeaderRow.getCell(i);
    console.log(`Column ${i}: "${cell.value}"`);
  }
}

addHeaderColumns().catch(err => console.error('Error:', err));
