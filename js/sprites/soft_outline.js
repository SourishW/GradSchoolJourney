// Outline pass shared by the body sprite and the portrait: every filled pixel
// that touches transparency is replaced by a darker, hue-tinted version of
// its own colour. That gives hair a dark-hair edge, skin a dark-skin edge and
// so on, instead of one hard black line around everything.
//
// The outline of letter X is a fixed other letter (X shifted into the Greek
// block), so the pass can run on several layers that share one colour table.

import { mix } from './color.js';

const INK = '#1a1028';
const OUTLINE_OFFSET = 0x350; // 'A' -> 'Α', 'a' -> 'α'
const DEFAULT_STRENGTH = 0.55;

export const isOutline = (letter) => letter.charCodeAt(0) >= OUTLINE_OFFSET;

// The material letter behind an outline letter (or the letter itself).
export function baseLetter(letter) {
  return isOutline(letter) ? String.fromCharCode(letter.charCodeAt(0) - OUTLINE_OFFSET) : letter;
}

// Options:
//   strength  how far the edge colour moves toward ink (0..1)
//   keep      (x, y, nx, ny) -> bool; called for each transparent neighbour
//             (nx, ny) of an edge pixel (x, y). The pixel is outlined only if
//             some neighbour is kept. Default: every edge is outlined.
export function softOutline(grid, colors, { strength = DEFAULT_STRENGTH, keep } = {}) {
  const height = grid.length, width = grid[0].length;
  const open = (x, y) => x < 0 || y < 0 || x >= width || y >= height || grid[y][x] === '.';
  const edges = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const letter = grid[y][x];
      if (letter === '.' || isOutline(letter)) continue;
      const exposed = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]
        .some(([nx, ny]) => open(nx, ny) && (!keep || keep(x, y, nx, ny)));
      if (!exposed) continue;
      const outlineLetter = String.fromCharCode(letter.charCodeAt(0) + OUTLINE_OFFSET);
      if (!colors[outlineLetter]) colors[outlineLetter] = mix(colors[letter], INK, strength);
      edges.push([x, y, outlineLetter]);
    }
  }
  for (const [x, y, letter] of edges) grid[y][x] = letter;
}
