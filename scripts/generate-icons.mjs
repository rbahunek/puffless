// Script to generate PWA icons using canvas
// Run with: node scripts/generate-icons.mjs

import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public', 'icons');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

function drawIcon(canvas, size, maskable = false) {
  const ctx = canvas.getContext('2d');
  const padding = maskable ? size * 0.15 : size * 0.1;
  const innerSize = size - padding * 2;
  
  // Background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#2EC4B6');
  gradient.addColorStop(1, '#4F7BFF');
  
  if (maskable) {
    // Full square background for maskable
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  } else {
    // Rounded rectangle
    const radius = size * 0.22;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  
  // Draw a simple "P" letter or cigarette-free icon
  const centerX = size / 2;
  const centerY = size / 2;
  const iconSize = innerSize * 0.55;
  
  ctx.fillStyle = 'white';
  ctx.font = `bold ${iconSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('P', centerX, centerY + iconSize * 0.05);
}

for (const size of sizes) {
  const canvas = createCanvas(size, size);
  drawIcon(canvas, size, false);
  const buffer = canvas.toBuffer('image/png');
  writeFileSync(join(publicDir, `icon-${size}x${size}.png`), buffer);
  console.log(`Generated icon-${size}x${size}.png`);
}

// Maskable icons
for (const size of [192, 512]) {
  const canvas = createCanvas(size, size);
  drawIcon(canvas, size, true);
  const buffer = canvas.toBuffer('image/png');
  writeFileSync(join(publicDir, `icon-maskable-${size}x${size}.png`), buffer);
  console.log(`Generated icon-maskable-${size}x${size}.png`);
}

console.log('All icons generated!');
