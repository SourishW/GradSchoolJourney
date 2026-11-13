// Where the string band plays: a bar's back room for rehearsal, the same room
// with curtains lit and a crowd murmur of string lights for the concert.

export function drawStage(ctx, variant, timeMs) {
  const concert = variant === 'concert';
  ctx.fillStyle = concert ? '#241236' : '#3e2a48';
  ctx.fillRect(0, 0, 384, 120);
  // Wooden stage floor.
  ctx.fillStyle = '#9a6a3a';
  ctx.fillRect(0, 120, 384, 96);
  ctx.fillStyle = '#b07e48';
  for (let x = 0; x < 384; x += 20) ctx.fillRect(x, 120, 10, 96);
  ctx.fillStyle = '#4a3220';
  ctx.fillRect(0, 120, 384, 2);

  // Curtains.
  ctx.fillStyle = concert ? '#c0263a' : '#8e2a3e';
  ctx.fillRect(0, 0, 44, 125);
  ctx.fillRect(340, 0, 44, 125);
  ctx.fillStyle = concert ? '#d83a4e' : '#a43a4e';
  for (let x = 4; x < 44; x += 10) { ctx.fillRect(x, 0, 3, 125); ctx.fillRect(340 + x, 0, 3, 125); }

  if (concert) {
    const spot = ctx.createRadialGradient(192, 60, 10, 192, 60, 150);
    spot.addColorStop(0, 'rgba(255,230,180,0.35)');
    spot.addColorStop(1, 'rgba(255,230,180,0)');
    ctx.fillStyle = spot;
    ctx.fillRect(44, 0, 296, 125);
  }

  // String lights across the back wall.
  ctx.strokeStyle = '#3a3a44';
  ctx.beginPath();
  ctx.moveTo(44, 20);
  ctx.quadraticCurveTo(192, 44, 340, 20);
  ctx.stroke();
  for (let index = 0; index < 13; index++) {
    const t = index / 12;
    const x = 44 + t * 296;
    const y = 20 + 4 * t * (1 - t) * 24 + 2;
    const on = Math.floor(timeMs / 350 + index) % 4 !== 0;
    ctx.fillStyle = on ? '#ffd678' : '#5a4a2a';
    ctx.fillRect(x - 1, y, 3, 3);
  }

  // Music stands.
  for (const standX of [120, 260]) {
    ctx.fillStyle = '#15141c';
    ctx.fillRect(standX, 110, 2, 36);
    ctx.fillRect(standX - 10, 100, 22, 14);
    ctx.fillStyle = '#f4f0e8';
    ctx.fillRect(standX - 8, 102, 18, 10);
    ctx.fillStyle = '#15141c';
    ctx.fillRect(standX - 6, 105, 10, 1);
    ctx.fillRect(standX - 6, 108, 14, 1);
  }

  // Amp and a stool.
  ctx.fillStyle = '#1b1b22';
  ctx.fillRect(300, 106, 26, 20);
  ctx.fillStyle = '#3a3a44';
  ctx.fillRect(304, 110, 18, 12);
  ctx.fillStyle = '#52f58a';
  ctx.fillRect(320, 108, 2, 2);
}
