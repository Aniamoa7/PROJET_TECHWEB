const ExcelJS = require('exceljs');
const path = require('path');

async function main() {
  const filePath = path.join(__dirname, './data/BDD1.xlsx');
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet('Utisers');
  
  console.log('\n=== CHECKING USER DATA ===\n');
  
  const userId = '1769718198386';
  let found = false;
  
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    
    const currentId = String(row.getCell(1).value || '');
    if (currentId === userId) {
      found = true;
      console.log('✓ USER FOUND IN DATABASE!\n');
      console.log('ID:', row.getCell(1).value);
      console.log('Prénom:', row.getCell(2).value);
      console.log('Nom:', row.getCell(3).value);
      console.log('Email:', row.getCell(4).value);
      console.log('Téléphone:', row.getCell(6).value);
      console.log('Adresse:', row.getCell(11).value);
      console.log('Ville:', row.getCell(12).value);
      console.log('Code postal:', row.getCell(13).value);
      console.log('Pays:', row.getCell(14).value);
      console.log('Nom carte:', row.getCell(15).value);
      console.log('Numéro carte:', row.getCell(16).value);
      console.log('Date expiration:', row.getCell(17).value);
      console.log('CVV:', row.getCell(18).value);
      console.log('\n=== DATA SAVED SUCCESSFULLY ===\n');
      process.exit(0);
    }
  });
  
  if (!found) {
    console.log('✗ User not found');
    process.exit(1);
  }
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
