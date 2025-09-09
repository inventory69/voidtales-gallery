const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');
const fs = require('fs');

async function getFileNames(url, regex) {
  try {
    // Fügen Sie diese Zeile hinzu, um die URL zu protokollieren
    console.log(`Debug: Attempting to fetch from URL: '${url}'`);

    if (!url) {
      throw new Error('URL is undefined or empty.');
    }

    const res = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(res.data);
    const files = [];
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && regex.test(href)) {
        files.push(href);
      }
    });
    return files.sort().join('|');
  } catch (error) {
    console.error(`Error fetching files from ${url}:`, error.message);
    return '';
  }
}

(async () => {
  // Fügen Sie diese Zeilen hinzu, um die Umgebungsvariablen zu protokollieren
  console.log(`Debug: ENV_VAR_MD: '${process.env.EXT_DL_URL_MARKDOWN_EXTERNAL}'`);
  console.log(`Debug: ENV_VAR_ORIG: '${process.env.EXT_DL_URL_ORIGINAL_EXTERNAL}'`);

  const mdFiles = await getFileNames(process.env.EXT_DL_URL_MARKDOWN_EXTERNAL, /\.md$/);
  const originalFiles = await getFileNames(process.env.EXT_DL_URL_ORIGINAL_EXTERNAL, /\.(png|jpe?g|webp|bmp)$/i);

  const combinedString = mdFiles + '|' + originalFiles;
  const hash = crypto.createHash('sha256').update(combinedString).digest('hex');

  console.log(`Generated cache key: ${hash}`);

  fs.writeFileSync(process.env.GITHUB_OUTPUT, `cache-key=${hash}`);
})();