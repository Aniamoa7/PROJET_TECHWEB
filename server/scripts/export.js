const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    const filePath = path.join(__dirname, './data/BDD1.xlsx');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.getWorksheet('Utisers');
    
    let result = '';
    const userId = '1769718198386';
    let found = false;
    
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      if (String(row.getCell(1).value) === userId) {
        found = true;
        result = `✓ USER DATA FOUND AND SAVED!\n\n`;
        result += `ID: ${row.getCell(1).value}\n`;
        result += `Prénom: ${row.getCell(2).value}\n`;
        result += `Nom: ${row.getCell(3).value}\n`;
        result += `Email: ${row.getCell(4).value}\n`;
        result += `Téléphone: ${row.getCell(6).value}\n`;
        result += `Adresse: ${row.getCell(11).value}\n`;
        result += `Ville: ${row.getCell(12).value}\n`;
        result += `Code postal: ${row.getCell(13).value}\n`;
        result += `Pays: ${row.getCell(14).value}\n`;
        result += `Nom carte: ${row.getCell(15).value}\n`;
        result += `Numéro carte: ${row.getCell(16).value}\n`;
        result += `Date expiration: ${row.getCell(17).value}\n`;
        result += `CVV: ${row.getCell(18).value}\n`;
      }
    });
    
    if (!found) {
      result = '✗ User not found';
    }
    
    fs.writeFileSync(path.join(__dirname, 'user_output.txt'), result);
    console.log(result);
  } catch (e) {
    console.error('ERROR:', e.message);
  }
})();
