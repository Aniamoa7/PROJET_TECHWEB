const http = require('http');

// First login to get a token
const loginData = JSON.stringify({
  email: 'ania@gmail.com',
  password: 'Ania@123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const req = http.request(loginOptions, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      if (result.token) {
        console.log('\n✓ Logged in successfully\n');
        
        // Now get the user profile
        const getOptions = {
          hostname: 'localhost',
          port: 4000,
          path: '/api/auth/me',
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + result.token
          }
        };
        
        const getReq = http.request(getOptions, (res2) => {
          let userData = '';
          
          res2.on('data', (chunk) => {
            userData += chunk;
          });
          
          res2.on('end', () => {
            try {
              const user = JSON.parse(userData);
              console.log('=== SAVED USER DATA ===\n');
              console.log('ID:', user.id);
              console.log('Prénom:', user.prenom);
              console.log('Nom:', user.nom);
              console.log('Email:', user.email);
              console.log('Téléphone:', user.phone);
              console.log('Adresse:', user.adresse);
              console.log('Ville:', user.ville);
              console.log('Code postal:', user.codepostal);
              console.log('Pays:', user.pays);
              console.log('Nom carte:', user.nomcarte);
              console.log('Numéro carte:', user.numcarte);
              console.log('Date expiration:', user.dateexp);
              console.log('CVV:', user.cvv);
              console.log('\n=== ALL DATA SAVED SUCCESSFULLY ===\n');
            } catch (e) {
              console.error('Error parsing user data:', e);
            }
          });
        });
        
        getReq.on('error', (err) => console.error('Error:', err));
        getReq.end();
      } else {
        console.error('Login failed:', result);
      }
    } catch (e) {
      console.error('Error:', e);
    }
  });
});

req.on('error', (err) => console.error('Error:', err));
req.write(loginData);
req.end();
