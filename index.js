// v6
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

// Improved browser detection
function isBrowser(req) {
  const ua = req.headers['user-agent'] || '';
  const accept = req.headers.accept || '';

  // Treat as browser if:
  return (
    accept.includes('text/html') ||
    accept.includes('application/xhtml+xml') ||
    ua.includes('Mozilla') ||              // Most browsers
    ua.includes('Chrome') ||               // Chrome-based tools
    ua.includes('Safari') ||               // Safari
    ua.includes('Gecko')                   // Firefox
  );
}

// Match dynamic routes like /api/script or /script/whatever
app.get(['/api/script', '/script/:id', '/:custom'], (req, res) => {
  if (isBrowser(req)) {
    // Send index.html to any browser visit
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  // Otherwise serve raw Luau script
  res.type('text/plain');
  res.send(`-- Protected Luau script\nprint("Hi")`);
});

// Root page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
