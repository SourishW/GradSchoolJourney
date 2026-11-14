// A letter-grid layer with the few drawing primitives the sprite generators
// need. Each cell is one sprite pixel; '.' is transparent. Body parts are
// painted on their own layers, outlined, then stamped onto the sprite, which
// is what draws the line where an arm crosses the torso.

export function createLayer(width, height) {
  const cells = Array.from({ length: height }, () => Array(width).fill('.'));
  const inside = (x, y) => x >= 0 && y >= 0 && x < width && y < height;
  const get = (x, y) => (inside(x, y) ? cells[y][x] : '.');
  const px = (x, y, c) => { if (inside(x, y)) cells[y][x] = c; };
  const fill = (x0, y0, x1, y1, c) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) px(x, y, c);
  };
  const row = (y, x0, x1, c) => fill(x0, y, x1, y, c);

  // Fills between two edges given as keyframes [[y, xLeft, xRight], ...],
  // interpolating linearly between consecutive keys.
  const shape = (keys, c) => {
    for (let index = 0; index < keys.length - 1; index++) {
      const [y0, l0, r0] = keys[index], [y1, l1, r1] = keys[index + 1];
      for (let y = y0; y <= y1; y++) {
        const t = y1 === y0 ? 0 : (y - y0) / (y1 - y0);
        row(y, Math.round(l0 + (l1 - l0) * t), Math.round(r0 + (r1 - r0) * t), c);
      }
    }
  };

  const ellipse = (cx, cy, rx, ry, c) => {
    for (let y = cy - ry; y <= cy + ry; y++) {
      const t = (y - cy) / ry;
      const half = Math.round(rx * Math.sqrt(Math.max(0, 1 - t * t)));
      if (half > 0) row(y, cx - half, cx + half - 1, c);
    }
  };

  // Every integer point on the segment, in order.
  const segment = (x0, y0, x1, y1) => {
    const points = [];
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let step = 0; step <= steps; step++) {
      points.push([Math.round(x0 + ((x1 - x0) * step) / steps), Math.round(y0 + ((y1 - y0) * step) / steps)]);
    }
    return points;
  };
  const line = (x0, y0, x1, y1, c) => { for (const [x, y] of segment(x0, y0, x1, y1)) px(x, y, c); };

  // Recolours `count` pixels at one end of every horizontal run of filled
  // pixels: the cheap way to give any shape a lit side and a shaded side.
  // Only pixels whose letter is in `from` change; `inset` skips the pixels
  // nearest the edge (the outline pass will claim the outermost one).
  const rim = (from, to, side, count = 1, inset = 0) => {
    for (let y = 0; y < height; y++) {
      let x = 0;
      while (x < width) {
        if (cells[y][x] === '.') { x += 1; continue; }
        let end = x;
        while (end + 1 < width && cells[y][end + 1] !== '.') end += 1;
        for (let k = inset; k < inset + count; k++) {
          const target = side === 'left' ? x + k : end - k;
          if (target >= x && target <= end && from.includes(cells[y][target])) cells[y][target] = to;
        }
        x = end + 1;
      }
    }
  };

  const recolor = (x0, y0, x1, y1, from, to) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (from.includes(get(x, y))) px(x, y, to);
  };

  const mirror = () => { for (const cellRow of cells) cellRow.reverse(); };

  const stamp = (layer) => {
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const letter = layer.cells[y][x];
      if (letter !== '.') cells[y][x] = letter;
    }
  };

  return { width, height, cells, get, px, fill, row, shape, ellipse, segment, line, rim, recolor, mirror, stamp, rows: () => cells.map((r) => r.join('')) };
}

// Mirrors edge keyframes about the vertical centre line of a `width` grid.
export const mirrorKeys = (keys, width) => keys.map(([y, left, right]) => [y, width - 1 - right, width - 1 - left]);
