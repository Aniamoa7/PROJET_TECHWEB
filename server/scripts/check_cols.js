const ExcelJS = require('exceljs');
const path = require('path');

async function checkColumns() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.join(__dirname, 'data/BDD1.xlsx'));
  const sheet = workbook.getWorksheet('Produit');
  const row = sheet.getRow(1);
  console.log(row.values);
  process.exit(0);
}

checkColumns().catch(e => {
  console.error(e);
  process.exit(1);
});
