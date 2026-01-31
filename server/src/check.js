const { getAllRows } = require('./utils/excel');
const fs = require('fs');
const path = require('path');

async function checkUsers() {
  try {
    const rows = await getAllRows('Utisers');
    const output = 'Users in database:\n' + JSON.stringify(rows, null, 2);
    console.log(output);
    fs.writeFileSync(path.join(__dirname, '../../check_output.txt'), output);
  } catch (err) {
    const errorMsg = 'Error reading users: ' + err.message;
    console.error(errorMsg);
    fs.writeFileSync(path.join(__dirname, '../../check_output.txt'), errorMsg);
  }
}

checkUsers();
