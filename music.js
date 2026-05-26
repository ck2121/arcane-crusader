'use strict';
/* ═══════════════════════════════════════════════════════════════════
   Arcane Crusader — 8-bit Fantasy Music Engine (Web Audio API)
   Track 1 : Burning Village  (D major, 150 BPM — heroic march)
   Track 2 : Dark Castle      (D minor, 105 BPM — ominous dread)
   Track 3 : Dragon's Lair   (E minor, 168 BPM — epic battle)
   ═══════════════════════════════════════════════════════════════════ */
const MusicEngine = (() => {
  let actx = null, masterGain = null;
  let oscs = [], loopTimer = null;
  let cur = 0, playing = false;

  /* ── Note frequency table ──────────────────────────────────────── */
  const N = {
    R:0,
    C3:130.81,D3:146.83,Eb3:155.56,E3:164.81,F3:174.61,Fs3:185.00,
    G3:196.00,Ab3:207.65,A3:220.00,Bb3:233.08,B3:246.94,
    C4:261.63,Cs4:277.18,D4:293.66,Eb4:311.13,E4:329.63,F4:349.23,
    Fs4:369.99,G4:392.00,Ab4:415.30,A4:440.00,Bb4:466.16,B4:493.88,
    C5:523.25,Cs5:554.37,D5:587.33,Eb5:622.25,E5:659.25,F5:698.46,
    Fs5:739.99,G5:783.99,A5:880.00,
  };

  /* ── Three chiptune tracks ─────────────────────────────────────── */
  /* mel / bas arrays: each entry = [frequency, beats (quarter=1)]   */
  const TRACKS = {

    /* ── 1: Burning Village — D major heroic march, 150 BPM ──────── */
    1: {
      bpm: 150,
      mel: [
        [N.D4, 1],[N.Fs4,.5],[N.A4,.5],[N.D5,1.5],[N.A4,.5],
        [N.Fs4,.5],[N.G4,.5],[N.A4,.5],[N.B4,.5],[N.A4,.5],[N.G4,.5],
        [N.Fs4, 1],[N.E4,.5],[N.D4,.5],[N.E4,.5],[N.Fs4,.5],[N.G4,.5],[N.A4,.5],
        [N.D5, 1],[N.A4,.5],[N.G4,.5],[N.Fs4,.5],[N.E4,.5],[N.D4,1.5],
        [N.A4, 1],[N.B4,.5],[N.A4,.5],[N.G4, 1],[N.Fs4,.5],[N.E4,.5],
        [N.D4,.5],[N.E4,.5],[N.Fs4,.5],[N.G4,.5],[N.A4, 2],
        [N.B4,.5],[N.A4,.5],[N.G4,.5],[N.Fs4,.5],[N.E4,.5],[N.D4,.5],[N.E4,.5],[N.Fs4,.5],
        [N.D4, 2],[N.R, 2],
      ],
      bas: [
        [N.D3, 2],[N.A3, 2],[N.G3, 2],[N.D3, 2],
        [N.A3, 2],[N.E3, 2],[N.G3, 1],[N.A3, 1],[N.D3, 2],
      ],
    },

    /* ── 2: Dark Castle — D natural minor, ominous, 105 BPM ──────── */
    2: {
      bpm: 105,
      mel: [
        [N.D4,1.5],[N.F4,.5],[N.A4,.5],[N.C5,.5],[N.A4, 1],
        [N.Bb4,.5],[N.A4,.5],[N.G4,.5],[N.F4,.5],[N.Eb4,1.5],
        [N.D4, 1],[N.C4,.5],[N.D4,.5],[N.F4,.5],[N.Ab4,.5],[N.G4,1.5],
        [N.F4,.5],[N.Eb4,.5],[N.D4,.5],[N.C4,.5],[N.D4, 2],
        [N.A4, 1],[N.C5,.5],[N.Bb4,.5],[N.A4,1.5],[N.G4,.5],
        [N.F4,.5],[N.G4,.5],[N.A4,.5],[N.Bb4,.5],[N.A4,.5],[N.G4,.5],[N.F4, 1],
        [N.Eb4,.5],[N.D4,.5],[N.C4,.5],[N.D4,.5],[N.Eb4,.5],[N.F4,.5],[N.G4, 1],
        [N.A4,.5],[N.G4,.5],[N.F4,.5],[N.Eb4,.5],[N.D4, 2],
      ],
      bas: [
        [N.D3, 2],[N.C3, 2],[N.Bb3, 2],[N.A3, 2],
        [N.G3, 2],[N.F3, 2],[N.Eb3, 2],[N.D3, 2],
      ],
    },

    /* ── 3: Dragon's Lair — E minor, epic battle, 168 BPM ────────── */
    3: {
      bpm: 168,
      mel: [
        [N.E4,.5],[N.G4,.5],[N.B4,.5],[N.E5,.5],[N.D5,.5],[N.B4,.5],[N.G4, 1],
        [N.Fs4,.5],[N.A4,.5],[N.C5,.5],[N.D5,.5],[N.C5,.5],[N.A4,.5],[N.Fs4, 1],
        [N.G4,.5],[N.B4,.5],[N.D5,.5],[N.G5,.5],[N.D5,.5],[N.B4,.5],[N.G4, 1],
        [N.A4,.5],[N.C5,.5],[N.E5,.5],[N.D5,.5],[N.C5,.5],[N.B4,.5],[N.A4, 1],
        [N.E5, 1],[N.D5,.5],[N.C5,.5],[N.B4, 1],[N.A4,.5],[N.G4,.5],
        [N.Fs4,.5],[N.G4,.5],[N.A4,.5],[N.B4,.5],[N.C5, 1],[N.D5, 1],
        [N.E5,.5],[N.D5,.5],[N.C5,.5],[N.B4,.5],[N.A4,.5],[N.G4,.5],[N.Fs4, 1],
        [N.E4,.5],[N.Fs4,.5],[N.G4,.5],[N.A4,.5],[N.B4, 2],
      ],
      bas: [
        [N.E3, 1],[N.E3,.5],[N.Fs3,.5],[N.G3, 1],[N.G3, 1],
        [N.D3, 1],[N.D3,.5],[N.E3,.5],[N.Fs3, 1],[N.Fs3, 1],
        [N.G3, 1],[N.G3,.5],[N.Fs3,.5],[N.E3, 1],[N.E3, 1],
        [N.A3, 1],[N.A3,.5],[N.G3,.5],[N.Fs3, 1],[N.E3, 1],
      ],
    },
  };

  /* ── Audio helpers ─────────────────────────────────────────────── */
  function getCtx() {
    if (!actx) {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = actx.createGain();
      masterGain.gain.value = 0.12;
      masterGain.connect(actx.destination);
    }
    return actx;
  }

  function playNote(freq, t0, dur, type, vol) {
    if (!freq || dur <= 0) return;
    const a = getCtx();
    const osc = a.createOscillator();
    const g   = a.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.01);
    g.gain.setValueAtTime(vol, t0 + Math.max(0.01, dur * 0.75));
    g.gain.linearRampToValueAtTime(0, t0 + dur);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
    oscs.push(osc);
  }

  /* ── Scheduler ─────────────────────────────────────────────────── */
  function schedulePass(id) {
    if (!playing || cur !== id) return;
    const a  = getCtx();
    const tr = TRACKS[id];
    const bd = 60 / tr.bpm;          // seconds per beat
    const t0 = a.currentTime + 0.05;

    // Melody — square wave (chiptune lead)
    let t = t0;
    for (const [f, b] of tr.mel) {
      playNote(f, t, b * bd * 0.88, 'square', 0.18);
      t += b * bd;
    }
    const totalBeats = tr.mel.reduce((s, [, b]) => s + b, 0);
    const totalSec   = totalBeats * bd;

    // Bass — triangle wave; loops to fill melody length
    t = t0;
    let walked = 0;
    loop: while (walked < totalBeats) {
      for (const [f, b] of tr.bas) {
        if (walked >= totalBeats) break loop;
        playNote(f, t, b * bd * 0.80, 'triangle', 0.10);
        t += b * bd;
        walked += b;
      }
    }

    // Re-schedule slightly before this pass ends to avoid silence gaps
    loopTimer = setTimeout(() => schedulePass(id), (totalSec - 0.20) * 1000);
  }

  /* ── Public API ────────────────────────────────────────────────── */
  function start(id) {
    if (!TRACKS[id]) return;
    if (cur === id && playing) return;   // already on this track
    stopNow();
    cur = id; playing = true;
    const a = getCtx();
    const go = () => schedulePass(id);
    if (a.state === 'suspended') a.resume().then(go); else go();
  }

  function stopNow() {
    playing = false;
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    oscs.forEach(o => { try { o.stop(0); } catch(e) {} });
    oscs = [];
  }

  function stop() { stopNow(); cur = 0; }

  return { start, stop };
})();
