const axios = require('axios');

const endpoints = [
  { method: 'post', url: 'http://localhost:3000/login', data: { username: 'jose.silva' } },
  { method: 'post', url: 'http://localhost:3000/login', data: { username: 'maikon.costa' } },
  { method: 'post', url: 'http://localhost:3000/login', data: {} },
  { method: 'post', url: 'http://localhost:3000/debug', data: { testParam: 'Connect To Database' } },
  { method: 'post', url: 'http://localhost:3000/debug', data: {} },
  { method: 'post', url: 'http://localhost:3000/error', data: { operation: 'save' } },
  { method: 'post', url: 'http://localhost:3000/error', data: { operation: 'fetch' } },
  { method: 'post', url: 'http://localhost:3000/error', data: { operation: 'error' } },
  { method: 'post', url: 'http://localhost:3000/critical', data: { serviceName: 'PaymentService' } },
  { method: 'post', url: 'http://localhost:3000/critical', data: { serviceName: 'DatabaseService' } },
  { method: 'post', url: 'http://localhost:3000/critical', data: { serviceName: 'DocumentService' } },
];

function getRandomEndpoint() {
  return endpoints[Math.floor(Math.random() * endpoints.length)];
}

function getRandomInterval() {
  return Math.random() * (12000 - 1200) + 1200; 
}

async function makeRandomCall() {
  const endpoint = getRandomEndpoint();

  try {
    const response = await axios({
      method: endpoint.method,
      url: endpoint.url,
      data: endpoint.data,
    });
    console.log(`✔️ Success: ${endpoint.url} - Status: ${response.status}`);
  } catch (error) {
    console.error(`❌ Error: ${endpoint.url} - ${error.message}`);
  }

  setTimeout(makeRandomCall, getRandomInterval());
}

for (let i = 0; i < 5; i++) { 
  setTimeout(makeRandomCall, getRandomInterval());
}
