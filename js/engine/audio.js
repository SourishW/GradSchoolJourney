// Tiny WebAudio synth: one soft voice blip per spoken word, a tick for menu
// moves, and a short chord for endings. The context is created on the first user
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

  // One blip per word as the typewriter reaches it; `wordIndex` alternates a
  // little pitch wobble so a sentence does not sound like a metronome.
  word(pitch, wordIndex) {
    if (!this.context || this.muted || pitch <= 0) return;
    const VOICE_PITCH_SCALE = 0.6; // speaker pitches were tuned for a square wave; sine sits lower
    const wobble = 1 + (wordIndex % 2 === 0 ? 0.03 : -0.04);
    this.tone(pitch * VOICE_PITCH_SCALE * wobble, 0.1, 'sine', 0.07, 900);
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
