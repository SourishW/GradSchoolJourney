// Parametric 32x58 pixel character with adult proportions (about four and a
// half heads tall). Every cast member is one call to `humanoid` with a palette
// and a pose, so faces, poses and proportions stay consistent across the cast.
//
// Letters used in the grid:
//   k outline   s skin   S skin shade   A hair   h hair highlight
//   T top       D top detail   U top shade   J bottom   V bottom shade  b shoes
//   e eye white p pupil  w eye glint  m mouth   t tear   r blush
//   f glasses frame      G cap     y tassel

import { mix, shade } from './color.js';

export const SPRITE_WIDTH = 32;
export const SPRITE_HEIGHT = 58;

const SHARED_COLORS = {
  k: '#15141c',
  e: '#f7f7fb',
  p: '#15141c',
  w: '#ffffff',
  m: '#7a2a2a',
  t: '#7ec8ff',
  f: '#1d1d26',
  G: '#1b1b26',
  y: '#f2c94c',
};

// Face landmarks (inclusive x ranges).
const FACE = { left: 10, right: 21, top: 3, bottom: 15 };
const BROW_Y = 6;
const EYE_Y = 9;            // eyes are 3 wide x 3 tall
const LEFT_EYE = [11, 13];
const RIGHT_EYE = [18, 20];
const BLUSH_Y = 13;
const MOUTH_Y = 14;

export function humanoid(spec) {
  const grid = Array.from({ length: SPRITE_HEIGHT }, () => Array(SPRITE_WIDTH).fill('.'));
  const px = (x, y, c) => {
    if (x >= 0 && x < SPRITE_WIDTH && y >= 0 && y < SPRITE_HEIGHT) grid[y][x] = c;
  };
  const fill = (x0, y0, x1, y1, c) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) px(x, y, c);
  };
  const paint = { px, fill };
  const facingRight = spec.facing !== 'left';
  const disheveled = Boolean(spec.disheveled);

  paintHairBack(paint, spec.hairStyle);
  paintBody(paint, spec, disheveled);
  paintHead(paint);
  paintHairFront(paint, spec.hairStyle);
  if (disheveled) paintFlyaways(paint);
  paintBrows(paint, spec.brows ?? 'none');
  paintEyes(paint, spec.eyes ?? 'open', facingRight, disheveled);
  paintNose(paint, facingRight);
  if (spec.brows !== 'angry' && spec.mouth !== 'frown') paintBlush(paint);
  paintMouth(paint, spec.mouth ?? 'soft');
  if (spec.tears) paintTears(paint);
  if (spec.glasses) paintGlasses(paint);
  if (spec.cap) paintCap(paint);

  return {
    rows: grid.map((row) => row.join('')),
    colors: {
      ...SHARED_COLORS,
      s: spec.skin,
      S: spec.skinShade,
      A: spec.hair,
      h: spec.hairHighlight ?? spec.hair,
      T: spec.top,
      D: spec.topDetail ?? spec.top,
      U: shade(spec.top),
      J: spec.bottom,
      V: shade(spec.bottom),
      b: spec.shoes,
      r: mix(spec.skin, '#ff5c7a', 0.42),
    },
  };
}

function paintBody({ px, fill }, spec, disheveled) {
  // Neck.
  fill(14, 16, 17, 18, 'S');
  for (let y = 17; y <= 18; y++) { px(13, y, 'k'); px(18, y, 'k'); }

  // Torso with shoulders; the right third is shaded.
  fill(10, 19, 21, 19, 'T'); px(9, 19, 'k'); px(22, 19, 'k');
  fill(9, 20, 22, 36, 'T');
  fill(20, 20, 22, 36, 'U');
  for (let y = 20; y <= 36; y++) { px(8, y, 'k'); px(23, y, 'k'); }

  // Arms hang beside the torso; hands at the hips.
  fill(6, 19, 7, 19, 'k'); fill(24, 19, 25, 19, 'k');
  fill(6, 20, 7, 37, 'T'); fill(24, 20, 25, 37, 'U');
  for (let y = 20; y <= 40; y++) { px(5, y, 'k'); px(26, y, 'k'); }
  fill(6, 38, 7, 40, 's'); fill(24, 38, 25, 40, 'S');
  fill(6, 41, 7, 41, 'k'); fill(24, 41, 25, 41, 'k');
  for (let y = 37; y <= 40; y++) { px(8, y, 'k'); px(23, y, 'k'); }

  paintTopDetail({ px, fill }, spec.topStyle ?? 'tee', disheveled);

  // Hips and legs.
  fill(9, 37, 22, 39, 'J');
  fill(9, 40, 14, 53, 'J'); fill(17, 40, 22, 53, 'J');
  fill(13, 40, 14, 53, 'V'); fill(21, 40, 22, 53, 'V');
  fill(20, 37, 22, 39, 'V');
  for (let y = 37; y <= 53; y++) { px(8, y, 'k'); px(23, y, 'k'); }
  for (let y = 40; y <= 53; y++) { px(15, y, 'k'); px(16, y, 'k'); }
  // Shoes.
  fill(8, 54, 14, 56, 'b'); fill(17, 54, 23, 56, 'b');
  fill(8, 57, 14, 57, 'k'); fill(17, 57, 23, 57, 'k');
  px(7, 56, 'k'); px(24, 56, 'k'); px(7, 55, 'b'); px(24, 55, 'b');
}

function paintTopDetail({ px, fill }, style, disheveled) {
  switch (style) {
    case 'hoodie':
      fill(11, 19, 20, 19, 'D');                 // hood rim
      fill(12, 30, 19, 34, 'D');                 // kangaroo pocket
      fill(12, 30, 19, 30, 'U');
      for (let y = 20; y <= 24; y++) { px(14, y, 'D'); px(17, y + (disheveled ? 2 : 0), 'D'); } // drawstrings
      px(14, 25, 'k'); px(17, disheveled ? 27 : 25, 'k');
      if (disheveled) { fill(9, 36, 14, 36, 'U'); px(10, 27, 'U'); px(11, 28, 'U'); } // hem askew, crease
      break;
    case 'sweater':
      fill(9, 35, 22, 36, 'D');                  // ribbed hem
      fill(13, 19, 18, 20, 'D');                 // collar
      for (let x = 10; x <= 20; x += 2) px(x, 27, 'D');
      break;
    case 'blazer':
      fill(14, 19, 17, 19, 'D');                 // shirt collar
      fill(14, 20, 17, 28, 'D');                 // shirt front
      fill(12, 20, 13, 26, 'U'); fill(18, 20, 19, 26, 'U'); // lapels
      px(13, 19, 'k'); px(18, 19, 'k');
      px(15, 30, 'k'); px(15, 33, 'k');          // buttons
      break;
    case 'tee':
    default:
      fill(14, 19, 17, 19, 'S');                 // neckline
      fill(12, 24, 19, 27, 'D');                 // print
      break;
  }
}

function paintHead({ px, fill }) {
  fill(FACE.left, FACE.top, FACE.right, FACE.bottom, 's');
  // Rounded outline.
  fill(FACE.left + 1, FACE.top - 1, FACE.right - 1, FACE.top - 1, 'k');
  px(FACE.left, FACE.top, 'k'); px(FACE.right, FACE.top, 'k');
  for (let y = FACE.top + 1; y <= FACE.bottom - 1; y++) { px(FACE.left - 1, y, 'k'); px(FACE.right + 1, y, 'k'); }
  px(FACE.left, FACE.bottom, 'k'); px(FACE.right, FACE.bottom, 'k');
  fill(FACE.left + 1, FACE.bottom + 1, 13, FACE.bottom + 1, 'k');
  fill(18, FACE.bottom + 1, FACE.right - 1, FACE.bottom + 1, 'k');
  // Jaw and cheek shading on the right.
  fill(FACE.right - 1, 7, FACE.right, FACE.bottom, 'S');
  fill(12, FACE.bottom, 19, FACE.bottom, 'S');
  // Ears.
  fill(8, 8, 8, 10, 's'); px(7, 8, 'k'); px(7, 9, 'k'); px(7, 10, 'k'); px(8, 7, 'k'); px(8, 11, 'k');
  fill(23, 8, 23, 10, 'S'); px(24, 8, 'k'); px(24, 9, 'k'); px(24, 10, 'k'); px(23, 7, 'k'); px(23, 11, 'k');
}

// Hair that hangs behind the shoulders is painted before the body.
function paintHairBack({ px, fill }, style) {
  if (style === 'down') {
    fill(6, 6, 9, 36, 'A'); fill(22, 6, 25, 36, 'A');
    for (let y = 10; y <= 36; y += 3) { px(5, y, 'A'); px(5, y + 1, 'A'); px(26, y + 1, 'A'); px(26, y + 2, 'A'); }
    px(7, 20, 'h'); px(7, 21, 'h'); px(24, 24, 'h'); px(24, 25, 'h');
  } else if (style === 'long') {
    fill(6, 6, 8, 32, 'A'); fill(23, 6, 25, 32, 'A');
  }
}

function paintHairFront({ px, fill }, style) {
  switch (style) {
    case 'down': // voluminous hair, parted, falling past the shoulders
      fill(9, 0, 22, 7, 'A'); px(9, 0, '.'); px(22, 0, '.'); px(10, 0, '.'); px(21, 0, '.');
      fill(7, 2, 9, 9, 'A'); fill(22, 2, 24, 9, 'A');
      px(6, 4, 'A'); px(6, 5, 'A'); px(25, 4, 'A'); px(25, 5, 'A');
      fill(10, 8, 11, 8, 'A'); fill(20, 8, 21, 8, 'A');
      px(12, 1, 'h'); px(13, 1, 'h'); px(14, 2, 'h'); px(8, 6, 'h');
      px(16, 2, 'k'); px(16, 3, 'k'); // part line
      break;
    case 'curly':
      fill(8, 1, 23, 7, 'A');
      [10, 13, 16, 19, 21].forEach((x) => px(x, 0, 'A'));
      fill(7, 3, 7, 9, 'A'); fill(24, 3, 24, 9, 'A');
      fill(8, 8, 8, 9, 'A'); fill(23, 8, 23, 9, 'A');
      px(11, 2, 'h'); px(12, 2, 'h'); px(17, 3, 'h');
      px(12, 8, 'A'); px(19, 8, 'A');
      break;
    case 'long':
      fill(9, 1, 22, 7, 'A'); px(9, 1, '.'); px(22, 1, '.');
      fill(8, 3, 9, 9, 'A'); fill(22, 3, 23, 9, 'A');
      fill(10, 8, 12, 8, 'A'); fill(19, 8, 21, 8, 'A');
      fill(12, 2, 14, 2, 'h');
      break;
    case 'short':
      fill(9, 2, 22, 7, 'A'); px(9, 2, '.'); px(22, 2, '.');
      fill(9, 8, 9, 9, 'A'); fill(22, 8, 22, 9, 'A');
      fill(10, 8, 13, 8, 'A'); fill(20, 8, 21, 8, 'A');
      fill(12, 3, 14, 3, 'h');
      break;
    case 'bob':
      fill(9, 1, 22, 7, 'A'); px(9, 1, '.'); px(22, 1, '.');
      fill(7, 3, 9, 15, 'A'); fill(22, 3, 24, 15, 'A');
      fill(10, 8, 12, 8, 'A');
      fill(8, 8, 9, 12, 'h'); // grey streak at the temple
      px(7, 16, 'k'); px(24, 16, 'k');
      break;
    default:
      throw new Error(`unknown hair style '${style}'`);
  }
}

// Stray strands for the disheveled look.
function paintFlyaways({ px }) {
  px(8, 1, 'A'); px(7, 0, 'A'); px(13, 0, 'A'); px(19, 0, 'A'); px(24, 1, 'A'); px(25, 0, 'A');
  px(4, 12, 'A'); px(27, 15, 'A');
  px(14, 5, 'A'); px(15, 6, 'A'); // lock across the forehead
}

function paintBrows({ px, fill }, brows) {
  const lift = brows === 'raised' ? -1 : 0;
  switch (brows) {
    case 'angry':
      px(11, BROW_Y - 1, 'A'); px(12, BROW_Y - 1, 'A'); px(13, BROW_Y, 'A'); px(14, BROW_Y + 1, 'A');
      px(20, BROW_Y - 1, 'A'); px(19, BROW_Y - 1, 'A'); px(18, BROW_Y, 'A'); px(17, BROW_Y + 1, 'A');
      break;
    case 'sad':
      px(11, BROW_Y + 1, 'A'); px(12, BROW_Y + 1, 'A'); px(13, BROW_Y, 'A'); px(14, BROW_Y - 1, 'A');
      px(20, BROW_Y + 1, 'A'); px(19, BROW_Y + 1, 'A'); px(18, BROW_Y, 'A'); px(17, BROW_Y - 1, 'A');
      break;
    default:
      fill(11, BROW_Y + lift, 14, BROW_Y + lift, 'A'); fill(17, BROW_Y + lift, 20, BROW_Y + lift, 'A');
  }
}

function paintEyes({ px, fill }, eyes, facingRight, disheveled) {
  for (const [x0, x1] of [LEFT_EYE, RIGHT_EYE]) {
    // Big 3x3 eyes: a 2-wide iris on the side she is facing, two glints.
    const irisLeft = facingRight ? x0 + 1 : x0;
    const glintX = facingRight ? x1 : x0;
    switch (eyes) {
      case 'open':
        fill(x0, EYE_Y, x1, EYE_Y + 2, 'e');
        fill(irisLeft, EYE_Y, irisLeft + 1, EYE_Y + 2, 'p');
        px(glintX, EYE_Y, 'w');
        px(facingRight ? irisLeft : irisLeft + 1, EYE_Y + 2, 'w');
        fill(x0, EYE_Y - 1, x1, EYE_Y - 1, 'k');  // lash line
        px(x0 - 1, EYE_Y, 'k'); px(x1 + 1, EYE_Y, 'k');
        break;
      case 'narrow': // angry: lids half down
        fill(x0, EYE_Y + 1, x1, EYE_Y + 2, 'e');
        fill(irisLeft, EYE_Y + 1, irisLeft + 1, EYE_Y + 2, 'p');
        fill(x0 - 1, EYE_Y, x1 + 1, EYE_Y, 'k');
        break;
      case 'tired':
        fill(x0, EYE_Y + 1, x1, EYE_Y + 2, 'e');
        fill(irisLeft, EYE_Y + 1, irisLeft + 1, EYE_Y + 2, 'p');
        fill(x0, EYE_Y, x1, EYE_Y, 'k');           // heavy lid
        fill(x0, EYE_Y + 3, x1, EYE_Y + 3, 'S');   // bag
        break;
      case 'closed_happy':                          // ^ ^
        px(x0, EYE_Y + 1, 'k'); px(x0 + 1, EYE_Y, 'k'); px(x1, EYE_Y + 1, 'k');
        break;
      case 'closed_sad':                            // squeezed shut
        px(x0, EYE_Y, 'k'); px(x0 + 1, EYE_Y + 1, 'k'); px(x1, EYE_Y, 'k');
        break;
      default:
        throw new Error(`unknown eyes '${eyes}'`);
    }
    if (disheveled && eyes !== 'tired') fill(x0, EYE_Y + 3, x1, EYE_Y + 3, 'S'); // bags
  }
}

function paintBlush({ fill }) {
  fill(10, BLUSH_Y, 11, BLUSH_Y, 'r');
  fill(20, BLUSH_Y, 21, BLUSH_Y, 'r');
}

function paintNose({ px }, facingRight) {
  px(facingRight ? 16 : 15, 13, 'S');
}

function paintMouth({ px, fill }, mouth) {
  switch (mouth) {
    case 'flat':
      fill(14, MOUTH_Y, 17, MOUTH_Y, 'm');
      break;
    case 'soft': // the resting face: corners just turned up
      px(14, MOUTH_Y - 1, 'm'); px(17, MOUTH_Y - 1, 'm');
      fill(15, MOUTH_Y, 16, MOUTH_Y, 'm');
      break;
    case 'smile':
      px(13, MOUTH_Y - 1, 'm'); px(18, MOUTH_Y - 1, 'm');
      fill(14, MOUTH_Y, 17, MOUTH_Y, 'm');
      fill(15, MOUTH_Y + 1, 16, MOUTH_Y + 1, 'm');
      break;
    case 'frown':
      px(13, MOUTH_Y + 1, 'm'); px(18, MOUTH_Y + 1, 'm');
      fill(14, MOUTH_Y, 17, MOUTH_Y, 'm');
      break;
    case 'gasp': // wide and shallow, teeth showing
      fill(13, MOUTH_Y - 1, 18, MOUTH_Y - 1, 'm');
      fill(14, MOUTH_Y, 17, MOUTH_Y, 'e');
      fill(14, MOUTH_Y + 1, 17, MOUTH_Y + 1, 'k');
      px(13, MOUTH_Y, 'm'); px(18, MOUTH_Y, 'm');
      break;
    default:
      throw new Error(`unknown mouth '${mouth}'`);
  }
}

function paintTears({ px, fill }) {
  fill(11, EYE_Y + 2, 11, EYE_Y + 5, 't'); px(10, EYE_Y + 5, 't'); px(10, EYE_Y + 6, 't'); px(11, EYE_Y + 6, 't');
  fill(20, EYE_Y + 2, 20, EYE_Y + 5, 't'); px(21, EYE_Y + 5, 't'); px(21, EYE_Y + 6, 't'); px(20, EYE_Y + 6, 't');
  px(9, EYE_Y + 3, 't'); px(22, EYE_Y + 3, 't'); // welling at the outer corners
}

function paintGlasses({ px, fill }) {
  for (const [x0, x1] of [LEFT_EYE, RIGHT_EYE]) {
    const left = x0 - 1, right = x1 + 1, top = EYE_Y - 1, bottom = EYE_Y + 3;
    fill(x0, top, x1, top, 'f'); fill(x0, bottom, x1, bottom, 'f');
    for (let y = top + 1; y <= bottom - 1; y++) { px(left, y, 'f'); px(right, y, 'f'); }
  }
  px(15, EYE_Y + 1, 'f'); px(16, EYE_Y + 1, 'f'); // bridge
}

function paintCap({ px, fill }) {
  fill(0, 0, SPRITE_WIDTH - 1, 1, '.');
  fill(5, 2, 26, 3, 'G');
  fill(9, 4, 22, 7, 'G');
  fill(6, 2, 25, 2, 'G');
  px(26, 4, 'y'); px(27, 5, 'y'); px(27, 6, 'y'); px(27, 7, 'y'); px(27, 8, 'y'); px(26, 9, 'y');
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
