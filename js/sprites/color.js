// Hex colour helpers shared by the sprite generators.

// Blends two hex colours; t = 0 gives `a`, t = 1 gives `b`.
export function mix(a, b, t) {
  const va = parseInt(a.slice(1), 16), vb = parseInt(b.slice(1), 16);
  const channel = (shift) => Math.round(((va >> shift) & 255) * (1 - t) + ((vb >> shift) & 255) * t);
  return `#${[16, 8, 0].map((s) => channel(s).toString(16).padStart(2, '0')).join('')}`;
}

// The shaded side of a surface: darker and nudged toward purple, not grey.
export function shade(hex) {
  return mix(hex, '#1a1028', 0.25);
}
