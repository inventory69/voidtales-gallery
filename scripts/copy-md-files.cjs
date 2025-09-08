const config = require('../config/module.js');
if (!config.enableCopyMdFiles) {
  console.log('Markdown-Download ist deaktiviert. Überspringe Skript.');
  process.exit(0);
}

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const destDir = './src/content/photos/';
const webserverUrl = config.mdSourceUrl;

if (!webserverUrl) {
  console.warn('Warnung: EXT_DL_URL_MARKDOWN ist nicht gesetzt. Überspringe das Kopieren der Markdown-Dateien.');
  process.exit(0); // Erfolgreich beenden, Build läuft weiter
}

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