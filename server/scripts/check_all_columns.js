const ExcelJS = require('exceljs');
const path = require('path');

async function checkAllColumns() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(__dirname, 'data', 'BDD1.xlsx'));
  const ws = wb.getWorksheet('Produit');
  
  console.log('===== ALL HEADERS =====');
  ws.getRow(1).eachCell((cell, colNum) => {
    console.log(`Column ${colNum}: ${cell.value}`);
  });
  
  console.log('\n===== ROW 3 DATA (all columns) =====');
  ws.getRow(3).eachCell((cell, colNum) => {
    console.log(`Column ${colNum}: ${cell.value}`);
  });
}

checkAllColumns().catch(console.error);
