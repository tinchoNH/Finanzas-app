// Script para generar íconos PNG para PWA
// Ejecutar: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

function createIconSVG(size) {
  const r = size * 0.2; // border radius
  const cx = size / 2;
  const cy = size / 2;
  const coinR = size * 0.35;
  const fontSize = size * 0.38;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="#0f172a"/>
  <circle cx="${cx}" cy="${cy}" r="${coinR}" fill="#f59e0b"/>
  <circle cx="${cx}" cy="${cy}" r="${coinR * 0.85}" fill="none" stroke="#d97706" stroke-width="${size * 0.02}"/>
  <text x="${cx}" y="${cy + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}" font-weight="bold" font-family="Arial, sans-serif" fill="#0f172a">$</text>
</svg>`;
}

const publicDir = path.join(__dirname, '..', 'public');

// Write SVGs (they'll be used directly)
fs.writeFileSync(path.join(publicDir, 'icon-192.svg'), createIconSVG(192));
fs.writeFileSync(path.join(publicDir, 'icon-512.svg'), createIconSVG(512));

console.log('Icons generated!');
