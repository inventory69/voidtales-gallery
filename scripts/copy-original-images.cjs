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
    const res = await axios.get(url, { timeout: 3000 });
    return res.data;
  } catch (err) {
    console.error(`Error fetching source:`, err.message);
    return null;
  }
}

(async () => {
  const marker = path.join(destDir, '.downloads_synced');

  // Prüfe, ob Marker existiert und alle Dateien vorhanden sind
  if (fs.existsSync(marker)) {
    // Extrahiere die aktuelle Dateiliste wie unten
    let html = null;
    let usedUrl = null;
    if (internalUrl) html = await fetchDirectoryListing(internalUrl), usedUrl = internalUrl;
    if (!html && externalUrl) html = await fetchDirectoryListing(externalUrl), usedUrl = externalUrl;
    if (!html) process.exit(0);
    const $ = cheerio.load(html);
    const files = [];
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && /\.(png|jpe?g|webp|bmp)$/i.test(href)) files.push(href);
    });
    // Prüfe, ob alle Dateien vorhanden sind
    const allPresent = files.every(file => fs.existsSync(path.join(destDir, file)));
    if (allPresent) {
      console.log('All original images already synced. Skipping download.');
      process.exit(0);
    }
  }

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

  // If neither URL works, skip (ignoriere Timeout)
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
      try {
        execSync(`wget -q -O "${destPath}" "${url}"`, { timeout: 3000 });
      } catch (e) {
        console.warn(`Failed to download ${file}, skipping.`);
      }
    }
  });
  // Schreibe Marker, wenn alle Dateien vorhanden sind
  const allPresent = files.every(file => fs.existsSync(path.join(destDir, file)));
  if (allPresent) {
    fs.writeFileSync(marker, 'Downloads synced');
    console.log('All original images synced. Marker file written.');
  }
})();