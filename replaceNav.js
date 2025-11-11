const fs = require('fs');
const path = require('path');

// Root directory (where this script is run)
const ROOT = process.cwd();

// The new <nav> block you want to replace the old one with
const NEW_NAV = `
        <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/contact/">Contact</a></li>
                    <li><a href="/css">CSS</a></li>
                    <li><a href="/html">HTML</a></li>
                    <li><a href="/javascript">Javascript</a></li>
                    <li><a href="/just-for-fun">Just For Fun</a></li>
                    <li><a href="/explore/">Explore</a></li>
                    <li><a href="/search">Search</a></li>
                </ul>
            </nav>
`;

// Function to replace the entire <nav>...</nav> block
function replaceNav(html) {
  const navPattern = /<nav[\s\S]*?<\/nav>/i;
  if (!navPattern.test(html)) return null;
  return html.replace(navPattern, NEW_NAV.trim());
}

// Get all subfolders (one level deep)
const folders = fs.readdirSync(ROOT).filter(f => {
  const fullPath = path.join(ROOT, f);
  return fs.statSync(fullPath).isDirectory();
});

// Go through each folder and replace nav in index.html
for (const folder of folders) {
  const indexPath = path.join(ROOT, folder, 'index.html');
  if (!fs.existsSync(indexPath)) continue;

  const html = fs.readFileSync(indexPath, 'utf8');
  const updated = replaceNav(html);

  if (updated && updated !== html) {
    fs.writeFileSync(indexPath, updated, 'utf8');
    console.log(`✅ Replaced <nav> in ${indexPath}`);
  } else {
    console.log(`⚠️  Skipped ${indexPath} (no <nav> found)`);
  }
}

console.log('✅ Done updating all navs!');
