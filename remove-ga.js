// remove-reload-from-index.js
const fs = require("fs");
const path = require("path");

const directory = "./"; // root folder of your site

function cleanIndexFile(filePath) {
  let html = fs.readFileSync(filePath, "utf8");

  // Regex to remove the block, including whitespace and newlines
  const regex = /\.then\(\s*?\(\)\s*?=>\s*?\{\s*?iframe\.contentWindow\.location\.reload\(\);\s*?\}\s*?\);/g;

  if (regex.test(html)) {
    html = html.replace(regex, "");
    fs.writeFileSync(filePath, html, "utf8");
    console.log(`Removed reload code from: ${filePath}`);
  } else {
    console.log(`No reload code found in: ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walkDir(filepath);
    } else if (file === "index.html") {
      cleanIndexFile(filepath);
    }
  });
}

walkDir(directory);
