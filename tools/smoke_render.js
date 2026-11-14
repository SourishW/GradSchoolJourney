// Drives the real ScenePlayer and every renderer through random play-throughs
// against a stub 2D canvas, in Node:  node tools/smoke_render.js
// Catches runtime errors in render code that the graph checker cannot see.

function stubContext() {
  const noop = () => {};
  return new Proxy(
    {
      measureText: (text) => ({ width: text.length * 8 }),
      createLinearGradient: () => ({ addColorStop: noop }),
      createRadialGradient: () => ({ addColorStop: noop }),
      getImageData: () => ({ data: new Uint8ClampedArray(4) }),
    },
    { get: (target, key) => (key in target ? target[key] : noop), set: () => true },
  );
}

globalThis.document = {
  createElement: () => ({ width: 0, height: 0, getContext: stubContext }),
  getElementById: () => ({ textContent: '' }),
};
globalThis.window = { addEventListener: () => {} };
globalThis.localStorage = { getItem: () => null, setItem: () => {} };
globalThis.performance = { now: () => Date.now() };
globalThis.setTimeout = (fn) => fn();

const { STORY } = await import('../js/story/story_graph.js');
const { ENDINGS } = await import('../js/story/endings.js');
const { ScenePlayer } = await import('../js/engine/scene_player.js');
const { BACKGROUNDS } = await import('../js/backgrounds/index.js');
const { drawCharacters } = await import('../js/render/characters.js');
const { drawHud } = await import('../js/render/hud.js');
const { drawDialogueBox, drawCard, drawLessonCard } = await import('../js/render/dialogue_box.js');
const { drawTitleScreen } = await import('../js/render/title_screen.js');
const { drawEndingScreen } = await import('../js/render/ending_screen.js');

const audio = { word() {}, tick() {}, confirm() {}, chord() {} };
const ctx = stubContext();

function renderFrame(player, now) {
  if (player.mode === 'title') return drawTitleScreen(ctx, 384, 216, now, 0, ENDINGS.length);
  if (player.mode === 'card') return drawCard(ctx, player, 384, 216);
  BACKGROUNDS[player.scene.bg](ctx, player.resolve(player.scene.bgVariant), now);
  drawCharacters(ctx, player, 384);
  drawHud(ctx, player);
  if (player.mode === 'ending') return drawEndingScreen(ctx, player, 384, 216);
  drawDialogueBox(ctx, player);
  if (player.mode === 'lesson') drawLessonCard(ctx, player);
}

let seed = 777;
const random = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

const RUNS = 300;
let frames = 0;
const endingsHit = new Set();
for (let run = 0; run < RUNS; run++) {
  const player = new ScenePlayer(STORY, audio);
  for (let step = 0; step < 2000; step++) {
    player.update(40);
    renderFrame(player, step * 40);
    frames += 1;
    if (player.mode === 'ending') { endingsHit.add(player.ending.id); break; }
    if (player.mode === 'choice') {
      player.cursor = Math.floor(random() * player.choices.length);
      player.select();
    } else if (player.mode !== 'text' || player.typingDone) {
      player.advance();
    } else if (random() < 0.3) {
      player.advance(); // skip typing
    }
  }
  if (player.mode !== 'ending') throw new Error(`run ${run} stuck at '${player.sceneId}' mode ${player.mode}`);
}
console.log(`runs: ${RUNS}, frames rendered: ${frames}, endings hit: ${[...endingsHit].sort().join(', ')}`);
console.log('OK');
