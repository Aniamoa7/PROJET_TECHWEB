const { getSheet } = require('./src/utils/excel');

async function inspect() {
  try {
    const sheet = await getSheet('Produit');
    
    const headerRow = sheet.getRow(1).values.slice(1);
    console.log('Header columns (index -> name):');
    headerRow.forEach((h, i) => console.log(`${i}: ${String(h || '')}`));

    console.log('\nFirst 5 product rows:');
    for (let r = 2; r <= Math.min(6, sheet.rowCount); r++) {
      const row = sheet.getRow(r).values.slice(1);
      console.log(`Row ${r}:`);
      row.forEach((v, i) => console.log(`  ${i}: ${String(v || '')}`));
      console.log('---');
    }
  } catch (err) {
    console.error('Error reading sheet:', err);
  }
}

inspect();
