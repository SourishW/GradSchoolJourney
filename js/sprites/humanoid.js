// Parametric 64x116 pixel character, about four and a half heads tall. Every
// cast member is one call to `humanoid` with a palette, a look (build, hair,
// outfit, accessories) and a pose, so story files never touch pixels.
//
// The sprite is built facing right and mirrored for facing left. Body parts
// are painted on separate layers and each gets a dark, hue-tinted outline, so
// overlapping parts stay readable.
//
// Letters used in the grid:
//   s skin   S skin shade   z skin deep shade   r blush
//   A hair   h hair highlight   a hair shade   I hair streak
//   T top    L top light   U top shade   D top detail   E top detail shade
//   J bottom j bottom light V bottom shade
//   b shoes  B shoe shade   n sole and laces
//   W shirt  N shirt shade  X accent   C accent light   x accent shade
//   e eye white i iris  p pupil  w glint   m lip line  M lower lip  t tear
//   f glasses   G cap   g cap top   y gold (tassel, jewellery, buttons)
//   O o Q violin wood   l strings and bow hair   d bow stick   k hard line

import { createLayer } from './painter.js';
import { softOutline } from './soft_outline.js';
import { mix, shade } from './color.js';
import { WIDTH, HEIGHT, LINE_STRENGTH, paintBody, paintViolin } from './humanoid_body.js';
import {
  headLayer, paintFace, paintGlasses, paintEarrings, paintHair, paintFlyaways,
  shadeUnderFringe, beanieLayer, capLayer, isHair, CAP_CLEAR_ROWS,
} from './humanoid_head.js';

export const SPRITE_WIDTH = WIDTH;
export const SPRITE_HEIGHT = HEIGHT;

export const SHARED_COLORS = {
  k: '#2a2230',
  e: '#f9f9fc',
  p: '#1e1824',
  w: '#ffffff',
  t: '#7ec8ff',
  f: '#2a2230',
  G: '#1f1d2c',
  g: '#35324a',
  y: '#f2c94c',
  O: '#b8692e', o: '#7d4318', Q: '#d68a4a', l: '#efe6c8', d: '#5a3a1c',
};

const GOWN = { top: '#262433', topDetail: '#3d3b55', trim: '#d9682f' };
const WHITE = '#ffffff';

// Leg rows removed, in this order, to make a character shorter. They are
// spread over thigh and shin so the proportions hold.
const SHORTEN_ROWS = [98, 82, 100, 80, 96, 84, 94, 86];

export function humanoid(spec) {
  const colors = paletteFor(spec);
  const main = createLayer(WIDTH, HEIGHT);
  const outlined = (part, keep) => { softOutline(part.cells, colors, { strength: LINE_STRENGTH, keep }); main.stamp(part); };
  const wears = (name) => (spec.accessories ?? []).includes(name);

  const hairBack = createLayer(WIDTH, HEIGHT);
  const hairFront = createLayer(WIDTH, HEIGHT);
  paintHair(spec.hairStyle, hairBack, hairFront);
  hairBack.rim('A', 'a', 'right', 2, 1);
  main.stamp(hairBack);

  paintBody(main, spec, colors);
  outlined(headLayer());
  paintFace(main, spec);
  if (wears('earrings')) paintEarrings(main);
  // Hair gets a line where it crosses skin or clothes, not where it lies on
  // more hair.
  outlined(hairFront, (x, y, nx, ny) => !isHair(main.get(nx, ny)));
  shadeUnderFringe(main);
  if (spec.disheveled) paintFlyaways(main);
  if (spec.glasses) paintGlasses(main, spec.glasses);
  if (spec.cap) {
    main.fill(0, 0, WIDTH - 1, CAP_CLEAR_ROWS - 1, '.');
    outlined(capLayer());
  } else if (wears('beanie')) {
    outlined(beanieLayer());
  }
  if (spec.arms === 'violin') paintViolin(main, spec, colors);

  shorten(main.cells, spec.shorter ?? 0);
  softOutline(main.cells, colors, { strength: LINE_STRENGTH });
  if (spec.facing === 'left') main.mirror();
  return { rows: main.rows(), colors };
}

function paletteFor(spec) {
  const top = spec.gown ? GOWN.top : spec.top;
  const detail = spec.gown ? GOWN.topDetail : spec.topDetail ?? spec.top;
  const accent = spec.gown ? GOWN.trim : spec.accent ?? '#c8553d';
  const shirt = spec.shirt ?? '#f1f1f6';
  const lips = spec.lips ?? '#8a3a44';
  return {
    ...SHARED_COLORS,
    s: spec.skin, S: spec.skinShade, z: shade(spec.skinShade),
    r: mix(spec.skin, '#ff5c7a', 0.38),
    A: spec.hair, h: spec.hairHighlight ?? mix(spec.hair, WHITE, 0.25), a: shade(spec.hair),
    I: spec.hairStreak ?? spec.hairHighlight ?? spec.hair,
    T: top, L: mix(top, WHITE, 0.16), U: shade(top), D: detail, E: shade(detail),
    J: spec.bottom, j: mix(spec.bottom, WHITE, 0.14), V: shade(spec.bottom),
    b: spec.shoes, B: shade(spec.shoes), n: spec.sole ?? '#e9e6dc',
    W: shirt, N: mix(shirt, '#6a6a8a', 0.3),
    X: accent, C: mix(accent, WHITE, 0.22), x: shade(accent),
    e: mix(SHARED_COLORS.e, spec.skin, 0.14),
    i: spec.iris ?? '#4a3020',
    m: lips, M: mix(lips, spec.skin, 0.45),
  };
}

// Removes `count` rows from the legs and pads the top, so a shorter character
// still stands on the bottom row of the grid.
function shorten(cells, count) {
  if (count > SHORTEN_ROWS.length) throw new Error(`cannot shorten by ${count} rows`);
  const rows = SHORTEN_ROWS.slice(0, count).sort((a, b) => b - a);
  for (const y of rows) cells.splice(y, 1);
  for (let index = 0; index < rows.length; index++) cells.unshift(Array(WIDTH).fill('.'));
}

// Pose names map to face and arm parameters. 'idle' is the resting face; for
// Amara the renderer swaps it for 'glad' or 'low' depending on the Happiness
// bar (see render/characters.js).
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
  violin: { eyes: 'closed_happy', mouth: 'smile', arms: 'violin' },
};
