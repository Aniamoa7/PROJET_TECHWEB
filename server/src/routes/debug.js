const express = require('express');
const path = require('path');
const router = express.Router();
const { getAllRows } = require('../utils/excel');


const USERS_SHEET = 'Utisers';


router.get('/utisers', async (req, res) => {
  try {
    const rows = await getAllRows(USERS_SHEET);
    res.json({ count: rows.length, rows });
  } catch (err) {
    console.error('Failed to read users sheet:', err);
    res.status(500).json({ error: 'Failed to read users sheet', details: err.message });
  }
});

router.get('/download', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../../data/BDD1.xlsx');
    res.download(filePath, 'BDD1.xlsx', (err) => {
      if (err) {
        console.error('Download error:', err);
      }
    });
  } catch (err) {
    console.error('Failed to send file:', err);
    res.status(500).json({ error: 'Failed to send file', details: err.message });
  }
});

module.exports = router;
