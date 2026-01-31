const http = require('http');

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/products/1',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const product = JSON.parse(data);
      console.log('YES! Product loaded:');
      console.log('  Name:', product.name);
      console.log('  Description:', product.description);
      console.log('\n Composition:');
      product.composition.forEach(item => console.log('   -', item));
      console.log('\n Benefices:');
      product.benefices.forEach(item => console.log('   -', item));
      process.exit(0);
    } catch (e) {
      console.error('❌ Error parsing:', e.message);
      console.error('Response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
  process.exit(1);
});

setTimeout(() => {
  console.error('❌ Request timeout');
  process.exit(1);
}, 5000);

req.end();
