// Tiny WebAudio synth: a short fixed-length voice burst per spoken line, a
// tick for menu moves, and a short chord for endings. The context is created on the first user
// gesture because browsers refuse to start audio before one.

export class GameAudio {
  constructor() {
    this.context = null;
    this.muted = false;
  }

  unlock() {
    if (this.context) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    this.context = new Ctx();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  tone(frequency, durationSeconds, type = 'square', gain = 0.04) {
    if (!this.context || this.muted) return;
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const amp = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    amp.gain.setValueAtTime(gain, now);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);
    oscillator.connect(amp).connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + durationSeconds);
  }

  // One burst per line, the same length no matter how long the line is:
  // a handful of blips with a little pitch wobble so it reads as a voice.
  speak(pitch) {
    if (!this.context || this.muted || pitch <= 0) return;
    const BLIPS = 6;
    const SPACING_SECONDS = 0.055;
    for (let index = 0; index < BLIPS; index++) {
      const wobble = 1 + (index % 2 === 0 ? 0.03 : -0.04);
      setTimeout(() => this.tone(pitch * wobble, 0.045), index * SPACING_SECONDS * 1000);
    }
  }

  tick() {
    this.tone(880, 0.03, 'triangle', 0.05);
  }

  confirm() {
    this.tone(660, 0.08, 'triangle', 0.05);
  }

  chord() {
    [392, 494, 587, 784].forEach((frequency, index) => {
      setTimeout(() => this.tone(frequency, 0.6, 'triangle', 0.05), index * 90);
    });
  }
}
