const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getAllRows, addRow, updateRow } = require('../utils/excel');

// MUHIM di l excel ismis UTISERS
const USERS_SHEET = 'Utisers';


function rowToUser(row) {
  return {
    id: String(row[0]),
    prenom: String(row[1] || ''),
    nom: String(row[2] || ''),
    email: String(row[3] || ''),
    phone: String(row[5] || ''),
    language: String(row[6] || 'fr'),
    theme: String(row[7] || 'light'),
    createdAt: String(row[8] || ''),
    role: String(row[9] || 'user'),
    
    adresse: String(row[10] || ''),
    ville: String(row[11] || ''),
    codepostal: String(row[12] || ''),
    pays: String(row[13] || ''),
    nomcarte: String(row[14] || ''),
    numcarte: String(row[15] || ''),
    dateexp: String(row[16] || ''),
    cvv: String(row[17] || ''),
    currency: String(row[18] || 'eur') 
  };
}


router.post('/signup', async (req, res) => {
  try {
    const { prenom, nom, email, password, phone } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    
    const rows = await getAllRows(USERS_SHEET);
    const emailExists = rows.some(row => String(row[3]).toLowerCase() === email.toLowerCase());
    if (emailExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // faut hasher le mdp
    const passwordHash = await bcrypt.hash(password, 10);

    
    const newId = Date.now().toString();

    
    await addRow(USERS_SHEET, [
      newId,
      prenom || '',
      nom || '',
      email,
      passwordHash,
      phone || '',
      'fr',
      'light',
      new Date().toISOString(),
      'user'
    ]);

    
    const token = jwt.sign({ id: newId }, process.env.JWT_SECRET, { expiresIn: '7d' });

    
    res.status(201).json({
      token,
      user: {
        id: newId,
        prenom: prenom || '',
        nom: nom || '',
        email,
        role: 'user'
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed', details: err.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    
    const rows = await getAllRows(USERS_SHEET);
    const userRow = rows.find(row => String(row[3]).toLowerCase() === email.toLowerCase());

    if (!userRow) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    
    const passwordHash = userRow[4];
    const isValid = await bcrypt.compare(password, passwordHash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    
    const user = rowToUser(userRow);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});


router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const rows = await getAllRows(USERS_SHEET);
    const userRow = rows.find(row => String(row[0]) === req.user.id);

    if (!userRow) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rowToUser(userRow);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user', details: err.message });
  }
});


router.put('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const rows = await getAllRows(USERS_SHEET);
    const rowIndex = rows.findIndex(row => String(row[0]) === req.user.id);
    if (rowIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existing = rows[rowIndex];
    const {
      prenom,
      nom,
      phone,
      language,
      theme
    } = req.body;

    const updatedRow = [
      existing[0],
      prenom !== undefined ? String(prenom).trim() : existing[1],
      nom !== undefined ? String(nom).trim() : existing[2],
      existing[3],
      existing[4],
      phone !== undefined ? String(phone).trim() : existing[5],
      language !== undefined ? String(language).trim() : existing[6],
      theme !== undefined ? String(theme).trim() : existing[7],
      existing[8],
      existing[9],
      // New fields
      req.body.adresse !== undefined ? String(req.body.adresse).trim() : existing[10],
      req.body.ville !== undefined ? String(req.body.ville).trim() : existing[11],
      req.body.codepostal !== undefined ? String(req.body.codepostal).trim() : existing[12],
      req.body.pays !== undefined ? String(req.body.pays).trim() : existing[13],
      req.body.nomcarte !== undefined ? String(req.body.nomcarte).trim() : existing[14],
      req.body.numcarte !== undefined ? String(req.body.numcarte).trim() : existing[15],
      req.body.dateexp !== undefined ? String(req.body.dateexp).trim() : existing[16],
      req.body.cvv !== undefined ? String(req.body.cvv).trim() : existing[17],
      req.body.currency !== undefined ? String(req.body.currency).trim() : existing[18]
    ];

    await updateRow(USERS_SHEET, rowIndex, updatedRow);

    const user = rowToUser(updatedRow);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
});

module.exports = router;
