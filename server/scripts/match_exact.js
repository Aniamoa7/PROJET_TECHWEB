const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function matchImagesDirectly() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.join(__dirname, 'data', 'BDD1.xlsx'));
  
  const ws = workbook.getWorksheet('Produit');
  const imagePath = path.join(__dirname, '..', 'Magasin', 'ImagesProd');
  
  // metttre toutes les images dans un directory 
  const allFiles = fs.readdirSync(imagePath);
  
  // on groupe les images apr nom du produit 
  const imagesByProduct = {};
  allFiles.forEach(file => {
    const match = file.match(/^(.+?)\s+(\d+)\.\w+$/); // Match "Name 1.ext"
    if (match) {
      const productName = match[1];
      if (!imagesByProduct[productName]) {
        imagesByProduct[productName] = [];
      }
      imagesByProduct[productName].push(file);
    }
  });

  console.log(`Found ${Object.keys(imagesByProduct).length} unique products with images`);
  console.log('Sample products:');
  Object.keys(imagesByProduct).slice(0, 5).forEach(p => {
    console.log(`  - "${p}" -> ${imagesByProduct[p][0]}`);
  });

  // apres on va tout match excel et les images
  if (ws) {
    let updateCount = 0;
    for (let r = 2; r <= 100; r++) {
      const row = ws.getRow(r);
      const id = row.getCell(1).value;
      const name = row.getCell(2).value;
      
      if (!name) break;
      
      const nameStr = String(name).trim();
      
      if (imagesByProduct[nameStr] && imagesByProduct[nameStr].length > 0) {
        const firstImage = imagesByProduct[nameStr][0]; // Use first image (1)
        row.getCell(5).value = firstImage;
        console.log(`Row ${r}: "${nameStr}" -> "${firstImage}"`);
        updateCount++;
      } else {
        console.log(`Row ${r}: "${nameStr}" -> NO MATCH`);
      }
    }
    
    // Save
    await workbook.xlsx.writeFile(path.join(__dirname, 'data', 'BDD1.xlsx'));
    console.log(`\nUpdated ${updateCount} rows`);
  }
}

matchImagesDirectly().catch(console.error);
