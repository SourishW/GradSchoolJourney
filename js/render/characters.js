// Draws the visible cast for the current scene. `x` in a cast entry is the
// character's foot centre in logical pixels; everyone stands on FLOOR_Y.

import { characterSprite } from '../sprites/cast.js';
import { PROPS } from '../sprites/props.js';
import { SPRITE_WIDTH, SPRITE_HEIGHT } from '../sprites/humanoid.js';
import { rasterize } from '../sprites/pixel_sprite.js';
import { LOW_STAMINA } from '../engine/stats.js';

export const SPRITE_SCALE = 3; // 32x58 sprite -> 96x174 on the 768x432 stage
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

export function drawCharacters(ctx, player, logicalWidth) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  const { stats } = player.state;
  for (const member of player.castVisible) {
    const facing = member.x < logicalWidth / 2 ? 'right' : 'left';
    const pose = moodPose(member.who, player.poses[member.who] ?? 'idle', stats);
    const sprite = characterSprite(member.who, pose, facing, lookFor(member.who, stats));
    const left = Math.round(member.x - (SPRITE_WIDTH * SPRITE_SCALE) / 2);
    const top = FLOOR_Y - SPRITE_HEIGHT * SPRITE_SCALE;
    ctx.drawImage(sprite, left, top, SPRITE_WIDTH * SPRITE_SCALE, SPRITE_HEIGHT * SPRITE_SCALE);

    const propName = pose === 'violin' ? 'violin' : player.props[member.who];
    if (propName) {
      const prop = propSprite(propName);
      const { offset } = PROPS[propName];
      ctx.drawImage(
        prop,
        left + offset.x * SPRITE_SCALE,
        top + offset.y * SPRITE_SCALE,
        prop.width * SPRITE_SCALE,
        prop.height * SPRITE_SCALE,
      );
    }
  }
  ctx.restore();
}
