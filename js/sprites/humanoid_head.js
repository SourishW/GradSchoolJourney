// Head, face, hair and headwear for the 64x116 character. Built facing right:
// the irises sit toward the right of each eye and light comes from the left.

import { createLayer } from './painter.js';
import { baseLetter } from './soft_outline.js';
import { WIDTH, HEIGHT } from './humanoid_body.js';

// The head is an egg centred on x=32, rows 5..31, tapering to the chin.
const HEAD = { cx: 32, cy: 18, rx: 12, ry: 13, taper: 0.32 };
const BROW_Y = 13;
const EYE_Y = 17;                 // eyes are 7 wide x 5 tall
const LEFT_EYE_X = 22;
const RIGHT_EYE_X = 35;
const NOSE = { x: 33, y: 23 };
const MOUTH_Y = 27;
const BLUSH_Y = 23;

const layer = () => createLayer(WIDTH, HEIGHT);
export const isHair = (letter) => 'AhaI'.includes(baseLetter(letter));

function headHalfWidth(y) {
  const t = (y - HEAD.cy) / HEAD.ry;
  let half = HEAD.rx * Math.sqrt(Math.max(0, 1 - t * t));
  if (t > 0) half = Math.max(half * (1 - HEAD.taper * t * t), t > 0.85 ? 4 : 0);
  return Math.round(half);
}

export function headLayer() {
  const head = layer();
  for (let y = HEAD.cy - HEAD.ry; y <= HEAD.cy + HEAD.ry; y++) {
    const half = headHalfWidth(y);
    head.row(y, HEAD.cx - half, HEAD.cx + half - 1, 's');
  }
  head.fill(18, 18, 19, 23, 's'); head.fill(44, 18, 45, 23, 's');   // ears
  head.px(18, 18, '.'); head.px(45, 18, '.'); head.px(18, 23, '.'); head.px(45, 23, '.');
  head.rim('s', 'S', 'right', 2, 1);                                 // cheek in shadow
  head.px(19, 20, 'S'); head.px(19, 21, 'S');
  return head;
}

// --- face --------------------------------------------------------------------

export function paintFace(main, spec) {
  const disheveled = Boolean(spec.disheveled);
  paintBrows(main, spec.brows ?? 'none');
  paintEyes(main, spec.eyes ?? 'open', disheveled);
  main.px(NOSE.x, NOSE.y, 'S'); main.px(NOSE.x, NOSE.y + 1, 'S'); main.px(NOSE.x - 1, NOSE.y + 1, 'S');
  if (spec.brows !== 'angry' && spec.mouth !== 'frown') {
    main.fill(22, BLUSH_Y, 25, BLUSH_Y, 'r'); main.fill(23, BLUSH_Y + 1, 24, BLUSH_Y + 1, 'r');
    main.fill(38, BLUSH_Y, 41, BLUSH_Y, 'r'); main.fill(39, BLUSH_Y + 1, 40, BLUSH_Y + 1, 'r');
  }
  paintMouth(main, spec.mouth ?? 'soft');
  if (spec.tears) {
    main.fill(23, EYE_Y + 5, 23, EYE_Y + 11, 't'); main.fill(22, EYE_Y + 11, 23, EYE_Y + 12, 't');
    main.fill(40, EYE_Y + 5, 40, EYE_Y + 11, 't'); main.fill(40, EYE_Y + 11, 41, EYE_Y + 12, 't');
    main.px(21, EYE_Y + 4, 't'); main.px(42, EYE_Y + 4, 't');
  }
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

export function paintGlasses(main, shape) {
  for (const x0 of [LEFT_EYE_X, RIGHT_EYE_X]) {
    if (shape === 'round') {
      for (let step = 0; step < 48; step++) {
        const angle = (step / 48) * Math.PI * 2;
        main.px(Math.round(x0 + 3 + 5 * Math.cos(angle)), Math.round(EYE_Y + 2 + 4.5 * Math.sin(angle)), 'f');
      }
    } else {
      const left = x0 - 1, right = x0 + 7, top = EYE_Y - 2, bottom = EYE_Y + 5;
      main.row(top, left + 1, right - 1, 'f'); main.row(bottom, left + 1, right - 1, 'f');
      main.fill(left, top + 1, left, bottom - 1, 'f'); main.fill(right, top + 1, right, bottom - 1, 'f');
    }
    main.px(x0 + 1, EYE_Y + 3, 'w');                                 // lens glint
  }
  main.px(30, EYE_Y + 1, 'f'); main.px(31, EYE_Y + 1, 'f'); main.px(32, EYE_Y + 1, 'f'); main.px(33, EYE_Y + 1, 'f');
  main.px(20, EYE_Y + 1, 'f'); main.px(19, EYE_Y + 1, 'f'); main.px(43, EYE_Y + 1, 'f'); main.px(44, EYE_Y + 1, 'f');
}

export function paintEarrings(main) {
  main.fill(18, 24, 18, 26, 'y'); main.fill(45, 24, 45, 26, 'y');
}

// --- hair --------------------------------------------------------------------

// Paints one hairstyle onto two layers: `back` goes behind the body and head,
// `front` over the face and shoulders.
export function paintHair(style, back, front) {
  // The fringe fills the cap already painted on `back` down to a hairline.
  const fringe = (hairlineAt) => {
    for (let x = 16; x <= 47; x++) {
      for (let y = 0; y <= hairlineAt(x); y++) if (back.get(x, y) !== '.') front.px(x, y, 'A');
    }
  };
  // A broken band of highlight following the crown.
  const shine = (y0, x0, x1) => {
    for (let x = x0; x <= x1; x++) {
      if ((x - x0) % 6 === 4) continue;
      const y = y0 + Math.round(Math.abs(x - 31.5) * Math.abs(x - 31.5) / 40);
      if (front.get(x, y) === 'A') front.px(x, y, 'h');
      if ((x - x0) % 3 === 0 && front.get(x, y + 1) === 'A') front.px(x, y + 1, 'h');
    }
  };

  switch (style) {
    case 'down': { // long and wavy, parted to one side, locks over the shoulders
      back.ellipse(32, 15, 16, 13, 'A');
      back.fill(17, 15, 46, 37, 'A');
      fringe((x) => (x < 27 ? 12 - Math.round((27 - x) * 0.15) : 9 + Math.round((x - 27) * 0.2)));
      for (let y = 10; y <= 58; y++) {
        const sway = Math.round(1.4 * Math.sin(y / 5));
        const taper = y > 50 ? Math.round((y - 50) / 3) : 0;
        front.row(y, 16 + sway + taper, 21 + sway, 'A');
        front.row(y, 42 + sway, 47 + sway - taper, 'A');
        if (y % 9 === 3) { front.px(18 + sway, y, 'h'); front.px(18 + sway, y + 1, 'h'); front.px(44 + sway, y + 2, 'h'); }
        front.px(46 + sway - taper, y, 'a'); front.px(45 + sway - taper, y, 'a');
      }
      front.line(27, 3, 27, 9, 'a');                                  // part
      shine(5, 20, 43);
      break;
    }
    case 'curls': { // short tight curls with a clean edge
      back.ellipse(32, 13, 14, 10, 'A');
      for (let x = 20; x <= 43; x += 3) { const top = 13 - Math.round(10 * Math.sqrt(1 - ((x - 31.5) / 14) ** 2)); back.fill(x, top - 1, x + 1, top - 1, 'A'); }
      fringe((x) => 9 + ((x >> 1) % 2));
      front.fill(19, 9, 20, 17, 'A'); front.fill(43, 9, 44, 17, 'A');
      for (let y = 4; y <= 9; y += 2) for (let x = 21 + (y % 4); x <= 42; x += 4) if (front.get(x, y) === 'A') front.px(x, y, 'h');
      for (let y = 5; y <= 9; y += 2) for (let x = 23 + (y % 4); x <= 42; x += 4) if (front.get(x, y) === 'A') front.px(x, y, 'a');
      break;
    }
    case 'braid': { // centre part, tucked behind the ears, one braid over the shoulder
      back.ellipse(32, 14, 15, 12, 'A');
      back.fill(18, 14, 45, 33, 'A');
      fringe((x) => 7 + Math.round(5 * Math.abs(x - 31.5) / 12));
      front.fill(19, 10, 20, 17, 'A'); front.fill(43, 10, 44, 17, 'A');
      front.line(31, 3, 31, 8, 'a');
      shine(5, 21, 42);
      for (let y = 24; y <= 60; y++) {                                  // the braid: plaited segments
        const centre = 19 + Math.min(3, Math.round((y - 24) * 0.25));
        const step = (y - 24) % 5, plait = Math.floor((y - 24) / 5);
        const half = step === 0 || step === 4 ? 2 : 3;
        front.row(y, centre - half, centre + half - 1, 'A');
        front.px(plait % 2 ? centre - 2 + step : centre + 1 - step, y, 'h');
        if (step === 4) front.row(y, centre - 1, centre, 'a');
      }
      front.fill(20, 61, 24, 62, 'X');                                 // tie
      front.fill(20, 63, 23, 66, 'A'); front.px(21, 67, 'A'); front.px(22, 67, 'A');
      break;
    }
    case 'bob': { // chin length, one grey streak at the temple
      back.ellipse(32, 14, 16, 12, 'A');
      back.fill(16, 14, 47, 34, 'A');
      back.fill(17, 35, 46, 36, 'A');
      fringe((x) => 10 + Math.round((x - 20) * 0.08));
      front.shape([[10, 17, 21], [30, 16, 21], [35, 17, 22], [36, 19, 22]], 'A');
      front.shape([[10, 42, 46], [30, 42, 47], [35, 41, 46], [36, 41, 44]], 'A');
      front.line(25, 4, 22, 11, 'I'); front.line(19, 12, 18, 27, 'I');  // the streak
      front.rim('A', 'a', 'right', 1, 1);
      shine(5, 26, 42);
      break;
    }
    case 'short': { // cropped, swept to one side
      back.ellipse(32, 13, 14, 11, 'A');
      fringe((x) => 12 - Math.round((x - 20) * 0.1));
      front.fill(19, 10, 20, 18, 'A'); front.fill(43, 10, 44, 17, 'A');
      shine(5, 22, 40);
      break;
    }
    case 'mop': { // a loose curly mop
      back.ellipse(32, 13, 17, 12, 'A');
      for (let step = 0; step < 14; step++) {                           // bumpy edge
        const angle = Math.PI + (step / 13) * Math.PI;
        back.ellipse(Math.round(32 + 16 * Math.cos(angle)), Math.round(13 + 11 * Math.sin(angle)), 3, 2, 'A');
      }
      fringe((x) => 11 + ((x + 1) % 5 < 2 ? 1 : 0) + (x % 7 === 0 ? 1 : 0));
      front.fill(16, 10, 20, 20, 'A'); front.fill(43, 10, 47, 20, 'A');
      front.px(16, 20, '.'); front.px(47, 20, '.'); front.px(17, 21, 'A'); front.px(46, 21, 'A');
      for (const [y, start] of [[3, 24], [6, 19], [9, 23], [13, 17]]) for (let x = start; x <= 45; x += 7) {  // curls
        if (front.get(x, y) === 'A') { front.px(x, y, 'h'); front.px(x + 1, y, 'h'); front.px(x + 2, y + 1, 'h'); }
        if (front.get(x + 3, y + 2) === 'A') { front.px(x + 3, y + 2, 'a'); front.px(x + 2, y + 3, 'a'); front.px(x + 1, y + 3, 'a'); }
      }
      break;
    }
    case 'bun': { // pulled back into a bun, fringe swept across
      back.ellipse(32, 4, 6, 4, 'A');
      back.ellipse(32, 15, 14, 11, 'A');
      fringe((x) => 9 + Math.round((43 - x) * 0.14));
      front.fill(19, 10, 20, 19, 'A'); front.fill(43, 10, 44, 16, 'A');
      front.row(8, 28, 35, 'a');                                        // where the bun is tied
      front.fill(30, 2, 33, 2, 'h');
      shine(9, 22, 40);
      break;
    }
    default:
      throw new Error(`unknown hair style '${style}'`);
  }
}

// Stray strands for the disheveled look.
export function paintFlyaways(main) {
  for (const [x, y] of [[20, 3], [19, 2], [26, 1], [27, 0], [44, 2], [45, 1], [38, 1], [14, 22], [13, 23], [50, 28], [51, 29]]) main.px(x, y, 'A');
  main.line(27, 12, 29, 15, 'A');                                       // a lock across the forehead
}

// A one-pixel shadow on the forehead under the fringe.
export function shadeUnderFringe(main) {
  for (let x = 21; x <= 42; x++) {
    for (let y = 6; y < BROW_Y - 1; y++) {
      if (isHair(main.get(x, y)) && main.get(x, y + 1) === 's') { main.px(x, y + 1, 'S'); break; }
    }
  }
}

// --- headwear ------------------------------------------------------------------

export function beanieLayer() {
  const hat = layer();
  hat.ellipse(32, 12, 15, 11, 'X');
  hat.fill(0, 12, WIDTH - 1, HEIGHT - 1, '.');
  hat.rim('X', 'C', 'left', 2, 1);
  hat.rim('X', 'x', 'right', 3, 1);
  hat.fill(17, 8, 46, 12, 'X');                                         // folded brim
  for (let x = 18; x <= 45; x += 3) hat.fill(x, 9, x, 12, 'x');
  hat.row(8, 18, 45, 'C');
  return hat;
}

// Mortarboard seen from just below: a wide flat board over a skull cap.
export function capLayer() {
  const cap = layer();
  cap.fill(20, 6, 43, 11, 'G');
  cap.row(12, 21, 42, 'G');
  for (let y = 0; y <= 6; y++) { const half = 23 - Math.abs(y - 3) * 5; cap.row(y, 32 - half, 31 + half, y <= 3 ? 'g' : 'G'); }
  cap.fill(31, 2, 32, 3, 'y');                                          // button
  cap.line(33, 3, 48, 4, 'y');                                          // tassel cord along the board
  cap.fill(48, 5, 48, 13, 'y');
  cap.fill(47, 14, 49, 17, 'y'); cap.px(48, 18, 'y');
  return cap;
}

export const CAP_CLEAR_ROWS = 8; // hair above this row is hidden under the board
