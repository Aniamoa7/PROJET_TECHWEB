const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '../../data/BDD1.xlsx');

let cache = { workbook: null, mtime: null };

function getFileMtime() {
  try {
    return fs.statSync(filePath).mtimeMs;
  } catch (e) {
    return null;
  }
}

async function loadWorkbook() {
  const mtime = getFileMtime();
  if (cache.workbook && cache.mtime === mtime) {
    return cache.workbook;
  }
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  cache.workbook = workbook;
  cache.mtime = mtime;
  return workbook;
}

function invalidateCache() {
  cache.workbook = null;
  cache.mtime = null;
}

async function getSheet(sheetName) {
  const workbook = await loadWorkbook();
  return workbook.getWorksheet(sheetName);
}

async function getAllRows(sheetName) {
  const sheet = await getSheet(sheetName);
  const rows = [];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; 
    const values = row.values.slice(1); 
    rows.push(values);
  });

  return rows;
}

async function addRow(sheetName, data) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet(sheetName);
  sheet.addRow(data);
  await workbook.xlsx.writeFile(filePath);
  invalidateCache();
}

async function updateRow(sheetName, rowIndex, data) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet(sheetName);
  const row = sheet.getRow(rowIndex + 2); 

  data.forEach((val, i) => {
    row.getCell(i + 1).value = val;
  });

  await workbook.xlsx.writeFile(filePath);
  invalidateCache();
}

async function deleteRow(sheetName, rowIndex) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet(sheetName);
  sheet.spliceRows(rowIndex + 2, 1); 
  await workbook.xlsx.writeFile(filePath);
  invalidateCache();
}

module.exports = { getSheet, getAllRows, addRow, updateRow, deleteRow };
