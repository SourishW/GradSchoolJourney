// The graduation ending card: ending title, a few lines, and the lesson count.

import { wrapText } from '../engine/text_layout.js';
import { LESSON_COUNT } from '../story/lessons.js';

export function drawEndingScreen(ctx, player, width, height) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.84)';
  ctx.fillRect(0, 0, width, height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  const { ending } = player;
  ctx.font = '22px "Press Start 2P", monospace';
  ctx.fillStyle = '#f2c94c';
  ctx.fillText(ending.title, width / 2, 56);

  ctx.font = '24px "VT323", "Courier New", monospace';
  ctx.fillStyle = '#e8e8f0';
  let y = 118;
  for (const paragraph of ending.lines) {
    for (const line of wrapText(ctx, paragraph, width - 160)) {
      ctx.fillText(line, width / 2, y);
      y += 28;
    }
    y += 14;
  }

  ctx.font = '18px "VT323", "Courier New", monospace';
  ctx.fillStyle = '#8888a8';
  ctx.fillText(`lessons learned: ${player.state.lessons.length}/${LESSON_COUNT}`, width / 2, height - 64);
  if (Math.floor(performance.now() / 600) % 2 === 0) {
    ctx.fillStyle = '#d0d0e8';
    ctx.fillText('press Enter to play again and find another path', width / 2, height - 38);
  }
  ctx.restore();
}
