// NOT YET USED ON STAGE: a 64x104 full-body character for a later art pass.
// Parametric, about four heads tall. Every
// cast member is one call to `humanoid` with a palette and a pose. The sprite
// is built facing right and mirrored for facing left. An outline pass then
// darkens every silhouette edge with a hue-tinted (never pure black) line so
// the whole cast shares one soft line weight.
//
// Letters used in the grid:
//   s skin   S skin shade   r blush
//   A hair   h hair highlight
//   T top    D top detail   U top shade   J bottom   V bottom shade  b shoes
//   e eye white i iris  p pupil  w glint   m lip line  M lower lip  t tear
//   f glasses   G cap   y tassel   k hard line (between legs, lashes)

import { softOutline } from './soft_outline.js';
import { mix, shade } from './color.js';

export const SPRITE_WIDTH = 64;
export const SPRITE_HEIGHT = 104;

export const SHARED_COLORS = {
  k: '#2a2230',
  e: '#f9f9fc',
  p: '#1e1824',
  w: '#ffffff',
  t: '#7ec8ff',
  f: '#2a2230',
  G: '#1f1d2c',
  y: '#f2c94c',
};

// Face landmarks. The head is an egg centred on x=32, rows 3..29.
const HEAD = { cx: 32, cy: 16, rx: 12, ry: 13 };
const BROW_Y = 12;
const EYE_Y = 15;                 // eyes are 7 wide x 5 tall
const LEFT_EYE_X = 22;
const RIGHT_EYE_X = 35;
const NOSE = { x: 33, y: 21 };
const MOUTH_Y = 25;
const BLUSH_Y = 21;

export function humanoid(spec) {
  const grid = Array.from({ length: SPRITE_HEIGHT }, () => Array(SPRITE_WIDTH).fill('.'));
  const px = (x, y, c) => {
    if (x >= 0 && x < SPRITE_WIDTH && y >= 0 && y < SPRITE_HEIGHT) grid[y][x] = c;
  };
  const fill = (x0, y0, x1, y1, c) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) px(x, y, c);
  };
  const ellipse = (cx, cy, rx, ry, c, chinTaper = 0) => {
    for (let y = cy - ry; y <= cy + ry; y++) {
      const t = (y - cy) / ry;
      let halfWidth = rx * Math.sqrt(Math.max(0, 1 - t * t));
      if (t > 0 && chinTaper) halfWidth = Math.max(halfWidth * (1 - chinTaper * t * t), t > 0.85 ? 4 : 0);
      const w = Math.round(halfWidth);
      fill(cx - w, y, cx + w - 1, y, c);
    }
  };
  const paint = { px, fill, ellipse };
  const slim = spec.build !== 'broad';
  const disheveled = Boolean(spec.disheveled);

  paintHairBack(paint, spec.hairStyle);
  paintLegs(paint, slim);
  paintTorso(paint, spec.topStyle ?? 'tee', slim, disheveled);
  paintNeck(paint);
  paintHead(paint);
  paintHairFront(paint, spec.hairStyle);
  if (disheveled) paintFlyaways(paint, spec.hairStyle);
  paintBrows(paint, spec.brows ?? 'none');
  paintEyes(paint, spec.eyes ?? 'open', disheveled);
  paintNose(paint);
  if (spec.brows !== 'angry' && spec.mouth !== 'frown') paintBlush(paint);
  paintMouth(paint, spec.mouth ?? 'soft');
  if (spec.tears) paintTears(paint);
  if (spec.glasses) paintGlasses(paint);
  if (spec.cap) paintCap(paint);

  const colors = {
    ...SHARED_COLORS,
    s: spec.skin,
    S: spec.skinShade,
    r: mix(spec.skin, '#ff5c7a', 0.38),
    A: spec.hair,
    h: spec.hairHighlight ?? mix(spec.hair, '#ffffff', 0.25),
    T: spec.top,
    D: spec.topDetail ?? spec.top,
    U: shade(spec.top),
    J: spec.bottom,
    V: shade(spec.bottom),
    b: spec.shoes,
    i: spec.iris ?? '#4a3020',
    m: spec.lips ?? '#8a3a44',
    M: mix(spec.lips ?? '#8a3a44', spec.skin, 0.45),
  };
  softOutline(grid, colors);
  if (spec.facing === 'left') grid.forEach((row) => row.reverse());
  return { rows: grid.map((row) => row.join('')), colors };
}

// --- body ------------------------------------------------------------------

function paintLegs({ px, fill }, slim) {
  const left = slim ? 18 : 16, right = slim ? 45 : 47;
  fill(left, 60, right, 67, 'J');
  fill(left, 68, 30, 97, 'J'); fill(33, 68, right, 97, 'J');
  fill(28, 68, 30, 97, 'V'); fill(right - 2, 68, right, 97, 'V');
  fill(right - 3, 60, right, 67, 'V');
  for (let y = 68; y <= 97; y++) { px(31, y, 'k'); px(32, y, 'k'); }
  fill(21, 82, 26, 82, 'V'); fill(36, 82, 41, 82, 'V');          // knees
  // Shoes.
  fill(left, 97, 30, 97, 'b'); fill(33, 97, right, 97, 'b');
  fill(left - 2, 98, 30, 102, 'b'); fill(33, 98, right + 2, 102, 'b');
  px(left - 2, 98, '.'); px(right + 2, 98, '.');
  fill(left - 1, 103, 30, 103, 'b'); fill(33, 103, right + 1, 103, 'b');
  fill(left, 100, 29, 100, 'k'); fill(34, 100, right, 100, 'k');  // lace line
  for (let y = 98; y <= 103; y++) { px(31, y, 'k'); px(32, y, 'k'); }
}

function paintTorso({ px, fill }, style, slim, disheveled) {
  const left = slim ? 18 : 16, right = slim ? 45 : 47;
  fill(left, 36, right, 62, 'T');
  fill(left, 36, left + 1, 36, '.'); fill(right - 1, 36, right, 36, '.');
  px(left, 37, '.'); px(right, 37, '.');
  fill(right - 3, 38, right, 62, 'U');
  const armL = left - 6, armR = right + 6;
  fill(armL, 38, left - 2, 66, 'T'); fill(right + 2, 38, armR, 66, 'U');
  px(armL, 38, '.'); px(armR, 38, '.');
  for (let y = 38; y <= 66; y++) { px(left - 1, y, 'U'); px(right + 1, y, 'U'); }
  fill(armL, 67, left - 2, 72, 's'); fill(right + 2, 67, armR, 72, 'S');
  px(armL, 72, '.'); px(left - 2, 72, '.'); px(right + 2, 72, '.'); px(armR, 72, '.');

  switch (style) {
    case 'hoodie':
      fill(24, 34, 39, 38, 'D'); fill(26, 39, 37, 40, 'D');
      for (let y = 40; y <= 48; y++) { px(29, y, 'D'); px(34, y + (disheveled ? 3 : 0), 'D'); }
      px(29, 49, 'k'); px(34, disheveled ? 52 : 49, 'k');
      fill(22, 52, 41, 60, 'D'); fill(22, 52, 41, 52, 'U');
      fill(22, 53, 23, 60, 'U'); fill(40, 53, 41, 60, 'U');
      fill(left, 61, right, 62, 'D');
      fill(armL, 64, left - 2, 66, 'D'); fill(right + 2, 64, armR, 66, 'D');
      if (disheveled) { fill(left, 63, 30, 64, 'D'); fill(right - 2, 63, right, 63, 'D'); } // hem riding up unevenly
      break;
    case 'sweater':
      fill(26, 36, 37, 37, 'D');
      fill(left, 59, right, 62, 'D');
      for (let x = left + 1; x <= right; x += 2) fill(x, 59, x, 62, 'U');
      for (let y = 41; y <= 56; y += 2) { px(26, y, 'U'); px(32, y, 'U'); px(38, y, 'U'); }
      break;
    case 'blazer':
      fill(29, 36, 34, 49, 'D');
      for (let i = 0; i <= 12; i++) { px(26 + Math.floor(i / 3), 36 + i, 'U'); px(37 - Math.floor(i / 3), 36 + i, 'U'); }
      px(31, 52, 'k'); px(31, 57, 'k');
      fill(20, 56, 24, 56, 'U'); fill(39, 56, 43, 56, 'U');
      break;
    case 'tee':
    default:
      fill(29, 36, 34, 37, 'S');
      fill(armL, 48, left - 2, 66, 's'); fill(right + 2, 48, armR, 66, 'S');
      fill(26, 44, 37, 50, 'D');
      break;
  }
  if (disheveled) { px(left + 3, 46, 'U'); px(left + 4, 47, 'U'); px(left + 2, 55, 'U'); } // creases
}

function paintNeck({ fill }) {
  fill(28, 29, 35, 35, 's');
  fill(28, 29, 35, 31, 'S');
}

// --- head ------------------------------------------------------------------

function paintHead({ px, fill, ellipse }) {
  ellipse(HEAD.cx, HEAD.cy, HEAD.rx, HEAD.ry, 's', 0.32);
  for (let y = 9; y <= 29; y++) {
    const t = (y - HEAD.cy) / HEAD.ry;
    let hw = HEAD.rx * Math.sqrt(Math.max(0, 1 - t * t));
    if (t > 0) hw = Math.max(hw * (1 - 0.32 * t * t), t > 0.85 ? 4 : 0);
    const edge = HEAD.cx + Math.round(hw) - 1;
    px(edge, y, 'S'); px(edge - 1, y, 'S');
  }
  fill(29, 28, 34, 29, 'S');
  fill(18, 16, 19, 21, 's'); fill(44, 16, 45, 21, 'S');
  px(19, 18, 'S');
}

function paintBrows({ px }, brows) {
  const arc = (x0, flip) => {
    const ys = brows === 'angry' ? [1, 0, 0, 0, 1, 2]
      : brows === 'sad' ? [2, 1, 0, 0, -1, -1]
        : [1, 0, 0, 0, 0, 1];
    const lift = brows === 'raised' ? -2 : 0;
    ys.forEach((dy, index) => px(flip ? x0 + 5 - index : x0 + index, BROW_Y + dy + lift, 'A'));
  };
  arc(LEFT_EYE_X + 1, false);
  arc(RIGHT_EYE_X + 1, true);
}

function paintEyes({ px, fill }, eyes, disheveled) {
  for (const x0 of [LEFT_EYE_X, RIGHT_EYE_X]) {
    const x1 = x0 + 6;
    switch (eyes) {
      case 'open':
        fill(x0 + 1, EYE_Y, x1 - 1, EYE_Y, 'e');
        fill(x0, EYE_Y + 1, x1, EYE_Y + 3, 'e');
        fill(x0 + 1, EYE_Y + 4, x1 - 1, EYE_Y + 4, 'e');
        fill(x0 + 3, EYE_Y, x1 - 1, EYE_Y + 3, 'i');
        fill(x0 + 4, EYE_Y + 1, x1 - 1, EYE_Y + 2, 'p');
        px(x0 + 3, EYE_Y + 1, 'w'); px(x0 + 4, EYE_Y + 1, 'w'); px(x1 - 1, EYE_Y + 3, 'w');
        fill(x0 + 1, EYE_Y - 1, x1 - 1, EYE_Y - 1, 'k');
        px(x0, EYE_Y, 'k'); px(x1, EYE_Y, 'k'); px(x0 - 1, EYE_Y - 1, 'k');
        fill(x0 + 1, EYE_Y + 5, x1 - 1, EYE_Y + 5, 'S');
        break;
      case 'narrow': // angry: lids half down
        fill(x0, EYE_Y + 1, x1, EYE_Y + 3, 'e');
        fill(x0 + 3, EYE_Y + 1, x1 - 1, EYE_Y + 3, 'i');
        fill(x0 + 4, EYE_Y + 1, x1 - 1, EYE_Y + 2, 'p');
        px(x0 + 3, EYE_Y + 1, 'w');
        fill(x0, EYE_Y, x1, EYE_Y, 'k'); px(x0 - 1, EYE_Y, 'k');
        break;
      case 'tired':
        fill(x0, EYE_Y + 2, x1, EYE_Y + 3, 'e');
        fill(x0 + 1, EYE_Y + 4, x1 - 1, EYE_Y + 4, 'e');
        fill(x0 + 3, EYE_Y + 2, x1 - 1, EYE_Y + 4, 'i');
        fill(x0 + 4, EYE_Y + 2, x1 - 1, EYE_Y + 3, 'p');
        fill(x0, EYE_Y + 1, x1, EYE_Y + 1, 'k');
        fill(x0 + 1, EYE_Y + 5, x1 - 1, EYE_Y + 6, 'S');
        break;
      case 'closed_happy':
        px(x0, EYE_Y + 2, 'k'); px(x0 + 1, EYE_Y + 1, 'k'); fill(x0 + 2, EYE_Y, x1 - 2, EYE_Y, 'k');
        px(x1 - 1, EYE_Y + 1, 'k'); px(x1, EYE_Y + 2, 'k');
        break;
      case 'closed_sad':
        px(x0, EYE_Y + 1, 'k'); px(x0 + 1, EYE_Y + 2, 'k'); fill(x0 + 2, EYE_Y + 3, x1 - 2, EYE_Y + 3, 'k');
        px(x1 - 1, EYE_Y + 2, 'k'); px(x1, EYE_Y + 1, 'k');
        break;
      default:
        throw new Error(`unknown eyes '${eyes}'`);
    }
    if (disheveled && eyes !== 'tired') fill(x0 + 1, EYE_Y + 5, x1 - 1, EYE_Y + 6, 'S'); // bags
  }
}

function paintNose({ px }) {
  px(NOSE.x, NOSE.y, 'S'); px(NOSE.x, NOSE.y + 1, 'S'); px(NOSE.x - 1, NOSE.y + 1, 'S');
}

function paintBlush({ fill }) {
  fill(22, BLUSH_Y, 25, BLUSH_Y, 'r'); fill(23, BLUSH_Y + 1, 24, BLUSH_Y + 1, 'r');
  fill(38, BLUSH_Y, 41, BLUSH_Y, 'r'); fill(39, BLUSH_Y + 1, 40, BLUSH_Y + 1, 'r');
}

function paintMouth({ px, fill }, mouth) {
  switch (mouth) {
    case 'soft':
      px(29, MOUTH_Y - 1, 'm'); px(34, MOUTH_Y - 1, 'm');
      fill(30, MOUTH_Y, 33, MOUTH_Y, 'm'); fill(30, MOUTH_Y + 1, 33, MOUTH_Y + 1, 'M');
      break;
    case 'smile':
      px(28, MOUTH_Y - 2, 'm'); px(29, MOUTH_Y - 1, 'm'); px(34, MOUTH_Y - 1, 'm'); px(35, MOUTH_Y - 2, 'm');
      fill(30, MOUTH_Y, 33, MOUTH_Y, 'm');
      fill(29, MOUTH_Y + 1, 34, MOUTH_Y + 1, 'M'); fill(30, MOUTH_Y + 2, 33, MOUTH_Y + 2, 'M');
      break;
    case 'flat':
      fill(29, MOUTH_Y, 34, MOUTH_Y, 'm'); fill(30, MOUTH_Y + 1, 33, MOUTH_Y + 1, 'M');
      break;
    case 'frown':
      px(29, MOUTH_Y + 1, 'm'); px(34, MOUTH_Y + 1, 'm');
      fill(30, MOUTH_Y, 33, MOUTH_Y, 'm');
      break;
    case 'gasp': // wide and shallow, teeth showing
      fill(28, MOUTH_Y - 1, 35, MOUTH_Y - 1, 'm');
      fill(29, MOUTH_Y, 34, MOUTH_Y, 'e');
      fill(29, MOUTH_Y + 1, 34, MOUTH_Y + 1, 'k');
      px(28, MOUTH_Y, 'm'); px(35, MOUTH_Y, 'm');
      fill(30, MOUTH_Y + 2, 33, MOUTH_Y + 2, 'M');
      break;
    default:
      throw new Error(`unknown mouth '${mouth}'`);
  }
}

function paintTears({ px, fill }) {
  fill(23, EYE_Y + 5, 23, EYE_Y + 11, 't'); fill(22, EYE_Y + 11, 23, EYE_Y + 12, 't');
  fill(40, EYE_Y + 5, 40, EYE_Y + 11, 't'); fill(40, EYE_Y + 11, 41, EYE_Y + 12, 't');
  px(21, EYE_Y + 4, 't'); px(42, EYE_Y + 4, 't');
}

function paintGlasses({ px }) {
  for (const cx of [LEFT_EYE_X + 3, RIGHT_EYE_X + 3]) {
    for (let step = 0; step < 48; step++) {
      const angle = (step / 48) * Math.PI * 2;
      px(Math.round(cx + 5 * Math.cos(angle)), Math.round(EYE_Y + 2 + 4.5 * Math.sin(angle)), 'f');
    }
  }
  px(31, EYE_Y + 2, 'f'); px(32, EYE_Y + 2, 'f');
  px(19, EYE_Y + 2, 'f'); px(44, EYE_Y + 2, 'f');
}

function paintCap({ px, fill }) {
  fill(0, 0, SPRITE_WIDTH - 1, 2, '.');
  fill(12, 3, 51, 5, 'G');
  fill(20, 6, 43, 10, 'G');
  px(32, 2, 'y');
  px(51, 6, 'y'); for (let y = 7; y <= 11; y++) px(52, y, 'y'); px(51, 12, 'y');
}

// --- hair ------------------------------------------------------------------

function paintHairBack({ px, fill, ellipse }, style) {
  switch (style) {
    case 'down':
      ellipse(32, 13, 17, 13, 'A');
      fill(15, 13, 21, 66, 'A'); fill(42, 13, 48, 66, 'A');
      for (let y = 14; y <= 66; y++) if ((y >> 2) % 2 === 0) { px(14, y, 'A'); px(49, y, 'A'); }
      for (let x = 16; x <= 20; x += 2) px(x, 67, 'A');
      for (let x = 43; x <= 47; x += 2) px(x, 67, 'A');
      fill(17, 22, 17, 32, 'h'); fill(46, 30, 46, 42, 'h');
      break;
    case 'long':
      ellipse(32, 12, 16, 12, 'A');
      fill(15, 12, 20, 72, 'A'); fill(43, 12, 48, 72, 'A');
      fill(17, 24, 17, 40, 'h'); fill(46, 30, 46, 46, 'h');
      break;
    case 'bob':
      ellipse(32, 12, 16, 12, 'A');
      fill(15, 12, 21, 34, 'A'); fill(42, 12, 48, 34, 'A');
      fill(16, 35, 21, 36, 'A'); fill(42, 35, 47, 36, 'A');
      break;
    case 'curly':
      ellipse(32, 11, 16, 11, 'A');
      for (let x = 17; x <= 47; x += 3) {
        const t = (x - 32) / 16;
        const top = Math.round(11 - 11 * Math.sqrt(Math.max(0, 1 - t * t)));
        px(x, top - 1, 'A'); px(x + 1, top - 1, 'A');
      }
      fill(16, 8, 16, 16, 'A'); fill(47, 8, 47, 16, 'A');
      break;
    case 'short':
      ellipse(32, 11, 15, 11, 'A');
      break;
    default:
      throw new Error(`unknown hair style '${style}'`);
  }
}

function paintHairFront({ px, fill }, style) {
  const fringe = (hairlineAt) => {
    for (let x = 18; x <= 46; x++) fill(x, 0, hairlineAt(x), 'A');
  };
  switch (style) {
    case 'down':
      fringe((x) => 7 + Math.floor((x - 18) / 7));
      fill(19, 9, 21, 27, 'A'); fill(43, 10, 45, 27, 'A');
      fill(26, 3, 38, 3, 'h'); fill(23, 4, 25, 4, 'h'); fill(39, 4, 41, 4, 'h');
      px(22, 5, 'h'); px(42, 5, 'h');
      break;
    case 'long':
      fringe((x) => 6 + Math.round(3 * Math.abs(x - 32) / 14));
      fill(19, 9, 21, 30, 'A'); fill(43, 9, 45, 30, 'A');
      fill(32, 1, 32, 6, 'k');
      fill(24, 3, 29, 3, 'h'); fill(35, 3, 40, 3, 'h');
      break;
    case 'bob':
      fringe(() => 10);
      fill(19, 10, 21, 34, 'A'); fill(43, 10, 45, 34, 'A');
      fill(16, 14, 18, 26, 'h');
      fill(26, 3, 38, 3, 'h');
      break;
    case 'curly':
      fringe((x) => 9 + ((x >> 1) % 2));
      fill(18, 9, 20, 20, 'A'); fill(44, 9, 46, 20, 'A');
      px(24, 3, 'h'); px(25, 3, 'h'); px(30, 2, 'h'); px(36, 3, 'h'); px(37, 3, 'h');
      break;
    case 'short':
      fringe((x) => 6 + Math.floor((x - 18) / 6));
      fill(18, 9, 20, 18, 'A'); fill(44, 9, 46, 17, 'A');
      fill(25, 3, 33, 3, 'h');
      break;
    default:
      throw new Error(`unknown hair style '${style}'`);
  }
}

// Stray strands for the disheveled look: a few flyaways off the crown and
// one lock fallen across the forehead.
function paintFlyaways({ px }, style) {
  px(20, 2, 'A'); px(19, 1, 'A'); px(26, 0, 'A'); px(27, -1, 'A');
  px(44, 1, 'A'); px(45, 0, 'A'); px(38, 0, 'A');
  px(13, 20, 'A'); px(12, 21, 'A'); px(50, 26, 'A'); px(51, 27, 'A');
  px(27, 10, 'A'); px(28, 11, 'A'); px(28, 12, 'A'); px(29, 13, 'A');
  if (style === 'down' || style === 'long') { px(13, 40, 'A'); px(50, 44, 'A'); }
}

// Pose names map to face parameters so story files never touch pixels.
// 'idle' is the resting face; for Amara the renderer swaps it for 'glad' or
// 'low' depending on the Happiness bar (see render/characters.js).
export const POSES = {
  idle:  { eyes: 'open',   mouth: 'soft' },
  glad:  { eyes: 'open',   mouth: 'smile' },
  low:   { eyes: 'open',   mouth: 'flat' },
  happy: { eyes: 'closed_happy', mouth: 'smile' },
  sad:   { eyes: 'open',   mouth: 'frown', brows: 'sad' },
  cry:   { eyes: 'closed_sad', mouth: 'frown', brows: 'sad', tears: true },
  tired: { eyes: 'tired',  mouth: 'flat' },
  angry: { eyes: 'narrow', mouth: 'frown', brows: 'angry' },
  kind:  { eyes: 'closed_happy', mouth: 'soft' },
  shock: { eyes: 'open',   mouth: 'gasp', brows: 'raised' },
  grad:  { eyes: 'open',   mouth: 'smile', cap: true, gown: true },
  violin: { eyes: 'closed_happy', mouth: 'smile' },
};
