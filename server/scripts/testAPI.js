const http = require('http');

const loginData = JSON.stringify({
  email: 'Ani@gmail.com',
  password: 'Ani@123'
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

const loginReq = http.request(loginOptions, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Login response:', data);
    const loginRes = JSON.parse(data);
    
    if (loginRes.token) {
      
      const meOptions = {
        hostname: 'localhost',
        port: 4000,
        path: '/api/auth/me',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + loginRes.token
        }
      };
      
      const meReq = http.request(meOptions, (res) => {
        let meData = '';
        
        res.on('data', (chunk) => {
          meData += chunk;
        });
        
        res.on('end', () => {
          console.log('\nGET /me response:', meData);
          
          
          const updateData = JSON.stringify({
            nom: 'TestNom',
            prenom: 'TestPrenom',
            phone: '0123456789',
            adresse: 'Test Address',
            ville: 'Test City',
            codepostal: '12345',
            pays: 'Test Country',
            nomcarte: 'Test Card Name',
            numcarte: '1234567890',
            dateexp: '12/25',
            cvv: '123'
          });
          
          const putOptions = {
            hostname: 'localhost',
            port: 4000,
            path: '/api/auth/me',
            method: 'PUT',
            headers: {
              'Authorization': 'Bearer ' + loginRes.token,
              'Content-Type': 'application/json',
              'Content-Length': updateData.length
            }
          };
          
          const putReq = http.request(putOptions, (res) => {
            let putData = '';
            
            res.on('data', (chunk) => {
              putData += chunk;
            });
            
            res.on('end', () => {
              console.log('\nPUT /me response:', putData);
            });
          });
          
          putReq.on('error', (error) => {
            console.error('PUT error:', error);
          });
          
          putReq.write(updateData);
          putReq.end();
        });
      });
      
      meReq.on('error', (error) => {
        console.error('GET error:', error);
      });
      
      meReq.end();
    }
  });
});

loginReq.on('error', (error) => {
  console.error('Login error:', error);
});

loginReq.write(loginData);
loginReq.end();
