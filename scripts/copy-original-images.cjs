const config = require('../src/config/externaldownload.cjs');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const destDir = './public/images/original/';
const internalUrl = config.originalSourceUrlInternal;
const externalUrl = config.originalSourceUrlExternal;

// Debug: Zeige die geladenen URLs
console.log('Loaded originalSourceUrlInternal:', internalUrl);
console.log('Loaded originalSourceUrlExternal:', externalUrl);

async function fetchDirectoryListing(url) {
  try {
    console.log(`Trying to fetch from: ${url}`);
    const res = await axios.get(url, { timeout: 5000 }); // Erhöhe Timeout auf 5s
    console.log(`Success: Fetched HTML from ${url}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching ${url}:`, err.message);
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
      console.log(`Using internal URL: ${usedUrl}`);
    } else {
      console.warn(`Internal URL not reachable: ${internalUrl}`);
    }
  }

  // Fallback to external URL
  if (!html && externalUrl) {
    html = await fetchDirectoryListing(externalUrl);
    if (html) {
      usedUrl = externalUrl;
      console.log(`Using external URL: ${usedUrl}`);
    } else {
      console.warn(`External URL not reachable: ${externalUrl}`);
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

  console.log(`Found ${files.length} image files to download.`);
  // Download each file using wget
  files.forEach(file => {
    const url = `${usedUrl}${file}`;
    const destPath = path.join(destDir, file);
    console.log(`Downloading ${file} -> ${destPath}`);
    execSync(`wget -q -O "${destPath}" "${url}"`);
  });
})();