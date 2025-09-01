import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const srcDir = path.resolve('public/images/original');
const outDir = path.resolve('public/images/thumbs');
const sizes = [200, 400];

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
      // // JPG-Thumbnail
      // const outJpg = path.join(outDir, `${name}-${w}.jpg`);
      // await sharp(input).resize({ width: w }).jpeg({ quality: 80 }).toFile(outJpg);
      // console.log('wrote', outJpg);

      // WebP-Thumbnail
      const outWebp = path.join(outDir, `${name}-${w}.webp`);
      await sharp(input).resize({ width: w }).webp({ quality: 80 }).toFile(outWebp);
      console.log('wrote', outWebp);
    }
  }
  console.log('All thumbnails (JPG & WebP) generated.');
})();