const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
// troisime fois ahyaaaaaaaa, toujours pour les images agi n zmer 
async function fixImagesCorrectly() {
  const workbook = new ExcelJS.Workbook();
  const excelPath = path.join(__dirname, 'data', 'BDD1.xlsx');
  const imagePath = path.join(__dirname, '..', 'Magasin', 'ImagesProd');
  
  await workbook.xlsx.readFile(excelPath);
  
  const ws = workbook.getWorksheet('Produit');
  const allFiles = fs.readdirSync(imagePath);
  
 
  // on map les images avec leurs chemins avec un ptit exemple en prmier liue pour l essae
  const imageMap = {};
  allFiles.forEach(file => {
    const match = file.match(/^(.+?)\s+1\.(\w+)$/); 
    if (match) {
      const productName = match[1];
      imageMap[productName] = file;
    }
  });

  console.log(`Found ${Object.keys(imageMap).length} products with images (1 variants)`);
  
  let updated = 0;
  if (ws) {
    for (let r = 2; r <= 100; r++) {
      const row = ws.getRow(r);
      const name = String(row.getCell(2).value || '').trim();
      
      if (!name) break;
      
      if (imageMap[name]) {
        row.getCell(5).value = imageMap[name];
        console.log(`✓ Row ${r}: ${name}`);
        updated++;
      } else {
        console.log(`✗ Row ${r}: ${name} (no match)`);
      }
    }
    
    await workbook.xlsx.writeFile(excelPath);
    console.log(`\nUpdated ${updated} products with correct image filenames`);
  }
}

fixImagesCorrectly().catch(console.error);
