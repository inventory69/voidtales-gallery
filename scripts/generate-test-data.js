import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// ============================================================================
// KONFIGURATION
// ============================================================================

const NUM_TEST_IMAGES = 50; // Gesamt: 6 Default + 44 neue Testbilder
const EXISTING_DEFAULT_IDS = [
  '31736163', '44215106', '64517921',
  '72382172', '96103542', '99323854'
];

// Verzeichnisse
const CONTENT_DIR = path.resolve('src/content/photos');
const IMAGES_DIR = path.resolve('public/images/original');
const THUMBS_DIR = path.resolve('public/images/thumbs');

// Thumbnail-Größen (wie in generate-thumbs.js)
const THUMB_SIZES = [200, 400, 800];

// Beispieldaten für Variation
const titleTemplates = [
  'Sunset Over Mountains',
  'City Lights at Night',
  'Forest Path in Autumn',
  'Ocean Waves at Dawn',
  'Desert Dunes Landscape',
  'Snowy Mountain Peaks',
  'Autumn Leaves Close-up',
  'Spring Flowers Bloom',
  'Urban Architecture Study',
  'Wildlife Portrait',
  'Abstract Patterns',
  'Macro Photography',
  'Street Scene Capture',
  'Landscape Vista',
  'Portrait Study',
  'Nature Close-up',
  'Artistic Composition',
  'Candid Moment',
  'Architectural Detail',
  'Twilight Atmosphere',
];

const captions = [
  'A beautiful capture of nature\'s splendor',
  'An artistic representation of urban life',
  'Exploring the wonders of the natural world',
  'A moment frozen in time',
  'Capturing the essence of emotion and light',
  'A study in colors and textures',
  'Documenting the beauty around us',
  'An intimate look at everyday scenes',
  'The interplay of light and shadow',
  'A celebration of visual storytelling',
];

const authors = ['.inventory', 'shinsnowly', 'testuser', 'photographer', 'visualartist'];

// ============================================================================
// HILFSFUNKTIONEN
// ============================================================================

/**
 * Generiert eine eindeutige 8-stellige ID
 */
function generateUniqueId(existingIds) {
  let id;
  let attempts = 0;
  do {
    id = String(Math.floor(10000000 + Math.random() * 90000000));
    attempts++;
    if (attempts > 1000) {
      throw new Error('Konnte keine eindeutige ID generieren');
    }
  } while (existingIds.includes(id));
  return id;
}

/**
 * Wählt ein zufälliges Element aus einem Array
 */
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generiert ein Datum für Testbilder
 * Default-Bilder: September 2025
 * Test-Bilder: Oktober-Dezember 2025
 */
function generateTestDate(index) {
  // Die ersten 6 Bilder sind die existierenden Default-Bilder
  if (index < 6) {
    // Diese haben bereits ihre eigenen Daten in den MD-Dateien
    // Wir überspringen diese
    return null;
  }
  
  // Neue Test-Bilder: Oktober-Dezember 2025
  const testIndex = index - 6;
  const totalTestImages = NUM_TEST_IMAGES - 6;
  
  // Verteile Bilder über 3 Monate (Oktober, November, Dezember)
  const month = 10 + Math.floor((testIndex / totalTestImages) * 3);
  const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
  const hour = String(Math.floor(Math.random() * 24)).padStart(2, '0');
  const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  const second = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  
  return `2025-${String(month).padStart(2, '0')}-${day}T${hour}:${minute}:${second}`;
}

/**
 * Generiert Markdown-Frontmatter für ein Bild
 */
function generateMarkdown(id, index) {
  const date = generateTestDate(index);
  const author = randomChoice(authors);
  const title = randomChoice(titleTemplates);
  const caption = randomChoice(captions);
  const slug = `test-${id}`;
  
  const frontmatter = `---
id: "${id}"
title: "${title}"
slug: "${slug}"
author: "${author}"
date: "${date}"
fullsizePath: "/images/original/${id}.webp"
thumbPath: "/images/thumbs/${id}-400.webp"
width: 1600
height: 900
caption: "${caption}"
body: ""
---
`;

  return frontmatter;
}

/**
 * Erstellt ein minimales 1x1 PNG als Dummy-Original
 * (67 Bytes, transparent)
 */
function createDummyPNG(filepath) {
  const png = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
    0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
    0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
    0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
    0x42, 0x60, 0x82
  ]);
  fs.writeFileSync(filepath, png);
}

/**
 * Erstellt ein farbiges WebP-Thumbnail mit Sharp
 */
async function createColoredThumbnail(width, filepath) {
  const color = {
    r: Math.floor(100 + Math.random() * 155),
    g: Math.floor(100 + Math.random() * 155),
    b: Math.floor(100 + Math.random() * 155)
  };
  
  await sharp({
    create: {
      width: width,
      height: width,
      channels: 3,
      background: color
    }
  })
  .webp({ quality: 80 })
  .toFile(filepath);
}

// ============================================================================
// HAUPTFUNKTION
// ============================================================================

async function main() {
  console.log('🎨 Generiere Testdaten für VoidTales Gallery...\n');
  
  // Stelle sicher, dass Verzeichnisse existieren
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  fs.mkdirSync(THUMBS_DIR, { recursive: true });
  
  // 1. Prüfe existierende Default-Bilder
  console.log('📋 Prüfe existierende Default-Bilder...');
  const existingIds = [...EXISTING_DEFAULT_IDS];
  console.log(`  ✓ Gefunden: ${existingIds.length} Default-Bilder\n`);
  
  // 2. Generiere neue eindeutige IDs
  console.log('🔢 Generiere neue IDs...');
  const newIds = [];
  for (let i = 0; i < NUM_TEST_IMAGES - 6; i++) {
    const id = generateUniqueId([...existingIds, ...newIds]);
    newIds.push(id);
  }
  console.log(`  ✓ ${newIds.length} neue IDs generiert\n`);
  
  // 3. Erstelle Markdown-Dateien
  console.log('📝 Erstelle Markdown-Dateien...');
  let mdCount = 0;
  for (let i = 6; i < NUM_TEST_IMAGES; i++) {
    const id = newIds[i - 6];
    const markdown = generateMarkdown(id, i);
    const mdPath = path.join(CONTENT_DIR, `${id}.md`);
    
    fs.writeFileSync(mdPath, markdown, 'utf-8');
    console.log(`  ✓ ${path.basename(mdPath)}`);
    mdCount++;
  }
  console.log(`  📊 ${mdCount} Markdown-Dateien erstellt\n`);
  
  // 4. Erstelle Dummy-Original-Bilder
  console.log('🖼️  Erstelle Dummy-Original-Bilder...');
  let imageCount = 0;
  for (const id of newIds) {
    const imagePath = path.join(IMAGES_DIR, `${id}.webp`);
    createDummyPNG(imagePath);
    console.log(`  ✓ ${path.basename(imagePath)}`);
    imageCount++;
  }
  console.log(`  📊 ${imageCount} Original-Bilder erstellt\n`);
  
  // 5. Erstelle farbige Thumbnails
  console.log('🎨 Erstelle Fake-Thumbnails (das kann einen Moment dauern)...');
  let thumbCount = 0;
  for (const id of newIds) {
    for (const size of THUMB_SIZES) {
      const thumbPath = path.join(THUMBS_DIR, `${id}-${size}.webp`);
      
      if (fs.existsSync(thumbPath)) {
        console.log(`  ⏭️  ${path.basename(thumbPath)} (existiert bereits)`);
        continue;
      }
      
      await createColoredThumbnail(size, thumbPath);
      console.log(`  ✓ ${path.basename(thumbPath)} (${size}x${size})`);
      thumbCount++;
    }
  }
  console.log(`  📊 ${thumbCount} Thumbnails erstellt\n`);
  
  // Zusammenfassung
  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ Testdaten erfolgreich generiert!');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📊 Gesamt: ${NUM_TEST_IMAGES} Bilder`);
  console.log(`   - ${EXISTING_DEFAULT_IDS.length} Default-Bilder (behalten)`);
  console.log(`   - ${newIds.length} neue Test-Bilder`);
  console.log('');
  console.log('🚀 Nächste Schritte:');
  console.log('   1. pnpm run gen:imagejson  # Aktualisiere images.json');
  console.log('   2. pnpm dev                # Starte Dev-Server');
  console.log('');
}

// ============================================================================
// CLEANUP-FUNKTION (optional, kann separat aufgerufen werden)
// ============================================================================

async function cleanup() {
  console.log('🧹 Bereinige alte Testdaten...\n');
  
  let deletedCount = 0;
  
  // Lösche nur Test-Markdown-Dateien (nicht -default.md)
  console.log('🗑️  Lösche alte Markdown-Dateien...');
  if (fs.existsSync(CONTENT_DIR)) {
    const mdFiles = fs.readdirSync(CONTENT_DIR)
      .filter(f => f.endsWith('.md') && !f.endsWith('-default.md') && !fs.statSync(path.join(CONTENT_DIR, f)).isDirectory());
    
    for (const file of mdFiles) {
      fs.unlinkSync(path.join(CONTENT_DIR, file));
      console.log(`  🗑️  ${file}`);
      deletedCount++;
    }
  }
  
  // Lösche nur Test-Original-Bilder (nicht in default/)
  console.log('\n🗑️  Lösche alte Original-Bilder...');
  if (fs.existsSync(IMAGES_DIR)) {
    const imageFiles = fs.readdirSync(IMAGES_DIR)
      .filter(f => /\.(webp|png|jpg|jpeg)$/i.test(f) && !fs.statSync(path.join(IMAGES_DIR, f)).isDirectory());
    
    for (const file of imageFiles) {
      fs.unlinkSync(path.join(IMAGES_DIR, file));
      console.log(`  🗑️  ${file}`);
      deletedCount++;
    }
  }
  
  // Lösche nur Test-Thumbnails (nicht -default-)
  console.log('\n🗑️  Lösche alte Thumbnails...');
  if (fs.existsSync(THUMBS_DIR)) {
    const thumbFiles = fs.readdirSync(THUMBS_DIR)
      .filter(f => /\-(200|400|800)\.webp$/i.test(f) && !f.includes('-default-'));
    
    for (const file of thumbFiles) {
      fs.unlinkSync(path.join(THUMBS_DIR, file));
      console.log(`  🗑️  ${file}`);
      deletedCount++;
    }
  }
  
  console.log(`\n✅ Cleanup abgeschlossen! ${deletedCount} Dateien gelöscht.\n`);
}

// ============================================================================
// CLI-HANDLING
// ============================================================================

const args = process.argv.slice(2);

if (args.includes('--cleanup') || args.includes('-c')) {
  cleanup().catch(console.error);
} else if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🎨 VoidTales Gallery - Testdaten Generator

USAGE:
  node scripts/generate-test-data.js [options]

OPTIONS:
  --help, -h      Zeige diese Hilfe
  --cleanup, -c   Bereinige alte Testdaten (ohne neue zu generieren)

EXAMPLES:
  node scripts/generate-test-data.js          # Generiere Testdaten
  node scripts/generate-test-data.js -c       # Bereinige alte Testdaten
  pnpm run gen:testdata                       # Via NPM-Script
  `);
} else {
  main().catch(console.error);
}
