// Dr. Park's office: a wall of books, a heavy desk, a lamp, one diploma.

const BOOK_COLORS = ['#c0392b', '#2f9e63', '#3b5bdb', '#e9b949', '#8e44ad', '#d35400', '#16a085'];

export function drawOffice(ctx) {
  ctx.fillStyle = '#3b3328';
  ctx.fillRect(0, 0, 384, 120);
  ctx.fillStyle = '#5a3f28';
  ctx.fillRect(0, 120, 384, 96);
  ctx.fillStyle = '#6b4a30';
  for (let x = 0; x < 384; x += 28) ctx.fillRect(x, 120, 14, 96);

  // Bookshelves on the left and right.
  for (const shelfX of [16, 300]) {
    ctx.fillStyle = '#2a1e14';
    ctx.fillRect(shelfX, 14, 70, 104);
    for (let shelf = 0; shelf < 4; shelf++) {
      const y = 20 + shelf * 25;
      ctx.fillStyle = '#4a3220';
      ctx.fillRect(shelfX + 2, y + 20, 66, 3);
      let x = shelfX + 4;
      let index = shelf * 3 + (shelfX > 100 ? 2 : 0);
      while (x < shelfX + 64) {
        const width = 4 + (index % 3);
        const height = 14 + (index % 4);
        ctx.fillStyle = BOOK_COLORS[index % BOOK_COLORS.length];
        ctx.fillRect(x, y + 20 - height, width, height);
        x += width + 1;
        index += 1;
      }
    }
  }

  // Diploma.
  ctx.fillStyle = '#1b1b22';
  ctx.fillRect(170, 26, 44, 32);
  ctx.fillStyle = '#f4f0e8';
  ctx.fillRect(173, 29, 38, 26);
  ctx.fillStyle = '#8888a8';
  ctx.fillRect(178, 36, 28, 2);
  ctx.fillRect(182, 42, 20, 2);
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(190, 47, 4, 4);

  // Desk, front and centre, with lamp and papers.
  ctx.fillStyle = '#4a3220';
  ctx.fillRect(130, 104, 124, 8);
  ctx.fillStyle = '#3a2618';
  ctx.fillRect(134, 112, 10, 34);
  ctx.fillRect(240, 112, 10, 34);
  ctx.fillStyle = '#f4f0e8';
  ctx.fillRect(150, 99, 22, 6);
  ctx.fillRect(176, 100, 18, 5);
  ctx.fillStyle = '#15141c';
  ctx.fillRect(224, 80, 2, 24);
  ctx.fillStyle = '#2f9e63';
  ctx.fillRect(216, 76, 18, 6);
  const glow = ctx.createRadialGradient(225, 86, 2, 225, 86, 26);
  glow.addColorStop(0, 'rgba(255,230,160,0.5)');
  glow.addColorStop(1, 'rgba(255,230,160,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(199, 80, 52, 30);
}
