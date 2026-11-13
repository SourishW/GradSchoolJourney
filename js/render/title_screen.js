// Night sky, title, and a blinking prompt. Amara stands in the middle.

import { characterSprite } from '../sprites/cast.js';
import { SPRITE_WIDTH, SPRITE_HEIGHT } from '../sprites/humanoid.js';
import { SPRITE_SCALE, FLOOR_Y } from './characters.js';

const STARS = Array.from({ length: 120 }, (_, index) => ({
  x: (index * 97) % 768,
  y: (index * 53) % 250,
  phase: index % 5,
  size: index % 7 === 0 ? 2 : 1,
}));

export function drawTitleScreen(ctx, width, height, timeMs, endingsSeen, endingCount) {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#060616');
  sky.addColorStop(1, '#1b1b40');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#e8e8ff';
  for (const star of STARS) {
    if (Math.floor(timeMs / 500 + star.phase) % 7 === 0) continue;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  }

  ctx.fillStyle = '#2a2a50';
  ctx.fillRect(0, FLOOR_Y, width, height - FLOOR_Y);
  ctx.fillStyle = '#3a3a66';
  ctx.fillRect(0, FLOOR_Y, width, 3);

  ctx.imageSmoothingEnabled = false;
  const sprite = characterSprite('amara', 'glad', 'right');
  ctx.drawImage(
    sprite,
    width / 2 - (SPRITE_WIDTH * SPRITE_SCALE) / 2,
    FLOOR_Y - SPRITE_HEIGHT * SPRITE_SCALE,
    SPRITE_WIDTH * SPRITE_SCALE,
    SPRITE_HEIGHT * SPRITE_SCALE,
  );

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = '30px "Press Start 2P", monospace';
  ctx.fillStyle = '#f2c94c';
  ctx.fillText('AMARA', width / 2, 34);
  ctx.font = '12px "Press Start 2P", monospace';
  ctx.fillStyle = '#d0d0e8';
  ctx.fillText('A Grad School Story', width / 2, 76);

  ctx.font = '24px "VT323", "Courier New", monospace';
  if (Math.floor(timeMs / 600) % 2 === 0) {
    ctx.fillStyle = '#f8f8ff';
    ctx.fillText('press Enter or click to begin', width / 2, FLOOR_Y + 36);
  }
  ctx.font = '18px "VT323", "Courier New", monospace';
  ctx.fillStyle = '#8888a8';
  ctx.fillText(`endings found: ${endingsSeen}/${endingCount}`, width / 2, height - 36);
  ctx.textAlign = 'left';
}
