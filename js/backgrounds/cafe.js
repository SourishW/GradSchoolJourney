// The cafe on Fourth: brick wall, hanging lamps, a counter, a chalkboard menu.

export function drawCafe(ctx) {
  // Brick wall.
  ctx.fillStyle = '#6b3a2a';
  ctx.fillRect(0, 0, 384, 120);
  ctx.fillStyle = '#7d4634';
  for (let row = 0; row < 15; row++) {
    const offset = row % 2 === 0 ? 0 : 12;
    for (let x = -12; x < 384; x += 24) ctx.fillRect(x + offset, row * 8, 22, 6);
  }
  // Floor.
  ctx.fillStyle = '#3f2a1e';
  ctx.fillRect(0, 120, 384, 96);
  ctx.fillStyle = '#4e3626';
  for (let x = 0; x < 384; x += 24) ctx.fillRect(x, 120, 12, 96);

  // Hanging lamps with glow.
  for (const lampX of [70, 190, 310]) {
    ctx.fillStyle = '#15141c';
    ctx.fillRect(lampX, 0, 1, 26);
    ctx.fillStyle = '#2a2a33';
    ctx.fillRect(lampX - 7, 26, 15, 7);
    const glow = ctx.createRadialGradient(lampX, 36, 2, lampX, 36, 40);
    glow.addColorStop(0, 'rgba(255,214,120,0.55)');
    glow.addColorStop(1, 'rgba(255,214,120,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(lampX - 40, 30, 80, 60);
    ctx.fillStyle = '#ffd678';
    ctx.fillRect(lampX - 3, 33, 7, 3);
  }

  // Chalkboard menu.
  ctx.fillStyle = '#1d2a22';
  ctx.fillRect(28, 36, 70, 44);
  ctx.strokeStyle = '#8b5a2b';
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 36, 70, 44);
  ctx.fillStyle = '#e8e8d0';
  ctx.fillRect(34, 44, 30, 2);
  ctx.fillRect(34, 52, 44, 2);
  ctx.fillRect(34, 60, 36, 2);
  ctx.fillRect(34, 68, 48, 2);

  // Counter with espresso machine.
  ctx.fillStyle = '#4a3222';
  ctx.fillRect(260, 92, 110, 54);
  ctx.fillStyle = '#6b4a30';
  ctx.fillRect(260, 92, 110, 6);
  ctx.fillStyle = '#9aa0ad';
  ctx.fillRect(300, 70, 40, 22);
  ctx.fillStyle = '#5c6270';
  ctx.fillRect(304, 74, 32, 8);
  ctx.fillStyle = '#ff5c5c';
  ctx.fillRect(306, 86, 3, 3);
  ctx.fillStyle = '#f4f0e8';
  ctx.fillRect(270, 86, 8, 6);
  ctx.fillRect(282, 86, 8, 6);

  // Small table with two cups.
  ctx.fillStyle = '#5a3f28';
  ctx.fillRect(150, 110, 50, 5);
  ctx.fillRect(172, 115, 6, 31);
  ctx.fillStyle = '#f4f0e8';
  ctx.fillRect(158, 104, 8, 6);
  ctx.fillRect(184, 104, 8, 6);
}
