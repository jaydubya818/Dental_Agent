#!/usr/bin/env node
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// SVG source
const svgIcon = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="80" fill="url(#bgGradient)"/>
  <text x="256" y="340" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        font-size="280" font-weight="700" fill="#ffffff" letter-spacing="-10">
    S<tspan fill="#fbbf24">F</tspan>
  </text>
</svg>`;

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = join(__dirname, '..', 'public', 'icons');

// Ensure icons directory exists
try {
  mkdirSync(iconsDir, { recursive: true });
} catch (err) {
  // Directory already exists
}

async function generateIcons() {
  console.log('🎨 Generating PNG icons from SVG...\n');
  
  for (const size of sizes) {
    try {
      const outputPath = join(iconsDir, `icon-${size}x${size}.png`);
      
      await sharp(Buffer.from(svgIcon))
        .resize(size, size)
        .png({
          compressionLevel: 9,
          quality: 100
        })
        .toFile(outputPath);
      
      console.log(`✅ Generated: icon-${size}x${size}.png`);
    } catch (err) {
      console.error(`❌ Failed to generate icon-${size}x${size}.png:`, err.message);
    }
  }
  
  console.log('\n✨ All icons generated successfully!');
  console.log('📍 Location: public/icons/');
}

generateIcons().catch(console.error);
