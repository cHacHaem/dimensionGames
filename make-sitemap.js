// make-sitemap.js
const fs = require("fs");
const path = require("path");

const siteUrl = "https://dimensioncoding.xyz"; // change to your domain
const directory = "./"; // root folder

// Exclusions: list any index.html you don't want
const exclude = [
  "404/index.html"
];

let urls = [];

// Collect index.html files (only root and one folder deep)
function collectIndexFiles(dir, depth = 0) {
  fs.readdirSync(dir).forEach((file) => {
    const filepath = path.join(dir, file);
    const relativePath = path.relative(directory, filepath).replace(/\\/g, "/");

    if (fs.statSync(filepath).isDirectory()) {
      if (depth < 1) {
        collectIndexFiles(filepath, depth + 1); // only go one folder in
      }
    } else if (file === "index.html" && !exclude.includes(relativePath)) {
      // Root index.html → /
      // folder/index.html → /folder/
      let urlPath = "/" + relativePath.replace("index.html", "");
      urls.push(siteUrl + urlPath);
    }
  });
}

collectIndexFiles(directory);

// Build sitemap.txt
const sitemap = urls.join("\n");
fs.writeFileSync("sitemap.txt", sitemap, "utf8");

console.log("✅ sitemap.txt created with", urls.length, "entries");
