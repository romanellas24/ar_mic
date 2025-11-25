const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// Serve files from public (so /js/* maps to public/js/*)
app.use(express.static(path.join(__dirname, 'public')));

// Serve root files (index.html, videos/assets) from project root as fallback
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
});
