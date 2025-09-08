const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const destDir = './public/images/original/';
const webserverUrl = 'http://172.19.0.1:8723/original/'; // interne IP und Pfad zum Ordner

(async () => {
  // Hole das Directory Listing als HTML
  const res = await axios.get(webserverUrl);
  const $ = cheerio.load(res.data);

  // Extrahiere alle Links auf Bilddateien
  const files = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (
      href &&
      /\.(png|jpe?g|webp|bmp)$/i.test(href)
    ) {
      files.push(href);
    }
  });

  // Lade jede Datei per wget herunter
  files.forEach(file => {
    const url = `${webserverUrl}${file}`;
    const destPath = path.join(destDir, file);
    console.log(`Downloading ${url} -> ${destPath}`);
    execSync(`wget -q -O "${destPath}" "${url}"`);
  });
})();