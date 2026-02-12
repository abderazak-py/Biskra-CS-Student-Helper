const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Serve static files from the current directory
app.use(express.static('.'));

// Catch-all handler for any routes that don't match a static file
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});