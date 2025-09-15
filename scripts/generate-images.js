import fs from 'fs';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'public/images/original');
const contentDir = path.join(process.cwd(), 'src/content');
const outPath = path.join(process.cwd(), 'public/images.json');

// Hilfsfunktion: Datum aus .md-Datei extrahieren
function extractDate(mdPath) {
  if (!fs.existsSync(mdPath)) return null;
  const content = fs.readFileSync(mdPath, 'utf-8');
  const match = content.match(/date:\s*["']?([\d-]+)["']?/);
  return match ? match[1] : null;
}

const imageFiles = fs.readdirSync(imagesDir).filter(f => /\.(png|jpg|jpeg|webp|bmp)$/i.test(f));
const mdFiles = fs.readdirSync(contentDir).filter(f => /\.md$/i.test(f));

function findMd(id, isDefault) {
  const direct = `${id}.md`;
  const withDefault = `${id}-default.md`;
  if (isDefault && mdFiles.includes(withDefault)) return path.join(contentDir, withDefault);
  if (mdFiles.includes(direct)) return path.join(contentDir, direct);
  return null;
}

const images = imageFiles.map(filename => {
  const base = path.parse(filename).name;
  const id = base.replace(/-default$/, '');
  const isDefault = base.endsWith('-default');
  const imageUrl = `/images/original/${filename}`;
  const mdPath = findMd(id, isDefault);
  const date = mdPath ? extractDate(mdPath) : null;

  return {
    id,
    imageUrl,
    mdPath: mdPath ? mdPath.replace(process.cwd(), '') : null,
    isDefault,
    date
  };
});

fs.writeFileSync(outPath, JSON.stringify(images, null, 2), 'utf-8');
console.log(`✔️ Wrote ${images.length} entries to public/images.json`);