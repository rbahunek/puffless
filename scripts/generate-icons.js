#!/usr/bin/env node
// Generate PWA icons as SVG files and convert to PNG using sharp or just create SVG placeholders

const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// SVG template for the icon
function createSVG(size, maskable = false) {
  const radius = maskable ? 0 : Math.round(size * 0.22);
  const bgPath = maskable 
    ? `<rect width="${size}" height="${size}" fill="url(#grad)"/>`
    : `<rect width="${size}" height="${size}" rx="${radius}" fill="url(#grad)"/>`;
  
  const fontSize = Math.round(size * 0.45);
  const centerX = size / 2;
  const centerY = size / 2 + fontSize * 0.1;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2EC4B6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4F7BFF;stop-opacity:1" />
    </linearGradient>
  </defs>
  ${bgPath}
  <text x="${centerX}" y="${centerY}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">P</text>
</svg>`;
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create SVG icons (these work as PWA icons in many contexts)
for (const size of sizes) {
  const svg = createSVG(size, false);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svg);
  console.log(`Created icon-${size}x${size}.svg`);
}

// Maskable icons
for (const size of [192, 512]) {
  const svg = createSVG(size, true);
  fs.writeFileSync(path.join(iconsDir, `icon-maskable-${size}x${size}.svg`), svg);
  console.log(`Created icon-maskable-${size}x${size}.svg`);
}

console.log('SVG icons created!');
