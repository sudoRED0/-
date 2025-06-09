// v7
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

// Only serve raw if ?raw=true is present
app.get(['/api/script', '/script/:id', '/:custom'], (req, res) => {
  const wantsRaw = req.query.raw === 'true';

  if (!wantsRaw) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  // Raw Luau script
  res.type('text/plain');
  res.send(`-- Protected Luau script\nprint("Hi")`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
