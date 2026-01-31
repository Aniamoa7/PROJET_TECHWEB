const ExcelJS = require('exceljs');
const path = require('path');

async function checkProductNames() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(__dirname, 'data', 'BDD1.xlsx'));
  const ws = wb.getWorksheet('Produit');
  
  console.log('===== First 15 Product Names from Excel =====\n');
  
  for (let i = 2; i <= 16; i++) {
    const row = ws.getRow(i);
    const name = row.getCell(2).value;
    console.log(`Row ${i}: "${name}"`);
  }
}

checkProductNames().catch(console.error);
