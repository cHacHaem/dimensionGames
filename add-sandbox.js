// add-sandbox.js
const fs = require('fs');
const path = require('path');

// Directory to start searching from
const ROOT = process.cwd(); // or replace with your specific path

function processHtmlFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Regex: find all <iframe> tags that don't already have a sandbox attribute
  const updated = html.replace(
    /<iframe(?![^>]*\bsandbox=)([^>]*)>/gi,
    '<iframe sandbox="allow-scripts allow-same-origin allow-pointer-lock"$1>'
  );

  if (updated !== html) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  }
}

function processDir(dir) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isFile() && item === 'index.html') {
      processHtmlFile(fullPath);
    }
  }
}

// 1️⃣ Process ROOT directory
processDir(ROOT);

// 2️⃣ Process only one layer of subdirectories
for (const item of fs.readdirSync(ROOT)) {
  const fullPath = path.join(ROOT, item);
  if (fs.statSync(fullPath).isDirectory()) {
    processDir(fullPath);
  }
}

console.log('Done!');
