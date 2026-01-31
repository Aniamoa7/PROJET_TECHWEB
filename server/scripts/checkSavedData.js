const ExcelJS = require('exceljs');
const path = require('path');

async function checkSavedData() {
  const filePath = path.join(__dirname, './data/BDD1.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet('Utisers');
  
  // Un essayer pour un id specifique, prck n L API marche pas 
  const userId = '1769718198386';
  let foundUser = false;
  
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; 
    const id = String(row.getCell(1).value || '');
    
    if (id === userId) {
      foundUser = true;
      console.log('✓ User found in database!');
      console.log('\nSaved data:');
      console.log('ID:', row.getCell(1).value);
      console.log('Prénom:', row.getCell(2).value);
      console.log('Nom:', row.getCell(3).value);
      console.log('Email:', row.getCell(4).value);
      console.log('Mot de passe (hash):', row.getCell(5).value);
      console.log('Téléphone (numTel):', row.getCell(6).value);
      console.log('Langue:', row.getCell(7).value);
      console.log('Thème:', row.getCell(8).value);
      console.log('Date création:', row.getCell(9).value);
      console.log('Rôle:', row.getCell(10).value);
      console.log('Adresse:', row.getCell(11).value);
      console.log('Ville:', row.getCell(12).value);
      console.log('Code postal:', row.getCell(13).value);
      console.log('Pays:', row.getCell(14).value);
      console.log('Nom carte:', row.getCell(15).value);
      console.log('Numéro carte:', row.getCell(16).value);
      console.log('Date expiration:', row.getCell(17).value);
      console.log('CVV:', row.getCell(18).value);
    }
  });
  
  if (!foundUser) {
    console.log('✗ User with ID', userId, 'not found in database');
  }
}

checkSavedData().catch(err => console.error('Error:', err));
