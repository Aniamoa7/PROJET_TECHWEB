const ExcelJS = require('exceljs');
const path = require('path');

const filePath = path.join(__dirname, 'data/BDD1.xlsx');

async function addBeneficesCompositionColumns() {
  try {
    console.log('📂 Opening Excel file...');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.getWorksheet('Produit');
    
    // CEST genre pour rcup le header courant
    const headerRow = sheet.getRow(1);
    console.log('Current columns:', headerRow.values);
    
    // pour ajouter des header de genre des nouvelles colonnes
    headerRow.getCell(10).value = 'composition';
    headerRow.getCell(11).value = 'benefices';
    
    console.log('YES! Added columns at positions 10 and 11');
    console.log('Updated header:', headerRow.values);
    
    // la sauvgarde du fichier, faut pas que j oublie
    await workbook.xlsx.writeFile(filePath);
    console.log('YUP! Excel file updated successfully!');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

addBeneficesCompositionColumns();
