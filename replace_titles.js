const fs = require('fs');
const file = 'app.js';
let content = fs.readFileSync(file, 'utf8');

// Replace all title="..." with data-tooltip="..."
content = content.replace(/title="/g, 'data-tooltip="');
// But ensure `<title>` tag or similar isn't broken?
// title="..." usually matches what we want.
fs.writeFileSync(file, content);
console.log('Replaced title with data-tooltip in app.js');
