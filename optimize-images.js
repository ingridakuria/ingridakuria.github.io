// One-off image optimizer: shrinks the photos in images/ to web-friendly sizes.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'images');
const files = fs.readdirSync(dir).filter(f => /\.jpe?g$/i.test(f));

(async () => {
  let before = 0, after = 0;
  for (const f of files) {
    const p = path.join(dir, f);
    const input = fs.readFileSync(p);
    before += input.length;
    const out = await sharp(input)
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 78, progressive: true, mozjpeg: true })
      .toBuffer();
    fs.writeFileSync(p, out);
    after += out.length;
    console.log(`${f}: ${(input.length/1024).toFixed(0)}KB -> ${(out.length/1024).toFixed(0)}KB`);
  }

  // Social-share image (Open Graph), 1200x630 from the hero photo.
  const og = await sharp(path.join(dir, 'DSC08444.jpg'))
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toBuffer();
  fs.writeFileSync(path.join(dir, 'og-image.jpg'), og);
  console.log(`og-image.jpg created: ${(og.length/1024).toFixed(0)}KB`);

  console.log(`\nTOTAL: ${(before/1024/1024).toFixed(1)}MB -> ${(after/1024/1024).toFixed(1)}MB`);
})();
