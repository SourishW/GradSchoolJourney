// Writes a PNG sprite sheet of the cast (one row per character, one column
// per pose) with no dependencies beyond Node's zlib.
//   node tools/export_sprite_sheet.js out.png [scale] [character|all] [pose,pose,...]

import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { CAST } from '../js/sprites/cast.js';
import { humanoid, POSES, SPRITE_WIDTH, SPRITE_HEIGHT } from '../js/sprites/humanoid.js';
import { PROPS } from '../js/sprites/props.js';

const [outPath = 'sprites.png', scaleArg = '4', onlyWho = 'all', onlyPoses] = process.argv.slice(2);
const SCALE = Number(scaleArg);
const GAP = 6;

const poseNames = onlyPoses ? onlyPoses.split(',') : Object.keys(POSES);
const names = onlyWho === 'all' ? Object.keys(CAST) : [onlyWho];
// Extra room on the left for the cello, which stands beside the sprite.
const CELL_W = SPRITE_WIDTH + 30;
const CELL_H = SPRITE_HEIGHT + 2;
const width = (CELL_W + GAP) * poseNames.length * SCALE;
const height = (CELL_H + GAP) * names.length * SCALE;
const pixels = Buffer.alloc(width * height * 4);
pixels.fill(0x30);
for (let i = 3; i < pixels.length; i += 4) pixels[i] = 255;

function hexToRgb(hex) {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function blit(rows, colors, originX, originY) {
  rows.forEach((row, y) => {
    [...row].forEach((letter, x) => {
      if (letter === '.') return;
      const [r, g, b] = hexToRgb(colors[letter]);
      for (let dy = 0; dy < SCALE; dy++) for (let dx = 0; dx < SCALE; dx++) {
        const px = (originX + x) * SCALE + dx;
        const py = (originY + y) * SCALE + dy;
        if (px < 0 || py < 0 || px >= width || py >= height) continue;
        const offset = (py * width + px) * 4;
        pixels[offset] = r; pixels[offset + 1] = g; pixels[offset + 2] = b; pixels[offset + 3] = 255;
      }
    });
  });
}

names.forEach((who, row) => {
  poseNames.forEach((pose, column) => {
    const face = POSES[pose];
    const holdsCake = who === 'priya' && pose === 'happy';
    const sprite = humanoid({ ...CAST[who], ...face, facing: 'right', ...(holdsCake ? { arms: 'hold' } : {}), ...(who === 'amara' && pose === 'tired' ? { disheveled: true } : {}) });
    const originX = column * (CELL_W + GAP) + 28;
    const originY = row * (CELL_H + GAP) + 1;
    blit(sprite.rows, sprite.colors, originX, originY);
    const prop = holdsCake ? 'cake' : who === 'jun' && pose === 'idle' ? 'cello' : null;
    if (prop) {
      const { rows, colors, offset, followsBody } = PROPS[prop];
      blit(rows, colors, originX + offset.x, originY + offset.y + (followsBody ? CAST[who].shorter ?? 0 : 0));
    }
  });
});

// --- minimal PNG encoder ---------------------------------------------------
const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
function crc32(buffer) {
  let crc = -1;
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 255] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}
function chunk(type, data) {
  const length = Buffer.alloc(4); length.writeUInt32BE(data.length);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([length, typeAndData, crc]);
}
const header = Buffer.alloc(13);
header.writeUInt32BE(width, 0); header.writeUInt32BE(height, 4);
header[8] = 8; header[9] = 6; header[10] = 0; header[11] = 0; header[12] = 0;
const raw = Buffer.alloc((width * 4 + 1) * height);
for (let y = 0; y < height; y++) {
  raw[y * (width * 4 + 1)] = 0;
  pixels.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
}
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', header),
  chunk('IDAT', deflateSync(raw)),
  chunk('IEND', Buffer.alloc(0)),
]);
writeFileSync(outPath, png);
console.log(`wrote ${outPath} (${width}x${height}): rows=${names.join(',')} cols=${poseNames.join(',')}`);
