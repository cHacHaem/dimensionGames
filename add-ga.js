// add-ga.js
const fs = require("fs");
const path = require("path");

// Your Google Analytics tag
const GA_TAG = `
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-MPFD90BY7J"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-MPFD90BY7J');
</script>
<!-- End Google Analytics -->
`;

const directory = "./"; // root folder of your site

function addTagToFile(filePath) {
  let html = fs.readFileSync(filePath, "utf8");

  if (html.includes("googletagmanager.com/gtag")) {
    console.log(`Already has GA: ${filePath}`);
    return;
  }

  html = html.replace("</head>", `${GA_TAG}\n</head>`);
  fs.writeFileSync(filePath, html, "utf8");
  console.log(`Injected GA into: ${filePath}`);
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walkDir(filepath);
    } else if (file.endsWith(".html")) {
      addTagToFile(filepath);
    }
  });
}

walkDir(directory);
