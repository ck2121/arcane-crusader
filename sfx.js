'use strict';
/* ═══════════════════════════════════════════════════════════════════
   Arcane Crusader — Procedural 8-bit Sound Effects (Web Audio API)
   ═══════════════════════════════════════════════════════════════════ */
const SFX = (() => {
  let actx = null, master = null;

  function ctx() {
    if (!actx) {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      master = actx.createGain();
      master.gain.value = 0.30;
      master.connect(actx.destination);
    }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }

  /* ── primitives ─────────────────────────────────────────────── */
  function tone(type, f0, f1, t0, dur, vol) {
    const a = ctx();
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t0);
    if (f1 !== f0) o.frequency.linearRampToValueAtTime(f1, t0 + dur);
    g.gain.setValueAtTime(vol, t0);
    g.gain.linearRampToValueAtTime(0, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.01);
  }

  function burst(t0, dur, vol) {            // white-noise burst
    const a = ctx();
    const n = Math.ceil(a.sampleRate * dur);
    const buf = a.createBuffer(1, n, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = a.createBufferSource();
    src.buffer = buf;
    const g = a.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.linearRampToValueAtTime(0, t0 + dur);
    src.connect(g); g.connect(master);
    src.start(t0);
  }

  /* ── public sound effects ───────────────────────────────────── */
  return {

    // Coin: bright two-note chirp (high square wave, quick ascent)
    coin() {
      const a = ctx(), t = a.currentTime;
      tone('square', 880,  1320, t,        0.05, 0.28);
      tone('square', 1320, 1760, t + 0.055, 0.07, 0.20);
    },

    // Bomb pickup: deep thunk + short metallic ping
    bomb() {
      const a = ctx(), t = a.currentTime;
      tone('triangle', 180, 80,  t,       0.14, 0.40);
      tone('square',   440, 360, t + 0.03, 0.09, 0.18);
    },

    // Chest open: triumphant 4-note ascending fanfare
    chest() {
      const a = ctx(), t = a.currentTime;
      const notes = [523, 659, 784, 1047];
      notes.forEach((f, i) => tone('square', f, f, t + i * 0.09, 0.12, 0.28));
      tone('square', 1047, 1047, t + 0.36, 0.20, 0.24);
    },

    // Spell cast: magical whoosh (dual sine descend + slight noise)
    spell() {
      const a = ctx(), t = a.currentTime;
      tone('sine', 1200, 600, t,       0.14, 0.22);
      tone('sine', 1800, 900, t + 0.02, 0.14, 0.12);
      burst(t, 0.04, 0.06);
    },

    // Spell hits enemy: sharp crunch (noise + pitch drop)
    spellHit() {
      const a = ctx(), t = a.currentTime;
      burst(t, 0.05, 0.30);
      tone('sawtooth', 400, 100, t + 0.01, 0.10, 0.22);
    },

    // Player damaged: harsh buzz (sawtooth drop + noise slap)
    damage() {
      const a = ctx(), t = a.currentTime;
      tone('sawtooth', 280, 90, t,       0.16, 0.38);
      burst(t, 0.06, 0.18);
    },

    // Boss defeated: triumphant 6-note rising fanfare
    bossDefeat() {
      const a = ctx(), t = a.currentTime;
      const mel = [523, 659, 784, 1047, 1319, 1568];
      mel.forEach((f, i) => tone('square', f, f, t + i * 0.10, 0.18, 0.28));
      tone('square', 1568, 1568, t + mel.length * 0.10, 0.40, 0.22);
    },

    // Lava / spike contact: sizzle (noise) + low rumble drop
    lavaSpike() {
      const a = ctx(), t = a.currentTime;
      burst(t, 0.08, 0.40);
      tone('sawtooth', 220, 55, t + 0.01, 0.14, 0.32);
    },

  };
})();
