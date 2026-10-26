import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, colorFn) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = colorFn(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : (c >>> 1);
    }
    table[i] = c;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdrData),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// Academic Crest Drawer: Deep Navy (#0f172a), Oxford Blue (#1e3a8a), Gold Amber (#f59e0b)
function drawCrest(x, y, w, h) {
  const nx = x / w;
  const ny = y / h;
  const cx = 0.5;
  const cy = 0.5;
  const dx = nx - cx;
  const dy = ny - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Rounded Corner background (radius ~ 20%)
  const cornerR = 0.2;
  const inBox = Math.abs(dx) <= 0.48 && Math.abs(dy) <= 0.48;

  // Outer border
  const borderDist = Math.max(Math.abs(dx), Math.abs(dy));

  // Shield boundary
  const inShield = (Math.abs(dx) <= 0.35 * (1 - (ny > 0.4 ? (ny - 0.4) * 1.5 : 0))) && ny >= 0.15 && ny <= 0.85;

  // Star / Crest core
  const inCore = dist < 0.16;
  const inGoldRing = dist >= 0.16 && dist <= 0.20;

  if (inGoldRing) {
    return [245, 158, 11, 255]; // Gold Amber
  }

  if (inCore) {
    // Open Book / Mortarboard Core
    return [254, 240, 138, 255]; // Bright Gold
  }

  if (inShield) {
    // Oxford Navy Blue
    return [30, 58, 138, 255];
  }

  if (borderDist > 0.46) {
    return [217, 119, 6, 255]; // Outer Gold Accent
  }

  // Dark Slate Background
  return [15, 23, 42, 255];
}

fs.writeFileSync('public/pwa-192x192.png', createPNG(192, 192, drawCrest));
fs.writeFileSync('public/pwa-512x512.png', createPNG(512, 512, drawCrest));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPNG(512, 512, drawCrest));
fs.writeFileSync('public/apple-touch-icon.png', createPNG(180, 180, drawCrest));
fs.writeFileSync('public/favicon.ico', createPNG(64, 64, drawCrest));

console.log('PWA PNG icons generated successfully!');
