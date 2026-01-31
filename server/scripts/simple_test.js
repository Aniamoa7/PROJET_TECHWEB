console.time('ExcelReading');
const ExcelJS = require('exceljs');
const path = require('path');

const filePath = path.join(__dirname, 'data/BDD1.xlsx');
console.log('Reading file:', filePath);

const workbook = new ExcelJS.Workbook();
workbook.xlsx.readFile(filePath).then(() => {
  console.log('YES! File loaded');
  const worksheet = workbook.getWorksheet('Produit');
  if (!worksheet) {
    console.log('❌ Produit sheet not found');
    console.log('Available sheets:', workbook.sheetNames);
    return;
  }
  
  console.log('YUESS! Produit sheet found');
  
  
  const headerRow = [];
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headerRow[colNumber] = cell.value;
  });
  console.log('Headers:', headerRow.slice(1, 15));
  
  
  let count = 0;
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1 && count < 2) {
      const values = [];
      row.eachCell((cell, colNumber) => {
        values[colNumber] = cell.value;
      });
      console.log(`\n Row ${rowNumber}:`, values.slice(1, 12));
      count++;
    }
  });
  
  console.timeEnd('ExcelReading');
}).catch(err => {
  console.error('❌ Error reading Excel:', err.message);
  console.timeEnd('ExcelReading');
});
