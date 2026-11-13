// The CS lab: a clean whiteboard with markers and an eraser in the tray,
// desks with glowing monitors, a server rack whose LEDs blink with time.
// Variants: 'night', 'deadline', 'deadline-night'. The deadline variants
// write the countdown on the board.

export function drawLab(ctx, variant = '', timeMs) {
  const night = variant.includes('night');
  const deadline = variant.includes('deadline');
  ctx.fillStyle = night ? '#1c2030' : '#2b3140';
  ctx.fillRect(0, 0, 384, 120);
  ctx.fillStyle = night ? '#2a2e3c' : '#3a3f4f';
  ctx.fillRect(0, 120, 384, 96);
  ctx.fillStyle = night ? '#343848' : '#474c5e';
  ctx.fillRect(0, 120, 384, 2);

  // Ceiling light strips.
  ctx.fillStyle = night ? '#404860' : '#e8eefc';
  ctx.fillRect(40, 6, 90, 3);
  ctx.fillRect(250, 6, 90, 3);

  // Whiteboard: aluminium frame, clean surface, tray with markers + eraser.
  ctx.fillStyle = '#b8bcc8';
  ctx.fillRect(20, 26, 114, 62);
  ctx.fillStyle = night ? '#dfe3ea' : '#f4f6f9';
  ctx.fillRect(22, 28, 110, 56);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(24, 30, 40, 2);
  ctx.fillStyle = '#9ea3b0';
  ctx.fillRect(20, 86, 114, 4);                // tray
  ctx.fillStyle = '#7d828f';
  ctx.fillRect(20, 90, 114, 1);
  const markers = ['#1d1d26', '#2c5fd6', '#d6336c', '#2f9e63'];
  markers.forEach((color, index) => {
    const x = 26 + index * 11;
    ctx.fillStyle = color;
    ctx.fillRect(x, 83, 8, 3);
    ctx.fillStyle = '#e8e8f0';
    ctx.fillRect(x, 83, 2, 3);                 // cap end
  });
  ctx.fillStyle = '#3a3f4f';
  ctx.fillRect(110, 81, 18, 5);                // eraser
  ctx.fillStyle = '#e0c9a0';
  ctx.fillRect(110, 85, 18, 1);
  if (deadline) {
    ctx.fillStyle = '#d6336c';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.textBaseline = 'top';
    ctx.fillText('DEADLINE:', 30, 40);
    ctx.fillText('10 DAYS', 30, 52);
    ctx.fillStyle = '#2c5fd6';
    ctx.fillRect(30, 64, 60, 1);
    ctx.fillRect(30, 70, 44, 1);
  }

  // Desks and monitors.
  for (const deskX of [150, 220, 290]) {
    ctx.fillStyle = '#5b4636';
    ctx.fillRect(deskX, 96, 56, 6);
    ctx.fillStyle = '#4a3729';
    ctx.fillRect(deskX + 4, 102, 4, 20);
    ctx.fillRect(deskX + 48, 102, 4, 20);
    ctx.fillStyle = '#15141c';
    ctx.fillRect(deskX + 14, 72, 30, 22);
    ctx.fillStyle = night ? '#6fb1ff' : '#8fd3ff';
    ctx.fillRect(deskX + 16, 74, 26, 18);
    ctx.fillStyle = '#15141c';
    ctx.fillRect(deskX + 18, 78, 14, 1);
    ctx.fillRect(deskX + 18, 82, 20, 1);
    ctx.fillRect(deskX + 18, 86, 10, 1);
    ctx.fillRect(deskX + 27, 94, 4, 2);
  }

  // Server rack with blinking LEDs.
  ctx.fillStyle = '#1b1d26';
  ctx.fillRect(352, 40, 26, 82);
  ctx.fillStyle = '#2d303d';
  for (let shelf = 0; shelf < 7; shelf++) ctx.fillRect(355, 44 + shelf * 11, 20, 8);
  for (let shelf = 0; shelf < 7; shelf++) {
    const on = Math.floor(timeMs / 180 + shelf * 3) % 5 !== 0;
    ctx.fillStyle = on ? '#52f58a' : '#1a4a2a';
    ctx.fillRect(357, 46 + shelf * 11, 2, 2);
    ctx.fillStyle = Math.floor(timeMs / 420 + shelf) % 3 === 0 ? '#ffb347' : '#5a3a10';
    ctx.fillRect(361, 46 + shelf * 11, 2, 2);
  }
}
