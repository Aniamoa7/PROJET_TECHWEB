const ExcelJS = require('exceljs');
const path = require('path');

// Sample data for different products
const sampleData = {
  'Crème hydratante Aloe Vera': {
    composition: 'Aloe Vera\nGlycérine\nVitamine E\nExtrait de Camomille',
    benefices: 'Hydrate intensément\nCalme les irritations\nProtège la peau sensible\nLisse et apaise'
  },
  'Sérum Vitamine C': {
    composition: 'Vitamine C 20%\nHyaluronate\nExtrait de Rose\nHuile de Jojoba',
    benefices: 'Éclaircit la peau\nRéduit les ridules\nUnifie le teint\nRenforce l\'éclat naturel'
  },
  'Masque à l\'argile verte': {
    composition: 'Argile Verte\nThé Vert\nMiel\nExtrait d\'Arnica',
    benefices: 'Purifie les pores\nÉlimine les impuretés\nMatifie la peau\nRévèle l\'éclat'
  },
  'Nettoyant visage doux': {
    composition: 'Savon Doux\nCamomille\nLait d\'Avoine\nGlycérine',
    benefices: 'Nettoie sans agresser\nRespect du pH naturel\nSouplesse de la peau\nSenteur apaisante'
  },
  'Huile d\'Argan Pure': {
    composition: 'Huile d\'Argan 100%\nVitamine E\nAcide Oléique\nAcides Gras Essentiels',
    benefices: 'Nourrit profondément\nRépare les cheveux\nRedonne de l\'éclat\nAntioxydant naturel'
  }
};

async function populateData() {
  try {
    console.log(' Ouverture fichier excel...');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname, 'data/BDD1.xlsx'));
    const sheet = workbook.getWorksheet('Produit');
    
    console.log(' Populating benefices and composition...');
    let updated = 0;
   
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; 
      
      const productName = row.getCell(2).value; 
      
  
      let foundSample = false;
      for (const [key, data] of Object.entries(sampleData)) {
        if (productName && productName.toLowerCase().includes(key.toLowerCase())) {
          row.getCell(10).value = data.composition; 
          row.getCell(11).value = data.benefices; 
          console.log(`  ✓ ${productName}`);
          updated++;
          foundSample = true;
          break;
        }
      }
     
      if (!foundSample && productName) {
        row.getCell(10).value = 'Ingrédients premium\nFormule exclusive\nDérivé naturel\nSans additifs';
        row.getCell(11).value = 'Résultat visible\nQualité supérieure\nSûr et efficace\nPour tous les types de peau';
        console.log(`  • ${productName} (generic data)`);
        updated++;
      }
    });
    
    console.log(`\nYES!!! Updated ${updated} products`);
    
    // Save the file
    await workbook.xlsx.writeFile(path.join(__dirname, 'data/BDD1.xlsx'));
    console.log('Yup!!!! Excel file saved successfully!');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  process.exit(0);
}

populateData();
