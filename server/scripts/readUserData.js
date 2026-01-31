const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function checkData() {
  try {
    const filePath = path.join(__dirname, 'data/BDD1.xlsx');
    console.log('Reading file:', filePath);
    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.getWorksheet('Utisers');
    
    const userId = '1769718198386';
    let output = '';
    
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const id = String(row.getCell(1).value || '');
      
      if (id === userId) {
        output = `✓ User found!\n`;
        output += `ID: ${row.getCell(1).value}\n`;
        output += `Prénom: ${row.getCell(2).value}\n`;
        output += `Nom: ${row.getCell(3).value}\n`;
        output += `Email: ${row.getCell(4).value}\n`;
        output += `Téléphone: ${row.getCell(6).value}\n`;
        output += `Adresse: ${row.getCell(11).value}\n`;
        output += `Ville: ${row.getCell(12).value}\n`;
        output += `Code postal: ${row.getCell(13).value}\n`;
        output += `Pays: ${row.getCell(14).value}\n`;
        output += `Nom carte: ${row.getCell(15).value}\n`;
        output += `Numéro carte: ${row.getCell(16).value}\n`;
        output += `Date expiration: ${row.getCell(17).value}\n`;
        output += `CVV: ${row.getCell(18).value}\n`;
      }
    });
    
    console.log(output);
    fs.writeFileSync(path.join(__dirname, 'user_data.txt'), output);
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkData();
