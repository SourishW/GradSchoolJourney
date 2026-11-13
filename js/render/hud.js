// Stat bars in the top-left corner plus floating "+2 CONN" toasts.

import { STAT_LABELS, STAT_MAX } from '../engine/stats.js';

const LEFT = 12;
const TOP = 12;
const LABEL_WIDTH = 92;
const BAR_WIDTH = 100;
const BAR_HEIGHT = 10;
const ROW_HEIGHT = 20;
const FONT = '19px "VT323", "Courier New", monospace';

export function drawHud(ctx, player) {
  const { stats } = player.state;
  ctx.save();
  ctx.font = FONT;
  ctx.textBaseline = 'top';

  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(LEFT - 6, TOP - 6, LABEL_WIDTH + BAR_WIDTH + 12, ROW_HEIGHT * STAT_LABELS.length + 6);

  STAT_LABELS.forEach(({ key, label, color }, index) => {
    const y = TOP + index * ROW_HEIGHT;
    ctx.fillStyle = '#d8d8e8';
    ctx.fillText(label, LEFT, y + 1);
    ctx.fillStyle = '#2a2a38';
    ctx.fillRect(LEFT + LABEL_WIDTH, y, BAR_WIDTH, BAR_HEIGHT);
    ctx.fillStyle = color;
    ctx.fillRect(LEFT + LABEL_WIDTH, y, Math.round((stats[key] / STAT_MAX) * BAR_WIDTH), BAR_HEIGHT);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(LEFT + LABEL_WIDTH, y, Math.round((stats[key] / STAT_MAX) * BAR_WIDTH), 2);
  });

  player.toasts.forEach((toast, index) => {
    const style = STAT_LABELS.find((entry) => entry.key === toast.key);
    ctx.globalAlpha = Math.max(0, 1 - toast.age / 1800);
    ctx.fillStyle = style.color;
    const sign = toast.delta > 0 ? '+' : '';
    ctx.fillText(`${sign}${toast.delta} ${style.label}`, LEFT + LABEL_WIDTH + BAR_WIDTH + 14, TOP + index * ROW_HEIGHT - toast.age / 250);
  });
  ctx.restore();
}
