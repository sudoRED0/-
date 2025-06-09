// v3
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

let serveLua = false; // Will turn true after the first /api/script request + 2s delay

app.use(express.static(__dirname));

function isBrowser(req) {
  const accept = req.headers.accept || '';
  return accept.includes('text/html') || accept.includes('application/xhtml+xml');
}

// /api/script and /api/script/:custom endpoint
app.get(['/api/script', '/api/script/:custom'], (req, res) => {
  const custom = req.params.custom?.toLowerCase() || 'root';

  if (isBrowser(req)) {
    // Browsers always get index.html
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  if (!serveLua) {
    // First request: send index.html as raw response, and schedule Lua serving
    console.log(`[+] First request detected. Sending index.html, switching to Lua in 2 seconds...`);
    res.sendFile(path.join(__dirname, 'index.html'));

    // Enable Lua serving after 2 seconds
    setTimeout(() => {
      serveLua = true;
      console.log(`[+] Now serving Lua scripts.`);
    }, 2000);
  } else {
    // After initial delay, serve Lua script
    res.type('text/plain');
    return res.send(`print("Hello from Luarmor-like server. Served Lua for: ${custom}")`);
  }
});

// Root or other custom routes
app.get('/:custom', (req, res) => {
  if (isBrowser(req)) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  res.type('text/plain');
  const custom = req.params.custom?.toLowerCase();
  return res.send(`print("Hello from root: ${custom}")`);
});

// Root / always send index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
