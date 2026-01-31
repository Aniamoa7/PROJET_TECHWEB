const { getSheet, getAllRows } = require('./src/utils/excel');

async function debug() {
  try {
    console.log(' Reading Produit sheet...');
    const sheet = await getSheet('Produit');
    console.log(' Sheet loaded');

    const headerRow = sheet.getRow(1).values.slice(1);
    console.log(' Header row:', headerRow);

    const rows = await getAllRows('Produit');
    console.log(`YES! Loaded ${rows.length} products`);

    if (rows.length > 0) {
      console.log('\n First product row:', rows[0]);
      
      
      const headerMap = {};
      headerRow.forEach((h, i) => {
        if (h && String(h).trim()) headerMap[String(h).toLowerCase().trim()] = i;
      });
      
      console.log('\n  Header map:', headerMap);
      
      // Check for composition and benefices columns
      const hasComposition = Object.keys(headerMap).includes('composition');
      const hasBenefices = Object.keys(headerMap).includes('benefices') || Object.keys(headerMap).includes('bénéfices');
      
      console.log(`\n Composition column exists: ${hasComposition}`);
      console.log(` Benefices column exists: ${hasBenefices}`);
      
      if (hasComposition) {
        const compIndex = headerMap['composition'];
        console.log(` Composition data in row 0: "${rows[0][compIndex]}"`);
      }
      
      if (hasBenefices) {
        const benIndex = headerMap['benefices'] || headerMap['bénéfices'];
        console.log(` Benefices data in row 0: "${rows[0][benIndex]}"`);
      }
    }
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

debug();
