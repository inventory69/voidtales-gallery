import fs from 'fs';
import path from 'path';

const imagesDirs = [
  path.join(process.cwd(), 'public/images/original'),
  path.join(process.cwd(), 'public/images/original/default')
];
const contentDirs = [
  path.join(process.cwd(), 'src/content/photos'),
  path.join(process.cwd(), 'src/content/photos/default')
];
const outPath = path.join(process.cwd(), 'public/images.json');

// Get all image files from both image directories
let imageFiles = [];
for (const dir of imagesDirs) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir)
      .filter(f => /\.(webp|jpg|png|jpeg|bmp)$/i.test(f))
      .map(f => ({ file: f, dir }));
    imageFiles = imageFiles.concat(files);
  }
}

// Get all markdown files from both content directories
let mdFiles = [];
for (const dir of contentDirs) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir)
      .filter(f => /\.md$/i.test(f))
      .map(f => ({ file: f, dir }));
    mdFiles = mdFiles.concat(files);
  }
}

// Helper: Find the matching markdown file for a given image
function findMd(id) {
  const direct = `${id}.md`;
  const withDefault = `${id}-default.md`;
  for (const { file, dir } of mdFiles) {
    if (file === direct || file === withDefault) {
      return { file, dir };
    }
  }
  return null;
}

// Helper: Extract frontmatter from markdown file
function extractFrontmatter(mdFileObj) {
  if (!mdFileObj) return {};
  const fullPath = path.join(mdFileObj.dir, mdFileObj.file);
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

const images = imageFiles.map(({ file, dir }) => {
  const base = path.parse(file).name;
  const id = base.replace(/-default$/, '');
  const isDefault = base.endsWith('-default');
  const imageUrl = `/images/original/${isDefault ? 'defaults/' : ''}${file}`;
  const mdFileObj = findMd(base);
  const mdPath = mdFileObj ? `/src/content/photos/${mdFileObj.dir.endsWith('defaults') ? 'defaults/' : ''}${mdFileObj.file}` : null;
  const frontmatter = extractFrontmatter(mdFileObj);

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

fs.writeFileSync(outPath, JSON.stringify(images, null, 2), 'utf-8');
console.log(`✔️ Wrote ${images.length} entries to public/images.json`);