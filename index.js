// v4 - Luarmor-like behavior
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

let serveLua = false; // Will switch to true after first request + 2 seconds

app.use(express.static(__dirname));

// Determine if request is from a browser based on User-Agent
function isBrowser(req) {
  const ua = req.headers['user-agent'] || '';
  return ua.includes('Mozilla') || ua.includes('Chrome') || ua.includes('Safari') || ua.includes('Firefox');
}

app.get(['/api/script', '/api/script/:custom'], (req, res) => {
  const custom = req.params.custom?.toLowerCase() || 'root';

  if (isBrowser(req)) {
    // Browsers always get index.html
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  if (!serveLua) {
    console.log(`[+] First executor/API request detected. Sending index.html, switching to Lua in 2 seconds...`);
    res.sendFile(path.join(__dirname, 'index.html'));

    setTimeout(() => {
      serveLua = true;
      console.log(`[+] Now serving Lua script for executor/API clients.`);
    }, 2000);
  } else {
    res.type('text/plain');
    return res.send(`print("Hello from Luarmor-like server. Served Lua for: ${custom}")`);
  }
});

// Root and /:custom fallback
app.get('/:custom', (req, res) => {
  if (isBrowser(req)) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  res.type('text/plain');
  const custom = req.params.custom?.toLowerCase();
  return res.send(`print("Hello from root: ${custom}")`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
