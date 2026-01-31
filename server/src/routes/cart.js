const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllRows, getSheet, addRow, updateRow, deleteRow } = require('../utils/excel');

// Apres ad 3eddigh pour verifier af le code inutilr
async function getProductNameAndPrice(productId) {
  try {
    const sheet = await getSheet('Produit');
    const headerRow = sheet.getRow(1).values.slice(1);
    const headerMap = {};
    headerRow.forEach((h, i) => {
      if (h && String(h).trim()) headerMap[String(h).toLowerCase().trim()] = i;
    });
    const rows = await getAllRows('Produit');
    const idIdx = typeof headerMap['id'] === 'number' ? headerMap['id'] : 0;
    const nameIdx = typeof headerMap['name'] === 'number' ? headerMap['name'] : (headerMap['nom'] ?? 1);
    const priceIdx = typeof headerMap['prix'] === 'number' ? headerMap['prix'] : (headerMap['price'] ?? 3);
    const row = rows.find(r => String(r[idIdx]) === String(productId));
    if (!row) return null;
    return {
      name: String(row[nameIdx] ?? ''),
      price: parseFloat(row[priceIdx]) || 0
    };
  } catch (err) {
    console.error('getProductNameAndPrice:', err);
    return null;
  }
}


function rowToCartItem(row, idx) {
  return {
    idx,
    id: String(row[0]),
    userId: String(row[1]),
    productId: String(row[2]),
    productName: String(row[3]),
    quantity: parseInt(row[4]) || 1,
    priceAt: parseFloat(row[5]) || 0,
    addedAt: String(row[6] || '')
  };
}


router.get('/', auth, async (req, res) => {
  try {
    const rows = await getAllRows('Panier');
    
    const productRows = await getAllRows('Produit');
    const productSheet = await getSheet('Produit');
    const headerRow = productSheet.getRow(1).values.slice(1);
    const headerMap = {};
    headerRow.forEach((h, i) => {
      if (h && String(h).trim()) headerMap[String(h).toLowerCase().trim()] = i;
    });

   
    const imgIdx = typeof headerMap['image1'] === 'number' ? headerMap['image1'] :
      (typeof headerMap['image'] === 'number' ? headerMap['image'] :
        (typeof headerMap['img'] === 'number' ? headerMap['img'] : 4)); // Default to 4 if unsure

    
    const productImages = {};
    const idIdx = typeof headerMap['id'] === 'number' ? headerMap['id'] : 0;

    productRows.forEach(r => {
      const pid = String(r[idIdx]);
      const img = String(r[imgIdx] || '');
      if (pid) productImages[pid] = img;
    });

    const items = rows
      .map((row, idx) => rowToCartItem(row, idx))
      .filter(item => item.userId === req.user.id)
      .map(item => ({
        ...item,
        image: productImages[item.productId] || '' // Add image to item
      }));

   
    const total = items.reduce((sum, item) => sum + (item.quantity * item.priceAt), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({ items, total, itemCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart', details: err.message });
  }
});


router.post('/', auth, async (req, res) => {
  try {
    let { productId, productName, quantity, price } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'productId and quantity are required' });
    }

    if (productName === undefined || productName === '' || price === undefined || price === null || String(price) === '') {
      const productInfo = await getProductNameAndPrice(productId);
      if (productInfo) {
        if (productName === undefined || productName === '') productName = productInfo.name;
        if (price === undefined || price === null || String(price) === '') price = productInfo.price;
      } else {
        productName = productName ?? '';
        price = parseFloat(price) || 0;
      }
    }

    const rows = await getAllRows('Panier');

   
    const existingIdx = rows.findIndex(
      row => String(row[1]) === req.user.id && String(row[2]) === String(productId)
    );

    if (existingIdx !== -1) {
      
      const existingRow = rows[existingIdx];
      const newQty = parseInt(existingRow[4]) + parseInt(quantity);
      await updateRow('Panier', existingIdx, [
        existingRow[0],
        existingRow[1],
        existingRow[2],
        existingRow[3],
        newQty,
        existingRow[5],
        existingRow[6]
      ]);
    } else {
      
      await addRow('Panier', [
        Date.now().toString(),
        req.user.id,
        String(productId),
        productName || '',
        parseInt(quantity),
        parseFloat(price) || 0,
        new Date().toISOString()
      ]);
    }

    res.status(201).json({ success: true, message: 'Item added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item to cart', details: err.message });
  }
});


router.put('/:itemId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const rows = await getAllRows('Panier');
    const idx = rows.findIndex(
      row => String(row[0]) === req.params.itemId && String(row[1]) === req.user.id
    );

    if (idx === -1) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const row = rows[idx];
    await updateRow('Panier', idx, [
      row[0],
      row[1],
      row[2],
      row[3],
      parseInt(quantity),
      row[5],
      row[6]
    ]);

    res.json({ success: true, message: 'Cart item updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update cart item', details: err.message });
  }
});


router.delete('/', auth, async (req, res) => {
  try {
    const rows = await getAllRows('Panier');
    const indicesToRemove = rows
      .map((row, idx) => (String(row[1]) === req.user.id ? idx : -1))
      .filter(idx => idx !== -1)
      .sort((a, b) => b - a);

    for (const idx of indicesToRemove) {
      await deleteRow('Panier', idx);
    }

    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear cart', details: err.message });
  }
});


router.delete('/:itemId', auth, async (req, res) => {
  try {
    const rows = await getAllRows('Panier');
    const idx = rows.findIndex(
      row => String(row[0]) === req.params.itemId && String(row[1]) === req.user.id
    );

    if (idx === -1) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await deleteRow('Panier', idx);

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove item', details: err.message });
  }
});



router.post('/sync', auth, async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' });
    }

   
    let rows = await getAllRows('Panier');
    let indicesToRemove = rows
      .map((row, idx) => (String(row[1]) === req.user.id ? idx : -1))
      .filter(idx => idx !== -1)
      .sort((a, b) => b - a); 

    for (const idx of indicesToRemove) {
      await deleteRow('Panier', idx);
    }

    
    for (const item of items) {
      let { productId, productName, quantity, price } = item;

      if (!productId || !quantity) continue;

      
      if (productName === undefined || productName === '' || price === undefined || price === null || String(price) === '') {
        const productInfo = await getProductNameAndPrice(productId);
        if (productInfo) {
          if (productName === undefined || productName === '') productName = productInfo.name;
          if (price === undefined || price === null || String(price) === '') price = productInfo.price;
        } else {
          productName = productName ?? '';
          price = parseFloat(price) || 0;
        }
      }

      await addRow('Panier', [
        Date.now().toString() + Math.random().toString().slice(2, 5), // unique ID
        req.user.id,
        String(productId),
        productName || '',
        parseInt(quantity),
        parseFloat(price) || 0,
        new Date().toISOString()
      ]);
    }

    res.json({ success: true, message: 'Cart synced successfully' });
  } catch (err) {
    console.error('Sync error:', err);
    res.status(500).json({ error: 'Failed to sync cart', details: err.message });
  }
});

module.exports = router;
