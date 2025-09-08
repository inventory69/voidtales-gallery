const config = require('../src/config/externaldownload.cjs');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const destDir = './public/images/original/';
const internalUrl = config.originalSourceUrlInternal ? config.originalSourceUrlInternal.replace(/'/g, '') : null;
const externalUrl = config.originalSourceUrlExternal ? config.originalSourceUrlExternal.replace(/'/g, '') : null;

async function fetchDirectoryListing(url) {
  try {
    const res = await axios.get(url, { timeout: 5000 });
    return res.data;
  } catch (err) {
    console.error(`Error fetching source:`, err.message);
    return null;
  }
}

(async () => {
  let html = null;
  let usedUrl = null;

  // Try internal URL first
  if (internalUrl) {
    html = await fetchDirectoryListing(internalUrl);
    if (html) {
      usedUrl = internalUrl;
    }
  }

  // Fallback to external URL
  if (!html && externalUrl) {
    html = await fetchDirectoryListing(externalUrl);
    if (html) {
      usedUrl = externalUrl;
    }
  }

  // If neither URL works, skip
  if (!html) {
    console.warn('No reachable image source found. Skipping download.');
    process.exit(0);
  }

  // Extract image files
  const $ = cheerio.load(html);
  const files = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && /\.(png|jpe?g|webp|bmp)$/i.test(href)) {
      files.push(href);
    }
  });

  // Download files
  files.forEach(file => {
    const url = `${usedUrl}${file}`;
    const destPath = path.join(destDir, file);
    if (fs.existsSync(destPath)) {
      console.log(`Skipping ${file} (already exists)`);
    } else {
      console.log(`Downloading ${file}`);
      execSync(`wget -q -O "${destPath}" "${url}"`);
    }
  });
})();