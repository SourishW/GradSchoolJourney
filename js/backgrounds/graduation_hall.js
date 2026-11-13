// The graduation hall: banner, podium, a far-away audience, falling confetti.

const CONFETTI_COLORS = ['#f2c94c', '#ff5c5c', '#7fd1a8', '#8fb8ff', '#c9a7ff'];

export function drawGraduationHall(ctx, variant, timeMs) {
  ctx.fillStyle = '#3250a8';
  ctx.fillRect(0, 0, 384, 120);
  ctx.fillStyle = '#a06a3e';
  ctx.fillRect(0, 120, 384, 96);
  ctx.fillStyle = '#b87c4c';
  for (let x = 0; x < 384; x += 24) ctx.fillRect(x, 120, 12, 96);

  // Banner.
  ctx.fillStyle = '#8e1b2a';
  ctx.fillRect(92, 14, 200, 26);
  ctx.fillStyle = '#6a1420';
  ctx.fillRect(92, 40, 200, 3);
  ctx.fillStyle = '#f2c94c';
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'center';
  ctx.fillText('CONGRATULATIONS', 192, 23);
  ctx.textAlign = 'left';

  // Far audience: rows of heads behind the stage edge.
  for (let row = 0; row < 3; row++) {
    for (let seat = 0; seat < 20; seat++) {
      const x = 14 + seat * 18 + (row % 2) * 9;
      const y = 72 + row * 12;
      ctx.fillStyle = ['#4a2a18', '#c68642', '#f1c9a5', '#6b3e26', '#b07a4a'][(seat + row) % 5];
      ctx.fillRect(x, y, 5, 5);
      ctx.fillStyle = ['#223455', '#2f9e63', '#8e44ad', '#c0392b', '#e9b949'][(seat * 3 + row) % 5];
      ctx.fillRect(x - 1, y + 5, 7, 6);
    }
  }
  ctx.fillStyle = '#15141c';
  ctx.fillRect(0, 108, 384, 12);

  // Podium.
  ctx.fillStyle = '#3a2618';
  ctx.fillRect(176, 100, 32, 46);
  ctx.fillStyle = '#5a3f28';
  ctx.fillRect(172, 96, 40, 6);
  ctx.fillStyle = '#f2c94c';
  ctx.fillRect(188, 112, 8, 8);

  // Confetti.
  for (let index = 0; index < 28; index++) {
    const speed = 18 + (index % 5) * 6;
    const y = ((timeMs / 1000) * speed + index * 37) % 150;
    const x = (index * 61 + Math.sin(timeMs / 600 + index) * 6) % 384;
    ctx.fillStyle = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
    ctx.fillRect(x, y, 2, 3);
  }
}
