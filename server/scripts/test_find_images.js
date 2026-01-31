const fs = require('fs');
const path = require('path');

// Nghantiyi les images agi, L API arrive pas a tout load jsp si cest a cause des extension negh les noms
// Bref on refait avec les 3 variantes
function findImages(productName) {
  const imagePath = path.join(__dirname, '../Magasin/ImagesProd');
  console.log(' Looking for images for:', productName);
  console.log(' Image path:', imagePath);
  
  try {
    const files = fs.readdirSync(imagePath);
    console.log(' Files in directory:', files.length);
    
    const img1 = files.find(f => f.startsWith(productName + ' 1.'));
    const img2 = files.find(f => f.startsWith(productName + ' 2.'));
    const img3 = files.find(f => f.startsWith(productName + ' 3.'));
    
    console.log('ENFIN! FINALLY! Found:', { img1, img2, img3 });
    
    return {
      image1: img1 || '',
      image2: img2 || '',
      image3: img3 || ''
    };
  } catch (err) {
    console.error('❌ Error:', err.message);
    return { image1: '', image2: '', image3: '' };
  }
}

const result = findImages('Sérum Vitamine C');
console.log('\n Final result:', result);
