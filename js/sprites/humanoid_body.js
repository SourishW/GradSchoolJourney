// Everything below the chin: legs, shoes, the torso in each outfit, arms in
// each arm pose, the neck, and whatever is worn or held on the body.
//
// All coordinates are for a full-height figure on the 64x116 grid, centred on
// the line between x=31 and x=32, built facing right (light from the left).
// humanoid.js mirrors the result for facing left and removes leg rows for
// shorter characters.

import { createLayer, mirrorKeys } from './painter.js';
import { softOutline } from './soft_outline.js';

export const WIDTH = 64;
export const HEIGHT = 116;
export const LINE_STRENGTH = 0.7; // how dark the outline is; shared by every layer

const CX = 32;
const SHOULDER_Y = 38;
const ARMPIT_Y = 43;
const ELBOW_Y = 53;
const WRIST_Y = 67;
const CROTCH_Y = 75;
const KNEE_Y = 91;

// Half-widths of the torso at shoulder, waist and hip, and the arm width.
export const BUILDS = {
  average: { shoulder: 13, waist: 11, hip: 12, arm: 5 },
  broad:   { shoulder: 15, waist: 13, hip: 13, arm: 6 },
  slim:    { shoulder: 12, waist: 10, hip: 11, arm: 5 },
};

const LONG_SLEEVED = new Set(['hoodie', 'sweater', 'blazer', 'cardigan', 'gown']);
const layer = () => createLayer(WIDTH, HEIGHT);
const mirrored = (source) => { const copy = layer(); copy.stamp(source); copy.mirror(); return copy; };

// Symmetric shape from [[y, halfWidth], ...].
const symmetric = (target, keys, c) => target.shape(keys.map(([y, half]) => [y, CX - half, CX - 1 + half]), c);

export function paintBody(main, spec, colors) {
  const build = BUILDS[spec.build ?? 'average'];
  if (!build) throw new Error(`unknown build '${spec.build}'`);
  const style = spec.gown ? 'gown' : spec.topStyle ?? 'tee';
  const arms = spec.arms ?? 'down';
  const outlined = (part, keep) => { softOutline(part.cells, colors, { strength: LINE_STRENGTH, keep }); main.stamp(part); };
  const worn = (name) => !spec.gown && (spec.accessories ?? []).includes(name);

  if (style === 'hoodie') paintHoodBehindNeck(main);
  outlined(legsLayer(build, spec));
  outlined(shoesLayer(build, spec.shoeStyle ?? 'sneaker'));
  outlined(torsoLayer(build, style, spec));

  const shoulderX = CX - build.shoulder; // torso's left edge at the shoulder
  // Above the armpit only the outer side of an arm gets a line, so the
  // sleeve joins the shoulder instead of looking pinned on.
  const leftKeep = (x, y, nx) => y > ARMPIT_Y || nx < x;
  const rightKeep = (x, y, nx) => y > ARMPIT_Y || nx > x;

  if (arms === 'violin') {
    // Only the arm holding the violin's neck goes here; the bow arm crosses
    // in front of the instrument and is painted with it (paintViolin).
    const neckArm = bentArm([[WIDTH - shoulderX + 1, 41], [WIDTH - shoulderX + 5, 55], [57, 43]], build, style);
    shadeArm(neckArm, 'right');
    outlined(neckArm, rightKeep);
  } else {
    const hold = arms === 'hold';
    const left = hold ? bentArm([[shoulderX - 2, 41], [shoulderX - 3, 54], [26, 60]], build, style) : hangingArm(build, style, shoulderX);
    const right = mirrored(left);
    if (!hold && worn('watch')) { left.fill(shoulderX - build.arm, 64, shoulderX - 1, 65, 'k'); left.px(shoulderX - 3, 64, 'y'); left.px(shoulderX - 3, 65, 'y'); }
    shadeArm(left, 'left');
    shadeArm(right, 'right');
    outlined(left, leftKeep);
    outlined(right, rightKeep);
  }
  paintNeck(main);
  paintCollar(main, style, spec);
  if (worn('backpack')) paintBackpackStraps(build, outlined);
  if (worn('headphones')) paintHeadphones(outlined);
  if (worn('scarf')) paintScarf(outlined);
  if (worn('lanyard')) paintLanyard(main, outlined);
  if (worn('necklace')) paintNecklace(main);
}

// --- legs and shoes ----------------------------------------------------------

function legsLayer(build, spec) {
  const part = layer();
  const outer = CX - build.hip;
  part.fill(outer, 64, WIDTH - 1 - outer, CROTCH_Y, 'J');
  const leftLeg = [[CROTCH_Y, outer, 31], [80, outer, 30], [KNEE_Y, outer + 1, 30], [108, outer + 2, 29]];
  part.shape(leftLeg, 'J');
  part.shape(mirrorKeys(leftLeg, WIDTH), 'J');
  part.rim('J', 'j', 'left', 1, 1);
  part.rim('J', 'V', 'right', 2, 1);
  // Fly, pocket seams, knees.
  part.line(32, 68, 32, 77, 'V');
  part.line(outer + 2, 69, outer + 5, 72, 'V'); part.line(WIDTH - 3 - outer, 69, WIDTH - 6 - outer, 72, 'V');
  for (const knee of [outer + 4, 37]) { part.row(KNEE_Y, knee, knee + 3, 'V'); part.px(knee + 4, KNEE_Y - 1, 'V'); }
  if (spec.cuffs) {
    for (const [x0, x1] of [[outer + 2, 29], [34, WIDTH - 3 - outer]]) { part.row(102, x0, x1, 'V'); part.fill(x0, 103, x1, 106, 'j'); }
  }
  return part;
}

function shoesLayer(build, style) {
  const part = layer();
  const outer = CX - build.hip;                 // shoes are as wide as the hips
  const top = style === 'boot' ? 101 : style === 'loafer' ? 109 : 106;
  const shoe = [[top, outer + 2, 30], [108, outer + 2, 30], [109, outer + 1, 30], [110, outer, 30], [112, outer, 30]];
  part.shape(shoe, 'b');
  part.fill(outer, 113, 30, 115, 'n');           // sole
  part.px(outer, 113, 'b');
  part.rim('b', 'B', 'right', 2, 1);
  const mid = Math.round((outer + 2 + 30) / 2);
  if (style === 'sneaker') {
    part.row(107, mid - 2, mid + 2, 'n'); part.row(109, mid - 2, mid + 2, 'n');   // laces
    part.row(112, outer + 1, outer + 4, 'B');                                    // toe cap
  } else if (style === 'boot') {
    part.row(top, outer + 2, 30, 'B'); part.row(top + 1, outer + 2, 30, 'B');     // cuff
    for (let y = 104; y <= 108; y += 2) part.row(y, mid - 1, mid + 1, 'y');       // laces
  } else {
    part.row(110, mid - 3, mid + 3, 'B');                                         // loafer strap
  }
  const both = layer();
  both.stamp(part);
  both.stamp(mirrored(part));
  return both;
}

// --- torso -------------------------------------------------------------------

function torsoLayer(build, style, spec) {
  const part = layer();
  const { shoulder, waist } = build;
  const top = [[36, 5], [37, 9], [SHOULDER_Y, shoulder - 1], [40, shoulder], [48, shoulder]];
  const paint = (rest) => {
    symmetric(part, [...top, ...rest], 'T');
    part.rim('T', 'L', 'left', 1, 1);
    part.rim('T', 'U', 'right', 3, 1);
  };
  const ribs = (y0, y1, half) => {
    part.fill(CX - half, y0, CX - 1 + half, y1, 'D');
    for (let x = CX - half + 1; x < CX + half; x += 2) part.fill(x, y0 + 1, x, y1, 'E');
  };

  switch (style) {
    case 'hoodie': {
      paint([[60, waist + 1], [66, waist + 2], [67, waist + 1], [70, waist + 1]]);
      ribs(67, 70, waist + 1);
      // Kangaroo pocket: a trapezoid with slanted hand openings.
      part.row(55, 26, 37, 'U');
      part.line(25, 56, 22, 65, 'U'); part.line(38, 56, 41, 65, 'U');
      part.line(24, 58, 23, 62, 'E'); part.line(39, 58, 40, 62, 'E');
      // Folds where the sleeve meets the body and at the waist.
      part.line(CX - shoulder + 2, 46, CX - shoulder + 4, 50, 'U');
      part.line(CX - 3 + shoulder, 45, CX - 5 + shoulder, 49, 'L');
      part.row(64, CX - waist + 1, CX - waist + 4, 'U');
      if (spec.disheveled) { part.row(66, CX - waist, 30, 'D'); part.line(27, 49, 29, 52, 'U'); } // hem riding up
      break;
    }
    case 'sweater': {
      paint([[61, waist + 1], [69, waist + 1]]);
      ribs(66, 69, waist + 1);
      for (const x of [26, 31, 37]) for (let y = 42; y <= 63; y += 3) { part.px(x, y, 'U'); part.px(x + 1, y + 1, 'U'); part.px(x - 1, y + 1, 'L'); }
      break;
    }
    case 'blazer': {
      paint([[60, waist], [71, waist + 1]]);
      // Shirt front, then lapels with a notch, then the closing edge.
      for (let y = 36; y <= 52; y++) { const half = Math.max(1, Math.round(4 - (y - 36) * 0.2)); part.row(y, CX - half, CX - 1 + half, 'W'); }
      part.line(27, 37, 31, 53, 'U'); part.line(26, 37, 30, 53, 'D'); part.line(25, 38, 29, 52, 'D');
      part.line(36, 37, 32, 53, 'U'); part.line(37, 37, 33, 53, 'E'); part.line(38, 38, 34, 52, 'E');
      part.row(44, 24, 26, 'U'); part.row(44, 37, 39, 'U');
      part.line(32, 54, 32, 69, 'U');
      part.px(33, 57, 'y'); part.px(33, 63, 'y');                                  // buttons
      part.row(61, 23, 27, 'U'); part.row(61, 37, 41, 'U');                        // pocket flaps
      part.row(45, 38, 41, 'W');                                                   // pocket square
      part.px(31, 71, '.'); part.px(32, 71, '.'); part.px(32, 70, '.');            // vent between the fronts
      break;
    }
    case 'cardigan': {
      paint([[61, waist + 1], [70, waist + 2]]);
      ribs(68, 70, waist + 2);
      for (let y = 36; y <= 70; y++) {
        const half = 3 + Math.round((y - 36) * 0.05);
        part.row(y, CX - half, CX - 1 + half, 'W');
        part.px(CX - 1 + half, y, 'N');
        part.fill(CX - half - 2, y, CX - half - 1, y, 'D');
        part.fill(CX + half, y, CX + half + 1, y, 'E');
      }
      for (let y = 44; y <= 66; y += 7) part.px(CX + 4 + Math.round((y - 36) * 0.05), y, 'y'); // buttons
      part.fill(22, 58, 26, 58, 'U'); part.fill(38, 58, 42, 58, 'U');               // pockets
      part.row(44, 30, 33, 'N');                                                    // blouse fold
      break;
    }
    case 'gown': {
      paint([[60, shoulder + 1], [100, shoulder + 3], [102, shoulder + 3]]);
      part.line(32, 46, 32, 102, 'U');
      part.line(25, 58, 23, 101, 'U'); part.line(38, 56, 40, 101, 'U'); part.line(28, 70, 27, 101, 'L');
      // White collar and the hood trim in the school colour.
      for (let y = 36; y <= 44; y++) { const half = Math.max(1, Math.round(4 - (y - 36) * 0.4)); part.row(y, CX - half, CX - 1 + half, 'W'); }
      for (let step = 0; step <= 20; step++) {
        const y = 37 + step, inset = Math.round(step * 0.28);
        part.fill(25 + inset, y, 26 + inset, y, 'X'); part.fill(37 - inset, y, 38 - inset, y, 'x');
      }
      part.row(102, CX - shoulder - 2, CX + 1 + shoulder, 'U');
      break;
    }
    case 'tee': {
      paint([[61, waist], [68, waist + 1]]);
      part.row(67, CX - waist, CX - 1 + waist, 'U');                               // hem stitch
      if (spec.print === 'stripes') {
        for (const y of [46, 47, 51, 52]) part.recolor(0, y, WIDTH - 1, y, 'TLU', 'D');
      } else if (spec.print === 'pocket') {
        part.row(45, 35, 39, 'U'); part.line(35, 46, 35, 49, 'U'); part.line(39, 46, 39, 49, 'U'); part.row(50, 36, 38, 'U');
      }
      part.line(CX - waist + 2, 56, CX - waist + 4, 60, 'U');                      // drape fold
      break;
    }
    default:
      throw new Error(`unknown top style '${style}'`);
  }
  return part;
}

// The neck sits in front of the torso; the collar then sits in front of the neck.
function paintNeck(main) {
  main.fill(28, 30, 35, 37, 's');
  main.fill(28, 30, 35, 33, 'S');   // shadow under the chin
  main.fill(34, 34, 35, 37, 'S');
  main.fill(28, 30, 28, 36, 'z'); main.fill(35, 30, 35, 36, 'z');
}

function paintCollar(main, style, spec) {
  switch (style) {
    case 'hoodie':
      // A white tee shows in the V of the hood; drawstrings hang from the rim.
      main.row(36, 29, 34, 'W'); main.row(37, 30, 33, 'W'); main.row(38, 31, 32, 'N');
      main.line(27, 35, 30, 39, 'E'); main.line(36, 35, 33, 39, 'E');
      main.line(26, 35, 29, 39, 'D'); main.line(37, 35, 34, 39, 'D');
      for (let y = 40; y <= 49; y++) { main.px(28, y, 'W'); main.px(35, y + (spec.disheveled ? 4 : 0), 'W'); }
      main.px(28, 50, 'N'); main.px(35, spec.disheveled ? 54 : 50, 'N');
      break;
    case 'sweater':
    case 'tee':
      main.px(27, 35, 'D'); main.px(36, 35, 'D'); main.px(28, 36, 'D'); main.px(35, 36, 'D');
      main.row(37, 29, 34, 'D'); main.row(38, 30, 33, 'E');
      main.fill(29, 36, 34, 36, 's');
      break;
    case 'blazer':
      // Shirt collar points over the lapels.
      main.line(27, 35, 30, 38, 'W'); main.line(36, 35, 33, 38, 'W'); main.px(28, 35, 'W'); main.px(35, 35, 'W');
      main.fill(30, 36, 33, 37, 's'); main.px(31, 38, 'N'); main.px(32, 38, 'N');
      break;
    case 'cardigan':
      main.fill(29, 36, 34, 36, 's'); main.row(37, 30, 33, 's'); main.row(38, 30, 33, 'N');
      break;
    case 'gown':
      main.fill(30, 36, 33, 37, 's'); main.px(31, 38, 's'); main.px(32, 38, 's');
      break;
    default:
      break;
  }
}

function paintHoodBehindNeck(main) {
  main.fill(23, 31, 40, 38, 'D');
  main.fill(22, 33, 41, 38, 'D');
  main.fill(26, 31, 37, 36, 'E');
}

// --- arms --------------------------------------------------------------------

function sleeveCuff(part, style, x0, x1) {
  if (style === 'hoodie' || style === 'sweater' || style === 'cardigan') {
    part.fill(x0, 64, x1, WRIST_Y, 'D');
    for (let x = x0 + 1; x <= x1; x += 2) part.fill(x, 65, x, WRIST_Y, 'E');
  } else if (style === 'blazer') {
    part.row(WRIST_Y, x0, x1, 'W');
    part.px(x1 - 1, 64, 'y');
  }
}

// The left arm hanging at the side; the right arm is its mirror image.
function hangingArm(build, style, shoulderX) {
  const part = layer();
  const outer = shoulderX - build.arm, inner = shoulderX - 1;
  const bell = style === 'gown' ? 2 : 0;
  part.shape([[SHOULDER_Y, shoulderX - 2, shoulderX], [40, outer, inner], [58, outer, inner], [WRIST_Y, outer - bell, inner + (bell ? 1 : 0)]], 'T');
  if (!LONG_SLEEVED.has(style)) {
    part.recolor(0, 50, WIDTH - 1, WRIST_Y, 'T', 's');
    part.row(49, outer, inner, 'U');
  }
  sleeveCuff(part, style, outer, inner);
  part.shape([[68, outer, inner], [72, outer, inner], [74, outer + 1, inner - 1]], 's');
  part.line(inner - 1, 70, inner - 1, 72, 'S');                                     // thumb
  if (LONG_SLEEVED.has(style)) { part.px(outer + 2, ELBOW_Y, 'U'); part.px(outer + 3, ELBOW_Y + 1, 'U'); part.px(outer + 1, ELBOW_Y + 2, 'U'); }
  return part;
}

// An arm bent at the elbow, from [shoulder, elbow, hand] points.
function bentArm([shoulder, elbow, hand], build, style) {
  const part = layer();
  const path = [...part.segment(...shoulder, ...elbow), ...part.segment(...elbow, ...hand)];
  const half = Math.floor(build.arm / 2);
  const sleeveEnd = LONG_SLEEVED.has(style) ? path.length - 4 : 10;
  path.forEach(([x, y], index) => {
    const letter = index < sleeveEnd ? 'T' : 's';
    part.fill(x - half, y - half, x - half + build.arm - 1, y - half + build.arm - 1, letter);
  });
  part.ellipse(hand[0], hand[1], 3, 3, 's');
  return part;
}

function shadeArm(part, side) {
  if (side === 'left') { part.rim('T', 'L', 'left', 1, 1); part.rim('T', 'U', 'right', 1, 1); part.rim('s', 'S', 'right', 1, 1); }
  else { part.rim('T', 'U', 'right', 2, 1); part.rim('s', 'S', 'right', 2, 1); }
}

// --- worn on the body --------------------------------------------------------

function paintBackpackStraps(build, outlined) {
  const part = layer();
  const x = CX - build.shoulder + 3;
  part.shape([[SHOULDER_Y, x, x + 2], [50, x, x + 2], [62, x + 1, x + 3]], 'X');
  part.rim('X', 'x', 'right', 1, 0);
  part.row(52, x, x + 2, 'k'); part.row(53, x, x + 2, 'C');                          // buckle
  outlined(part);
  outlined(mirrored(part));
}

// Headphones resting round the neck, cups forward on the collarbones.
function paintHeadphones(outlined) {
  const part = layer();
  part.fill(25, 31, 26, 35, 'X');                                                    // band
  part.ellipse(24, 40, 3, 5, 'X');                                                   // cup
  part.fill(22, 38, 24, 42, 'C'); part.px(23, 40, 'x');
  part.fill(26, 37, 26, 43, 'k');                                                    // cushion
  outlined(part);
  outlined(mirrored(part));
}

function paintScarf(outlined) {
  const part = layer();
  part.fill(25, 31, 38, 37, 'X');
  part.fill(24, 33, 39, 36, 'X');
  part.line(26, 34, 37, 33, 'x'); part.line(27, 36, 36, 35, 'x');                    // wrap folds
  part.row(31, 26, 37, 'C');
  outlined(part);
  const tail = layer();
  tail.shape([[37, 35, 39], [52, 36, 40]], 'X');
  tail.rim('X', 'x', 'right', 1, 0);
  tail.row(47, 36, 40, 'C');
  for (let x = 36; x <= 40; x += 2) tail.fill(x, 53, x, 54, 'X');                    // fringe
  outlined(tail);
}

function paintLanyard(main, outlined) {
  main.line(28, 37, 31, 53, 'X'); main.line(35, 37, 32, 53, 'X');
  const badge = layer();
  badge.fill(29, 54, 34, 61, 'W');
  badge.fill(30, 55, 31, 57, 'S');                                                    // photo
  badge.row(59, 30, 33, 'N'); badge.row(57, 33, 33, 'N');
  outlined(badge);
}

function paintNecklace(main) {
  main.px(29, 36, 'y'); main.px(30, 37, 'y'); main.px(33, 37, 'y'); main.px(34, 36, 'y');
  main.fill(31, 38, 32, 39, 'y');
}

// --- held --------------------------------------------------------------------

// The violin pose: instrument under the chin, bow arm across the chest. Runs
// after the head and hair so the instrument sits in front of both.
export function paintViolin(main, spec, colors) {
  const build = BUILDS[spec.build ?? 'average'];
  const style = spec.gown ? 'gown' : spec.topStyle ?? 'tee';
  const outlined = (part, keep) => { softOutline(part.cells, colors, { strength: LINE_STRENGTH, keep }); main.stamp(part); };

  const violin = layer();
  violin.ellipse(38, 38, 6, 5, 'O');                // lower bout, under the chin
  violin.fill(43, 36, 46, 40, 'O');                 // waist
  violin.ellipse(49, 38, 5, 4, 'O');                // upper bout
  violin.rim('O', 'Q', 'left', 2, 1);
  for (let y = 40; y <= 43; y++) violin.recolor(0, y, WIDTH - 1, y, 'O', 'o');
  violin.fill(33, 39, 36, 41, 'o');                 // chin rest
  violin.px(41, 36, 'k'); violin.px(41, 40, 'k'); violin.px(47, 36, 'k'); violin.px(47, 40, 'k'); // f-holes
  violin.fill(44, 37, 44, 39, 'Q');                 // bridge
  violin.fill(46, 37, 60, 39, 'k');                 // fingerboard and neck
  violin.fill(60, 36, 62, 40, 'O'); violin.px(61, 35, 'o'); violin.px(61, 41, 'o'); // scroll and pegs
  violin.row(38, 37, 60, 'l');                      // strings
  outlined(violin);
  main.fill(56, 37, 58, 37, 's'); main.px(57, 36, 's'); // fingers over the neck

  const bow = layer();
  bow.line(43, 51, 51, 23, 'd');
  bow.line(42, 51, 50, 23, 'l');
  main.stamp(bow);

  const shoulderX = CX - build.shoulder;
  const bowArm = bentArm([[shoulderX - 2, 41], [shoulderX - 3, 55], [42, 50]], build, style);
  shadeArm(bowArm, 'left');
  outlined(bowArm, (x, y, nx) => y > ARMPIT_Y || nx < x);
}
