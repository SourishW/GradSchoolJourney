// Props drawn beside or in front of a character, on the same fine grid as the
// character sprite (64x116) and with the same outline. `offset` is where the
// prop's top-left sits relative to the character's top-left, in sprite
// pixels.
//
//   followsBody  the prop is carried, so it moves down with shorter characters
//   arms         the arm pose the carrier takes (see humanoid_body.js)
//
// The violin is not here: it is part of the 'violin' pose.

import { createLayer } from './painter.js';
import { softOutline } from './soft_outline.js';
import { LINE_STRENGTH } from './humanoid_body.js';

function finish(layer, colors) {
  softOutline(layer.cells, colors, { strength: LINE_STRENGTH });
  return { rows: layer.rows(), colors };
}

// A frosted cake on a plate, three candles lit.
function cake() {
  const colors = { c: '#f3d9a4', C: '#d9b77c', p: '#f78fb3', q: '#ffc2d6', P: '#e8e8f0', R: '#b9b9cc', n: '#fff3dd', y: '#ffd166', f: '#ff8c42' };
  const g = createLayer(26, 20);
  g.fill(0, 18, 25, 19, 'P'); g.row(19, 2, 23, 'R');                 // plate
  g.fill(3, 9, 22, 17, 'c');                                         // sponge
  g.row(13, 3, 22, 'n');                                             // filling
  g.rim('c', 'C', 'right', 3, 0);
  g.fill(3, 6, 22, 9, 'p'); g.row(6, 4, 21, 'q');                    // frosting
  for (const x of [5, 6, 10, 15, 16, 20]) g.fill(x, 10, x, 10 + (x % 2), 'p'); // drips
  for (const x of [7, 13, 19]) {
    g.fill(x, 2, x, 5, 'n'); g.px(x, 3, 'p');                        // candle
    g.px(x, 1, 'f'); g.px(x, 0, 'y');                                // flame
  }
  return finish(g, colors);
}

// A cello standing on its endpin.
function cello() {
  const colors = { w: '#5c2d0e', W: '#9c4f1f', v: '#7a3c16', h: '#c06a2c', n: '#efe6c8', k: '#2a2230', m: '#b9b9cc' };
  const g = createLayer(34, 96);
  g.ellipse(17, 46, 11, 10, 'W');                                    // upper bout
  g.fill(9, 50, 24, 62, 'W');                                        // waist
  g.ellipse(17, 69, 14, 13, 'W');                                    // lower bout
  for (let y = 53; y <= 59; y++) { g.px(9, y, '.'); g.px(24, y, '.'); }
  g.px(10, 55, '.'); g.px(10, 56, '.'); g.px(10, 57, '.'); g.px(23, 55, '.'); g.px(23, 56, '.'); g.px(23, 57, '.');
  g.rim('W', 'h', 'left', 2, 1);
  g.rim('W', 'v', 'right', 4, 1);
  g.fill(15, 0, 18, 3, 'w'); g.px(14, 1, 'w'); g.px(19, 2, 'w');     // scroll
  g.fill(14, 4, 19, 9, 'w');                                         // pegbox
  for (const y of [5, 8]) { g.fill(11, y, 13, y, 'k'); g.fill(20, y, 22, y, 'k'); } // pegs
  g.fill(15, 10, 18, 58, 'k');                                       // fingerboard
  g.fill(11, 58, 11, 66, 'k'); g.px(12, 57, 'k'); g.px(12, 67, 'k'); // f-holes
  g.fill(22, 58, 22, 66, 'k'); g.px(21, 57, 'k'); g.px(21, 67, 'k');
  g.fill(13, 63, 20, 64, 'h');                                       // bridge
  g.shape([[70, 15, 18], [80, 14, 19]], 'k');                        // tailpiece
  for (const x of [15, 16, 17, 18]) g.fill(x, 5, x, 70, x % 2 ? 'n' : 'k'); // strings
  g.fill(16, 83, 17, 94, 'm'); g.row(95, 15, 18, 'k');               // endpin
  return finish(g, colors);
}

export const PROPS = {
  cake: { ...cake(), offset: { x: 19, y: 38 }, followsBody: true, arms: 'hold' },
  cello: { ...cello(), offset: { x: -26, y: 20 } },
};
