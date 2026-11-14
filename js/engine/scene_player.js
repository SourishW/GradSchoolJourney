// Walks the story graph. Holds all mutable game state: stats, flags, the
// current scene, typewriter progress, menu cursor, and stat-change toasts.
//
// Scene schema (see js/story/*.js):
//   type:     'title' | 'card' | 'dialogue' (default) | 'ending'
//   text:     card text, string or fn(state)
//   bg:       background key; bgVariant: string or fn(state)
//   cast:     [{ who, x, pose?, prop?, when? }]
//   lines:    [{ who, text, pose?, prop?, effects?, set?, when? }]
//   choices:  [{ text, effects?, set?, next, when? }]
//   next:     scene id or fn(state) -> id
//   enter:    { effects?, set? } applied when the scene starts

import { createStats, applyEffects } from './stats.js';
import { CAST, SPEAKER_STYLE } from '../sprites/cast.js';
import { computeEnding } from '../story/endings.js';
import { LESSONS } from '../story/lessons.js';

const CHARS_PER_SECOND = 45;
const TOAST_LIFETIME_MS = 1800;
const ENDINGS_STORAGE_KEY = 'amara-endings-seen';

export class ScenePlayer {
  constructor(story, audio) {
    this.story = story;
    this.audio = audio;
    this.toasts = [];
    this.choiceRects = [];
    this.start();
  }

  start() {
    this.state = { stats: createStats(), flags: {}, lessons: [] };
    this.poses = {};
    this.props = {};
    this.ending = null;
    this.goto('title');
  }

  resolve(value) {
    return typeof value === 'function' ? value(this.state) : value;
  }

  goto(id) {
    const scene = this.story[id];
    if (!scene) throw new Error(`no scene '${id}' (from '${this.sceneId}')`);
    this.sceneId = id;
    this.scene = scene;
    this.cursor = 0;
    this.lineIndex = -1;
    this.lessonShown = false;
    this.lines = (scene.lines ?? []).filter((line) => !line.when || line.when(this.state));
    this.castVisible = (scene.cast ?? []).filter((member) => !member.when || member.when(this.state));
    for (const member of this.castVisible) {
      this.poses[member.who] = member.pose ?? 'idle';
      this.props[member.who] = member.prop ?? null;
    }
    if (scene.enter) this.applyChange(scene.enter);

    const type = scene.type ?? 'dialogue';
    if (type === 'title' || type === 'card') {
      this.mode = type;
      return;
    }
    if (type === 'ending') {
      this.mode = 'ending';
      this.ending = computeEnding(this.state.flags);
      this.rememberEnding(this.ending.id);
      this.audio.chord();
      return;
    }
    this.advanceLine();
  }

  applyChange({ effects, set }) {
    if (effects) {
      for (const { key, delta } of applyEffects(this.state.stats, effects)) {
        this.toasts.push({ key, delta, age: 0 });
      }
    }
    if (set) Object.assign(this.state.flags, set);
  }

  advanceLine() {
    this.lineIndex += 1;
    if (this.lineIndex >= this.lines.length) {
      if (this.scene.lesson && !this.lessonShown) {
        if (!LESSONS[this.scene.lesson]) throw new Error(`scene '${this.sceneId}': unknown lesson '${this.scene.lesson}'`);
        this.lessonShown = true;
        if (!this.state.lessons.includes(this.scene.lesson)) this.state.lessons.push(this.scene.lesson);
        this.lesson = LESSONS[this.scene.lesson];
        this.mode = 'lesson';
        this.audio.confirm();
        return;
      }
      const choices = (this.scene.choices ?? []).filter((choice) => !choice.when || choice.when(this.state));
      if (choices.length > 0) {
        this.choices = choices;
        this.mode = 'choice';
        this.cursor = 0;
        return;
      }
      this.goto(this.resolve(this.scene.next));
      return;
    }
    const line = { ...this.lines[this.lineIndex] };
    line.who = this.resolve(line.who);
    this.currentLine = line;
    this.fullText = this.resolve(line.text);
    this.shownChars = 0;
    this.typingDone = false;
    this.mode = 'text';
    this.wordsSpoken = 0;
    if (line.pose) this.poses[line.who] = line.pose;
    if (line.prop !== undefined) this.props[line.who] = line.prop;
    this.applyChange(line);
  }

  speakerStyle(who) {
    return CAST[who] ?? SPEAKER_STYLE[who] ?? SPEAKER_STYLE.narrator;
  }

  update(deltaMs) {
    if (this.mode === 'text' && !this.typingDone) {
      const before = Math.floor(this.shownChars);
      this.shownChars = Math.min(this.fullText.length, this.shownChars + (deltaMs / 1000) * CHARS_PER_SECOND);
      const after = Math.floor(this.shownChars);
      // A word starts at a non-space character that follows a space (or the start).
      for (let index = before; index < after; index++) {
        const letter = this.fullText[index];
        if (letter !== ' ' && (index === 0 || this.fullText[index - 1] === ' ')) {
          this.audio.word(this.speakerStyle(this.currentLine.who).pitch, this.wordsSpoken);
          this.wordsSpoken += 1;
          break; // at most one blip per frame
        }
      }
      if (this.shownChars >= this.fullText.length) this.typingDone = true;
    }
    for (const toast of this.toasts) toast.age += deltaMs;
    this.toasts = this.toasts.filter((toast) => toast.age < TOAST_LIFETIME_MS);
  }

  get shownText() {
    return this.fullText.slice(0, Math.floor(this.shownChars));
  }

  // --- input -------------------------------------------------------------

  advance() {
    switch (this.mode) {
      case 'title':
      case 'card':
        this.audio.confirm();
        this.goto(this.resolve(this.scene.next));
        break;
      case 'text':
        if (!this.typingDone) {
          this.shownChars = this.fullText.length;
          this.typingDone = true;
        } else {
          this.advanceLine();
        }
        break;
      case 'choice':
        this.select();
        break;
      case 'lesson':
        this.advanceLine();
        break;
      case 'ending':
        this.audio.confirm();
        this.start();
        break;
      default:
        break;
    }
  }

  moveCursor(delta) {
    if (this.mode !== 'choice') return;
    const count = this.choices.length;
    this.cursor = (this.cursor + delta + count) % count;
    this.audio.tick();
  }

  select() {
    if (this.mode !== 'choice') return;
    const choice = this.choices[this.cursor];
    this.audio.confirm();
    this.applyChange(choice);
    this.goto(this.resolve(choice.next));
  }

  choiceAt(point) {
    const index = this.choiceRects.findIndex(
      (rect) => point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h,
    );
    return index;
  }

  // --- endings tracker ---------------------------------------------------

  rememberEnding(id) {
    try {
      const seen = new Set(JSON.parse(localStorage.getItem(ENDINGS_STORAGE_KEY) ?? '[]'));
      seen.add(id);
      localStorage.setItem(ENDINGS_STORAGE_KEY, JSON.stringify([...seen]));
    } catch {
      // Private mode or blocked storage: the tracker is a convenience only.
    }
  }

  endingsSeen() {
    try {
      return JSON.parse(localStorage.getItem(ENDINGS_STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }
}
