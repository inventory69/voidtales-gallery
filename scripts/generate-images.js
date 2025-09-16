import fs from 'fs';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'public/images/original');
const contentDir = path.join(process.cwd(), 'src/content/photos');
const outPath = path.join(process.cwd(), 'public/images.json');

// Get all image files (including -default)
const imageFiles = fs.readdirSync(imagesDir).filter(f =>
  /\.(webp|jpg|png|jpeg|bmp)$/i.test(f)
);

// Get all markdown files (including -default)
const mdFiles = fs.readdirSync(contentDir).filter(f => /\.md$/i.test(f));

// Helper: Find the matching markdown file for a given image
function findMd(id) {
  const direct = `${id}.md`;
  const withDefault = `${id}-default.md`;
  if (mdFiles.includes(direct)) return direct;
  if (mdFiles.includes(withDefault)) return withDefault;
  return null;
}

// Helper: Extract frontmatter from markdown file
function extractFrontmatter(mdFilePath) {
  if (!mdFilePath) return {};
  const fullPath = path.join(contentDir, mdFilePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};

  const frontmatter = {};
  const lines = frontmatterMatch[1].split('\n');
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      frontmatter[key.trim()] = value;
    }
  }
  return frontmatter;
}

const images = imageFiles.map(filename => {
  const base = path.parse(filename).name;
  const id = base.replace(/-default$/, '');
  const isDefault = base.endsWith('-default');
  const imageUrl = `/images/original/${filename}`;
  const mdFile = findMd(base);
  const mdPath = mdFile ? `/src/content/photos/${mdFile}` : null;
  const frontmatter = extractFrontmatter(mdFile);

  // Definiere mdFilePath korrekt
  const mdFilePath = mdFile ? path.join(contentDir, mdFile) : null;

  // Vor dem Lesen der MD-Datei
  console.log(`Looking for MD file: ${mdFilePath}`);
  console.log(`MD file exists: ${mdFilePath ? fs.existsSync(mdFilePath) : false}`);

  // Nach dem Lesen (innerhalb extractFrontmatter)
  // Entferne diese Logs hier, da mdContent nicht verfügbar ist

  // Nach extractFrontmatter
  console.log(`Frontmatter keys: ${Object.keys(frontmatter)}`);
  console.log(`Author value: "${frontmatter.author}"`);

  return {
    id,
    imageUrl,
    mdPath,
    isDefault,
    date: frontmatter.date || null,
    title: frontmatter.title || id,
    caption: frontmatter.caption || '',
    author: frontmatter.author || '',
    body: frontmatter.body || '',
  };
});

// Am Ende
console.log(`Final images:`, images.map(img => ({ id: img.id, author: img.author })));

fs.writeFileSync(outPath, JSON.stringify(images, null, 2), 'utf-8');
console.log(`✔️ Wrote ${images.length} entries to public/images.json`);