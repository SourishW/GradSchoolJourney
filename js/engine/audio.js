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

  // A soft tone: a short attack so it never clicks, a low-pass filter to
  // round off the edges, then an exponential decay.
  tone(frequency, durationSeconds, type = 'triangle', gain = 0.05, cutoffHz = 1400) {
    if (!this.context || this.muted) return;
    const now = this.context.currentTime;
    const ATTACK_SECONDS = 0.012;
    const oscillator = this.context.createOscillator();
    const filter = this.context.createBiquadFilter();
    const amp = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    filter.type = 'lowpass';
    filter.frequency.value = cutoffHz;
    amp.gain.setValueAtTime(0.0001, now);
    amp.gain.exponentialRampToValueAtTime(gain, now + ATTACK_SECONDS);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);
    oscillator.connect(filter).connect(amp).connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + durationSeconds);
  }

  // One burst per line, the same length no matter how long the line is:
  // a handful of blips with a little pitch wobble so it reads as a voice.
  speak(pitch) {
    if (!this.context || this.muted || pitch <= 0) return;
    const BLIPS = 5;
    const SPACING_SECONDS = 0.07;
    const VOICE_PITCH_SCALE = 0.6; // speaker pitches were tuned for a square wave; sine sits lower
    for (let index = 0; index < BLIPS; index++) {
      const wobble = 1 + (index % 2 === 0 ? 0.03 : -0.04);
      setTimeout(() => this.tone(pitch * VOICE_PITCH_SCALE * wobble, 0.11, 'sine', 0.07, 900), index * SPACING_SECONDS * 1000);
    }
  }

  tick() {
    this.tone(660, 0.05, 'sine', 0.05, 1200);
  }

  confirm() {
    this.tone(520, 0.12, 'sine', 0.06, 1200);
  }

  chord() {
    [392, 494, 587, 784].forEach((frequency, index) => {
      setTimeout(() => this.tone(frequency, 0.6, 'triangle', 0.05), index * 90);
    });
  }
}
