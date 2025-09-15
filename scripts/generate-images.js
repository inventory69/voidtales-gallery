import fs from 'fs';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'public/images/original');
const contentDir = path.join(process.cwd(), 'src/content/photos');
const outPath = path.join(process.cwd(), 'public/images.json');

// Alle Bilddateien (inkl. -default)
const imageFiles = fs.readdirSync(imagesDir).filter(f =>
  /\.(webp|jpg|png|jpeg|bmp)$/i.test(f)
);

// Alle .md-Dateien (inkl. -default)
const mdFiles = fs.readdirSync(contentDir).filter(f => /\.md$/i.test(f));

// Hilfsfunktion: Finde zu jedem Bild die passende .md-Datei
function findMd(id) {
  const direct = `${id}.md`;
  const withDefault = `${id}-default.md`;
  if (mdFiles.includes(direct)) return direct;
  if (mdFiles.includes(withDefault)) return withDefault;
  return null;
}

// Hilfsfunktion: Datum aus Markdown-Frontmatter extrahieren
function extractDate(mdFilePath) {
  if (!mdFilePath) return null;
  const fullPath = path.join(contentDir, mdFilePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const match = content.match(/date:\s*["']?([\d-:TZ ]+)["']?/i);
  return match ? match[1].trim() : null;
}

const images = imageFiles.map(filename => {
  const base = path.parse(filename).name;
  const id = base.replace(/-default$/, '');
  const isDefault = base.endsWith('-default');
  const imageUrl = `/images/original/${filename}`;
  const mdFile = findMd(base);
  const mdPath = mdFile ? `/src/content/photos/${mdFile}` : null;
  const date = extractDate(mdFile);

  return {
    id,
    imageUrl,
    mdPath,
    isDefault,
    date
  };
});

fs.writeFileSync(outPath, JSON.stringify(images, null, 2), 'utf-8');
console.log(`✔️ Wrote ${images.length} entries to public/images.json`);