const { getSheet, getAllRows } = require('./src/utils/excel');
//Pour le debugaage voir ce qui ya dans la console, genre en cas d erreur 
async function debug() {
  try {
    console.log('📖 Reading Produit sheet...\n');
    const sheet = await getSheet('Produit');
    
    const headerRow = sheet.getRow(1).values.slice(1);
    console.log('📋 Header row (all columns):');
    headerRow.forEach((h, i) => {
      console.log(`  [${i}] ${h}`);
    });

    const rows = await getAllRows('Produit');
    console.log(`\nYes! Loaded ${rows.length} products`);

    if (rows.length > 0) {
      console.log('\nVOILA: First product data:');
      rows[0].forEach((val, i) => {
        const header = headerRow[i] || `Column ${i}`;
        const preview = String(val || '').substring(0, 60);
        console.log(`  [${i}] ${header}: "${preview}${String(val || '').length > 60 ? '...' : ''}"`);
      });
      
      // construire une map pour les header
      const headerMap = {};
      headerRow.forEach((h, i) => {
        if (h && String(h).trim()) headerMap[String(h).toLowerCase().trim()] = i;
      });
      
      console.log('\n  Header map keys:');
      Object.keys(headerMap).forEach(k => console.log(`  "${k}" -> index ${headerMap[k]}`));
      
    
      console.log('\n What the backend code extracts:');
      
      const getByName = (names, fallbackIndex) => {
        for (const n of names) {
          const key = String(n || '').toLowerCase().trim();
          if (key && typeof headerMap[key] === 'number') {
            console.log(`    ✓ Found "${key}" at index ${headerMap[key]}`);
            return rows[0][headerMap[key]];
          }
        }
        console.log(`    ✗ Not found by name, using fallback index ${fallbackIndex}`);
        return rows[0][fallbackIndex];
      };
      
      console.log('  Extracting COMPOSITION:');
      const compositionRaw = String(getByName(['composition'], 9) || '');
      console.log(`    Raw: "${compositionRaw.substring(0, 80)}${compositionRaw.length > 80 ? '...' : ''}"`);
      
      console.log('  Extracting BENEFICES:');
      const beneficesRaw = String(getByName(['benefices', 'bénéfices', 'benefit'], 10) || '');
      console.log(`    Raw: "${beneficesRaw.substring(0, 80)}${beneficesRaw.length > 80 ? '...' : ''}"`);
      
      console.log('\n✨ Parsed result:');
      const composition = compositionRaw ? compositionRaw.split(/\r?\n/).map(s => s.trim()).filter(Boolean) : [];
      const benefices = beneficesRaw ? beneficesRaw.split(/\r?\n/).map(s => s.trim()).filter(Boolean) : [];
      console.log(`  Composition items: ${composition.length}`, composition);
      console.log(`  Benefices items: ${benefices.length}`, benefices);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  process.exit(0);
}

debug();
