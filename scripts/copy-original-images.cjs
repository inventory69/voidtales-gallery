const config = require('../src/config/externaldownload.cjs');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const destDir = './public/images/original/';
const internalUrl = config.originalSourceUrlInternal;
const externalUrl = config.originalSourceUrlExternal;

async function fetchDirectoryListing(url) {
  try {
    const res = await axios.get(url, { timeout: 3000 });
    return res.data;
  } catch (err) {
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
      console.log(`Using internal URL`);
    } else {
      console.warn(`Internal URL not reachable`);
    }
  }

  // Fallback to external URL
  if (!html && externalUrl) {
    html = await fetchDirectoryListing(externalUrl);
    if (html) {
      usedUrl = externalUrl;
      console.log(`Using external URL`);
    } else {
      console.warn(`External URL not reachable`);
    }
  }

  // If neither URL works, skip and exit successfully
  if (!html) {
    console.warn('No reachable image source URL found. Skipping original image download.');
    process.exit(0);
  }

  // Extract all links to image files
  const $ = cheerio.load(html);
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
    const url = `${usedUrl}${file}`;
    const destPath = path.join(destDir, file);
    console.log(`Downloading ${file} -> ${destPath}`);
    execSync(`wget -q -O "${destPath}" "${url}"`);
  });
})();