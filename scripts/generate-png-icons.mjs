import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'public', 'icons');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function convertSvgToPng(svgPath, pngPath, size) {
  const svgBuffer = readFileSync(svgPath);
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(pngPath);
  console.log(`Converted to ${pngPath}`);
}

async function main() {
  for (const size of sizes) {
    const svgPath = join(iconsDir, `icon-${size}x${size}.svg`);
    const pngPath = join(iconsDir, `icon-${size}x${size}.png`);
    await convertSvgToPng(svgPath, pngPath, size);
  }
  
  for (const size of [192, 512]) {
    const svgPath = join(iconsDir, `icon-maskable-${size}x${size}.svg`);
    const pngPath = join(iconsDir, `icon-maskable-${size}x${size}.png`);
    await convertSvgToPng(svgPath, pngPath, size);
  }
  
  console.log('All PNG icons generated!');
}

main().catch(console.error);
