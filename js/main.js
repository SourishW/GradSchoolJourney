// Boot: load the fonts, wire input, run the render loop.

import { STORY } from './story/story_graph.js';
import { ENDINGS } from './story/endings.js';
import { ScenePlayer } from './engine/scene_player.js';
import { GameAudio } from './engine/audio.js';
import { attachInput } from './engine/input.js';
import { BACKGROUNDS } from './backgrounds/index.js';
import { drawCharacters } from './render/characters.js';
import { drawHud } from './render/hud.js';
import { drawDialogueBox, drawCard, drawLessonCard } from './render/dialogue_box.js';
import { drawTitleScreen } from './render/title_screen.js';
import { drawEndingScreen } from './render/ending_screen.js';

// The stage is 768x432 logical pixels. Backgrounds are authored on a
// 384x216 grid and drawn at 2x; sprites are 32x58 drawn at 3x.
const LOGICAL_WIDTH = 768;
const LOGICAL_HEIGHT = 432;
const BACKGROUND_SCALE = 2;
const PIXEL_SCALE = 2; // canvas is 1536x864; CSS scales it to the window

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
ctx.scale(PIXEL_SCALE, PIXEL_SCALE);

const audio = new GameAudio();
const player = new ScenePlayer(STORY, audio);
const DEFAULT_HINT = 'Enter / click: continue · arrows + Enter: choose · M: mute';

attachInput(canvas, LOGICAL_WIDTH, LOGICAL_HEIGHT, {
  onAction(action) {
    audio.unlock();
    if (action === 'advance') player.advance();
    else if (action === 'up') player.moveCursor(-1);
    else if (action === 'down') player.moveCursor(1);
    else if (action === 'mute') {
      const muted = audio.toggleMute();
      document.getElementById('hint').textContent = muted ? 'muted · M to unmute' : DEFAULT_HINT;
    }
  },
  onPointer(point) {
    audio.unlock();
    if (player.mode === 'choice') {
      const index = player.choiceAt(point);
      if (index >= 0) {
        player.cursor = index;
        player.select();
      }
      return;
    }
    player.advance();
  },
  onHover(point) {
    if (player.mode !== 'choice') return;
    const index = player.choiceAt(point);
    if (index >= 0 && index !== player.cursor) {
      player.cursor = index;
      audio.tick();
    }
  },
});

let lastTime = performance.now();

function frame(now) {
  const deltaMs = Math.min(100, now - lastTime);
  lastTime = now;
  player.update(deltaMs);
  render(now);
  requestAnimationFrame(frame);
}

function render(now) {
  ctx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  if (player.mode === 'title') {
    drawTitleScreen(ctx, LOGICAL_WIDTH, LOGICAL_HEIGHT, now, player.endingsSeen().length, ENDINGS.length);
    return;
  }
  if (player.mode === 'card') {
    drawCard(ctx, player, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    return;
  }

  const paintBackground = BACKGROUNDS[player.scene.bg];
  if (!paintBackground) throw new Error(`scene '${player.sceneId}' has unknown bg '${player.scene.bg}'`);
  ctx.save();
  ctx.scale(BACKGROUND_SCALE, BACKGROUND_SCALE);
  paintBackground(ctx, player.resolve(player.scene.bgVariant), now);
  ctx.restore();
  drawCharacters(ctx, player, LOGICAL_WIDTH);
  drawHud(ctx, player);

  if (player.mode === 'ending') {
    drawEndingScreen(ctx, player, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    return;
  }
  drawDialogueBox(ctx, player);
  if (player.mode === 'lesson') drawLessonCard(ctx, player);
}

async function boot() {
  try {
    await Promise.all([
      document.fonts.load('12px "Press Start 2P"'),
      document.fonts.load('20px "VT323"'),
    ]);
  } catch {
    // Offline: the monospace fallbacks are fine.
  }
  requestAnimationFrame(frame);
}

boot();
