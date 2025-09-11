const config = require('../src/config/externaldownload.cjs');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const destDir = './public/images/original/';
const internalUrl = config.originalSourceUrlInternal ? config.originalSourceUrlInternal.replace(/'/g, '') : null;
const externalUrl = config.originalSourceUrlExternal ? config.originalSourceUrlExternal.replace(/'/g, '') : null;

/**
 * Fetches the HTML directory listing from a given URL.
 * @param {string} url - The URL to fetch.
 * @returns {Promise<string|null>} - The HTML content or null if failed.
 */
async function fetchDirectoryListing(url) {
  try {
    const res = await axios.get(url, { timeout: 3000 });
    return res.data;
  } catch (err) {
    return null;
  }
}

(async () => {
  const marker = path.join(destDir, '.downloads_synced');

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

  // Extract image files from HTML
  const $ = cheerio.load(html);
  const files = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && /\.(png|jpe?g|webp|bmp)$/i.test(href)) {
      files.push(href);
    }
  });

  // Remove duplicate file names
  const uniqueFiles = [...new Set(files)];

  // Download only missing files
  let downloaded = false;
  uniqueFiles.forEach(file => {
    const destPath = path.join(destDir, file);
    if (fs.existsSync(destPath)) {
      console.log(`Skipping ${file} (already exists)`);
    } else {
      const url = `${usedUrl}${file}`;
      console.log(`Downloading ${file}`);
      try {
        execSync(`wget -q -O "${destPath}" "${url}"`, { timeout: 3000 });
        downloaded = true;
      } catch (e) {
        console.warn(`Failed to download ${file}, skipping.`);
      }
    }
  });

  // Write marker if all files are present
  const allPresent = uniqueFiles.every(file => fs.existsSync(path.join(destDir, file)));
  if (allPresent) {
    fs.writeFileSync(marker, 'Downloads synced');
    console.log('All original images synced. Marker file written.');
  } else {
    if (!downloaded) {
      console.log('No new images downloaded. Some files may be missing.');
    }
  }
})();