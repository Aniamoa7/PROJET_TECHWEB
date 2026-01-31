const express = require('express');
const router = express.Router();
const { getAllRows, getSheet } = require('../utils/excel');
const path = require('path');
const fs = require('fs');

const imagePath = path.join(__dirname, '../../../Magasin/ImagesProd');

// Genre faut faire en sorte que une ligne exel soit conveti en objet produit 

function rowToProduct(row, headerMap = {}) {
  const getByName = (names, fallbackIndex) => {
    for (const n of names) {
      const key = String(n || '').toLowerCase().trim();
      if (key && typeof headerMap[key] === 'number') return row[headerMap[key]];
    }
    return row[fallbackIndex];
  };

  const rawCategory = String(getByName(['category', 'categorie'], 2) || '');
  const category = rawCategory.trim();
  const compositionRaw = String(getByName(['composition'], 9) || '');
  const beneficesRaw = String(getByName(['benefices', 'bénéfices', 'benefit'], 10) || '');

  
  const imageRaw = String(getByName(['image', 'image1'], 4) || '');
  const image1Normalized = imageRaw ? path.basename(String(imageRaw).replace(/\\/g, '/')) : '';

  return {
    id: String(getByName(['id'], 0)),
    name: String(getByName(['name', 'nom'], 1) || ''),
    category,
    price: parseFloat(getByName(['prix', 'price'], 3)) || 0,
    image1: image1Normalized,
    image2: '',
    image3: '',
    description: String(getByName(['desc', 'description'], 5) || ''),
    composition: compositionRaw ? compositionRaw.split(/\r?\n/).map(s => s.trim()).filter(Boolean) : [],
    benefices: beneficesRaw ? beneficesRaw.split(/\r?\n/).map(s => s.trim()).filter(Boolean) : [],
    stock: parseInt(getByName(['stock'], 6)) || 0,
    visible: (function(){ const v = getByName(['visible(true/false)', 'visible'],7); return v !== false && String(v || '').toLowerCase() !== 'false'; })(),
    slug: String(getByName(['name','nom'],1) || '').toLowerCase().replace(/\s+/g, '-'),
    createdAt: String(getByName(['ajouteLe','createdat'],8) || '')
  };
}


function findImages(product, fileList) {
  let files = fileList;
  if (!files) {
    try {
      files = fs.readdirSync(imagePath);
    } catch (err) {
      return { image1: '', image2: '', image3: '' };
    }
  }

  const norm = s => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const excelImage = String(product.image1 || '').trim();
  const productName = String(product.name || '').trim();
  const excelImageNoExt = excelImage.replace(/\.[a-z0-9]{1,6}$/i, '').trim();
  const normExcelImage = norm(excelImageNoExt);
  const normProductName = norm(productName);
  let searchBase = normExcelImage || normProductName;

  if (!searchBase) {
    return { image1: '', image2: '', image3: '' };
  }

  const baseForNums = searchBase.replace(/\s+[123]$/i, '').trim();

  const findImageByNumber = (num) => {
    return files.find(f => {
      const normFile = norm(f).replace(/\.[a-z0-9]+$/i, '').trim();
      return normFile === `${baseForNums} ${num}` || normFile === `${baseForNums}${num}`;
    });
  };

  const img1 = findImageByNumber(1);
  const img2 = findImageByNumber(2);
  const img3 = findImageByNumber(3);

  return {
    image1: img1 || '',
    image2: img2 || '',
    image3: img3 || ''
  };
}

async function loadAllProducts() {
  const sheet = await getSheet('Produit');
  const headerRow = sheet.getRow(1).values.slice(1);
  const headerMap = {};
  headerRow.forEach((h, i) => {
    if (h && String(h).trim()) headerMap[String(h).toLowerCase().trim()] = i;
  });

  const rows = await getAllRows('Produit');
  let files;
  try {
    files = fs.readdirSync(imagePath);
  } catch (err) {
    files = [];
  }

  const products = rows.map(row => {
    const product = rowToProduct(row, headerMap);
    const images = findImages(product, files);
    product.image1 = images.image1 || product.image1;
    product.image2 = images.image2;
    product.image3 = images.image3;
    return product;
  });

  return products.filter(p => p.visible !== false);
}

router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;
    const products = await loadAllProducts();

    let filtered = products;
    if (category && category !== 'all' && category !== 'tous') {
      const wanted = String(category).toLowerCase().trim();
      filtered = filtered.filter(p => String(p.category || '').toLowerCase().trim() === wanted);
    }

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(term) ||
             p.description.toLowerCase().includes(term)
      );
    }

    const total = filtered.length;
    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 12;
    const start = (pageNum - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    res.json({ items, total, page: pageNum, limit: pageSize });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const products = await loadAllProducts();
    const product = products.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product', details: err.message });
  }
});

module.exports = router;
