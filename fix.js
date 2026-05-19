const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf16le');
fs.writeFileSync('app.js', content, 'utf8');
