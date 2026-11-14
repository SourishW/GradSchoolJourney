// 64x64 head-and-shoulders portrait shown beside the dialogue text, in the
// manner of visual novels: the face is three times the size it is on the
// stage sprite, so expressions actually read. Same palette and pose names as
// the body sprite; built facing right, mirrored for left.
//
// Letters are the same as humanoid.js.

import { softOutline } from './soft_outline.js';
import { mix, shade } from './color.js';
import { SHARED_COLORS } from './humanoid.js';

export const PORTRAIT_SIZE = 64;

const HEAD = { cx: 32, cy: 30, rx: 16, ry: 18 };   // rows 12..48
const BROW_Y = 24;
const EYE_Y = 29;                                   // eyes are 9 wide x 7 tall
const LEFT_EYE_X = 18;
const RIGHT_EYE_X = 36;
const NOSE = { x: 34, y: 39 };
const MOUTH_Y = 44;
const BLUSH_Y = 38;

export function portrait(spec) {
  const grid = Array.from({ length: PORTRAIT_SIZE }, () => Array(PORTRAIT_SIZE).fill('.'));
  const px = (x, y, c) => {
    if (x >= 0 && x < PORTRAIT_SIZE && y >= 0 && y < PORTRAIT_SIZE) grid[y][x] = c;
  };
  const fill = (x0, y0, x1, y1, c) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) px(x, y, c);
  };
  const ellipse = (cx, cy, rx, ry, c, chinTaper = 0) => {
    for (let y = cy - ry; y <= cy + ry; y++) {
      const t = (y - cy) / ry;
      let hw = rx * Math.sqrt(Math.max(0, 1 - t * t));
      if (t > 0 && chinTaper) hw = Math.max(hw * (1 - chinTaper * t * t), t > 0.85 ? 5 : 0);
      const w = Math.round(hw);
      fill(cx - w, y, cx + w - 1, y, c);
    }
  };
  const paint = { px, fill, ellipse };
  const disheveled = Boolean(spec.disheveled);

  paintHairBack(paint, spec.hairStyle);
  paintShoulders(paint, spec.topStyle ?? 'tee');
  paintNeck(paint);
  paintHead(paint);
  paintHairFront(paint, spec.hairStyle);
  if (disheveled) paintFlyaways(paint);
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
    i: spec.iris ?? '#4a3020',
    I: mix(spec.iris ?? '#4a3020', '#1a1028', 0.4),
    m: spec.lips ?? '#8a3a44',
    M: mix(spec.lips ?? '#8a3a44', spec.skin, 0.45),
  };
  softOutline(grid, colors);
  if (spec.facing === 'left') grid.forEach((row) => row.reverse());
  return { rows: grid.map((row) => row.join('')), colors };
}

function paintShoulders({ px, fill, ellipse }, style) {
  fill(4, 52, 59, 63, 'T');
  fill(4, 52, 7, 53, '.'); fill(56, 52, 59, 53, '.'); fill(4, 54, 5, 54, '.'); fill(58, 54, 59, 54, '.');
  fill(50, 54, 59, 63, 'U');
  switch (style) {
    case 'hoodie':
      ellipse(32, 54, 15, 6, 'D'); fill(17, 54, 46, 58, 'D');
      for (let y = 57; y <= 63; y++) { px(27, y, 'D'); px(36, y, 'D'); }
      break;
    case 'sweater':
      fill(22, 52, 41, 54, 'D');
      for (let y = 57; y <= 63; y += 2) { px(14, y, 'U'); px(32, y, 'U'); px(48, y, 'U'); }
      break;
    case 'blazer':
      fill(26, 52, 37, 63, 'D');
      for (let i = 0; i <= 11; i++) { px(22 + Math.floor(i / 3), 52 + i, 'U'); px(41 - Math.floor(i / 3), 52 + i, 'U'); }
      break;
    default:
      fill(25, 52, 38, 53, 'S');
      break;
  }
}

function paintNeck({ fill }) {
  fill(26, 44, 37, 54, 's');
  fill(26, 44, 37, 48, 'S');
}

function paintHead({ px, fill, ellipse }) {
  ellipse(HEAD.cx, HEAD.cy, HEAD.rx, HEAD.ry, 's', 0.30);
  for (let y = 20; y <= 48; y++) {
    const t = (y - HEAD.cy) / HEAD.ry;
    let hw = HEAD.rx * Math.sqrt(Math.max(0, 1 - t * t));
    if (t > 0) hw = Math.max(hw * (1 - 0.30 * t * t), t > 0.85 ? 5 : 0);
    const edge = HEAD.cx + Math.round(hw) - 1;
    fill(edge - 2, y, edge, y, 'S');
  }
  fill(28, 46, 36, 48, 'S');
  fill(13, 30, 15, 37, 's'); fill(48, 30, 50, 37, 'S');   // ears
  px(14, 33, 'S'); px(14, 34, 'S');
}

function paintBrows({ px }, brows) {
  const arc = (x0, flip) => {
    const ys = brows === 'angry' ? [2, 1, 0, 0, 0, 1, 2, 3]
      : brows === 'sad' ? [3, 2, 1, 0, 0, -1, -1, -2]
        : [1, 0, 0, -1, -1, 0, 0, 1];
    const lift = brows === 'raised' ? -3 : 0;
    ys.forEach((dy, index) => {
      const x = flip ? x0 + 7 - index : x0 + index;
      px(x, BROW_Y + dy + lift, 'A'); if (index > 1 && index < 6) px(x, BROW_Y + dy + lift + 1, 'A');
    });
  };
  arc(LEFT_EYE_X + 1, false);
  arc(RIGHT_EYE_X + 1, true);
}

function paintEyes({ px, fill }, eyes, disheveled) {
  for (const x0 of [LEFT_EYE_X, RIGHT_EYE_X]) {
    const x1 = x0 + 8;
    switch (eyes) {
      case 'open':
      case 'narrow': {
        const top = eyes === 'narrow' ? EYE_Y + 2 : EYE_Y;
        fill(x0 + 2, top, x1 - 2, top, 'e');
        fill(x0 + 1, top + 1, x1 - 1, top + 1, 'e');
        fill(x0, top + 2, x1, EYE_Y + 5, 'e');
        fill(x0 + 1, EYE_Y + 6, x1 - 1, EYE_Y + 6, 'e');
        fill(x0 + 4, top, x1 - 1, EYE_Y + 5, 'I');            // iris ring
        fill(x0 + 5, top + 1, x1 - 2, EYE_Y + 4, 'i');
        fill(x0 + 6, EYE_Y + 2, x1 - 1, EYE_Y + 4, 'p');       // pupil
        fill(x0 + 4, top + 1, x0 + 5, top + 2, 'w');           // big glint
        px(x1 - 1, EYE_Y + 5, 'w');                            // small glint
        fill(x0 + 1, top - 1, x1 - 1, top - 1, 'k');           // lashes
        px(x0, top, 'k'); px(x1, top, 'k'); px(x0 - 1, top - 1, 'k'); px(x0 - 2, top - 2, 'k');
        px(x1 - 1, top - 2, 'k'); px(x1 - 2, top - 2, 'k');
        if (eyes === 'narrow') fill(x0, top - 1, x1, top - 1, 'k');
        fill(x0 + 2, EYE_Y + 7, x1 - 2, EYE_Y + 7, 'S');       // under-eye
        break;
      }
      case 'tired':
        fill(x0, EYE_Y + 3, x1, EYE_Y + 5, 'e');
        fill(x0 + 1, EYE_Y + 6, x1 - 1, EYE_Y + 6, 'e');
        fill(x0 + 4, EYE_Y + 3, x1 - 1, EYE_Y + 6, 'I'); fill(x0 + 5, EYE_Y + 3, x1 - 2, EYE_Y + 5, 'i');
        fill(x0 + 6, EYE_Y + 3, x1 - 1, EYE_Y + 5, 'p');
        fill(x0, EYE_Y + 2, x1, EYE_Y + 2, 'k'); fill(x0 + 1, EYE_Y + 1, x1 - 1, EYE_Y + 1, 'S');
        fill(x0 + 1, EYE_Y + 7, x1 - 1, EYE_Y + 8, 'S');
        break;
      case 'closed_happy':
        px(x0, EYE_Y + 4, 'k'); px(x0 + 1, EYE_Y + 3, 'k'); px(x0 + 2, EYE_Y + 2, 'k');
        fill(x0 + 3, EYE_Y + 1, x1 - 3, EYE_Y + 1, 'k');
        px(x1 - 2, EYE_Y + 2, 'k'); px(x1 - 1, EYE_Y + 3, 'k'); px(x1, EYE_Y + 4, 'k');
        break;
      case 'closed_sad':
        px(x0, EYE_Y + 2, 'k'); px(x0 + 1, EYE_Y + 3, 'k'); px(x0 + 2, EYE_Y + 4, 'k');
        fill(x0 + 3, EYE_Y + 5, x1 - 3, EYE_Y + 5, 'k');
        px(x1 - 2, EYE_Y + 4, 'k'); px(x1 - 1, EYE_Y + 3, 'k'); px(x1, EYE_Y + 2, 'k');
        break;
      default:
        throw new Error(`unknown eyes '${eyes}'`);
    }
    if (disheveled && eyes !== 'tired') fill(x0 + 1, EYE_Y + 7, x1 - 1, EYE_Y + 8, 'S');
  }
}

function paintNose({ px }) {
  px(NOSE.x, NOSE.y, 'S'); px(NOSE.x, NOSE.y + 1, 'S'); px(NOSE.x, NOSE.y + 2, 'S');
  px(NOSE.x - 1, NOSE.y + 2, 'S'); px(NOSE.x - 2, NOSE.y + 2, 'S');
}

function paintBlush({ fill }) {
  fill(17, BLUSH_Y, 22, BLUSH_Y, 'r'); fill(18, BLUSH_Y + 1, 21, BLUSH_Y + 1, 'r');
  fill(41, BLUSH_Y, 46, BLUSH_Y, 'r'); fill(42, BLUSH_Y + 1, 45, BLUSH_Y + 1, 'r');
}

function paintMouth({ px, fill }, mouth) {
  switch (mouth) {
    case 'soft':
      px(27, MOUTH_Y - 1, 'm'); px(37, MOUTH_Y - 1, 'm');
      fill(28, MOUTH_Y, 36, MOUTH_Y, 'm'); fill(29, MOUTH_Y + 1, 35, MOUTH_Y + 1, 'M');
      break;
    case 'smile':
      px(26, MOUTH_Y - 2, 'm'); px(27, MOUTH_Y - 1, 'm'); px(37, MOUTH_Y - 1, 'm'); px(38, MOUTH_Y - 2, 'm');
      fill(28, MOUTH_Y, 36, MOUTH_Y, 'm');
      fill(28, MOUTH_Y + 1, 36, MOUTH_Y + 1, 'M'); fill(29, MOUTH_Y + 2, 35, MOUTH_Y + 2, 'M');
      break;
    case 'flat':
      fill(27, MOUTH_Y, 37, MOUTH_Y, 'm'); fill(29, MOUTH_Y + 1, 35, MOUTH_Y + 1, 'M');
      break;
    case 'frown':
      px(27, MOUTH_Y + 1, 'm'); px(37, MOUTH_Y + 1, 'm');
      fill(28, MOUTH_Y, 36, MOUTH_Y, 'm'); fill(30, MOUTH_Y + 1, 34, MOUTH_Y + 1, 'M');
      break;
    case 'gasp':
      fill(26, MOUTH_Y - 1, 38, MOUTH_Y - 1, 'm');
      fill(27, MOUTH_Y, 37, MOUTH_Y, 'e');
      fill(27, MOUTH_Y + 1, 37, MOUTH_Y + 2, 'k');
      px(26, MOUTH_Y, 'm'); px(38, MOUTH_Y, 'm');
      fill(29, MOUTH_Y + 3, 35, MOUTH_Y + 3, 'M');
      break;
    default:
      throw new Error(`unknown mouth '${mouth}'`);
  }
}

function paintTears({ px, fill }) {
  fill(20, EYE_Y + 8, 20, EYE_Y + 16, 't'); fill(19, EYE_Y + 15, 20, EYE_Y + 17, 't');
  fill(43, EYE_Y + 8, 43, EYE_Y + 16, 't'); fill(43, EYE_Y + 15, 44, EYE_Y + 17, 't');
  px(17, EYE_Y + 6, 't'); px(46, EYE_Y + 6, 't');
}

function paintGlasses({ px }) {
  for (const cx of [LEFT_EYE_X + 4, RIGHT_EYE_X + 4]) {
    for (let step = 0; step < 80; step++) {
      const angle = (step / 80) * Math.PI * 2;
      px(Math.round(cx + 7 * Math.cos(angle)), Math.round(EYE_Y + 3 + 6 * Math.sin(angle)), 'f');
    }
  }
  px(30, EYE_Y + 3, 'f'); px(31, EYE_Y + 3, 'f'); px(32, EYE_Y + 3, 'f'); px(33, EYE_Y + 3, 'f');
  fill_(px, 13, EYE_Y + 3, 14, EYE_Y + 3, 'f'); fill_(px, 49, EYE_Y + 3, 50, EYE_Y + 3, 'f');
}

function fill_(px, x0, y0, x1, y1, c) {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) px(x, y, c);
}

function paintCap({ px, fill }) {
  fill(0, 0, PORTRAIT_SIZE - 1, 3, '.');
  fill(4, 4, 59, 7, 'G');
  fill(16, 8, 47, 14, 'G');
  px(32, 3, 'y');
  fill(59, 8, 59, 9, 'y'); for (let y = 10; y <= 18; y++) px(60, y, 'y'); px(59, 19, 'y');
}

// --- hair ------------------------------------------------------------------

function paintHairBack({ px, fill, ellipse }, style) {
  switch (style) {
    case 'down':
      ellipse(32, 22, 23, 19, 'A');
      fill(8, 22, 16, 63, 'A'); fill(47, 22, 55, 63, 'A');
      for (let y = 22; y <= 63; y++) if ((y >> 2) % 2 === 0) { px(7, y, 'A'); px(56, y, 'A'); }
      fill(11, 34, 11, 50, 'h'); fill(52, 40, 52, 56, 'h'); fill(9, 54, 9, 60, 'h');
      break;
    case 'long':
      ellipse(32, 21, 22, 18, 'A');
      fill(7, 21, 15, 63, 'A'); fill(48, 21, 56, 63, 'A');
      fill(10, 30, 10, 52, 'h'); fill(53, 36, 53, 58, 'h');
      break;
    case 'bob':
      ellipse(32, 21, 22, 18, 'A');
      fill(8, 21, 16, 50, 'A'); fill(47, 21, 55, 50, 'A');
      fill(10, 51, 16, 52, 'A'); fill(47, 51, 53, 52, 'A');
      break;
    case 'curly':
      ellipse(32, 20, 22, 18, 'A');
      for (let x = 11; x <= 53; x += 4) {
        const t = (x - 32) / 22;
        const top = Math.round(20 - 18 * Math.sqrt(Math.max(0, 1 - t * t)));
        fill(x, top - 2, x + 1, top - 1, 'A');
      }
      fill(9, 16, 9, 30, 'A'); fill(54, 16, 54, 30, 'A');
      break;
    case 'short':
      ellipse(32, 19, 20, 16, 'A');
      break;
    default:
      throw new Error(`unknown hair style '${style}'`);
  }
}

function paintHairFront({ px, fill }, style) {
  const fringe = (hairlineAt) => {
    for (let x = 14; x <= 50; x++) fill(x, 0, hairlineAt(x), 'A');
  };
  switch (style) {
    case 'down':
      fringe((x) => 15 + Math.floor((x - 14) / 7));
      fill(13, 18, 17, 50, 'A'); fill(47, 20, 51, 50, 'A');
      fill(22, 6, 42, 7, 'h'); fill(18, 8, 21, 9, 'h'); fill(43, 8, 46, 9, 'h'); fill(16, 10, 17, 12, 'h');
      fill(24, 18, 24, 19, 'h'); fill(30, 17, 31, 17, 'h');
      break;
    case 'long':
      fringe((x) => 13 + Math.round(5 * Math.abs(x - 32) / 18));
      fill(13, 18, 17, 56, 'A'); fill(47, 18, 51, 56, 'A');
      fill(32, 4, 32, 12, 'k');
      fill(20, 6, 28, 7, 'h'); fill(36, 6, 44, 7, 'h');
      break;
    case 'bob':
      fringe(() => 19);
      fill(13, 19, 17, 50, 'A'); fill(47, 19, 51, 50, 'A');
      fill(9, 26, 12, 44, 'h');
      fill(22, 6, 42, 7, 'h');
      break;
    case 'curly':
      fringe((x) => 17 + ((x >> 1) % 2) * 2);
      fill(12, 18, 16, 36, 'A'); fill(48, 18, 52, 36, 'A');
      px(20, 7, 'h'); px(21, 7, 'h'); px(28, 5, 'h'); px(29, 5, 'h'); px(38, 6, 'h'); px(39, 6, 'h'); px(45, 9, 'h');
      break;
    case 'short':
      fringe((x) => 10 + Math.floor((x - 14) / 5));
      fill(13, 16, 16, 34, 'A'); fill(48, 16, 51, 32, 'A');
      fill(22, 6, 36, 7, 'h');
      break;
    default:
      throw new Error(`unknown hair style '${style}'`);
  }
}

function paintFlyaways({ px }) {
  px(16, 4, 'A'); px(15, 3, 'A'); px(24, 1, 'A'); px(25, 0, 'A'); px(40, 1, 'A'); px(47, 3, 'A'); px(48, 2, 'A');
  px(6, 30, 'A'); px(5, 31, 'A'); px(57, 40, 'A'); px(58, 41, 'A');
  for (let i = 0; i < 7; i++) px(27 + i, 20 + i, 'A');  // lock fallen across the forehead
}
