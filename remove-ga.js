// remove-ga-from-game.js
const fs = require("fs");
const path = require("path");

const directory = "./"; // root folder of your site

function cleanGameFile(filePath) {
  let html = fs.readFileSync(filePath, "utf8");

  if (html.includes("googletagmanager.com/gtag")) {
    // Remove everything between the GA comments
    html = html.replace(/<!-- Google Analytics -->[\s\S]*?<!-- End Google Analytics -->/, "");
    fs.writeFileSync(filePath, html, "utf8");
    console.log(`Removed GA from: ${filePath}`);
  } else {
    console.log(`No GA found in: ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walkDir(filepath);
    } else if (file.endsWith("game.html")) {
      cleanGameFile(filepath);
    }
  });
}

walkDir(directory);
