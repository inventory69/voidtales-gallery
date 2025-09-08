const config = require('../src/config/externaldownload.cjs');
if (!config.enableCopyOriginalImages) {
  console.log('Original image download is disabled. Skipping script.');
  process.exit(0);
}

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const destDir = './public/images/original/';
const webserverUrl = config.originalSourceUrl;

if (!webserverUrl) {
  console.warn('Warning: EXT_DL_URL_ORIGINAL is not set. Skipping original image download.');
  process.exit(0); // Exit successfully, build continues
}

(async () => {
  // Fetch the directory listing as HTML
  const res = await axios.get(webserverUrl);
  const $ = cheerio.load(res.data);

  // Extract all links to image files
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

  // Download each file using wget
  files.forEach(file => {
    const url = `${webserverUrl}${file}`;
    const destPath = path.join(destDir, file);
    console.log(`Downloading ${file} -> ${destPath}`);
    execSync(`wget -q -O "${destPath}" "${url}"`);
  });
})();