// The three numbers the story reads, each in [0, STAT_MAX]:
//   stamina     sleep and reserves; skipping sleep drains it, and low stamina
//               is what makes the risky deadline options appear
//   happiness   friends, music, rest lift it; isolation drains it
//   stress      overwork, shortcuts and burnout raise it; planning,
//               honesty and help bring it down

export const STAT_MAX = 10;

export const STAT_LABELS = [
  { key: 'stamina',   label: 'Stamina',   color: '#ff6b6b' },
  { key: 'happiness', label: 'Happiness', color: '#f2c94c' },
  { key: 'stress',    label: 'Stress',    color: '#c084fc' },
];

export function createStats() {
  return { stamina: 8, happiness: 5, stress: 3 };
}

export const LOW_STAMINA = 4; // below this she is 'tired' and the risky options appear

// Where Amara's mood shows: on her face (render/characters.js) and in the
// state of her bedroom (backgrounds/apartment.js).
export const GLAD_HAPPINESS = 7; // at or above: she smiles, the room is tidy
export const LOW_HAPPINESS = 2;  // at or below: she droops, the room is a mess
export const TENSE_STRESS = 5;   // at or above: work starts to pile up around the desk
export const HIGH_STRESS = 7;    // at or above: the room is buried, and nothing has been dusted

// Returns the list of {key, delta} actually applied (after clamping) so the
// HUD can show toasts.
export function applyEffects(stats, effects = {}) {
  const applied = [];
  for (const [key, delta] of Object.entries(effects)) {
    if (!(key in stats)) throw new Error(`unknown stat '${key}'`);
    const before = stats[key];
    stats[key] = Math.max(0, Math.min(STAT_MAX, before + delta));
    if (stats[key] !== before) applied.push({ key, delta: stats[key] - before });
  }
  return applied;
}
