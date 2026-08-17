#!/usr/bin/env node
import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function crc32(buf) {
  let c = ~0;
  for (const byte of buf) {
    c ^= byte;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function png(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function drawIcon(size) {
  const data = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.hypot(dx, dy) / (size / 2);
      const i = (y * size + x) * 4;
      const ocean = r < 0.92;
      data[i] = ocean ? 8 : 0;
      data[i + 1] = ocean ? 40 + Math.floor((1 - r) * 50) : 0;
      data[i + 2] = ocean ? 48 + Math.floor((1 - r) * 80) : 0;
      data[i + 3] = ocean ? 255 : 0;
      if (Math.abs(dy) < size * 0.08 && dx > -size * 0.28 && dx < size * 0.32) {
        data[i] = 62;
        data[i + 1] = 224;
        data[i + 2] = 210;
      }
      if (dx > size * 0.08 && Math.abs(dy + dx * 0.25) < size * 0.07 && dx < size * 0.34) {
        data[i] = 243;
        data[i + 1] = 193;
        data[i + 2] = 74;
      }
    }
  }
  return png(size, size, data);
}

const favicon = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="FINDS">
  <rect width="64" height="64" rx="14" fill="#04121c"/>
  <circle cx="32" cy="32" r="22" fill="#0b3a4a"/>
  <path d="M14 36c10-8 18-10 28-6l8-6-2 10c6 4 8 8 8 8-10-2-16 0-22 4-8 4-16 2-20-10z" fill="#3ee0d2"/>
  <circle cx="44" cy="28" r="2" fill="#04121c"/>
</svg>`;

function sharkCard(title, accent) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop stop-color="#04121c"/><stop offset="1" stop-color="#0b3a4a"/>
    </linearGradient>
  </defs>
  <rect width="400" height="240" fill="url(#g)"/>
  <path d="M40 140c40-40 90-54 160-30l50-28-8 36c30 16 48 30 70 34-60-4-92 8-130 24-50 20-100 10-142-36z" fill="${accent}"/>
  <circle cx="230" cy="108" r="6" fill="#04121c"/>
  <text x="24" y="36" fill="#e7f6ff" font-size="22" font-family="Avenir Next, Segoe UI, sans-serif">${title}</text>
  <text x="24" y="220" fill="#9db8c9" font-size="14" font-family="Avenir Next, Segoe UI, sans-serif">Original FINDS illustration</text>
</svg>`;
}

const sharks = {
  'great-white.svg': sharkCard('Great white', '#d9e7ee'),
  'hammerhead.svg': sharkCard('Hammerhead', '#7aa0b8'),
  'tiger.svg': sharkCard('Tiger shark', '#c7a56a'),
  'whitetip.svg': sharkCard('Whitetip reef', '#8fd0c8'),
  'bull.svg': sharkCard('Bull shark', '#9aa7b5'),
  'mako.svg': sharkCard('Shortfin mako', '#5ec8d8'),
};

const marker = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <path d="M64 8c28 0 52 22 52 56 0 40-52 64-52 64S12 104 12 64C12 30 36 8 64 8z" fill="#f3c14a"/>
  <path d="M28 70c18-14 36-18 56-8l16-10-4 14c10 6 14 12 14 12-16 0-28 4-40 10-18 8-34 4-42-18z" fill="#04121c"/>
</svg>`;

mkdirSync(join(root, 'public/icons'), { recursive: true });
mkdirSync(join(root, 'public/sharks'), { recursive: true });
mkdirSync(join(root, 'public/screenshots'), { recursive: true });
writeFileSync(join(root, 'public/favicon.svg'), favicon);
writeFileSync(join(root, 'public/icons/shark-marker.svg'), marker);
writeFileSync(join(root, 'public/icons/icon-192.png'), drawIcon(192));
writeFileSync(join(root, 'public/icons/icon-512.png'), drawIcon(512));
writeFileSync(join(root, 'public/icons/maskable-512.png'), drawIcon(512));
writeFileSync(join(root, 'public/apple-touch-icon.png'), drawIcon(180));
writeFileSync(join(root, 'public/pwa-192x192.png'), drawIcon(192));
writeFileSync(join(root, 'public/pwa-512x512.png'), drawIcon(512));
writeFileSync(join(root, 'public/favicon.ico'), drawIcon(32));
for (const [name, svg] of Object.entries(sharks)) {
  writeFileSync(join(root, 'public/sharks', name), svg);
}
writeFileSync(join(root, 'docs/media/social-preview.svg'), favicon.replace('viewBox="0 0 64 64"', 'viewBox="0 0 64 64"').replace('<svg', '<svg width="1200" height="630"'));
console.log('assets', createHash('sha256').update(favicon).digest('hex').slice(0, 8));
