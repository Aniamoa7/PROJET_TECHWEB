const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, './data/BDD1.xlsx');
console.log('Looking for file at:', filePath);
console.log('File exists:', fs.existsSync(filePath));

if (fs.existsSync(filePath)) {
  const stats = fs.statSync(filePath);
  console.log('File size:', stats.size, 'bytes');
  console.log('Last modified:', stats.mtime);
}
