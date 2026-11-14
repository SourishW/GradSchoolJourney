// Amara's studio. She is a manga and anime fan and it shows: posters over the
// bed, a shelf of manga volumes with figures on top, a wall scroll, a lucky
// cat on the windowsill, cup noodles by the laptop. Her violin lies in its
// case under the bed.
//
// The room shows how she is doing. It is described by
//   light  'night' (default) | 'day'
//   care   'tidy'   bed made, plush on the pillow, string lights on
//          'lived'  blanket turned back, a manga left on the bed, a cardigan
//                   over the footboard, a mug on the desk
//          'messy'  blanket dragged onto the floor, clothes and manga on the
//                   floor, takeout on the desk, a poster corner come untaped,
//                   string lights off
//   clutter  0 | 1 | 2: work piling up. 1: sticky notes and a deadline
//          calendar by the desk, pages and a coffee cup on it, a bin filling
//          with crumpled drafts, a few pages on the floor. 2: twice the notes, the bin overflowing,
//          pages all over the floor, energy-drink cans
//   dusty  dust on the violin case and every flat surface, a cobweb
//   dark   lamp off and laptop shut: nobody is really living here
// A scene does not pick these itself: it writes `bgVariant: bedroom()` and the
// room follows her bars (see `bedroom` below).
//
// Painted on the 384x216 background grid. Characters stand with their feet at
// y=146 and usually at x=192, so the detail sits to either side of the centre.
// The HUD covers the top-left corner and the dialogue box everything below
// y=162.

import { GLAD_HAPPINESS, LOW_HAPPINESS, TENSE_STRESS, HIGH_STRESS } from '../engine/stats.js';

const FLOOR_TOP = 118;

const CARE = ['tidy', 'lived', 'messy'];   // in order of neglect

// The `bgVariant` for a bedroom scene. Both bars show in the room, and the
// worse one wins:
//   Happiness  the bed and floor (`care`), with the same thresholds as her face
//   Stress     work clutter around the desk (`clutter`); from TENSE_STRESS it
//              also stops her making the bed, and at HIGH_STRESS the whole
//              room is a mess and gathers dust
// `atLeast` is the least neglect the script calls for ({ care, clutter, dusty,
// dark }); the bars can make the room worse than that but not better.
export function bedroom(atLeast = {}) {
  return ({ stats }) => {
    const strain = stats.stress >= HIGH_STRESS ? 2 : stats.stress >= TENSE_STRESS ? 1 : 0;
    const mood = stats.happiness >= GLAD_HAPPINESS ? 0 : stats.happiness <= LOW_HAPPINESS ? 2 : 1;
    return {
      light: atLeast.light ?? 'night',
      care: CARE[Math.max(mood, strain, CARE.indexOf(atLeast.care ?? 'tidy'))],
      clutter: Math.max(strain, atLeast.clutter ?? 0),
      dusty: Boolean(atLeast.dusty) || strain === 2,
      dark: Boolean(atLeast.dark),
    };
  };
}

// --- tiny pixel pictures --------------------------------------------------------

// Draws a letter grid one pixel per letter; '.' is transparent.
function stamp(ctx, rows, colors, left, top) {
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] === '.') continue;
      ctx.fillStyle = colors[row[x]];
      ctx.fillRect(left + x, top + y, 1, 1);
    }
  });
}

// Katakana and kanji as 5x5 bitmaps, for poster titles.
const GLYPHS = {
  a:    ['#####', '....#', '..##.', '..#..', '.#...'],   // ア
  ni:   ['.....', '.###.', '.....', '#####', '.....'],   // ニ
  me:   ['....#', '.#.#.', '..#..', '.#.#.', '#....'],   // メ
  ka:   ['..#..', '#####', '..#.#', '.#..#', '#..#.'],   // カ
  tsu:  ['#.#.#', '#.#.#', '....#', '...#.', '###..'],   // ツ
  ki:   ['..#..', '#####', '..#..', '#####', '..#..'],   // キ
  yama: ['..#..', '..#..', '#.#.#', '#.#.#', '#####'],   // 山
};

// Writes glyphs left to right, or top to bottom when `vertical`.
function write(ctx, names, color, left, top, vertical = false) {
  names.forEach((name, index) => {
    stamp(ctx, GLYPHS[name], { '#': color }, left + (vertical ? 0 : index * 6), top + (vertical ? index * 6 : 0));
  });
}

const HEROINE = [  // an original magical-girl heroine: plum hair, star pin
  '......HHHHHHHHHH......',
  '....HHHHhhHHHHHHHH....',
  '...HHHhhHHHHHHyHHHH...',
  '..HHHHHHHHHHHyyyHHHH..',
  '..HHHHssssssssyHHHHH..',
  '..HHHssssssssssssHHH..',
  '..HHsseewsssseewssHH..',
  '..HHsseeesssseeessHH..',
  '..HHsseeesssseeessHH..',
  '..HHssrsssssssssrsHH..',
  '..HHHsssssmmsssssHHH..',
  '..HHHHssssssssssHHHH..',
  '..HHH.HssssssssH.HHH..',
  '.HHH...wwsssswww..HHH.',
  '.HHH..wwwwrrwwww..HHH.',
  '.HH..ppwwwrrwwwpp..HH.',
  '.HH.pppppwrrwppppp.HH.',
  '..H.ppppppppppppp..H..',
  '....ppppppppppppp.....',
];
const HEROINE_COLORS = { H: '#7a2d6e', h: '#b04a9a', s: '#ffe0c8', e: '#3a2a6a', w: '#ffffff', r: '#ff5c7a', m: '#c0392b', p: '#ff8fb8', y: '#ffd166' };

const STAR = ['..#..', '.###.', '#####', '.###.', '#.#.#'];

const CAT_FACE = [  // mascot poster
  '.#........#.',
  '###......###',
  '############',
  '############',
  '##k######k##',
  '############',
  '#####pp#####',
  '.##########.',
  '..########..',
];

const PLUSH_CAT = [  // on the bed
  '.w......w.',
  'www....www',
  'wwwwwwwwww',
  'wkwwwwwwkw',
  'wwwwppwwww',
  'wwwwwwwwww',
  '.wwwwwwww.',
  'wwwwwwwwww',
  'wwwwwwwwww',
  '.ww....ww.',
];

const PLUSH_FOX = [  // on the cube shelf
  'o........o',
  'oo......oo',
  'oooooooooo',
  'okoooooko.',
  'oowwwwwwoo',
  '.wwwkkwww.',
  '..wwwwww..',
  '.oooooooo.',
  'oowwwwwwoo',
  'oowwwwwwoo',
  'oo.oooo.oo',
];

const LUCKY_CAT = [  // on the windowsill, one paw raised
  'w.w..w.',
  'www.ww.',
  'wwwwww.',
  'wkwkww.',
  'wwwwww.',
  'rrrrrw.',
  'wwgwww.',
  'wwgwww.',
  'wwwwww.',
];

const FIGURE = [  // a chibi figure on the shelf
  '.hhh.',
  'hhhhh',
  'hsssh',
  '.sss.',
  '.bbb.',
  'bbbbb',
  '.bbb.',
  '.s.s.',
  'kkkkk',
];

const ROBOT_FIGURE = [  // and a toy robot beside it
  '...r...',
  '..ggg..',
  '..gcg..',
  'bbbbbbb',
  'bgryrgb',
  '.bbbbb.',
  '.g...g.',
  'kkkkkkk',
];

// --- the room ---------------------------------------------------------------------

export function drawApartment(ctx, room, timeMs) {
  const { light = 'night', care = 'tidy', clutter = 0, dusty = false, dark = false } = room ?? {};
  const night = light !== 'day';
  const messy = care === 'messy';
  const wall = night ? '#5a4660' : '#f7e6c4';
  const rect = (color, x, y, w, h) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };

  // Walls and floor.
  rect(wall, 0, 0, 384, FLOOR_TOP);
  rect(night ? '#4a3850' : '#e6cfa6', 0, FLOOR_TOP - 4, 384, 4);            // skirting board
  rect(night ? '#6a4a36' : '#c0885a', 0, FLOOR_TOP, 384, 98);
  ctx.fillStyle = night ? '#7a5a44' : '#d49a6a';
  for (let x = 0; x < 384; x += 32) ctx.fillRect(x, FLOOR_TOP, 1, 98);

  paintStringLights(ctx, rect, timeMs, !messy && !dark);
  paintWindow(ctx, rect, night, timeMs);
  if (night && !dark) paintLampGlow(ctx);
  paintPosters(ctx, rect, messy ? wall : null);
  paintWallScroll(ctx, rect);
  paintBookshelf(ctx, rect);
  paintBed(ctx, rect, care, dusty);
  paintDesk(ctx, rect, night, care, dark);
  paintCorner(ctx, rect);
  paintFloorThings(ctx, rect, messy);
  if (clutter) paintWorkClutter(ctx, rect, clutter);
  if (dark) rect('rgba(12, 8, 34, 0.24)', 0, 0, 384, 216);                   // only the window lights the room
  if (dusty) paintDust(ctx, rect, timeMs);
}

// A run of single pixels: `length` across, climbing or falling by `slope`.
function stroke(rect, color, x, y, length, slope = 0) {
  for (let step = 0; step < length; step++) rect(color, x + step, y + Math.round(step * slope), 1, 1);
}

// A sagging string of bulbs across the top of the wall.
function paintStringLights(ctx, rect, timeMs, lit) {
  const COLORS = ['#ffd166', '#ff8fb8', '#8fd3ff', '#b9f18c'];
  const left = 112, right = 246;
  for (let x = left; x <= right; x++) {
    const y = 9 + Math.round(6 * Math.sin((Math.PI * (x - left)) / (right - left)));
    rect('#2a2230', x, y, 1, 1);
    if ((x - left) % 9 !== 4) continue;
    const index = (x - left - 4) / 9;
    const bright = lit && Math.floor(timeMs / 600 + index * 1.7) % 4 !== 0;   // each bulb dims in turn
    rect(lit ? COLORS[index % COLORS.length] : '#6b6474', x - 1, y + 1, 2, 3);
    if (bright) rect('rgba(255,255,255,0.7)', x - 1, y + 1, 1, 1);
  }
}

function paintWindow(ctx, rect, night, timeMs) {
  rect('#2a2420', 252, 24, 80, 62);
  if (night) {
    const sky = ctx.createLinearGradient(0, 28, 0, 82);
    sky.addColorStop(0, '#07071c');
    sky.addColorStop(1, '#1d1d4a');
    rect(sky, 256, 28, 72, 54);
    ctx.fillStyle = '#f0f0ff';
    for (let index = 0; index < 12; index++) {
      if (Math.floor(timeMs / 700 + index) % 6 === 0) continue;
      ctx.fillRect(260 + (index * 29) % 64, 32 + (index * 17) % 44, 1, 1);
    }
    rect('#f2e9c4', 310, 36, 8, 8);
  } else {
    rect('#9fd3ff', 256, 28, 72, 54);
    rect('#ffffff', 262, 40, 18, 5);
    rect('#ffffff', 290, 52, 24, 5);
  }
  rect('#2a2420', 291, 28, 2, 54);
  rect('#2a2420', 256, 54, 72, 2);
  rect('#8a6a50', 248, 86, 88, 3);                                           // sill

  // Curtains on a rod, drawn back.
  rect('#3a2a20', 242, 19, 100, 2);
  for (const x of [244, 332]) {
    rect('#c9727f', x, 21, 8, 70);
    rect('#a85863', x + 2, 21, 1, 70); rect('#a85863', x + 5, 21, 1, 70);
    rect('#e08e99', x, 21, 1, 70);
  }

  stamp(ctx, LUCKY_CAT, { w: '#f7f3ea', k: '#2a2230', r: '#d6336c', g: '#f2c94c' }, 257, 77);
  rect('#c96f3b', 320, 82, 7, 4);                                            // a succulent in a pot
  rect('#5fae6a', 321, 78, 5, 4); rect('#7fce8a', 323, 76, 1, 3); rect('#3f8e4a', 320, 80, 1, 2); rect('#3f8e4a', 326, 80, 1, 2);
}

function paintLampGlow(ctx) {
  const glow = ctx.createRadialGradient(332, 92, 2, 332, 92, 40);
  glow.addColorStop(0, 'rgba(255, 214, 140, 0.45)');
  glow.addColorStop(1, 'rgba(255, 214, 140, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(292, 52, 80, 66);
}

// Taped-up posters over the bed. All original art. `peeledOnto` is the wall
// colour when a corner of the robot poster has come untaped, else null.
function paintPosters(ctx, rect, peeledOnto) {
  const tape = (x, y, w) => { rect('#f3e6a8', x - 1, y - 1, 3, 2); rect('#f3e6a8', x + w - 2, y - 1, 3, 2); };

  // The magical-girl series she grew up on.
  rect('#f4f0e8', 20, 42, 30, 46);
  rect('#3bb3a8', 21, 43, 28, 44);
  ctx.fillStyle = '#62cdc2';
  for (let offset = -40; offset < 30; offset += 8) for (let y = 0; y < 32; y++) {       // burst lines
    const x = 21 + offset + y;
    if (x >= 21 && x <= 47) ctx.fillRect(x, 43 + y, 2, 1);
  }
  stamp(ctx, HEROINE, HEROINE_COLORS, 24, 51);
  stamp(ctx, STAR, { '#': '#ffd166' }, 42, 44);
  rect('#22335c', 21, 76, 28, 11);
  write(ctx, ['a', 'ni', 'me'], '#ffd166', 27, 79);
  tape(20, 42, 30);

  // A giant-robot film.
  rect('#f4f0e8', 56, 40, 46, 30);
  rect('#ff9a5c', 57, 41, 44, 28);
  rect('#ffb56e', 57, 51, 44, 9); rect('#ffcf7a', 57, 60, 44, 9);
  rect('#fff0c4', 88, 46, 8, 8); rect('#fff0c4', 87, 48, 10, 4); rect('#fff0c4', 90, 45, 4, 10);   // low sun
  ctx.fillStyle = '#3a2a4a';                                                                      // skyline
  for (const [x, height] of [[66, 5], [70, 8], [75, 4], [80, 9], [85, 6], [90, 10], [95, 5]]) ctx.fillRect(x, 69 - height, 4, height);
  rect('#3d4f9a', 70, 58, 22, 11);                                           // shoulders
  rect('#2c3a78', 70, 58, 3, 11); rect('#2c3a78', 89, 58, 3, 11);
  rect('#d6336c', 78, 61, 6, 5);                                             // chest plate
  rect('#c8ccd8', 77, 50, 8, 8);                                             // head
  rect('#2a2230', 78, 53, 6, 2); rect('#6fe3ff', 79, 53, 4, 1);              // visor
  rect('#c8ccd8', 80, 45, 1, 5); rect('#d6336c', 80, 44, 1, 1);              // antenna
  rect('#c0392b', 57, 41, 7, 28);
  write(ctx, ['me', 'ka'], '#fff6e8', 58, 44, true);
  tape(56, 40, 46);
  if (peeledOnto) {
    rect(peeledOnto, 99, 39, 4, 2);                                          // the tape has let go
    for (let row = 0; row < 8; row++) {
      rect(peeledOnto, 94 + row, 40 + row, 8 - row, 1);                      // bare wall behind the corner
      rect('#e6dfd0', 94, 40 + row, row, 1);                                 // the corner, folded over
    }
    stroke(rect, '#b9b3a6', 94, 48, 8);
    stroke(rect, 'rgba(0, 0, 0, 0.25)', 94, 49, 9);
  }

  // A cat mascot print.
  rect('#f4f0e8', 56, 74, 20, 18);
  rect('#ffd166', 57, 75, 18, 16);
  stamp(ctx, CAT_FACE, { '#': '#fffaf0', k: '#2a2230', p: '#ff8fb8' }, 60, 78);
  rect('#d6336c', 62, 87, 8, 1); rect('#f2c94c', 65, 88, 2, 2);              // collar and bell
  tape(56, 74, 20);

  // A ramen print.
  rect('#f4f0e8', 80, 74, 22, 18);
  rect('#22335c', 81, 75, 20, 16);
  rect('#f7f3ea', 84, 83, 14, 2); rect('#d6336c', 84, 85, 14, 1);            // bowl rim
  rect('#f7f3ea', 85, 86, 12, 2); rect('#f7f3ea', 87, 88, 8, 1);
  rect('#ffd166', 86, 82, 10, 1); rect('#ffd166', 87, 81, 3, 1); rect('#ffd166', 92, 81, 3, 1);   // noodles
  rect('#fff6e8', 93, 80, 3, 2); rect('#f2a33c', 94, 80, 1, 1);              // egg
  rect('#8a5a30', 88, 77, 1, 5); rect('#8a5a30', 90, 76, 1, 6);              // chopsticks
  rect('rgba(255,255,255,0.5)', 84, 77, 1, 3); rect('rgba(255,255,255,0.5)', 97, 76, 1, 4);       // steam
  tape(80, 74, 22);
}

// A hanging scroll: red sun over an ink mountain.
function paintWallScroll(ctx, rect) {
  rect('#2a2230', 191, 17, 2, 1); rect('#8a6a50', 188, 18, 8, 1); rect('#8a6a50', 184, 20, 16, 1); rect('#8a6a50', 186, 19, 12, 1);   // cord
  rect('#3a2a20', 178, 21, 28, 3);
  rect('#f3ead8', 180, 24, 24, 60);
  rect('#e2d6bd', 180, 24, 2, 60); rect('#e2d6bd', 202, 24, 2, 60);
  rect('#d6336c', 189, 29, 6, 8); rect('#d6336c', 188, 30, 8, 6);            // sun
  ctx.fillStyle = '#3a3440';                                                 // mountain
  for (let row = 0; row < 14; row++) ctx.fillRect(192 - Math.ceil(row * 0.7), 42 + row, Math.ceil(row * 1.4) + 1, 1);
  rect('#f3ead8', 191, 42, 2, 2); rect('#f3ead8', 190, 44, 1, 2);            // snow cap
  rect('#8a8494', 182, 58, 20, 1); rect('#b9b3c4', 184, 61, 16, 1);          // mist
  write(ctx, ['yama'], '#2a2230', 190, 67);
  rect('#c0392b', 198, 77, 3, 3);                                            // seal
  rect('#3a2a20', 178, 84, 28, 3);
}

// Manga, shelved by series, with two figures on top.
function paintBookshelf(ctx, rect) {
  const SPINES = ['#d6336c', '#2c5fd6', '#f2c94c', '#2f9e63', '#8e5fc0', '#f4a261', '#1f8fb5', '#f7f3ea', '#c0392b', '#3d4f9a'];
  rect('#7a5536', 124, 52, 36, 94);
  rect('#5a3d26', 124, 52, 2, 94); rect('#5a3d26', 158, 52, 2, 94);
  for (let shelf = 0; shelf < 4; shelf++) {
    const top = 55 + shelf * 23;
    rect('#33241a', 126, top, 32, 20);
    let x = 127;
    // Runs of matching spines read as one series; the run length and colour
    // step are fixed per shelf so the shelf looks the same every frame.
    for (let run = 0; x < 152; run++) {
      const color = SPINES[(shelf * 3 + run * 7) % SPINES.length];
      const volumes = 2 + ((shelf + run) % 3);
      const height = 15 + ((shelf + run) % 2) * 2;
      for (let volume = 0; volume < volumes && x < 155; volume++, x += 3) {
        rect(color, x, top + 20 - height, 2, height);
        rect('rgba(255,255,255,0.55)', x, top + 23 - height, 2, 2);          // title label
        rect('rgba(0,0,0,0.25)', x, top + 17, 2, 1);                         // volume band
      }
    }
    rect('#5a3d26', 124, top + 20, 36, 3);
  }
  rect('#7a5536', 152, 64, 5, 11); rect('#f7f3ea', 153, 66, 3, 4);           // one volume face-out
  stamp(ctx, FIGURE, { h: '#2c5fd6', s: '#ffe0c8', b: '#f7f3ea', k: '#2a2230' }, 130, 43);
  stamp(ctx, ROBOT_FIGURE, { r: '#d6336c', g: '#c8ccd8', c: '#6fe3ff', b: '#3d4f9a', y: '#f2c94c', k: '#2a2230' }, 144, 44);
}

const BLANKET = '#8e5fc0', BLANKET_LIGHT = '#b48ae0', BLANKET_DARK = '#7a4fac', BLANKET_STARS = '#d9c2f2';
const PLUSH_CAT_COLORS = { w: '#f7f3ea', k: '#2a2230', p: '#ff8fb8' };

function paintBed(ctx, rect, care, dusty) {
  rect('#231a24', 17, 130, 100, 16);                                         // the dark under the bed
  paintViolinCase(ctx, rect, dusty);
  rect('#5a3a2a', 12, 86, 6, 60);                                            // headboard
  rect('#6f4a36', 12, 86, 6, 2);
  rect('#5a3a2a', 115, 112, 5, 34);                                          // footboard
  rect('#5a3a2a', 12, 124, 108, 6);                                          // rail
  rect('#6f4a36', 12, 124, 108, 1);
  rect('#efe7da', 18, 110, 98, 14);                                          // mattress
  BEDDING[care](ctx, rect);
}

function blanketStars(ctx, left, width) {
  ctx.fillStyle = BLANKET_STARS;
  for (let index = 0; index < 9; index++) {
    const x = 54 + ((index * 23) % 58);
    if (x >= left && x < left + width - 2) ctx.fillRect(x, 113 + ((index * 5) % 10), 2, 2);
  }
}

// How the bed has been left, by level of care.
const BEDDING = {
  // Made, with the cat plush sitting on the pillow.
  tidy(ctx, rect) {
    rect('#f7f3ea', 20, 100, 26, 11); rect('#dcd4c6', 20, 109, 26, 2);       // pillow
    rect(BLANKET, 48, 106, 68, 20);
    rect(BLANKET_LIGHT, 48, 106, 68, 5);
    rect(BLANKET_DARK, 48, 124, 68, 2);
    blanketStars(ctx, 48, 68);
    stamp(ctx, PLUSH_CAT, PLUSH_CAT_COLORS, 30, 91);
  },

  // Slept in and not made: the blanket turned back, a manga left open on it,
  // a cardigan over the footboard.
  lived(ctx, rect) {
    rect('#f7f3ea', 20, 100, 26, 11); rect('#dcd4c6', 20, 109, 26, 2);       // pillow, dented
    rect('#dcd4c6', 28, 103, 9, 1); rect('#dcd4c6', 30, 104, 5, 1);
    rect(BLANKET, 48, 106, 68, 20);
    rect(BLANKET_LIGHT, 48, 106, 68, 5);
    rect(BLANKET_DARK, 48, 124, 68, 2);
    blanketStars(ctx, 48, 68);
    for (let row = 0; row < 14; row++) {                                     // the corner turned back
      rect('#efe7da', 48, 106 + row, 14 - row, 1);
      rect(BLANKET_STARS, 62 - row, 106 + row, 7, 1);
      rect(BLANKET_DARK, 69 - row, 106 + row, 1, 1);
    }
    stroke(rect, BLANKET_DARK, 78, 114, 9, 0.5); stroke(rect, BLANKET_DARK, 84, 119, 7, -0.4);   // creases
    stroke(rect, BLANKET_DARK, 104, 110, 8, 0.6);
    rect('#f7f3ea', 91, 112, 13, 2);                                         // a manga, face down
    rect('#f2c94c', 90, 109, 15, 3); rect('#c9a23a', 97, 108, 1, 5); rect('#d6336c', 92, 110, 4, 1);
    stamp(ctx, PLUSH_CAT, PLUSH_CAT_COLORS, 30, 91);
    rect('#3bb3a8', 111, 108, 12, 17);                                       // cardigan over the footboard
    rect('#62cdc2', 111, 108, 12, 2);
    rect('#2a8a82', 116, 110, 1, 15); rect('#2a8a82', 111, 123, 12, 2);
    rect('#3bb3a8', 108, 114, 3, 14); rect('#2a8a82', 108, 126, 3, 2);       // a sleeve hanging
  },

  // Not made in days: the blanket in a heap at the foot and trailing onto the
  // floor, the sheet wrinkled, the pillow shoved aside, the plush fallen out.
  messy(ctx, rect) {
    for (const [x, y, length, slope] of [[24, 114, 10, 0.4], [40, 118, 12, -0.3], [52, 113, 9, 0.5], [60, 120, 10, -0.2], [30, 121, 8, 0.2]]) {
      stroke(rect, '#cfc6b6', x, y, length, slope);                          // wrinkles in the sheet
    }
    for (let row = 0; row < 12; row++) rect(row < 10 ? '#f7f3ea' : '#dcd4c6', 33 - Math.floor(row / 3), 99 + row, 25, 1);   // pillow, askew
    stroke(rect, '#dcd4c6', 38, 102, 9, 0.4); stroke(rect, '#dcd4c6', 44, 106, 6, -0.3);

    // Shoved to the foot of the bed: the near edge runs back diagonally, and
    // what was pushed up bunches into two low lumps.
    for (let row = 0; row < 20; row++) {
      const left = 80 - Math.round(row * 1.4);
      rect(BLANKET, left, 106 + row, 116 - left, 1);
      rect(BLANKET_LIGHT, left, 106 + row, 3, 1);
    }
    rect(BLANKET, 83, 104, 17, 2); rect(BLANKET, 87, 103, 9, 1); rect(BLANKET, 103, 103, 12, 3); rect(BLANKET, 106, 102, 7, 1);
    rect(BLANKET_LIGHT, 83, 104, 4, 1); rect(BLANKET_LIGHT, 87, 103, 9, 1); rect(BLANKET_LIGHT, 103, 103, 3, 1); rect(BLANKET_LIGHT, 106, 102, 7, 1);
    rect(BLANKET_DARK, 54, 124, 62, 2);
    for (const [x, y, length, slope] of [[88, 108, 10, 0.5], [100, 106, 9, 0.7], [76, 117, 14, 0.3], [98, 117, 12, -0.3], [66, 122, 9, -0.2]]) {
      stroke(rect, BLANKET_DARK, x, y, length, slope);                       // folds
    }
    blanketStars(ctx, 84, 32);
    rect(BLANKET, 92, 124, 23, 22);                                          // one end hanging over the rail
    rect(BLANKET_DARK, 92, 124, 1, 22);
    rect(BLANKET_DARK, 97, 127, 1, 18); rect(BLANKET_DARK, 104, 123, 1, 21); rect(BLANKET_DARK, 110, 128, 1, 17);
    rect(BLANKET_LIGHT, 99, 126, 1, 16); rect(BLANKET_LIGHT, 106, 125, 1, 18);
    rect('rgba(0, 0, 0, 0.3)', 84, 151, 40, 1);                              // and pooled on the floor
    rect(BLANKET, 88, 145, 32, 3); rect(BLANKET, 85, 147, 38, 4);
    rect(BLANKET_LIGHT, 85, 147, 4, 1); rect(BLANKET_LIGHT, 119, 147, 4, 1); rect(BLANKET_DARK, 85, 150, 38, 1);
    stroke(rect, BLANKET_DARK, 90, 147, 6, 0.3); stroke(rect, BLANKET_DARK, 108, 148, 8, -0.2);
    rect(BLANKET_STARS, 100, 135, 2, 2); rect(BLANKET_STARS, 112, 141, 2, 2); rect(BLANKET_STARS, 94, 148, 2, 2);

    rect('rgba(0, 0, 0, 0.3)', 21, 158, 12, 1);                              // the plush, on the floor on its head
    stamp(ctx, [...PLUSH_CAT].reverse(), PLUSH_CAT_COLORS, 22, 148);
  },
};

// Her violin, in its case, where it has been for six years. The case is
// shaped to the instrument: two bouts, a waist, a long neck.
function paintViolinCase(ctx, rect, dusty) {
  const LEATHER = '#8a5a30', LIGHT = '#b07a44', TRIM = '#3b2a1a';
  // [left, top, width, height] of each part, lower bout first.
  const PARTS = [[30, 132, 26, 13], [28, 134, 30, 9], [57, 135, 7, 7], [63, 133, 16, 11], [62, 135, 18, 7], [79, 136, 16, 5], [94, 134, 6, 9]];
  for (const [x, y, w, h] of PARTS) rect(TRIM, x, y, w, h);
  for (const [x, y, w, h] of PARTS) rect(LEATHER, x + 1, y + 1, w - 2, h - 2);
  rect(LEATHER, 56, 136, 40, 5);                                             // join the parts inside the trim
  rect(LIGHT, 31, 133, 24, 2); rect(LIGHT, 64, 134, 14, 2); rect(LIGHT, 80, 137, 14, 1);
  rect('#c8ccd8', 40, 143, 3, 2); rect('#c8ccd8', 69, 142, 3, 2); rect('#c8ccd8', 88, 140, 2, 2);   // latches
  rect(TRIM, 50, 144, 12, 2); rect('#231a24', 52, 144, 8, 1);                // handle
  if (dusty) {
    rect('rgba(214, 208, 200, 0.5)', 31, 133, 24, 3); rect('rgba(214, 208, 200, 0.5)', 64, 134, 14, 3); rect('rgba(214, 208, 200, 0.5)', 80, 137, 18, 2);
    ctx.fillStyle = 'rgba(214, 208, 200, 0.7)';
    for (let index = 0; index < 12; index++) ctx.fillRect(32 + ((index * 17) % 60), 137 + ((index * 3) % 5), 1, 1);
    for (const [x, y] of [[19, 143], [84, 143]]) { rect('#8a8494', x, y, 5, 2); rect('#a8a2b0', x + 1, y - 1, 3, 1); }   // dust bunnies
  }
}

// The desk under the window: laptop, cup noodles, a pile of manga, a lamp.
function paintDesk(ctx, rect, night, care, dark) {
  rect('#4a3220', 238, 106, 4, 40); rect('#4a3220', 340, 106, 4, 40);        // legs
  rect('#5f4129', 304, 108, 34, 38);                                         // drawers
  rect('#4a3220', 304, 120, 34, 1); rect('#4a3220', 304, 133, 34, 1);
  rect('#c8a878', 319, 113, 4, 2); rect('#c8a878', 319, 126, 4, 2); rect('#c8a878', 319, 139, 4, 2);
  rect('#6b4a30', 234, 100, 112, 6);
  rect('#7f5a3c', 234, 100, 112, 1);

  if (dark) {
    rect('#2a2a33', 268, 97, 34, 3);                                         // laptop, shut
    rect('#3c3c48', 268, 97, 34, 1);
  } else {
    rect('#2a2a33', 270, 82, 32, 17);                                        // laptop, open
    rect(night ? '#6fb1ff' : '#a8dcff', 272, 84, 28, 13);
    rect('rgba(255,255,255,0.45)', 274, 86, 12, 1); rect('rgba(255,255,255,0.3)', 274, 89, 18, 1); rect('rgba(255,255,255,0.3)', 274, 92, 9, 1);
    rect('#2a2a33', 268, 99, 36, 2);
  }
  rect('#f7f3ea', 245, 92, 8, 8); rect('#d6336c', 245, 94, 8, 2); rect('#f7f3ea', 244, 91, 10, 1);      // cup noodles
  rect('#8a5a30', 250, 86, 1, 6); rect('#8a5a30', 252, 85, 1, 7);            // chopsticks standing in the cup
  if (care === 'lived') {
    rect('#8fd3ff', 258, 94, 6, 6); rect('#6fb1df', 258, 98, 6, 2); rect('#8fd3ff', 264, 95, 1, 3);     // a mug
  }
  if (care === 'messy') {
    rect('#f7f3ea', 256, 93, 9, 7); rect('#d9d2c2', 256, 93, 9, 2); rect('#d6336c', 259, 96, 3, 3);     // a takeout box
    rect('#f7f3ea', 235, 96, 8, 4); rect('#d6336c', 239, 96, 2, 4); rect('#d9d2c2', 235, 96, 1, 4);     // an empty pot, on its side
  }
  rect('#d6336c', 306, 97, 16, 3); rect('#f7f3ea', 306, 98, 16, 1);          // manga, stacked flat
  rect('#2c5fd6', 307, 94, 15, 3); rect('#f7f3ea', 307, 95, 15, 1);
  rect('#f2c94c', 306, 91, 14, 3); rect('#f7f3ea', 306, 92, 14, 1);

  rect('#3a3a48', 329, 98, 10, 2);                                           // desk lamp
  rect('#3a3a48', 333, 85, 2, 13);
  rect('#4d4d5e', 326, 80, 14, 5); rect('#4d4d5e', 328, 79, 10, 1);
  rect(night && !dark ? '#ffe9a8' : '#8a8494', 328, 85, 10, 1);
}

// The corner by the window: one more poster, a cube shelf with the console.
function paintCorner(ctx, rect) {
  rect('#f4f0e8', 348, 30, 30, 46);                                          // a film about the moon
  const sky = ctx.createLinearGradient(0, 31, 0, 75);
  sky.addColorStop(0, '#141a4a');
  sky.addColorStop(1, '#4a3a8a');
  rect(sky, 349, 31, 28, 44);
  rect('#f7f0c8', 360, 35, 12, 14); rect('#f7f0c8', 358, 37, 16, 10);        // the moon
  rect('#e0d6a0', 364, 39, 3, 3); rect('#e0d6a0', 369, 44, 2, 2);
  ctx.fillStyle = '#f0f0ff';
  for (const [x, y] of [[352, 34], [355, 41], [351, 50], [357, 55], [374, 53], [353, 60]]) ctx.fillRect(x, y, 1, 1);
  ctx.fillStyle = '#0c0c20';                                                 // a hill, a girl, a cat
  for (let x = 349; x < 377; x++) { const rise = Math.round(5 * Math.sin((Math.PI * (x - 349)) / 28)); ctx.fillRect(x, 62 - rise, 1, 6 + rise); }
  rect('#0c0c20', 361, 51, 2, 6); rect('#0c0c20', 360, 49, 4, 3); rect('#0c0c20', 367, 54, 3, 3); rect('#0c0c20', 369, 52, 1, 2);
  rect('#0c0c20', 349, 67, 28, 8);
  write(ctx, ['tsu', 'ki'], '#f7f0c8', 357, 69);
  rect('#f3e6a8', 347, 29, 3, 2); rect('#f3e6a8', 376, 29, 3, 2);            // tape

  rect('#7a5536', 348, 118, 32, 28);                                         // cube shelf
  rect('#33241a', 350, 120, 28, 11); rect('#33241a', 350, 133, 28, 11);
  rect('#2a2a33', 353, 125, 16, 5); rect('#5fe38a', 366, 127, 1, 1); rect('#3c3c48', 353, 125, 16, 1);   // console
  rect('#c8ccd8', 371, 126, 5, 4); rect('#d6336c', 372, 127, 1, 1); rect('#2c5fd6', 374, 128, 1, 1);     // controller
  rect('#8e5fc0', 352, 136, 3, 8); rect('#f4a261', 355, 137, 3, 7); rect('#2f9e63', 358, 136, 3, 8); rect('#f7f3ea', 361, 138, 3, 6);  // game cases
  rect('#f2c94c', 366, 139, 10, 5); rect('#c9a23a', 366, 139, 10, 1);
  stamp(ctx, PLUSH_FOX, { o: '#f08a3c', w: '#fff6e8', k: '#2a2230' }, 359, 107);
}

function paintFloorThings(ctx, rect, messy) {
  rect('#b5544a', 150, 149, 92, 13);                                         // rug
  rect('#f3ead8', 150, 151, 92, 1); rect('#f3ead8', 150, 159, 92, 1);
  rect('#d97a6c', 150, 154, 92, 3);
  ctx.fillStyle = '#f3ead8';
  for (let y = 149; y < 162; y += 2) { ctx.fillRect(148, y, 2, 1); ctx.fillRect(242, y, 2, 1); }   // fringe
  rect('#ff8fb8', 124, 149, 7, 3); rect('#ff8fb8', 133, 150, 7, 3);          // slippers
  rect('#e06a98', 124, 151, 7, 1); rect('#e06a98', 133, 152, 7, 1);
  if (!messy) return;

  rect('rgba(0, 0, 0, 0.3)', 55, 157, 26, 1);                                // a heap of clothes
  rect('#3bb3a8', 58, 150, 18, 7); rect('#3bb3a8', 61, 148, 10, 2); rect('#62cdc2', 61, 148, 10, 1);
  rect('#2a8a82', 58, 155, 18, 2); rect('#2a8a82', 66, 150, 1, 5);
  rect('#f2a33c', 68, 152, 12, 5); rect('#f7c46c', 68, 152, 12, 1); rect('#c9822a', 68, 156, 12, 1);
  rect('#f7f3ea', 84, 155, 6, 2); rect('#f7f3ea', 88, 152, 2, 3); rect('#d6336c', 88, 152, 2, 1);      // a sock

  // Manga left where it was dropped: [x, y, cover, lying open].
  for (const [x, y, cover, open] of [[142, 156, '#2c5fd6', false], [224, 149, '#d6336c', true], [252, 150, '#f2c94c', false], [264, 156, '#2f9e63', true], [300, 150, '#8e5fc0', false]]) {
    rect('rgba(0, 0, 0, 0.3)', x, y + 4, open ? 11 : 7, 1);
    if (open) {
      rect('#f7f3ea', x, y, 11, 4); rect(cover, x, y + 3, 11, 1); rect('#b9b3a6', x + 5, y, 1, 4);
      rect('#8a8494', x + 1, y + 1, 3, 1); rect('#8a8494', x + 7, y + 1, 3, 1);
    } else {
      rect(cover, x, y, 7, 4); rect('#f7f3ea', x + 1, y + 1, 4, 1); rect('#f7f3ea', x, y + 3, 7, 1);
    }
  }
  rect('#f7f3ea', 284, 151, 8, 4); rect('#d6336c', 286, 151, 2, 4); rect('#33241a', 291, 152, 1, 2);   // an empty pot
  ctx.fillStyle = '#f7f3ea';                                                 // tissues
  for (const [x, y] of [[126, 157], [146, 147], [234, 158], [276, 148], [44, 150], [312, 156]]) { ctx.fillRect(x, y, 3, 2); ctx.fillRect(x + 1, y - 1, 2, 1); }
}

// Work taking over the room. Level 1 stays around the desk; level 2 spreads
// across the floor.
function paintWorkClutter(ctx, rect, level) {
  const PAPER = '#f7f3ea', INK = '#8a8494';
  const heavy = level >= 2;

  // A calendar counting down to the deadline, and sticky notes around it.
  rect(PAPER, 219, 28, 20, 20); rect('#d6336c', 219, 28, 20, 4); rect('#2a2230', 228, 26, 2, 3);
  for (let day = 0; day < 15; day++) {
    const x = 221 + (day % 5) * 4, y = 34 + Math.floor(day / 5) * 4;
    rect(day < (heavy ? 13 : 8) ? '#d6336c' : '#c8c2b4', x, y, 2, 2);        // days crossed off
  }
  rect('#2c5fd6', 235, 41, 4, 4); rect(PAPER, 236, 42, 2, 2);                // the day, circled
  const NOTES = [[219, 52, '#f2c94c'], [226, 53, '#ff8fb8'], [233, 51, '#8fd3ff'], [220, 60, '#b9f18c'],
    [228, 61, '#f2c94c'], [234, 59, '#ff8fb8'], [219, 68, '#8fd3ff'], [226, 69, '#f2c94c'], [233, 67, '#b9f18c'],
    [221, 76, '#ff8fb8'], [229, 77, '#8fd3ff'], [235, 75, '#f2c94c']];
  for (const [x, y, color] of NOTES.slice(0, heavy ? 12 : 7)) {
    rect(color, x, y, 6, 6); rect('rgba(0, 0, 0, 0.35)', x + 1, y + 2, 4, 1); rect('rgba(0, 0, 0, 0.35)', x + 1, y + 4, 3, 1);
    rect('rgba(0, 0, 0, 0.2)', x, y + 6, 6, 1);
  }
  if (heavy) for (const [x, y, color] of [[262, 30, '#f2c94c'], [300, 31, '#ff8fb8'], [312, 60, '#f2c94c'], [258, 58, '#b9f18c']]) {
    rect(color, x, y, 6, 6); rect('rgba(0, 0, 0, 0.35)', x + 1, y + 2, 4, 1);   // and on the window glass
  }

  // On the desk: a coffee cup on the manga, pages sliding off the edge.
  const page = (x, y, w, h) => { rect(PAPER, x, y, w, h); for (let line = 1; line < h - 1; line += 2) rect(INK, x + 1, y + line, w - 2 - (line % 3), 1); };
  rect(PAPER, 311, 84, 6, 7); rect('#8a5a30', 311, 86, 6, 3); rect('#3a2a20', 310, 83, 8, 1);
  rect('rgba(255, 255, 255, 0.45)', 313, 79, 1, 3); rect('rgba(255, 255, 255, 0.45)', 315, 77, 1, 3);   // steam
  page(246, 100, 9, 9); page(290, 100, 10, 8);
  if (heavy) {
    page(258, 101, 8, 10); page(276, 100, 9, 6);
    for (const [x, y] of [[266, 80], [342, 94]]) { rect('#2f9e63', x, y, 3, 6); rect('#c8ccd8', x, y, 3, 1); rect('#f2c94c', x, y + 3, 3, 1); }   // cans
    rect(PAPER, 234, 93, 5, 7); rect('#8a5a30', 234, 95, 5, 2);              // yesterday's cup
  }

  // The bin by the desk, and the drafts that missed it.
  rect('#4d4d5e', 222, 135, 11, 11); rect('#3a3a48', 222, 135, 11, 1);
  for (let x = 224; x < 233; x += 3) rect('#3a3a48', x, 136, 1, 10);
  const ball = (x, y) => { rect('#e6dfd0', x, y, 4, 3); rect(PAPER, x + 1, y - 1, 2, 1); rect('#b9b3a6', x + 1, y + 1, 2, 1); rect('rgba(0, 0, 0, 0.3)', x, y + 3, 4, 1); };
  ball(223, 132); ball(228, 131);
  const sheet = (x, y, w) => { rect('rgba(0, 0, 0, 0.3)', x, y + 5, w, 1); page(x, y, w, 5); };
  for (const [x, y] of [[236, 148], [215, 150], [241, 155], [250, 147], [208, 157]]) ball(x, y);
  sheet(254, 152, 10); sheet(226, 156, 9); sheet(276, 147, 9);
  if (!heavy) return;
  ball(225, 128); ball(230, 127); ball(220, 130);
  for (const [x, y] of [[206, 147], [244, 151], [270, 156], [198, 152], [290, 148], [180, 150], [330, 149]]) ball(x, y);
  for (const [x, y, w] of [[160, 152, 10], [186, 155, 9], [296, 156, 9], [316, 147, 10], [340, 154, 9], [140, 147, 9], [108, 155, 10]]) sheet(x, y, w);   // pages across the floor
  for (const [x, y] of [[250, 141], [346, 150]]) {                           // cans, one standing, one on its side
    rect('#2f9e63', x, y, 3, 6); rect('#c8ccd8', x, y, 3, 1); rect('#f2c94c', x, y + 3, 3, 1);
  }
  rect('#2f9e63', 306, 152, 6, 3); rect('#c8ccd8', 306, 152, 1, 3); rect('#f2c94c', 309, 152, 1, 3);
}

// Nobody has cleaned: a film on every flat surface, a cobweb in the corner of
// the ceiling, motes hanging in the air. (The violin case carries its own.)
function paintDust(ctx, rect, timeMs) {
  const FILM = 'rgba(222, 216, 208, 0.5)';
  rect(FILM, 124, 52, 36, 1);                                                // bookshelf and its figures
  rect(FILM, 131, 43, 3, 1); rect(FILM, 146, 46, 3, 1);
  rect(FILM, 178, 21, 28, 1);                                                // scroll rod
  rect(FILM, 248, 86, 88, 1);                                                // windowsill
  rect(FILM, 234, 100, 112, 1);                                              // desk
  rect(FILM, 348, 118, 32, 1);                                               // cube shelf
  rect(FILM, 12, 86, 6, 1);                                                  // headboard
  rect('#8a8494', 162, 147, 5, 2); rect('#a8a2b0', 163, 146, 3, 1);          // a dust bunny by the shelf

  // Cobweb: three strands out of the corner, joined by two sagging rings.
  const WEB = 'rgba(232, 228, 222, 0.6)';
  const line = (x0, y0, x1, y1) => {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let step = 0; step <= steps; step++) rect(WEB, Math.round(x0 + ((x1 - x0) * step) / steps), Math.round(y0 + ((y1 - y0) * step) / steps), 1, 1);
  };
  const SPOKES = [[362, 0], [366, 9], [373, 16], [383, 20]];
  for (const [x, y] of SPOKES) line(383, 0, x, y);
  for (const reach of [0.5, 0.85]) {
    const ring = SPOKES.map(([x, y]) => [383 + (x - 383) * reach, y * reach]);
    for (let index = 1; index < ring.length; index++) line(...ring[index - 1], ...ring[index]);
  }

  ctx.fillStyle = 'rgba(240, 236, 228, 0.45)';                               // motes, drifting down slowly
  for (let index = 0; index < 14; index++) {
    const x = 40 + ((index * 67) % 320) + Math.round(2 * Math.sin(timeMs / 1700 + index));
    const y = 24 + ((index * 41 + Math.floor(timeMs / 260)) % 116);
    ctx.fillRect(x, y, 1, 1);
  }
}
