// v2
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

function isBrowser(req) {
  const accept = req.headers.accept || '';
  return accept.includes('text/html') || accept.includes('application/xhtml+xml');
}

app.get(['/api/script', '/api/script/:custom'], (req, res) => {
  const custom = req.params.custom?.toLowerCase();

  if (isBrowser(req)) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  res.type('text/plain');
  if (custom) {
    return res.send(`print("Hello from ${custom}!")`);
  }
  return res.send(`print("Hello from /api/script!")`);
});

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
