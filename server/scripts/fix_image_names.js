const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function updateImages() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.join(__dirname, 'data', 'BDD1.xlsx'));
  
  const ws = workbook.getWorksheet('Produit');
  const imagePath = path.join(__dirname, '..', 'Magasin', 'ImagesProd');
  
  // Get list of image files that start with "1" (primary images)
  const files = fs.readdirSync(imagePath);
  const imageMap = {};
  
  files.forEach(file => {
    if (file.startsWith('1')) {
      // Extract product name from filename (e.g., "1vitamine-c-serum.png" -> "vitamine-c-serum")
      const baseName = file.substring(1); // Remove leading "1"
      // Try to find matching product in database by checking the file
      imageMap[file] = baseName;
    }
  });

  // Read all rows to match with images
  if (ws) {
    let updateCount = 0;
    for (let r = 2; r <= 100; r++) {
      const row = ws.getRow(r);
      const id = row.getCell(1).value;
      const name = row.getCell(2).value;
      
      if (!name) break; // No more products
      
      // Find matching image file by checking if filename starts with "1" and contains product keywords
      // Look for files in format "1<something>"
      const productNameLower = String(name).toLowerCase();
      let matchedFile = null;
      
      // Direct matching strategy: check for filename containing product name keywords
      for (const file of files) {
        if (file.startsWith('1')) {
          const fileLower = file.toLowerCase();
          // Simple heuristic: if first few words of product name are in filename
          const words = productNameLower.split(' ').slice(0, 2);
          let hasMatch = words.some(word => fileLower.includes(word.substring(0, 4)));
          
          if (hasMatch) {
            matchedFile = file;
            break;
          }
        }
      }
      
      if (matchedFile) {
        const currentValue = row.getCell(5).value;
        row.getCell(5).value = matchedFile;
        console.log(`Row ${r}: "${name}" -> updated image1 to "${matchedFile}"`);
        updateCount++;
      } else {
        console.log(`Row ${r}: "${name}" -> NO MATCH FOUND`);
      }
    }
    
    // Save the workbook
    await workbook.xlsx.writeFile(path.join(__dirname, 'data', 'BDD1.xlsx'));
    console.log(`\nUpdated ${updateCount} product image filenames in Excel`);
  }
}

updateImages().catch(console.error);
