// Every character in the game: palette plus display name and text-blip pitch.
// Poses are rasterized lazily and cached per (character, pose, facing, look).

import { humanoid, POSES } from './humanoid.js';
import { rasterize } from './pixel_sprite.js';

const GOWN = { top: '#1c1c28', topDetail: '#3a3a52', bottom: '#1c1c28', topStyle: 'hoodie' };

export const CAST = {
  amara: {
    name: 'Amara', color: '#c9a7ff', pitch: 520,
    skin: '#f3cfa9', skinShade: '#d9a97f', hair: '#6b4226', hairHighlight: '#9a6a3c',
    top: '#f4a261', topDetail: '#d9843f', bottom: '#2f4b7c', shoes: '#1d1d24', // light orange hoodie
    hairStyle: 'down', topStyle: 'hoodie',
  },
  daniel: {
    name: 'Daniel', color: '#7fd1a8', pitch: 360,
    skin: '#5a3420', skinShade: '#3e2214', hair: '#120f0d', hairHighlight: '#2a2320',
    top: '#2f9e63', topDetail: '#1f7a4a', bottom: '#3a3a44', shoes: '#3b2a1a',
    hairStyle: 'curly', topStyle: 'tee',
  },
  clara: {
    name: 'Clara', color: '#f4a261', pitch: 480,
    skin: '#c99a6e', skinShade: '#a07448', hair: '#3b2418', hairHighlight: '#6b4a34',
    top: '#2a9d8f', topDetail: '#1f776d', bottom: '#4a4a58', shoes: '#222228',
    hairStyle: 'bob', topStyle: 'sweater',
  },
  priya: {
    name: 'Priya', color: '#ffd166', pitch: 600,
    skin: '#b07a4a', skinShade: '#86592f', hair: '#1a1414', hairHighlight: '#3a2a2a',
    top: '#e9b949', topDetail: '#c99a2c', bottom: '#4a3a5e', shoes: '#222228',
    hairStyle: 'long', topStyle: 'sweater',
  },
  park: {
    name: 'Dr. Park', color: '#8fb8ff', pitch: 340,
    skin: '#f0c9a0', skinShade: '#c99a70', hair: '#1a1616', hairHighlight: '#8a8a94',
    top: '#223455', topDetail: '#e8e8f0', bottom: '#2b2b33', shoes: '#1b1b1b',
    hairStyle: 'bob', topStyle: 'blazer',
  },
  jun: {
    name: 'Jun', color: '#ff9f80', pitch: 440,
    skin: '#f1c9a5', skinShade: '#d19f78', hair: '#2a1f1a', hairHighlight: '#4a3a30',
    top: '#c0392b', topDetail: '#8e2b20', bottom: '#2c3e50', shoes: '#222228',
    hairStyle: 'short', topStyle: 'tee',
  },
  sam: {
    name: 'Sam', color: '#80e0ff', pitch: 560,
    skin: '#e0ac7e', skinShade: '#b98558', hair: '#8b4513', hairHighlight: '#a65a2a',
    top: '#1f8fb5', topDetail: '#16697f', bottom: '#333340', shoes: '#222228',
    hairStyle: 'curly', topStyle: 'hoodie', glasses: true,
  },
};

export const SPEAKER_STYLE = {
  narrator: { name: '', color: '#e8e8f0', pitch: 0 },
  terminal: { name: 'TERMINAL', color: '#7cff7c', pitch: 220 },
  phone: { name: 'PHONE', color: '#ffe08a', pitch: 700 },
  email: { name: 'EMAIL', color: '#8fb8ff', pitch: 260 },
};

const spriteCache = new Map();

// `look` is {} or { disheveled: true } (low stamina).
export function characterSprite(who, pose = 'idle', facing = 'right', look = {}) {
  const key = `${who}:${pose}:${facing}:${look.disheveled ? 'disheveled' : 'neat'}`;
  if (spriteCache.has(key)) return spriteCache.get(key);
  const member = CAST[who];
  if (!member) throw new Error(`unknown character '${who}'`);
  const face = POSES[pose];
  if (!face) throw new Error(`unknown pose '${pose}' for ${who}`);
  const spec = { ...member, ...face, facing, ...look, ...(face.gown ? GOWN : {}) };
  const sprite = rasterize(humanoid(spec), key);
  spriteCache.set(key, sprite);
  return sprite;
}
