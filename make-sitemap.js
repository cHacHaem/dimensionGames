// make-sitemap.js
const fs = require("fs");
const path = require("path");

const siteUrl = "https://www.dimensioncoding.xyz"; // change this to your site
const directory = "./"; // root folder of your site

// Exclusions: list any index.html you don't want
const exclude = [
    "404/index.html",
];

let urls = [];

function collectIndexFiles(dir, depth = 0) {
  fs.readdirSync(dir).forEach((file) => {
    const filepath = path.join(dir, file);
    const relativePath = path.relative(directory, filepath).replace(/\\/g, "/");

    if (fs.statSync(filepath).isDirectory()) {
      if (depth < 1) {
        collectIndexFiles(filepath, depth + 1); // only go one folder in
      }
    } else if (file === "index.html" && !exclude.includes(relativePath)) {
      // Turn "folder/index.html" → "/folder/"
      let urlPath = "/" + relativePath.replace("index.html", "");
      urls.push(siteUrl + urlPath);
    }
  });
}

collectIndexFiles(directory);

// Build sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>`;

fs.writeFileSync("sitemap.xml", sitemap, "utf8");
console.log("✅ sitemap.xml created with", urls.length, "entries");
