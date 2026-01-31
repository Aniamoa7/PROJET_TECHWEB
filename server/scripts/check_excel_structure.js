const ExcelJS = require('exceljs');
const path = require('path');

async function checkExcelStructure() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(__dirname, 'data', 'BDD1.xlsx'));
  const ws = wb.getWorksheet('Produit');
  
  console.log('=== HEADERS (Row 1) - All columns ===');
  const row1 = ws.getRow(1);
  row1.eachCell((cell, colNum) => {
    console.log(`Column ${colNum}: ${cell.value}`);
  });
  
  console.log('\n=== Row 3 Data (Sérum Vitamine C) ===');
  const row3 = ws.getRow(3);
  row3.eachCell((cell, colNum) => {
    console.log(`Column ${colNum}: ${cell.value}`);
  });
}

checkExcelStructure().catch(console.error);
