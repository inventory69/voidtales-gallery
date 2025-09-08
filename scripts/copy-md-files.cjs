const config = require('../src/config/externaldownload.cjs');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const destDir = './src/content/photos/';
const internalUrl = config.mdSourceUrlInternal ? config.mdSourceUrlInternal.replace(/'/g, '') : null;
const externalUrl = config.mdSourceUrlExternal ? config.mdSourceUrlExternal.replace(/'/g, '') : null;

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
    console.warn('No reachable markdown source found. Skipping download.');
    process.exit(0);
  }

  // Extract .md files
  const $ = cheerio.load(html);
  const files = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.endsWith('.md')) {
      files.push(href);
    }
  });

  // Download files
  files.forEach(file => {
    const url = `${usedUrl}${file}`;
    const destPath = path.join(destDir, file);
    execSync(`wget -q -O "${destPath}" "${url}"`);
  });
})();