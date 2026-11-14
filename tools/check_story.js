// Static + simulated checks on the story graph and sprite grids. Runs in Node
// with no DOM:  node tools/check_story.js
//
//  1. every scene id referenced by `next` exists
//  2. every speaker, pose, prop and background referenced exists
//  3. every character x pose x facing rasterizes to a valid grid, and so
//     does every frame of every idle animation
//  4. random walks from the title always reach the ending, and all endings
//     are reachable

import { STORY } from '../js/story/story_graph.js';
import { ENDINGS, computeEnding } from '../js/story/endings.js';
import { LESSONS } from '../js/story/lessons.js';
import { CAST, SPEAKER_STYLE } from '../js/sprites/cast.js';
import { humanoid, POSES } from '../js/sprites/humanoid.js';
import { PROPS } from '../js/sprites/props.js';
import { assertGrid } from '../js/sprites/pixel_sprite.js';
import { BACKGROUNDS } from '../js/backgrounds/index.js';
import { createStats, applyEffects } from '../js/engine/stats.js';
import { idleMotion } from '../js/render/idle.js';

const problems = [];
const note = (message) => problems.push(message);

// --- 1 & 2: static references ---------------------------------------------

for (const [id, scene] of Object.entries(STORY)) {
  const type = scene.type ?? 'dialogue';
  if (typeof scene.next === 'string' && !STORY[scene.next]) note(`${id}: next -> missing '${scene.next}'`);
  for (const choice of scene.choices ?? []) {
    if (typeof choice.next === 'string' && !STORY[choice.next]) note(`${id}: choice -> missing '${choice.next}'`);
  }
  if (scene.lesson && !LESSONS[scene.lesson]) note(`${id}: unknown lesson '${scene.lesson}'`);
  if (type === 'dialogue') {
    if (!BACKGROUNDS[scene.bg]) note(`${id}: unknown bg '${scene.bg}'`);
    for (const member of scene.cast ?? []) {
      if (!CAST[member.who]) note(`${id}: unknown cast member '${member.who}'`);
      if (member.pose && !POSES[member.pose]) note(`${id}: unknown pose '${member.pose}'`);
      if (member.prop && !PROPS[member.prop]) note(`${id}: unknown prop '${member.prop}'`);
    }
    for (const line of scene.lines ?? []) {
      const who = typeof line.who === 'function' ? 'daniel' : line.who;
      if (!CAST[who] && !SPEAKER_STYLE[who]) note(`${id}: unknown speaker '${who}'`);
      if (line.pose && !POSES[line.pose]) note(`${id}: unknown pose '${line.pose}'`);
    }
    if (!scene.next && !(scene.choices ?? []).length) note(`${id}: dead end (no next, no choices)`);
  }
}

// --- 3: sprites ------------------------------------------------------------

let spriteCount = 0;
for (const [who, member] of Object.entries(CAST)) {
  for (const [poseName, face] of Object.entries(POSES)) {
    for (const facing of ['left', 'right']) {
      const sprite = humanoid({ ...member, ...face, facing });
      assertGrid(sprite.rows, `${who}:${poseName}:${facing}`);
      for (const row of sprite.rows) {
        for (const letter of row) {
          if (letter !== '.' && !sprite.colors[letter]) note(`${who}:${poseName}: no color for '${letter}'`);
        }
      }
      spriteCount += 1;
    }
  }
}
// Every distinct frame the idle animations can ask for, sampled over a span
// longer than any of their cycles. `arms: 'hold'` is checked too because a
// character can be carrying something while animating.
const IDLE_SWEEP_MS = 30000, IDLE_STEP_MS = 30;
let idleFrameCount = 0;
for (const [who, member] of Object.entries(CAST)) {
  for (const [poseName, face] of Object.entries(POSES)) {
    const seen = new Set();
    for (let time = 0; time < IDLE_SWEEP_MS; time += IDLE_STEP_MS) {
      const { look, dx, dy } = idleMotion(who, poseName, time, time);
      if (!Number.isInteger(dx) || !Number.isInteger(dy)) note(`${who}:${poseName}: idle offset is not whole pixels at ${time}ms`);
      const key = JSON.stringify(look);
      if (seen.has(key)) continue;
      seen.add(key);
      for (const extra of [{}, { arms: 'hold' }]) {
        try {
          const sprite = humanoid({ ...member, ...face, facing: 'right', ...look, ...extra });
          assertGrid(sprite.rows, `${who}:${poseName}:idle`);
          for (const row of sprite.rows) for (const letter of row) {
            if (letter !== '.' && !sprite.colors[letter]) note(`${who}:${poseName}: idle frame ${key} has no color for '${letter}'`);
          }
        } catch (error) {
          note(`${who}:${poseName}: idle frame ${key} failed: ${error.message}`);
        }
      }
      idleFrameCount += 1;
    }
  }
}
for (const [name, prop] of Object.entries(PROPS)) {
  assertGrid(prop.rows, name);
  for (const row of prop.rows) for (const letter of row) {
    if (letter !== '.' && !prop.colors[letter]) note(`prop ${name}: no color for '${letter}'`);
  }
}

// --- 4: random walks -------------------------------------------------------

function simulate(randomChoice) {
  const state = { stats: createStats(), flags: {}, lessons: new Set() };
  const apply = (change) => {
    if (change.effects) applyEffects(state.stats, change.effects);
    if (change.set) Object.assign(state.flags, change.set);
  };
  const resolve = (value) => (typeof value === 'function' ? value(state) : value);
  let id = 'title';
  const visited = [];
  for (let step = 0; step < 400; step++) {
    const scene = STORY[id];
    if (!scene) throw new Error(`walk hit missing scene '${id}' after ${visited.join(' > ')}`);
    visited.push(id);
    if (scene.enter) apply(scene.enter);
    if ((scene.type ?? 'dialogue') === 'ending') {
      return { ending: computeEnding(state.flags), steps: step, visited, stats: state.stats, lessons: state.lessons };
    }
    if (scene.lesson) state.lessons.add(scene.lesson);
    for (const line of (scene.lines ?? []).filter((line) => !line.when || line.when(state))) {
      resolve(line.text);
      apply(line);
    }
    const choices = (scene.choices ?? []).filter((choice) => !choice.when || choice.when(state));
    if (choices.length > 0) {
      const choice = choices[Math.floor(randomChoice() * choices.length)];
      resolve(choice.text);
      apply(choice);
      id = resolve(choice.next);
    } else {
      if (scene.next === undefined) throw new Error(`'${id}' has no choices and no next`);
      id = resolve(scene.next);
    }
  }
  throw new Error(`walk did not finish: ${visited.slice(-10).join(' > ')}`);
}

const RUNS = 2000;
const endingCounts = Object.fromEntries(ENDINGS.map((ending) => [ending.id, 0]));
const sceneVisits = Object.fromEntries(Object.keys(STORY).map((id) => [id, 0]));
let seed = 12345;
const random = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};
let walksMissingLessons = 0;
const missingExamples = new Set();
for (let run = 0; run < RUNS; run++) {
  const result = simulate(random);
  endingCounts[result.ending.id] += 1;
  const missing = Object.keys(LESSONS).filter((lesson) => !result.lessons.has(lesson));
  if (missing.length) { walksMissingLessons += 1; missing.forEach((lesson) => missingExamples.add(`${lesson} (ending ${result.ending.id})`)); }
  for (const id of new Set(result.visited)) sceneVisits[id] += 1;
}
for (const [id, count] of Object.entries(endingCounts)) {
  if (count === 0) note(`ending '${id}' never reached in ${RUNS} random walks`);
}
for (const [id, count] of Object.entries(sceneVisits)) {
  if (count === 0) note(`scene '${id}' never visited in ${RUNS} random walks`);
}

// --- report ----------------------------------------------------------------

console.log(`scenes: ${Object.keys(STORY).length}`);
console.log(`sprites rasterized: ${spriteCount}, idle frames: ${idleFrameCount}, props: ${Object.keys(PROPS).length}`);
console.log(`random walks: ${RUNS}, all reached the ending`);
console.log('ending distribution:', endingCounts);
console.log(`lessons: ${Object.keys(LESSONS).length}; walks missing a lesson: ${walksMissingLessons}`);
if (walksMissingLessons) note(`lessons not taught on some paths: ${[...missingExamples].join(', ')}`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log('OK');
