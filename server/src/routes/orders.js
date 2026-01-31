const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllRows, addRow } = require('../utils/excel');


function rowToOrder(row) {
  return {
    commandeID: String(row[0]),
    userID: String(row[1]),
    status: String(row[2] || 'pending'),
    total: parseFloat(row[3]) || 0,
    devise: String(row[4] || 'DA'),
    payMethode: String(row[5] || ''),
    shippingAddress: String(row[6] || ''),
    createdAt: String(row[7] || '')
  };
}

router.post('/', auth, async (req, res) => {
  try {
    const { total, shippingAddress, paymentMethod } = req.body;

    if (!total || !shippingAddress) {
      return res.status(400).json({ error: 'Total and shipping address are required' });
    }

    const commandeID = Date.now().toString();

    await addRow('Commandes', [
      commandeID,
      req.user.id,
      'pending',
      parseFloat(total),
      'DA',
      paymentMethod || 'COD',
      shippingAddress,
      new Date().toISOString()
    ]);

    res.status(201).json({
      success: true,
      commandeID,
      status: 'pending',
      message: 'Order created successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const rows = await getAllRows('Commandes');
    const orders = rows
      .map(rowToOrder)
      .filter(order => order.userID === req.user.id);

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
});

router.get('/:commandeID', auth, async (req, res) => {
  try {
    const rows = await getAllRows('Commandes');
    const orderRow = rows.find(row => String(row[0]) === req.params.commandeID);

    if (!orderRow) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = rowToOrder(orderRow);

    if (order.userID !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order', details: err.message });
  }
});

module.exports = router;
