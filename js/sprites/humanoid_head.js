// Head, face, hair and headwear for the 64x116 character. Built facing right:
// the irises sit toward the right of each eye and light comes from the left.

import { createLayer } from './painter.js';
import { baseLetter } from './soft_outline.js';
import { WIDTH, HEIGHT } from './humanoid_body.js';

// The head is an oval centred on x=32: a half-ellipse crown (rows 5..18) over
// full cheeks and a rounded chin (rows 18..32).
const HEAD = { cx: 32, cy: 18, rx: 12, crown: 13 };
const JAW = [12, 12, 12, 12, 12, 12, 11, 11, 10, 10, 9, 8, 7, 6, 4]; // half-widths from row cy down
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
  if (y >= HEAD.cy) return JAW[y - HEAD.cy] ?? 0;
  const t = (HEAD.cy - y) / HEAD.crown;
  return Math.round(HEAD.rx * Math.sqrt(Math.max(0, 1 - t * t)));
}

export function headLayer() {
  const head = layer();
  for (let y = HEAD.cy - HEAD.crown; y < HEAD.cy + JAW.length; y++) {
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
  paintEyes(main, spec.blink ? blinkFor(spec.eyes ?? 'open') : spec.eyes ?? 'open', disheveled, spec.gaze === 'away');
  main.px(NOSE.x, NOSE.y, 'S'); main.px(NOSE.x, NOSE.y + 1, 'S'); main.px(NOSE.x - 1, NOSE.y + 1, 'S');
  if (spec.brows !== 'angry' && spec.mouth !== 'frown') {
    main.fill(22, BLUSH_Y, 25, BLUSH_Y, 'r'); main.fill(23, BLUSH_Y + 1, 24, BLUSH_Y + 1, 'r');
    main.fill(38, BLUSH_Y, 41, BLUSH_Y, 'r'); main.fill(39, BLUSH_Y + 1, 40, BLUSH_Y + 1, 'r');
  }
  paintMouth(main, spec.mouth ?? 'soft');
  if (spec.tears) {
    // Two frames: the drops run a little further down the cheek on the second.
    const run = spec.tearFrame ? 2 : 0;
    main.fill(23, EYE_Y + 5 + run, 23, EYE_Y + 11 + run, 't'); main.fill(22, EYE_Y + 11 + run, 23, EYE_Y + 12 + run, 't');
    main.fill(40, EYE_Y + 5 + run, 40, EYE_Y + 11 + run, 't'); main.fill(40, EYE_Y + 11 + run, 41, EYE_Y + 12 + run, 't');
    main.px(21, EYE_Y + 4, 't'); main.px(42, EYE_Y + 4, 't');
  }
}

// A blink only changes eyes that are open to begin with.
const blinkFor = (eyes) => (eyes === 'closed_happy' || eyes === 'closed_sad' ? eyes : 'blink');

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

function paintEyes({ px, fill }, eyes, disheveled, gazeAway) {
  for (const x0 of [LEFT_EYE_X, RIGHT_EYE_X]) {
    const x1 = x0 + 6;
    const iris = gazeAway ? x0 + 1 : x0 + 3;        // the iris is 3 wide; it sits toward where she looks
    switch (eyes) {
      case 'open':
        fill(x0 + 1, EYE_Y, x1 - 1, EYE_Y, 'e');
        fill(x0, EYE_Y + 1, x1, EYE_Y + 3, 'e');
        fill(x0 + 1, EYE_Y + 4, x1 - 1, EYE_Y + 4, 'e');
        fill(iris, EYE_Y, iris + 2, EYE_Y + 3, 'i');
        fill(iris + 1, EYE_Y + 1, iris + 2, EYE_Y + 2, 'p');
        px(iris, EYE_Y + 1, 'w'); px(iris + 1, EYE_Y + 1, 'w'); px(iris + 2, EYE_Y + 3, 'w');
        fill(x0 + 1, EYE_Y - 1, x1 - 1, EYE_Y - 1, 'k');
        px(x0, EYE_Y, 'k'); px(x1, EYE_Y, 'k'); px(x0 - 1, EYE_Y - 1, 'k');
        fill(x0 + 1, EYE_Y + 5, x1 - 1, EYE_Y + 5, 'S');
        break;
      case 'narrow': // angry: lids half down
        fill(x0, EYE_Y + 1, x1, EYE_Y + 3, 'e');
        fill(iris, EYE_Y + 1, iris + 2, EYE_Y + 3, 'i');
        fill(iris + 1, EYE_Y + 1, iris + 2, EYE_Y + 2, 'p');
        px(iris, EYE_Y + 1, 'w');
        fill(x0, EYE_Y, x1, EYE_Y, 'k'); px(x0 - 1, EYE_Y, 'k');
        break;
      case 'tired':
        fill(x0, EYE_Y + 2, x1, EYE_Y + 3, 'e');
        fill(x0 + 1, EYE_Y + 4, x1 - 1, EYE_Y + 4, 'e');
        fill(iris, EYE_Y + 2, iris + 2, EYE_Y + 4, 'i');
        fill(iris + 1, EYE_Y + 2, iris + 2, EYE_Y + 3, 'p');
        fill(x0, EYE_Y + 1, x1, EYE_Y + 1, 'k');
        fill(x0 + 1, EYE_Y + 5, x1 - 1, EYE_Y + 6, 'S');
        break;
      case 'blink':                                   // lids down, lashes level
        fill(x0, EYE_Y + 2, x1, EYE_Y + 2, 'k'); px(x0 - 1, EYE_Y + 1, 'k');
        fill(x0 + 1, EYE_Y + 3, x1 - 1, EYE_Y + 3, 'S');
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
    if (disheveled && eyes !== 'tired' && eyes !== 'blink') fill(x0 + 1, EYE_Y + 5, x1 - 1, EYE_Y + 6, 'S'); // bags
  }
}

// Mouths are a single line: no lips, no shading.
function paintMouth({ px, fill }, mouth) {
  switch (mouth) {
    case 'soft':  // the resting face: corners just turned up
      px(29, MOUTH_Y - 1, 'm'); px(34, MOUTH_Y - 1, 'm');
      fill(30, MOUTH_Y, 33, MOUTH_Y, 'm');
      break;
    case 'smile':
      px(28, MOUTH_Y - 2, 'm'); px(29, MOUTH_Y - 1, 'm'); px(34, MOUTH_Y - 1, 'm'); px(35, MOUTH_Y - 2, 'm');
      fill(30, MOUTH_Y, 33, MOUTH_Y, 'm');
      break;
    case 'flat':
      fill(29, MOUTH_Y, 34, MOUTH_Y, 'm');
      break;
    case 'frown':
      px(29, MOUTH_Y + 1, 'm'); px(34, MOUTH_Y + 1, 'm');
      fill(30, MOUTH_Y, 33, MOUTH_Y, 'm');
      break;
    case 'gasp': // open: a line round the teeth and the dark of the mouth
      fill(28, MOUTH_Y - 1, 35, MOUTH_Y - 1, 'm');
      fill(29, MOUTH_Y, 34, MOUTH_Y, 'e');
      fill(29, MOUTH_Y + 1, 34, MOUTH_Y + 1, 'k');
      px(28, MOUTH_Y, 'm'); px(35, MOUTH_Y, 'm'); px(28, MOUTH_Y + 1, 'm'); px(35, MOUTH_Y + 1, 'm');
      fill(29, MOUTH_Y + 2, 34, MOUTH_Y + 2, 'm');
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
// `front` over the face and shoulders. `sway` (-2..2) swings whatever hangs
// loose, most at the tips; 0 is the resting shape.
export function paintHair(style, back, front, sway = 0) {
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
      for (let y = 10; y <= 60; y++) {
        // Each lock is a ribbon whose two edges wave out of step, so it
        // swells and narrows the way a loose wave does.
        const swing = Math.round((sway * Math.max(0, y - 14)) / 30);
        const outer = Math.round(2 * Math.sin((y - 10) / 2.7));
        const inner = Math.round(1.2 * Math.sin((y - 10) / 2.7 + 1.1));
        const taper = y > 52 ? Math.round((y - 52) / 2) : 0;
        const left = [15 + outer + swing + taper, 21 + inner + swing];
        const right = [42 - inner + swing, 48 - outer + swing - taper];
        front.row(y, left[0], left[1], 'A');
        front.row(y, right[0], right[1], 'A');
        if ((y - 10) % 17 >= 4 && (y - 10) % 17 <= 9) { front.px(left[0] + 2, y, 'h'); front.px(right[0] + 2, y, 'h'); } // light on each wave crest
        front.px(right[1], y, 'a'); front.px(right[1] - 1, y, 'a');
        if ((y - 10) % 17 >= 12) front.px(left[1] - 1, y, 'a');                                                        // shadow in each trough
      }
      front.line(27, 3, 27, 9, 'a');                                  // part
      shine(5, 20, 43);
      break;
    }
    case 'crop': { // cut close to the scalp, sharp squared hairline, sides faded out
      back.ellipse(32, 14, 13, 10, 'A');
      back.fill(0, 15, WIDTH - 1, HEIGHT - 1, '.');                    // nothing behind the ears
      fringe(() => 9);
      front.fill(20, 9, 22, 12, 'A'); front.fill(41, 9, 43, 12, 'A'); // temples, squared off
      for (const [x, y] of [[20, 13], [21, 13], [20, 14], [21, 15], [20, 16]]) {  // the fade: hair thinning into skin
        front.px(x, y, 'h'); front.px(63 - x, y, 'h');
      }
      for (let y = 5; y <= 8; y++) for (let x = 22 + ((y * 2) % 5); x <= 41; x += 5) if (front.get(x, y) === 'A') front.px(x, y, 'h');  // short waves
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
        const centre = 19 + Math.min(3, Math.round((y - 24) * 0.25)) + Math.round((sway * (y - 24)) / 30);
        const step = (y - 24) % 5, plait = Math.floor((y - 24) / 5);
        const half = step === 0 || step === 4 ? 2 : 3;
        front.row(y, centre - half, centre + half - 1, 'A');
        front.px(plait % 2 ? centre - 2 + step : centre + 1 - step, y, 'h');
        if (step === 4) front.row(y, centre - 1, centre, 'a');
      }
      front.fill(20 + sway, 61, 24 + sway, 62, 'X');                   // tie
      front.fill(20 + sway, 63, 23 + sway, 66, 'A'); front.px(21 + sway, 67, 'A'); front.px(22 + sway, 67, 'A');
      break;
    }
    case 'bob': { // chin length and going grey: a streak at the temple, strands through the rest
      back.ellipse(32, 14, 16, 12, 'A');
      back.fill(16, 14, 47, 34, 'A');
      back.fill(17, 35, 46, 36, 'A');
      fringe((x) => 10 + Math.round((x - 20) * 0.08));
      front.shape([[10, 17, 21], [30, 16, 21], [35, 17, 22], [36, 19, 22]], 'A');
      front.shape([[10, 42, 46], [30, 42, 47], [35, 41, 46], [36, 41, 44]], 'A');
      front.line(25, 4, 22, 11, 'I'); front.line(26, 4, 23, 11, 'I'); front.line(19, 12, 18, 27, 'I');  // the streak
      for (const [x0, y0, x1, y1] of [[30, 3, 28, 9], [35, 3, 37, 9], [39, 4, 42, 10], [20, 14, 20, 24], [44, 13, 45, 23], [46, 18, 46, 30], [17, 20, 17, 31]]) {
        for (const [x, y] of front.segment(x0, y0, x1, y1)) if (front.get(x, y) === 'A') front.px(x, y, 'I');
      }
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
export function capLayer(sway = 0) {
  const cap = layer();
  cap.fill(20, 6, 43, 11, 'G');
  cap.row(12, 21, 42, 'G');
  for (let y = 0; y <= 6; y++) { const half = 23 - Math.abs(y - 3) * 5; cap.row(y, 32 - half, 31 + half, y <= 3 ? 'g' : 'G'); }
  cap.fill(31, 2, 32, 3, 'y');                                          // button
  cap.line(33, 3, 48, 4, 'y');                                          // tassel cord along the board
  cap.line(48, 5, 48 + sway, 13, 'y');
  cap.fill(47 + sway, 14, 49 + sway, 17, 'y'); cap.px(48 + sway, 18, 'y');
  return cap;
}

export const CAP_CLEAR_ROWS = 8; // hair above this row is hidden under the board
