const ExcelJS = require('exceljs');
const path = require('path');

async function listUsers() {
  const filePath = path.join(__dirname, './data/BDD1.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet('Utisers');
  
  console.log('All users in database:\n');
  let count = 0;
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    const id = row.getCell(1).value;
    const prenom = row.getCell(2).value;
    const nom = row.getCell(3).value;
    const email = row.getCell(4).value;
    
    console.log(`${count + 1}. ID: ${id}, Email: ${email}, Name: ${prenom} ${nom}`);
    count++;
    if (count >= 10) return; // Just show first 10
  });
}

listUsers().catch(err => console.error('Error:', err));
