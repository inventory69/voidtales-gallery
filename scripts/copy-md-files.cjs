const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const destDir = './src/content/photos/';
const webserverUrl = process.env.EXT_DL_URL_MARKDOWN; // interne IP und Pfad zum Ordner

(async () => {
  // Hole das Directory Listing als HTML
  const res = await axios.get(webserverUrl);
  const $ = cheerio.load(res.data);

  // Extrahiere alle Links auf .md-Dateien
  const files = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.endsWith('.md')) {
      files.push(href);
    }
  });

  // Lade jede Datei per wget herunter
  files.forEach(file => {
    const url = `${webserverUrl}${file}`;
    const destPath = path.join(destDir, file);
    console.log(`Downloading ${file} -> ${destPath}`);
    execSync(`wget -q -O "${destPath}" "${url}"`);
  });
})();