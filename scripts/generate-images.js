import fs from 'fs';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'public/images/original');
const contentDir = path.join(process.cwd(), 'src/content/photos');
const outPath = path.join(process.cwd(), 'public/images.json');

// Alle Bilddateien (inkl. -default)
const imageFiles = fs.readdirSync(imagesDir).filter(f =>
  /\.(webp|jpg|png)$/i.test(f)
);

// Alle .md-Dateien (inkl. -default)
const mdFiles = fs.readdirSync(contentDir).filter(f => /\.md$/i.test(f));

// Hilfsfunktion: Finde zu jedem Bild die passende .md-Datei
function findMd(id) {
  // Exakte ID oder ID-default
  const direct = `${id}.md`;
  const withDefault = `${id}-default.md`;
  if (mdFiles.includes(direct)) return `/src/content/photos/${direct}`;
  if (mdFiles.includes(withDefault)) return `/src/content/photos/${withDefault}`;
  return null;
}

const images = imageFiles.map(filename => {
  // ID ist entweder 8-stellig oder 8-stellig + '-default'
  const base = path.parse(filename).name;
  const id = base.replace(/-default$/, ''); // Nur die 8-stellige ID
  const isDefault = base.endsWith('-default');
  const imageUrl = `/images/original/${filename}`;
  const mdPath = findMd(base);

  return {
    id,
    imageUrl,
    mdPath,
    isDefault
  };
});

fs.writeFileSync(outPath, JSON.stringify(images, null, 2), 'utf-8');
console.log(`✔️ Wrote ${images.length} entries to public/images.json`);