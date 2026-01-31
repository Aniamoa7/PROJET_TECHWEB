const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

//je refais zmer n tagi mille fois, uggint ad lhunt
async function updateImagesAccurate() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.join(__dirname, 'data', 'BDD1.xlsx'));
  
  const ws = workbook.getWorksheet('Produit');
  const imagePath = path.join(__dirname, '..', 'Magasin', 'ImagesProd');
  
  // Recupere la liste de toutes les images, depuis excel 
  const files = fs.readdirSync(imagePath);
  
  //chercher celles qui commencev avec 1
  const primaryImages = files.filter(f => f.startsWith('1'));
  
  // creation du mappaging, negh mapping, jsp comment on dit 
  const imageByProductName = {};
  primaryImages.forEach(file => {
    let baseName = file.substring(1); 
    const nameWithoutExt = baseName.replace(/\.(png|jpg|jpeg|avif|webp)$/i, '');
    imageByProductName[nameWithoutExt.toLowerCase()] = file;
  });

  console.log('Available product images:');
  Object.keys(imageByProductName).slice(0, 10).forEach(key => {
    console.log(`  - ${key} -> ${imageByProductName[key]}`);
  });

  // on fait ca a toutes les lignes gene touts le sprodits nni 
  if (ws) {
    let updateCount = 0;
    for (let r = 2; r <= 100; r++) {
      const row = ws.getRow(r);
      const id = row.getCell(1).value;
      const name = row.getCell(2).value;
      
      if (!name) break; 
      
      const nameLower = String(name).toLowerCase();
      
   
      if (imageByProductName[nameLower]) {
        const matchedFile = imageByProductName[nameLower];
        row.getCell(5).value = matchedFile;
        console.log(`Row ${r}: "${name}" -> "${matchedFile}" (exact match)`);
        updateCount++;
        continue;
      }
      
      // icic cest pour assurer que genre si je vais une recherche avec soit disant un mot et ce mot est contenu dans nimporte quel nom de nimport quel produit ces produits seront loaded avec l api apres je pense je vais 
      // je pense apres je vais faire les suggestion je vais voir 
      const words = nameLower.split(' ').filter(w => w.length > 2).slice(0, 3);
      let bestMatch = null;
      for (const [imgName, file] of Object.entries(imageByProductName)) {
        let matchScore = 0;
        for (const word of words) {
          if (imgName.includes(word)) matchScore++;
        }
        if (matchScore >= 2) {
          bestMatch = file;
          break;
        }
      }
      
      if (bestMatch) {
        row.getCell(5).value = bestMatch;
        console.log(`Row ${r}: "${name}" -> "${bestMatch}" (partial match)`);
        updateCount++;
      } else {
        console.log(`Row ${r}: "${name}" -> NO MATCH`);
      }
    }
    
    
    await workbook.xlsx.writeFile(path.join(__dirname, 'data', 'BDD1.xlsx'));
    console.log(`\nUpdated ${updateCount} product image filenames in Excel`);
  }
}

updateImagesAccurate().catch(console.error);
