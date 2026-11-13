// Amara's studio: bed, desk with laptop, a window that knows the time of day,
// and the violin case that gathers dust on the lonely path.

export function drawApartment(ctx, variant, timeMs) {
  const night = variant !== 'day';
  ctx.fillStyle = night ? '#3a2f3a' : '#6b5660';
  ctx.fillRect(0, 0, 384, 118);
  ctx.fillStyle = night ? '#4a3a30' : '#7a5c42';
  ctx.fillRect(0, 118, 384, 98);
  ctx.fillStyle = night ? '#5a4838' : '#8e6b4e';
  for (let x = 0; x < 384; x += 32) ctx.fillRect(x, 118, 1, 98);

  // Window.
  ctx.fillStyle = '#2a2420';
  ctx.fillRect(252, 24, 80, 62);
  if (night) {
    const sky = ctx.createLinearGradient(0, 28, 0, 82);
    sky.addColorStop(0, '#07071c');
    sky.addColorStop(1, '#1d1d4a');
    ctx.fillStyle = sky;
    ctx.fillRect(256, 28, 72, 54);
    ctx.fillStyle = '#f0f0ff';
    for (let index = 0; index < 12; index++) {
      if (Math.floor(timeMs / 700 + index) % 6 === 0) continue;
      ctx.fillRect(260 + (index * 29) % 64, 32 + (index * 17) % 44, 1, 1);
    }
    ctx.fillStyle = '#f2e9c4';
    ctx.fillRect(310, 36, 8, 8);
  } else {
    ctx.fillStyle = '#9fd3ff';
    ctx.fillRect(256, 28, 72, 54);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(262, 40, 18, 5);
    ctx.fillRect(290, 52, 24, 5);
  }
  ctx.fillStyle = '#2a2420';
  ctx.fillRect(291, 28, 2, 54);
  ctx.fillRect(256, 54, 72, 2);

  // Bed.
  ctx.fillStyle = '#5a3a2a';
  ctx.fillRect(14, 96, 104, 50);
  ctx.fillStyle = '#7b4fa0';
  ctx.fillRect(18, 104, 96, 32);
  ctx.fillStyle = '#9b6fc0';
  ctx.fillRect(18, 104, 96, 6);
  ctx.fillStyle = '#f4f0e8';
  ctx.fillRect(22, 98, 26, 10);

  // Desk with laptop.
  ctx.fillStyle = '#6b4a30';
  ctx.fillRect(160, 100, 70, 6);
  ctx.fillStyle = '#4a3220';
  ctx.fillRect(164, 106, 4, 40);
  ctx.fillRect(222, 106, 4, 40);
  ctx.fillStyle = '#2a2a33';
  ctx.fillRect(178, 84, 32, 17);
  ctx.fillStyle = night ? '#6fb1ff' : '#a8dcff';
  ctx.fillRect(180, 86, 28, 13);
  ctx.fillStyle = '#2a2a33';
  ctx.fillRect(176, 101, 36, 2);

  // Poster.
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(130, 30, 30, 40);
  ctx.fillStyle = '#f2c94c';
  ctx.fillRect(136, 38, 18, 4);
  ctx.fillRect(136, 48, 12, 4);
  ctx.fillRect(136, 58, 18, 4);

  // Violin case in the corner.
  ctx.fillStyle = '#3b2a1a';
  ctx.fillRect(348, 92, 14, 54);
  ctx.fillStyle = '#5a3f28';
  ctx.fillRect(351, 96, 8, 46);
  if (variant === 'dusty') {
    ctx.fillStyle = 'rgba(200,200,200,0.35)';
    ctx.fillRect(348, 92, 14, 6);
  }
}
