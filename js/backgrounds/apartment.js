// Amara's studio. She is a manga and anime fan and it shows: posters over the
// bed, a shelf of manga volumes with figures on top, a wall scroll, a lucky
// cat on the windowsill, cup noodles by the laptop. Her violin lies in its
// case under the bed.
//
// Variants:
//   'night'  (default) lamp on, string lights twinkling, laptop open
//   'day'    daylight in the window
//   'dusty'  the lonely days: laptop shut, lights off, takeout boxes, tissues,
//            dust on the violin case
//
// Painted on the 384x216 background grid. Characters stand with their feet at
// y=146 and usually at x=192, so the detail sits to either side of the centre.

const FLOOR_TOP = 118;

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

export function drawApartment(ctx, variant, timeMs) {
  const night = variant !== 'day';
  const dusty = variant === 'dusty';
  const rect = (color, x, y, w, h) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };

  // Walls and floor.
  rect(night ? '#5a4660' : '#f7e6c4', 0, 0, 384, FLOOR_TOP);
  rect(night ? '#4a3850' : '#e6cfa6', 0, FLOOR_TOP - 4, 384, 4);            // skirting board
  rect(night ? '#6a4a36' : '#c0885a', 0, FLOOR_TOP, 384, 98);
  ctx.fillStyle = night ? '#7a5a44' : '#d49a6a';
  for (let x = 0; x < 384; x += 32) ctx.fillRect(x, FLOOR_TOP, 1, 98);

  paintStringLights(ctx, rect, timeMs, !dusty);
  paintWindow(ctx, rect, night, timeMs);
  if (night && !dusty) paintLampGlow(ctx);
  paintPosters(ctx, rect);
  paintWallScroll(ctx, rect);
  paintBookshelf(ctx, rect);
  paintBed(ctx, rect, dusty);
  paintDesk(ctx, rect, night, dusty);
  paintCorner(ctx, rect);
  paintFloorThings(ctx, rect, dusty);
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

// Taped-up posters over the bed. All original art.
function paintPosters(ctx, rect) {
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

function paintBed(ctx, rect, dusty) {
  rect('#231a24', 17, 130, 100, 16);                                         // the dark under the bed
  paintViolinCase(ctx, rect, dusty);
  rect('#5a3a2a', 12, 86, 6, 60);                                            // headboard
  rect('#6f4a36', 12, 86, 6, 2);
  rect('#5a3a2a', 115, 112, 5, 34);                                          // footboard
  rect('#5a3a2a', 12, 124, 108, 6);                                          // rail
  rect('#6f4a36', 12, 124, 108, 1);
  rect('#efe7da', 18, 110, 98, 14);                                          // mattress
  rect('#f7f3ea', 20, 100, 26, 11); rect('#dcd4c6', 20, 109, 26, 2);         // pillow
  rect('#8e5fc0', 48, 106, 68, 20);                                          // blanket
  rect('#b48ae0', 48, 106, 68, 5);
  rect('#7a4fac', 48, 124, 68, 2);
  ctx.fillStyle = '#d9c2f2';
  for (let index = 0; index < 9; index++) ctx.fillRect(54 + ((index * 23) % 58), 113 + ((index * 5) % 10), 2, 2);   // stars on the blanket
  stamp(ctx, PLUSH_CAT, { w: '#f7f3ea', k: '#2a2230', p: '#ff8fb8' }, 30, 91);
}

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
  }
}

// The desk under the window: laptop, cup noodles, a pile of manga, a lamp.
function paintDesk(ctx, rect, night, dusty) {
  rect('#4a3220', 238, 106, 4, 40); rect('#4a3220', 340, 106, 4, 40);        // legs
  rect('#5f4129', 304, 108, 34, 38);                                         // drawers
  rect('#4a3220', 304, 120, 34, 1); rect('#4a3220', 304, 133, 34, 1);
  rect('#c8a878', 319, 113, 4, 2); rect('#c8a878', 319, 126, 4, 2); rect('#c8a878', 319, 139, 4, 2);
  rect('#6b4a30', 234, 100, 112, 6);
  rect('#7f5a3c', 234, 100, 112, 1);

  if (dusty) {
    rect('#2a2a33', 268, 97, 34, 3);                                         // laptop, shut
    rect('#3c3c48', 268, 97, 34, 1);
    rect('#f7f3ea', 244, 92, 10, 8); rect('#d9d2c2', 244, 92, 10, 2); rect('#d6336c', 247, 95, 4, 3);   // takeout boxes
    rect('#f7f3ea', 256, 94, 8, 6); rect('#d9d2c2', 256, 94, 8, 2);
  } else {
    rect('#2a2a33', 270, 82, 32, 17);                                        // laptop, open
    rect(night ? '#6fb1ff' : '#a8dcff', 272, 84, 28, 13);
    rect('rgba(255,255,255,0.45)', 274, 86, 12, 1); rect('rgba(255,255,255,0.3)', 274, 89, 18, 1); rect('rgba(255,255,255,0.3)', 274, 92, 9, 1);
    rect('#2a2a33', 268, 99, 36, 2);
    rect('#f7f3ea', 245, 92, 8, 8); rect('#d6336c', 245, 94, 8, 2); rect('#f7f3ea', 244, 91, 10, 1);    // cup noodles
    rect('#8a5a30', 250, 86, 1, 6); rect('#8a5a30', 252, 85, 1, 7);          // chopsticks standing in the cup
  }
  rect('#d6336c', 306, 97, 16, 3); rect('#f7f3ea', 306, 98, 16, 1);          // manga, stacked flat
  rect('#2c5fd6', 307, 94, 15, 3); rect('#f7f3ea', 307, 95, 15, 1);
  rect('#f2c94c', 306, 91, 14, 3); rect('#f7f3ea', 306, 92, 14, 1);

  rect('#3a3a48', 329, 98, 10, 2);                                           // desk lamp
  rect('#3a3a48', 333, 85, 2, 13);
  rect('#4d4d5e', 326, 80, 14, 5); rect('#4d4d5e', 328, 79, 10, 1);
  rect(night && !dusty ? '#ffe9a8' : '#8a8494', 328, 85, 10, 1);
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

function paintFloorThings(ctx, rect, dusty) {
  rect('#b5544a', 150, 149, 92, 13);                                         // rug
  rect('#f3ead8', 150, 151, 92, 1); rect('#f3ead8', 150, 159, 92, 1);
  rect('#d97a6c', 150, 154, 92, 3);
  ctx.fillStyle = '#f3ead8';
  for (let y = 149; y < 162; y += 2) { ctx.fillRect(148, y, 2, 1); ctx.fillRect(242, y, 2, 1); }   // fringe
  rect('#ff8fb8', 124, 149, 7, 3); rect('#ff8fb8', 133, 150, 7, 3);          // slippers
  rect('#e06a98', 124, 151, 7, 1); rect('#e06a98', 133, 152, 7, 1);
  if (dusty) {
    ctx.fillStyle = '#f7f3ea';                                               // tissues
    for (const [x, y] of [[104, 150], [112, 154], [226, 147], [143, 156], [98, 157]]) { ctx.fillRect(x, y, 3, 2); ctx.fillRect(x + 1, y - 1, 2, 1); }
  }
}
