const config = require('../src/config/externaldownload.cjs');
if (!config.enableCopyMdFiles) {
  console.log('Markdown download is disabled. Skipping script.');
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
  console.warn('Warning: EXT_DL_URL_MARKDOWN is not set. Skipping markdown file download.');
  process.exit(0); // Exit successfully, build continues
}

(async () => {
  // Fetch the directory listing as HTML
  const res = await axios.get(webserverUrl);
  const $ = cheerio.load(res.data);

  // Extract all links to .md files
  const files = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.endsWith('.md')) {
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