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
      if (href && href.endsWith('.md')) files.push(href);
    });
    // Prüfe, ob alle Dateien vorhanden sind
    const allPresent = files.every(file => fs.existsSync(path.join(destDir, file)));
    if (allPresent) {
      console.log('All markdown files already synced. Skipping download.');
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
    console.log('All markdown files synced. Marker file written.');
  }
})();