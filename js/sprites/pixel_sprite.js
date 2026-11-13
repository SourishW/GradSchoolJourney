// Turns a letter grid into a 1:1 offscreen canvas. Each character in a row is
// one pixel; '.' is transparent; every other letter must exist in `colors`.

export function assertGrid(rows, name = 'sprite') {
  if (!Array.isArray(rows) || rows.length === 0) throw new Error(`${name}: empty grid`);
  const width = rows[0].length;
  rows.forEach((row, y) => {
    if (row.length !== width) {
      throw new Error(`${name}: row ${y} has width ${row.length}, expected ${width}`);
    }
  });
  return { width, height: rows.length };
}

export function rasterize({ rows, colors }, name = 'sprite') {
  const { width, height } = assertGrid(rows, name);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const letter = rows[y][x];
      if (letter === '.') continue;
      const color = colors[letter];
      if (!color) throw new Error(`${name}: no color for letter '${letter}' at (${x},${y})`);
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvas;
}
