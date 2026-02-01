require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Le Middlewear comme je faisian di les architecture a 3 dimension di linux
app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  try { res.setHeader('Content-Encoding', 'identity'); } catch (e) {}
  next();
});

const imagePath = path.join(__dirname, '../../Magasin/ImagesProd');
app.use('/images', express.static(imagePath, { maxAge: '1h' }));

//Les routes nnegh
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/debug', require('./routes/debug'));
}


app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});


app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET is not set. Copy server/.env.example to server/.env and set JWT_SECRET for auth to work.');
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
  console.log(`
  YES! Server running on http://localhost:${PORT}
  
  Available endpoints:
  - GET  /api/products
  - GET  /api/products/:id
  - POST /api/auth/signup
  - POST /api/auth/login
  - GET  /api/auth/me
  - GET  /api/cart
  - POST /api/cart
  - DELETE /api/cart (clear cart)
  - PUT  /api/cart/:itemId
  - DELETE /api/cart/:itemId
  - POST /api/orders
  - GET  /api/orders
  - GET  /api/orders/:orderId
  - PUT  /api/auth/me (update profile)
  ${process.env.NODE_ENV !== 'production' ? '- /api/debug/* (dev only)' : ''}
  `);
});

