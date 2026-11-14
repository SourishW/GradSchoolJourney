// Every character in the game: palette plus display name and text-blip pitch.
// Poses are rasterized lazily and cached per (character, pose, facing, look).

import { humanoid, POSES } from './humanoid.js';
import { rasterize } from './pixel_sprite.js';

// Besides the palette, each member has a look:
//   build        'average' | 'broad' | 'slim'
//   shorter      leg rows removed (0 = tallest)
//   hairStyle    'down' | 'crop' | 'braid' | 'bob' | 'short' | 'mop' | 'bun'
//   topStyle     'hoodie' | 'tee' | 'sweater' | 'blazer' | 'cardigan'
//   shoeStyle    'sneaker' | 'boot' | 'loafer'
//   accessories  worn items; `accent` is their colour
//   fidget       what they do while standing around (see render/idle.js)
export const CAST = {
  amara: {
    name: 'Amara', color: '#c9a7ff', pitch: 520,
    skin: '#f3cfa9', skinShade: '#d9a97f', hair: '#6b4226', hairHighlight: '#9a6a3c',
    top: '#f4a261', topDetail: '#d9843f', bottom: '#2f4b7c', shoes: '#e8e4dc', sole: '#b9b4c4', // light orange hoodie
    build: 'average', shorter: 3, hairStyle: 'down', topStyle: 'hoodie', shoeStyle: 'sneaker', cuffs: true,
    fidget: 'sway',
  },
  daniel: {
    name: 'Daniel', color: '#7fd1a8', pitch: 360,
    skin: '#6e432b', skinShade: '#4f2e1c', hair: '#1c1512', hairHighlight: '#4d3a2e',
    top: '#2f9e63', topDetail: '#1f7a4a', bottom: '#3a3a44', shoes: '#6b4a2a', sole: '#2a2018',
    build: 'broad', shorter: 0, hairStyle: 'crop', topStyle: 'tee', print: 'pocket', shoeStyle: 'boot',
    accessories: ['headphones', 'watch'], accent: '#4a4a5c', fidget: 'watch',
  },
  clara: {
    name: 'Clara', color: '#f4a261', pitch: 480,
    skin: '#c99a6e', skinShade: '#a07448', hair: '#3b2418', hairHighlight: '#6b4a34',
    top: '#2a9d8f', topDetail: '#1f776d', bottom: '#4a4a58', shoes: '#5a3a2a', sole: '#2a2018',
    build: 'average', shorter: 3, hairStyle: 'bun', topStyle: 'cardigan', shoeStyle: 'loafer',
    accessories: ['necklace'], shirt: '#f3ead8', fidget: 'nod',
  },
  priya: {
    name: 'Priya', color: '#ffd166', pitch: 600,
    skin: '#b07a4a', skinShade: '#86592f', hair: '#1a1414', hairHighlight: '#4a3838',
    top: '#e9b949', topDetail: '#c99a2c', bottom: '#4a3a5e', shoes: '#3a2a3a', sole: '#e9e6dc',
    build: 'slim', shorter: 4, hairStyle: 'braid', topStyle: 'sweater', shoeStyle: 'sneaker',
    accessories: ['scarf', 'earrings'], accent: '#b5446e', fidget: 'rock',
  },
  park: {
    name: 'Dr. Park', color: '#8fb8ff', pitch: 340,
    skin: '#f0c9a0', skinShade: '#c99a70', hair: '#1a1616', hairHighlight: '#3d3642', hairStreak: '#9a9aa6',
    top: '#223455', topDetail: '#31497a', bottom: '#2b2b33', shoes: '#1b1b1b', sole: '#0e0e12',
    build: 'average', shorter: 5, hairStyle: 'bob', topStyle: 'blazer', shoeStyle: 'loafer',
    accessories: ['lanyard'], accent: '#c8553d', glasses: 'rect', shirt: '#e8e8f0', fidget: 'glasses',
  },
  jun: {
    name: 'Jun', color: '#ff9f80', pitch: 440,
    skin: '#f1c9a5', skinShade: '#d19f78', hair: '#2a1f1a', hairHighlight: '#4a3a30',
    top: '#c0392b', topDetail: '#f1e3d3', bottom: '#2c3e50', shoes: '#222228', sole: '#e9e6dc',
    build: 'slim', shorter: 2, hairStyle: 'short', topStyle: 'tee', print: 'stripes', shoeStyle: 'sneaker', cuffs: true,
    accessories: ['beanie'], accent: '#3d6b6b', fidget: 'beat',
  },
  sam: {
    name: 'Sam', color: '#80e0ff', pitch: 560,
    skin: '#e0ac7e', skinShade: '#b98558', hair: '#8b4513', hairHighlight: '#b8692e',
    top: '#1f8fb5', topDetail: '#16697f', bottom: '#333340', shoes: '#c0392b', sole: '#e9e6dc',
    build: 'slim', shorter: 6, hairStyle: 'mop', topStyle: 'hoodie', shoeStyle: 'sneaker',
    accessories: ['backpack'], accent: '#4a4458', glasses: 'round', fidget: 'glance',
  },
};

export const SPEAKER_STYLE = {
  narrator: { name: '', color: '#e8e8f0', pitch: 0 },
  terminal: { name: 'TERMINAL', color: '#7cff7c', pitch: 220 },
  phone: { name: 'PHONE', color: '#ffe08a', pitch: 700 },
  email: { name: 'EMAIL', color: '#8fb8ff', pitch: 260 },
};

const spriteCache = new Map();

// `look` adds to the pose: { disheveled: true } (low stamina), { arms: 'hold' }
// (carrying something in both hands), and the idle-animation fields from
// render/idle.js. Unset, false and zero fields are the resting state, so they
// share one cache entry.
export function characterSprite(who, pose = 'idle', facing = 'right', look = {}) {
  const lookKey = Object.keys(look).filter((field) => look[field]).sort().map((field) => `${field}=${look[field]}`).join(',');
  const key = `${who}:${pose}:${facing}:${lookKey}`;
  if (spriteCache.has(key)) return spriteCache.get(key);
  const member = CAST[who];
  if (!member) throw new Error(`unknown character '${who}'`);
  const face = POSES[pose];
  if (!face) throw new Error(`unknown pose '${pose}' for ${who}`);
  const spec = { ...member, ...face, facing, ...look };
  const sprite = rasterize(humanoid(spec), key);
  spriteCache.set(key, sprite);
  return sprite;
}
