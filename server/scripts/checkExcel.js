const ExcelJS = require('exceljs');
const path = require('path');

async function checkExcel() {
  const filePath = path.join(__dirname, './data/BDD1.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet('Utisers');
  
  console.log('Sheet name:', sheet.name);
  console.log('Total columns:', sheet.columnCount);
  console.log('Total rows:', sheet.rowCount);
  
  // recupere un enregistrement, une ligne quoi
  const headerRow = sheet.getRow(1);
  console.log('\nHeader columns:');
  for (let i = 1; i <= Math.max(sheet.columnCount, 20); i++) {
    const cell = headerRow.getCell(i);
    console.log(`Column ${i}: "${cell.value}"`);
  }
  
  // recup la premiere ligne pour verification 
  console.log('\nFirst data row:');
  const firstRow = sheet.getRow(2);
  for (let i = 1; i <= Math.max(sheet.columnCount, 20); i++) {
    const cell = firstRow.getCell(i);
    console.log(`Column ${i}: "${cell.value}"`);
  }
}

checkExcel().catch(err => console.error('Error:', err));
