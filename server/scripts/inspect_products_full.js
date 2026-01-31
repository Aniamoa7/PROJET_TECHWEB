console.log('=> inspect_products_full.js starting');
const { getSheet } = require('./src/utils/excel');
async function inspect() {
  try {
    const sheet = await getSheet('Produit');
    const maxCols = 20;
    console.log('Showing header columns 0..' + (maxCols-1));
    const headerRow = sheet.getRow(1).values.slice(1);
    for (let i=0;i<maxCols;i++) console.log(`${i}: ${String(headerRow[i] || '')}`);

    console.log('\nFirst 5 product rows (cols 0..' + (maxCols-1) + '):');
    for (let r = 2; r <= Math.min(6, sheet.rowCount); r++) {
      const row = sheet.getRow(r).values.slice(1);
      console.log(`Row ${r}:`);
      for (let i=0;i<maxCols;i++) console.log(`  ${i}: ${String(row[i] || '')}`);
      console.log('---');
    }
  } catch (err) {
    console.error('Error reading sheet:', err);
  }
}

inspect();
