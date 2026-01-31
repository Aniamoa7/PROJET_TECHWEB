const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// ON TEST Le middle ware server
function findImages(productName) {
  const imagePath = path.join(__dirname, '../../Magasin/ImagesProd');
  console.log(`Finding images for: "${productName}"`);
  console.log(`Image path: ${imagePath}`);
  
  try {
    const files = fs.readdirSync(imagePath);
    const img1 = files.find(f => f.startsWith(productName + ' 1.'));
    const img2 = files.find(f => f.startsWith(productName + ' 2.'));
    const img3 = files.find(f => f.startsWith(productName + ' 3.'));
    
    console.log(`TES! Found: img1=${img1}, img2=${img2}, img3=${img3}`);
    
    return { image1: img1 || '', image2: img2 || '', image3: img3 || '' };
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    return { image1: '', image2: '', image3: '' };
  }
}


const imagePath = path.join(__dirname, '../../Magasin/ImagesProd');
app.use('/images', express.static(imagePath));

// Test endpoint
app.get('/api/test/:product', (req, res) => {
  const images = findImages(req.params.product);
  res.json(images);
});

app.listen(4000, '127.0.0.1', () => {
  console.log(' Test server running on http://127.0.0.1:4000');
  console.log('Try: http://127.0.0.1:4000/api/test/Sérum%20Vitamine%20C');
});
