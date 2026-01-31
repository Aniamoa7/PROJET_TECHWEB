const http = require('http');
const url = 'http://127.0.0.1:4000/api/products?limit=8';

http.get(url, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log(data);
    }
    process.exit(0);
  });
}).on('error', err => {
  console.error('Request error:', err.message);
  process.exit(2);
});
