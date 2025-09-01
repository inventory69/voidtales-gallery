import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const srcDir = path.resolve('public/images/original');
const outDir = path.resolve('public/images/thumbs');
const sizes = [400, 800, 1600];

fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
if (!files.length) {
  console.log('No source images found in', srcDir);
  process.exit(0);
}

(async () => {
  for (const file of files) {
    const name = path.parse(file).name;
    const input = path.join(srcDir, file);
    for (const w of sizes) {
      const outFile = path.join(outDir, `${name}-${w}.jpg`);
      await sharp(input).resize({ width: w }).jpeg({ quality: 80 }).toFile(outFile);
      console.log('wrote', outFile);
    }
  }
  console.log('All thumbnails generated.');
})();
