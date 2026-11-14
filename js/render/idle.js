// What a character does while standing on stage: a pure function of who they
// are, the pose they are in and the clock. Nothing here draws; the result is
// handed to the sprite generator (`look`) and to the renderer (`dx`, `dy`).
//
// The pose's mood (POSES[pose].mood) picks the animation:
//   normal   breathing, blinking, and the character's own fidget
//   happy    a small double hop now and then; loose hair and scarves swing wide
//   sad      head hung, slow sighs, slow blinks, everything else still
//   excited  one startle jump and a tremble when the pose begins, then wide-eyed stillness
//   tense    a fixed stare with an occasional shudder of anger
//   playing  the violin: the bow goes back and forth
//
// `look` fields (all optional; see sprites/humanoid.js):
//   blink, gaze: 'away', headDrop (px), sway (-2..2), gesture, tearFrame,
//   bowStroke
// `dx`, `dy` move the whole sprite, in sprite pixels.

import { CAST } from '../sprites/cast.js';
import { POSES } from '../sprites/humanoid.js';

const REST = Object.freeze({ look: Object.freeze({}), dx: 0, dy: 0 });

// True while `t` is inside the window [start, start + length) of a repeating
// `period`. Every timeline below is built from these windows.
const during = (t, period, start, length) => { const at = t % period; return at >= start && at < start + length; };

const swing = (t, reach, period) => Math.round(reach * Math.sin((2 * Math.PI * t) / period));

// Two quick hops, then a rest.
function hop(t) {
  const at = t % 2800;
  for (const start of [0, 330]) {
    if (at >= start && at < start + 110) return -2;
    if (at >= start + 110 && at < start + 200) return -1;
  }
  return 0;
}

// What each character does in a normal mood. Each fidget adds to `motion`.
const FIDGETS = {
  // Loose hair drifts a little.
  sway(motion, t) {
    motion.look.sway = swing(t, 1, 2600);
  },
  // Rocks up onto her toes while her braid and scarf swing.
  rock(motion, t) {
    motion.look.sway = swing(t, 1, 2600);
    if (during(t, 3200, 0, 700)) motion.dy = -1;
  },
  // Raises his wrist and looks down at his watch.
  watch(motion, t) {
    if (!during(t, 9000, 5200, 1600)) return;
    motion.look.gesture = 'watch';
    motion.look.headDrop = 1;
    motion.look.blink = false;
  },
  // Pushes her glasses back up.
  glasses(motion, t) {
    if (during(t, 10000, 6000, 800)) motion.look.gesture = 'glasses';
  },
  // Nods along to a beat only they can hear, in bursts.
  beat(motion, t) {
    if (during(t, 7000, 0, 4200)) motion.look.headDrop = during(t, 560, 0, 200) ? 1 : 0;
  },
  // Glances off to the side and back; cannot quite stand still.
  glance(motion, t) {
    if (during(t, 6500, 3000, 1100)) motion.look.gaze = 'away';
    if (during(t, 2400, 0, 160)) motion.dy = -1;
  },
  // A slow double nod: listening.
  nod(motion, t) {
    if (during(t, 5200, 0, 320) || during(t, 5200, 620, 320)) motion.look.headDrop = 1;
  },
};

// Characters with something loose enough to swing.
const sways = (member) => member.fidget === 'sway' || member.fidget === 'rock';

const MOODS = {
  normal(motion, t, member) {
    motion.look.blink = during(t, 4100, 300, 130);
    if (during(t, 3400, 2000, 900)) motion.look.headDrop = 1;          // breathing out
    FIDGETS[member.fidget]?.(motion, t);
  },
  happy(motion, t, member) {
    motion.look.blink = during(t, 4100, 300, 130);
    motion.dy = hop(t);
    if (sways(member)) motion.look.sway = swing(t, 2, 1800);
  },
  sad(motion, t, member, pose) {
    motion.look.blink = during(t, 5600, 300, 220);
    motion.look.headDrop = during(t, 5200, 0, 1100) ? 2 : 1;           // a sigh
    if (pose.tears) {
      motion.look.tearFrame = Math.floor(t / 450) % 2;
      if (during(t, 2300, 0, 90) || during(t, 2300, 180, 90)) motion.dy = -1;  // a sob
    }
  },
  // A reaction, not a loop: it plays once from the moment the pose begins.
  excited(motion, t, member, pose, age) {
    if (age < 120) motion.dy = -3;
    else if (age < 200) motion.dy = -1;
    else if (age < 620) motion.dx = Math.floor(age / 70) % 2 ? 1 : -1;
    else motion.look.blink = during(t, 5600, 300, 130);
  },
  tense(motion, t) {
    const at = t % 2600;
    if (at < 280) motion.dx = Math.floor(at / 70) % 2 ? 1 : -1;
  },
  playing(motion, t, member) {
    motion.look.bowStroke = Math.floor(t / 420) % 2;
    if (sways(member)) motion.look.sway = swing(t, 1, 1680);
  },
};

// A fixed per-character offset, so nobody blinks or hops in step.
const phases = new Map();
function phaseOf(who) {
  if (!phases.has(who)) {
    let hash = 0;
    for (const letter of who) hash = (hash * 31 + letter.charCodeAt(0)) % 9973;
    phases.set(who, hash);
  }
  return phases.get(who);
}

// `timeMs` is the frame clock; pass null for the resting frame (no motion).
// `poseAgeMs` is how long the character has held this pose; one-shot
// reactions play from it. Left out, the pose counts as long held.
export function idleMotion(who, poseName, timeMs, poseAgeMs = Infinity) {
  if (timeMs === null || timeMs === undefined) return REST;
  const member = CAST[who], pose = POSES[poseName];
  const animate = MOODS[pose?.mood];
  if (!member || !animate) return REST;
  const motion = { look: {}, dx: 0, dy: 0 };
  animate(motion, timeMs + phaseOf(who), member, pose, poseAgeMs);
  return motion;
}
