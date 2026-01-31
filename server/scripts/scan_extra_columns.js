const { getSheet } = require('./src/utils/excel');

async function scan() {
  try {
    const sheet = await getSheet('Produit');
    const maxCols = sheet.actualColumnCount || 30;
    console.log('Scanning rows for non-empty columns beyond index 8...');
    for (let r = 2; r <= sheet.rowCount; r++) {
      const row = sheet.getRow(r).values.slice(1);
      const extras = [];
      for (let i = 9; i < Math.min(maxCols, 40); i++) {
        if (row[i] && String(row[i]).trim()) extras.push({col: i, val: String(row[i]).slice(0,80)});
      }
      if (extras.length) {
        console.log(`Row ${r} has extras:`, extras);
      }
    }
    console.log('Scan complete');
  } catch (err) {
    console.error('Error:', err);
  }
}

scan();
