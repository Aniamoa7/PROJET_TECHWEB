const ExcelJS = require('exceljs');
const path = require('path');

async function checkImages() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.join(__dirname, 'data', 'BDD1.xlsx'));
  
  const ws = workbook.getWorksheet('Produit');
  if (ws) {
    console.log('First 10 products - image filenames:');
    for (let r = 2; r <= 11; r++) {
      const row = ws.getRow(r);
      const id = row.getCell(1).value;
      const name = row.getCell(2).value;
      const img = row.getCell(5).value;
      console.log(`Row ${r}: id=${id}, name=${name}, image1=${img}`);
    }
  }
}

checkImages().catch(console.error);
