const config = require('../src/config/externaldownload.cjs');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const destDir = './src/content/photos/';
const internalUrl = config.mdSourceUrlInternal;
const externalUrl = config.mdSourceUrlExternal;

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
      console.log(`Using internal URL: ${internalUrl}`);
    } else {
      console.warn(`Internal URL not reachable: ${internalUrl}`);
    }
  }

  // Fallback to external URL
  if (!html && externalUrl) {
    html = await fetchDirectoryListing(externalUrl);
    if (html) {
      usedUrl = externalUrl;
      console.log(`Using external URL: ${externalUrl}`);
    } else {
      console.warn(`External URL not reachable: ${externalUrl}`);
    }
  }

  // If neither URL works, skip and exit successfully
  if (!html) {
    console.warn('No reachable markdown source URL found. Skipping markdown file download.');
    process.exit(0);
  }

  // Extract all links to .md files
  const $ = cheerio.load(html);
  const files = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.endsWith('.md')) {
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