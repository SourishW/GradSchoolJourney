// Props layered over a character sprite, drawn procedurally on small grids.
// `offset` is where the prop's top-left sits relative to the character's
// top-left, in sprite pixels (the character is 32x58).

function grid(width, height) {
  const cells = Array.from({ length: height }, () => Array(width).fill('.'));
  const px = (x, y, c) => { if (x >= 0 && x < width && y >= 0 && y < height) cells[y][x] = c; };
  const fill = (x0, y0, x1, y1, c) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) px(x, y, c); };
  return { px, fill, rows: () => cells.map((row) => row.join('')) };
}

// Violin tucked under the chin: body on the right, neck running left, bow
// crossing the strings diagonally.
function violinRows() {
  const g = grid(32, 18);
  // Neck and scroll.
  g.fill(2, 7, 18, 9, 'w'); g.fill(2, 6, 18, 6, 'k'); g.fill(2, 10, 18, 10, 'k');
  g.fill(0, 5, 2, 10, 'w'); g.px(0, 5, 'k'); g.px(0, 10, 'k'); g.px(1, 4, 'k'); g.px(1, 11, 'k');
  // Body: two bouts with a waist.
  g.fill(19, 3, 28, 8, 'W'); g.fill(20, 8, 27, 10, 'W'); g.fill(19, 10, 29, 15, 'W');
  g.fill(20, 2, 27, 2, 'k'); g.fill(20, 16, 28, 16, 'k');
  for (let y = 3; y <= 7; y++) { g.px(18, y, 'k'); g.px(29, y, 'k'); }
  for (let y = 11; y <= 15; y++) { g.px(18, y, 'k'); g.px(30, y, 'k'); }
  g.px(19, 8, 'k'); g.px(19, 9, 'k'); g.px(19, 10, 'k'); g.px(28, 8, 'k'); g.px(28, 9, 'k'); g.px(29, 10, 'k');
  // Shading, f-holes, bridge, tailpiece, chin rest.
  g.fill(26, 4, 28, 14, 'v');
  g.fill(21, 6, 21, 8, 'k'); g.fill(26, 6, 26, 8, 'k');
  g.fill(24, 7, 24, 11, 'k');
  g.fill(27, 10, 28, 12, 'k');
  g.fill(26, 14, 29, 15, 'k');
  // Strings from scroll to tailpiece.
  for (let x = 2; x <= 26; x++) g.px(x, 8, 'n');
  for (let x = 3; x <= 25; x += 2) g.px(x, 9, 'n');
  // Bow: crosses the strings near the bridge and angles down toward the
  // bow hand; stick darker than the hair.
  for (let i = 0; i <= 11; i++) { g.px(20 + i, 2 + i, 'B'); g.px(21 + i, 2 + i, 'b'); }
  g.fill(19, 1, 20, 2, 'k');
  return g.rows();
}

function cakeRows() {
  const g = grid(16, 12);
  g.fill(1, 10, 14, 11, 'P'); g.fill(0, 11, 15, 11, 'k');       // plate
  g.fill(2, 5, 13, 9, 'c'); g.fill(2, 4, 13, 5, 'p');            // sponge and frosting
  g.px(4, 6, 'p'); g.px(8, 6, 'p'); g.px(11, 6, 'p');            // drips
  g.fill(1, 4, 1, 9, 'k'); g.fill(14, 4, 14, 9, 'k'); g.fill(2, 3, 13, 3, 'k');
  g.fill(2, 10, 13, 10, 'k');
  [4, 8, 11].forEach((x) => { g.fill(x, 1, x, 3, 'n'); g.px(x, 0, 'y'); });
  return g.rows();
}

// A cello standing on its endpin beside the player.
function celloRows() {
  const g = grid(20, 60);
  g.fill(8, 0, 11, 3, 'w'); g.px(7, 1, 'k'); g.px(12, 1, 'k'); g.fill(8, 4, 11, 4, 'k'); // scroll and pegs
  g.fill(8, 5, 11, 20, 'w'); g.fill(7, 5, 7, 20, 'k'); g.fill(12, 5, 12, 20, 'k');     // neck
  g.fill(4, 21, 15, 30, 'W'); g.fill(5, 31, 14, 35, 'W'); g.fill(3, 36, 16, 50, 'W');   // bouts
  g.fill(13, 21, 15, 50, 'v');
  g.fill(5, 20, 14, 20, 'k'); g.fill(4, 51, 15, 51, 'k');
  for (let y = 21; y <= 30; y++) { g.px(3, y, 'k'); g.px(16, y, 'k'); }
  for (let y = 31; y <= 35; y++) { g.px(4, y, 'k'); g.px(15, y, 'k'); }
  for (let y = 36; y <= 50; y++) { g.px(2, y, 'k'); g.px(17, y, 'k'); }
  g.fill(6, 32, 6, 36, 'k'); g.fill(13, 32, 13, 36, 'k');                                // f-holes
  g.fill(7, 38, 12, 39, 'k');                                                            // bridge
  g.fill(8, 44, 11, 49, 'k');                                                            // tailpiece
  for (let x = 8; x <= 11; x += 1) g.fill(x, 5, x, 43, x % 2 ? 'n' : 'w');               // strings
  g.fill(9, 52, 10, 58, 'k'); g.fill(8, 59, 11, 59, 'k');                                // endpin
  return g.rows();
}

export const PROPS = {
  violin: {
    offset: { x: -16, y: 17 },
    colors: { k: '#15141c', w: '#6e3a16', W: '#b8692e', v: '#8f4f20', n: '#efe6c8', B: '#e3d4a6', b: '#5a4a2a' },
    rows: violinRows(),
  },
  cake: {
    offset: { x: 21, y: 30 },
    colors: { k: '#15141c', c: '#f3d9a4', p: '#f78fb3', P: '#e8e8f0', n: '#fff3dd', y: '#ff9f43' },
    rows: cakeRows(),
  },
  cello: {
    offset: { x: -18, y: 4 },
    colors: { k: '#15141c', w: '#5c2d0e', W: '#9c4f1f', v: '#7a3c16', n: '#efe6c8' },
    rows: celloRows(),
  },
};
