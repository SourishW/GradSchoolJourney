// Draws the visible cast for the current scene. `x` in a cast entry is the
// character's foot centre in logical pixels; everyone stands on FLOOR_Y.

import { characterSprite, CAST } from '../sprites/cast.js';
import { PROPS } from '../sprites/props.js';
import { SPRITE_WIDTH, SPRITE_HEIGHT } from '../sprites/humanoid.js';
import { rasterize } from '../sprites/pixel_sprite.js';
import { LOW_STAMINA } from '../engine/stats.js';
import { idleMotion } from './idle.js';

// 64x116 sprite -> 96x174 on the 768x432 stage. The canvas itself is twice
// that, so one sprite pixel is exactly 3x3 device pixels.
export const SPRITE_SCALE = 1.5;
export const FLOOR_Y = 292;

const propCache = new Map();

function propSprite(name) {
  if (!propCache.has(name)) propCache.set(name, rasterize(PROPS[name], name));
  return propCache.get(name);
}

// Amara's resting face follows the Happiness bar; everyone else's 'idle' is
// the soft default smile.
const GLAD_HAPPINESS = 7;
const LOW_HAPPINESS = 2;

export function moodPose(who, pose, stats) {
  if (who !== 'amara' || pose !== 'idle') return pose;
  if (stats.happiness >= GLAD_HAPPINESS) return 'glad';
  if (stats.happiness <= LOW_HAPPINESS) return 'low';
  return 'idle';
}

// Low stamina shows: flyaway hair, eye bags, hoodie askew.
export function lookFor(who, stats) {
  return who === 'amara' && stats.stamina < LOW_STAMINA ? { disheveled: true } : {};
}

// When each character took up their current pose, so that one-shot reactions
// (the startle jump) play once from that moment. A new scene counts as a new
// pose.
const poseStart = new Map();

function poseAge(who, pose, sceneId, timeMs) {
  const key = `${sceneId}:${pose}`;
  const entry = poseStart.get(who);
  if (!entry || entry.key !== key) {
    poseStart.set(who, { key, at: timeMs });
    return 0;
  }
  return timeMs - entry.at;
}

// `timeMs` drives the idle animations; null draws everyone at rest.
export function drawCharacters(ctx, player, logicalWidth, timeMs = null) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  const { stats } = player.state;
  for (const member of player.castVisible) {
    const facing = member.x < logicalWidth / 2 ? 'right' : 'left';
    const pose = moodPose(member.who, player.poses[member.who] ?? 'idle', stats);
    const propName = player.props[member.who];
    const prop = propName ? PROPS[propName] : null;
    const motion = idleMotion(member.who, pose, timeMs, timeMs === null ? 0 : poseAge(member.who, pose, player.sceneId, timeMs));
    const look = { ...lookFor(member.who, stats), ...motion.look, ...(prop?.arms ? { arms: prop.arms } : {}) };
    const sprite = characterSprite(member.who, pose, facing, look);
    const restLeft = Math.round(member.x - (SPRITE_WIDTH * SPRITE_SCALE) / 2);
    const restTop = FLOOR_Y - SPRITE_HEIGHT * SPRITE_SCALE;
    // Sprites are built facing right, so sideways motion flips with them.
    const left = restLeft + (facing === 'left' ? -motion.dx : motion.dx) * SPRITE_SCALE;
    const top = restTop + motion.dy * SPRITE_SCALE;
    ctx.drawImage(sprite, left, top, SPRITE_WIDTH * SPRITE_SCALE, SPRITE_HEIGHT * SPRITE_SCALE);

    if (prop) {
      const image = propSprite(propName);
      const drop = prop.followsBody ? CAST[member.who].shorter ?? 0 : 0;
      // Something carried moves with its carrier; something standing does not.
      const [propLeft, propTop] = prop.followsBody ? [left, top] : [restLeft, restTop];
      ctx.drawImage(
        image,
        propLeft + prop.offset.x * SPRITE_SCALE,
        propTop + (prop.offset.y + drop) * SPRITE_SCALE,
        image.width * SPRITE_SCALE,
        image.height * SPRITE_SCALE,
      );
    }
  }
  ctx.restore();
}
