// Outline pass shared by the body sprite and the portrait: every filled pixel
// that touches transparency is replaced by a darker, hue-tinted version of
// its own colour. That gives hair a dark-hair edge, skin a dark-skin edge and
// so on, instead of one hard black line around everything.

import { mix } from './color.js';

const OUTLINE_LETTERS = 'αβγδεζηθικλμνξοπρστυφχψωΓΔΘΛΞΠΣΦΨΩ';
const OUTLINE_MIX = 0.55;

export function softOutline(grid, colors) {
  const height = grid.length, width = grid[0].length;
  const open = (x, y) => x < 0 || y < 0 || x >= width || y >= height || grid[y][x] === '.';
  const outlineFor = new Map();
  const edges = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const letter = grid[y][x];
      if (letter === '.') continue;
      if (!(open(x - 1, y) || open(x + 1, y) || open(x, y - 1) || open(x, y + 1))) continue;
      if (!outlineFor.has(letter)) {
        const outlineLetter = OUTLINE_LETTERS[outlineFor.size];
        if (!outlineLetter) throw new Error('softOutline: ran out of outline letters');
        outlineFor.set(letter, outlineLetter);
        colors[outlineLetter] = mix(colors[letter], '#1a1028', OUTLINE_MIX);
      }
      edges.push([x, y, outlineFor.get(letter)]);
    }
  }
  for (const [x, y, letter] of edges) grid[y][x] = letter;
}
