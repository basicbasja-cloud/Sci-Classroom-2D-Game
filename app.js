/**
 * Sci-Classroom 2026 - Main Glue Controller (Cooperative Multiplayer)
 * จัดการซิงค์ข้อมูลผู้เล่น (ห้องเรียนหลัก และ จอยนักเรียน) ผ่าน LocalStorage
 * ซิงค์สถานะเฟสเกม, การโหวตท่าต่อสู้, การตอบคำถาม และการคำนวณผลลัพธ์
 */

// ==========================================================================
// 1. Web Audio Synthesizer (ระบบเสียงประกอบ)
// ==========================================================================
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (audioCtx) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (AudioContextClass) {
    audioCtx = new AudioContextClass();
  }
}

const SoundFX = {
  toggle: function(enabled) {
    soundEnabled = enabled;
  },
  playBeep: function(freq = 600, duration = 0.08, type = 'sine') {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn(e);
    }
  },
  playClick: function() {
    this.playBeep(800, 0.06);
  },
  playSlash: function() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.25);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn(e);
    }
  },
  playExplosion: function() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(30, now + 0.6);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(now + 0.6);
    } catch (e) {
      console.warn(e);
    }
  },
  playPlayerDamage: function() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.15);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn(e);
    }
  },
  playChest: function() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.06 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.18);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
    } catch (e) {
      console.warn(e);
    }
  },
  playLevelUp: function() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      const melody = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
      melody.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.0, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.2);
      });
    } catch (e) {
      console.warn(e);
    }
  },
  playGameOver: function() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      const melody = [392.00, 349.23, 311.13, 261.63];
      melody.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.2);
        gain.gain.setValueAtTime(0.0, now + idx * 0.2);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.2 + 0.03);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.2 + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.2 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.2);
        osc.stop(now + idx * 0.2 + 0.4);
      });
    } catch (e) {
      console.warn(e);
    }
  },
  playAlarm: function() {
    this.playBeep(440, 0.4, 'triangle');
  },
  // ======================================================================
  // NEW ERA JRPG: 12 Unique Per-Action Sound Effects
  // Each player skill, boss move, and game event has its own audio signature
  // ======================================================================

  playLaserBeam: function() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);
      gain.gain.setValueAtTime(0.10, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2400, now);
      osc2.frequency.exponentialRampToValueAtTime(600, now + 0.10);
      gain2.gain.setValueAtTime(0.04, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now);
      osc2.stop(now + 0.12);
    } catch (e) { console.warn(e); }
  },

  playEMPBlast: function() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(60, now);
      osc1.frequency.linearRampToValueAtTime(30, now + 0.35);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(400, now + 0.05);
      osc2.frequency.exponentialRampToValueAtTime(1800, now + 0.3);
      gain2.gain.setValueAtTime(0.0, now);
      gain2.gain.linearRampToValueAtTime(0.07, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.38);
    } catch (e) { console.warn(e); }
  },

  playQuantumStorm: function() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      [400, 415, 385].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq * 0.3, now + 0.5);
        gain.gain.setValueAtTime(0.0, now);
        gain.gain.linearRampToValueAtTime(0.06 - idx * 0.01, now + 0.08);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.03);
        osc.stop(now + 0.55);
      });
      const oscH = audioCtx.createOscillator();
      const gainH = audioCtx.createGain();
      oscH.type = 'sine';
      oscH.frequency.setValueAtTime(1800, now + 0.1);
      oscH.frequency.exponentialRampToValueAtTime(2400, now + 0.25);
      oscH.frequency.exponentialRampToValueAtTime(800, now + 0.5);
      gainH.gain.setValueAtTime(0.0, now);
      gainH.gain.linearRampToValueAtTime(0.04, now + 0.15);
      gainH.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      oscH.connect(gainH);
      gainH.connect(audioCtx.destination);
      oscH.start(now + 0.1);
      oscH.stop(now + 0.5);
    } catch (e) { console.warn(e); }
  },

  playNanobotHeal: function() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.06 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
      const oscPad = audioCtx.createOscillator();
      const gainPad = audioCtx.createGain();
      oscPad.type = 'triangle';
      oscPad.frequency.setValueAtTime(261.63, now);
      gainPad.gain.setValueAtTime(0.0, now);
      gainPad.gain.linearRampToValueAtTime(0.05, now + 0.05);
      gainPad.gain.linearRampToValueAtTime(0.03, now + 0.2);
      gainPad.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      oscPad.connect(gainPad);
      gainPad.connect(audioCtx.destination);
      oscPad.start(now);
      oscPad.stop(now + 0.4);
    } catch (e) { console.warn(e); }
  },

  playBossShockwave: function() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.45);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(55, now + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(20, now + 0.5);
      gain2.gain.setValueAtTime(0.0, now);
      gain2.gain.linearRampToValueAtTime(0.10, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.55);
    } catch (e) { console.warn(e); }
  },

  playBossPoisonBeam: function() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2000, now);
      osc.frequency.linearRampToValueAtTime(300, now + 0.4);
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.10, now + 0.03);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(800, now + 0.05);
      osc2.frequency.linearRampToValueAtTime(200, now + 0.35);
      gain2.gain.setValueAtTime(0.0, now);
      gain2.gain.linearRampToValueAtTime(0.05, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.4);
    } catch (e) { console.warn(e); }
  },

  playBossLightningPunch: function() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.18);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(60, now + 0.05);
      osc2.frequency.exponentialRampToValueAtTime(20, now + 0.3);
      gain2.gain.setValueAtTime(0.0, now);
      gain2.gain.linearRampToValueAtTime(0.12, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.35);
    } catch (e) { console.warn(e); }
  },

  playBossDrain: function() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.55);
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.10, now + 0.06);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
      for (let i = 0; i < 3; i++) {
        const oscP = audioCtx.createOscillator();
        const gainP = audioCtx.createGain();
        oscP.type = 'sine';
        oscP.frequency.setValueAtTime(200 - i * 40, now + i * 0.15);
        gainP.gain.setValueAtTime(0.0, now + i * 0.15);
        gainP.gain.linearRampToValueAtTime(0.04, now + i * 0.15 + 0.03);
        gainP.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.15 + 0.12);
        oscP.connect(gainP);
        gainP.connect(audioCtx.destination);
        oscP.start(now + i * 0.15);
        oscP.stop(now + i * 0.15 + 0.15);
      }
    } catch (e) { console.warn(e); }
  },

  playCritHit: function() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.2);
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
      for (let i = 0; i < 4; i++) {
        const oscN = audioCtx.createOscillator();
        const gainN = audioCtx.createGain();
        oscN.type = 'square';
        oscN.frequency.setValueAtTime(200 + Math.random() * 800, now);
        oscN.frequency.exponentialRampToValueAtTime(50, now + 0.08);
        gainN.gain.setValueAtTime(0.0, now);
        gainN.gain.linearRampToValueAtTime(0.06, now + 0.01);
        gainN.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        oscN.connect(gainN);
        gainN.connect(audioCtx.destination);
        oscN.start(now);
        oscN.stop(now + 0.1);
      }
      const oscH = audioCtx.createOscillator();
      const gainH = audioCtx.createGain();
      oscH.type = 'sine';
      oscH.frequency.setValueAtTime(1760, now + 0.05);
      gainH.gain.setValueAtTime(0.0, now);
      gainH.gain.linearRampToValueAtTime(0.06, now + 0.06);
      gainH.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      oscH.connect(gainH);
      gainH.connect(audioCtx.destination);
      oscH.start(now + 0.05);
      oscH.stop(now + 0.2);
    } catch (e) { console.warn(e); }
  },

  playMiss: function() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2000, now + 0.02);
      osc2.frequency.exponentialRampToValueAtTime(500, now + 0.08);
      gain2.gain.setValueAtTime(0.0, now);
      gain2.gain.linearRampToValueAtTime(0.03, now + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.02);
      osc2.stop(now + 0.1);
    } catch (e) { console.warn(e); }
  },

  playComboUp: function(comboLevel) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      const baseFreq = 440 + (comboLevel || 1) * 60;
      const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.07, now + idx * 0.08 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.15);
      });
    } catch (e) { console.warn(e); }
  },

  playVictoryFanfare: function() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      const melody = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1568.00];
      melody.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.10, now + idx * 0.1 + 0.02);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.1 + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.35);
      });
      melody.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 0.75, now + idx * 0.1);
        gain.gain.setValueAtTime(0.0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.3);
      });
    } catch (e) { console.warn(e); }
  },

  playPlayerHurt: function() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) { console.warn(e); }
  }
};
window.SoundFX = SoundFX;

// ==========================================================================
// 2. ระบบนำทางและข้อมูลห้องเรียนคลัง LocalStorage (Co-Op Database)
// ==========================================================================
const DEFAULT_SYSTEM_SETTINGS = {
  activeGrade: "p4", 
  activeSlot: 1,
  timerLimit: 90,    
  hintsEnabled: true, 
  soundEnabled: true  
};

// สเตตัส Node Candy Crush (10 ด่าน)
const DEFAULT_MODULE_STATES = {
  node1: { repaired: false, key: "node1", label: "ด่าน 1: เตาปฏิกรณ์เริ่มต้น", bossName: "หุ่นยนต์ไมโครจิ๋ว", subject: "ฟิสิกส์ & พลังงาน", status: "unlocked" },
  node2: { repaired: false, key: "node2", label: "ด่าน 2: เครื่องกำเนิดไฟฟ้าหลัก", bossName: "หุ่นยนต์ไฟฟ้าเทอร์โบ", subject: "ฟิสิกส์ & ไฟฟ้า", status: "locked" },
  node3: { repaired: false, key: "node3", label: "ด่าน 3: ท่อน้ำกรดรั่วไหล", bossName: "ดรอปเคมีกัดกร่อน", subject: "เคมี & สารละลาย", status: "locked" },
  node4: { repaired: false, key: "node4", label: "ด่าน 4: ห้องแล็บแยกสารเคมี", bossName: "อสุรกายกรดพิษเขียว", subject: "เคมี & ของเหลว", status: "locked" },
  node5: { repaired: false, key: "node5", label: "ด่าน 5: สวนกระจกพฤกษาชั้นนอก", bossName: "เถาหนามมรณะ", subject: "ระบบนิเวศ & พืช", status: "locked" },
  node6: { repaired: false, key: "node6", label: "ด่าน 6: ป่าชื้นมรณะ", bossName: "อสูรพฤกษาเพชฌฆาต", subject: "ระบบนิเวศ & พืช", status: "locked" },
  node7: { repaired: false, key: "node7", label: "ด่าน 7: ตู้เก็บตัวอย่างวัคซีน", bossName: "เซลล์กลายพันธุ์", subject: "เซลล์ & สิ่งมีชีวิต", status: "locked" },
  node8: { repaired: false, key: "node8", label: "ด่าน 8: ศูนย์พันธุวิศวกรรม", bossName: "ไวรัสนาโนกลายพันธุ์", subject: "เซลล์ & พันธุกรรม", status: "locked" },
  node9: { repaired: false, key: "node9", label: "ด่าน 9: จานส่งสัญญาณดาวเทียม", bossName: "อสุรกายขยะอวกาศ", subject: "ดาราศาสตร์ & คลื่น", status: "locked" },
  node10: { repaired: false, key: "node10", label: "ด่าน 10: ห้องบังคับการสะพานยาน", bossName: "โกเลมอุกกาบาตอัคคี", subject: "โลก & ดาราศาสตร์", status: "locked" }
};

const DEFAULT_STUDENT_SCORE = {
  score: 0,
  correct: 0,
  wrong: 0,
  hp: 100,
  maxHp: 100
};

function getActiveGrade() {
  const stored = localStorage.getItem("sci_quest_settings");
  if (stored) {
    try {
      return JSON.parse(stored).activeGrade || "p4";
    } catch (e) {
      return "p4";
    }
  }
  return "p4";
}

function getActiveSlot() {
  const stored = localStorage.getItem("sci_quest_settings");
  if (stored) {
    try {
      return JSON.parse(stored).activeSlot || 1;
    } catch (e) {
      return 1;
    }
  }
  return 1;
}

// Helper: สร้าง localStorage key เฉพาะแต่ละระดับชั้น + ช่องเซฟ (per-grade per-slot save)
function gk(baseKey) {
  const grade = getActiveGrade();
  const slot = getActiveSlot();
  return `${baseKey}_${grade}_slot${slot}`;
}

// ตรวจสอบว่าระดับชั้นนี้มีข้อมูลเซฟในช่องใดช่องหนึ่งหรือไม่
function hasSaveData(grade, slot) {
  if (slot) {
    return hasSaveDataInSlot(grade, slot);
  }
  for (let s = 1; s <= 3; s++) {
    if (hasSaveDataInSlot(grade, s)) return true;
  }
  return false;
}

// ตรวจสอบข้อมูลเซฟในช่องที่ระบุ
function hasSaveDataInSlot(grade, slot) {
  const modulesKey = `sci_quest_modules_${grade}_slot${slot}`;
  const scoreKey = `sci_quest_student_score_${grade}_slot${slot}`;
  try {
    const modules = JSON.parse(localStorage.getItem(modulesKey));
    const score = JSON.parse(localStorage.getItem(scoreKey));
    if (!modules || !score) return false;
    for (let key in modules) {
      if (modules[key].repaired) return true;
    }
    return score.score > 0 || score.correct > 0;
  } catch(e) {
    return false;
  }
}

function initAppData() {
  try {
    if (!localStorage.getItem("sci_quest_settings")) {
      localStorage.setItem("sci_quest_settings", JSON.stringify(DEFAULT_SYSTEM_SETTINGS));
    }
    
    const grades = ["p4", "p5", "p6", "m1", "m2", "m3"];
    const slots = [1, 2, 3];
    grades.forEach(g => {
      slots.forEach(s => {
        const modulesKey = `sci_quest_modules_${g}_slot${s}`;
        const scoreKey = `sci_quest_student_score_${g}_slot${s}`;
        if (!localStorage.getItem(modulesKey)) {
          localStorage.setItem(modulesKey, JSON.stringify(DEFAULT_MODULE_STATES));
        }
        if (!localStorage.getItem(scoreKey)) {
          localStorage.setItem(scoreKey, JSON.stringify(DEFAULT_STUDENT_SCORE));
        }
      });
    });
    
    // คีย์ตัวแปรแชร์ข้อมูลการประสานความร่วมมือ Co-op
    if (!localStorage.getItem("sci_quest_game_phase")) {
      localStorage.setItem("sci_quest_game_phase", "map"); // map, voting, quiz, explanation, victory, gameover
    }
    if (!localStorage.getItem("sci_quest_active_node")) {
      localStorage.setItem("sci_quest_active_node", ""); 
    }
    if (!localStorage.getItem("sci_quest_active_votes")) {
      localStorage.setItem("sci_quest_active_votes", JSON.stringify({})); // { "นักเรียน A": "easy", "นักเรียน B": "medium" }
    }
    if (!localStorage.getItem("sci_quest_student_responses")) {
      localStorage.setItem("sci_quest_student_responses", JSON.stringify({})); // { "นักเรียน A": 0, "นักเรียน B": 2 }
    }
    if (!localStorage.getItem("sci_quest_student_list")) {
      localStorage.setItem("sci_quest_student_list", JSON.stringify([])); // รายชื่อนักเรียนในห้องเรียนจริงที่ลงทะเบียน
    }
    if (!localStorage.getItem("sci_quest_active_move")) {
      localStorage.setItem("sci_quest_active_move", JSON.stringify({ diff: "easy", dmg: 20, type: "attack" }));
    }
  } catch (e) {
    console.warn("localStorage init failed: " + e.message);
  }
}

function getSystemSettings() {
  initAppData();
  return JSON.parse(localStorage.getItem("sci_quest_settings"));
}

function saveSystemSettings(settings) {
  localStorage.setItem("sci_quest_settings", JSON.stringify(settings));
  SoundFX.toggle(settings.soundEnabled);
  window.dispatchEvent(new CustomEvent("settings-changed", { detail: settings }));
}

function getModuleStates() {
  initAppData();
  const grade = getActiveGrade();
  const slot = getActiveSlot();
  const key = `sci_quest_modules_${grade}_slot${slot}`;
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(DEFAULT_MODULE_STATES));
  }
  return JSON.parse(localStorage.getItem(key));
}

function saveModuleStates(states) {
  const grade = getActiveGrade();
  const slot = getActiveSlot();
  const key = `sci_quest_modules_${grade}_slot${slot}`;
  localStorage.setItem(key, JSON.stringify(states));
  window.dispatchEvent(new CustomEvent("modules-changed", { detail: states }));
}

function getStudentScore() {
  initAppData();
  const grade = getActiveGrade();
  const slot = getActiveSlot();
  const key = `sci_quest_student_score_${grade}_slot${slot}`;
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(DEFAULT_STUDENT_SCORE));
  }
  return JSON.parse(localStorage.getItem(key));
}

function saveStudentScore(scoreObj) {
  const grade = getActiveGrade();
  const slot = getActiveSlot();
  const key = `sci_quest_student_score_${grade}_slot${slot}`;
  localStorage.setItem(key, JSON.stringify(scoreObj));
  window.dispatchEvent(new CustomEvent("score-changed", { detail: scoreObj }));
}

// รีเซ็ตเกมห้องเรียน
function resetStudentGame() {
  const grade = getActiveGrade();
  const slot = getActiveSlot();
  const modulesKey = `sci_quest_modules_${grade}_slot${slot}`;
  const scoreKey = `sci_quest_student_score_${grade}_slot${slot}`;
  
  localStorage.setItem(modulesKey, JSON.stringify(DEFAULT_MODULE_STATES));
  localStorage.setItem(scoreKey, JSON.stringify(DEFAULT_STUDENT_SCORE));
  localStorage.setItem("sci_quest_game_phase", "map");
  localStorage.setItem("sci_quest_active_node", "");
  localStorage.setItem("sci_quest_active_votes", JSON.stringify({}));
  localStorage.setItem("sci_quest_student_responses", JSON.stringify({}));
  localStorage.setItem("sci_quest_student_list", JSON.stringify([])); // ล้างห้องเรียน
  
  window.dispatchEvent(new CustomEvent("modules-changed", { detail: DEFAULT_MODULE_STATES }));
  window.dispatchEvent(new CustomEvent("score-changed", { detail: DEFAULT_STUDENT_SCORE }));
  window.dispatchEvent(new CustomEvent("phase-changed", { detail: "map" }));
  window.dispatchEvent(new CustomEvent("game-reset"));
}

// ฟังก์ชันอำนวยความสะดวกสำหรับ Student Controller
function getGamePhase() {
  initAppData();
  return localStorage.getItem("sci_quest_game_phase");
}

function setGamePhase(phase) {
  localStorage.setItem("sci_quest_game_phase", phase);
  window.dispatchEvent(new CustomEvent("phase-changed", { detail: phase }));
}

function getActiveNode() {
  initAppData();
  return localStorage.getItem("sci_quest_active_node");
}

function setActiveNode(nodeKey) {
  localStorage.setItem("sci_quest_active_node", nodeKey);
  window.dispatchEvent(new CustomEvent("active-node-changed", { detail: nodeKey }));
}

function getStudentList() {
  initAppData();
  return JSON.parse(localStorage.getItem("sci_quest_student_list"));
}

function registerStudent(name) {
  const list = getStudentList();
  if (name && !list.includes(name)) {
    list.push(name);
    localStorage.setItem("sci_quest_student_list", JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("students-updated", { detail: list }));
    return true;
  }
  return false;
}

function getActiveVotes() {
  initAppData();
  return JSON.parse(localStorage.getItem("sci_quest_active_votes"));
}

function submitStudentVote(name, moveKey) {
  const votes = getActiveVotes();
  if (name) {
    votes[name] = moveKey;
    localStorage.setItem("sci_quest_active_votes", JSON.stringify(votes));
    window.dispatchEvent(new CustomEvent("votes-updated", { detail: votes }));
  }
}

function getStudentResponses() {
  initAppData();
  return JSON.parse(localStorage.getItem("sci_quest_student_responses"));
}

function submitStudentResponse(name, answerIdx) {
  const responses = getStudentResponses();
  if (name) {
    responses[name] = answerIdx;
    localStorage.setItem("sci_quest_student_responses", JSON.stringify(responses));
    window.dispatchEvent(new CustomEvent("responses-updated", { detail: responses }));
  }
}

function getActiveMove() {
  initAppData();
  return JSON.parse(localStorage.getItem("sci_quest_active_move"));
}

function saveActiveMove(moveObj) {
  localStorage.setItem("sci_quest_active_move", JSON.stringify(moveObj));
  window.dispatchEvent(new CustomEvent("active-move-changed", { detail: moveObj }));
}

// ล้างคะแนนโหวตและคำตอบทุกเทิร์นใหม่
function clearVotesAndResponses() {
  localStorage.setItem("sci_quest_active_votes", JSON.stringify({}));
  localStorage.setItem("sci_quest_student_responses", JSON.stringify({}));
  window.dispatchEvent(new CustomEvent("votes-updated", { detail: {} }));
  window.dispatchEvent(new CustomEvent("responses-updated", { detail: {} }));
}

// รับค่าจากบราวเซอร์อื่นทันที
window.addEventListener("storage", function(event) {
  if (event.key === "sci_quest_settings") {
    const s = JSON.parse(event.newValue);
    SoundFX.toggle(s.soundEnabled);
    window.dispatchEvent(new CustomEvent("settings-changed", { detail: s }));
  }
  const grade = getActiveGrade();
  const slot = getActiveSlot();
  if (event.key === `sci_quest_modules_${grade}_slot${slot}`) {
    window.dispatchEvent(new CustomEvent("modules-changed", { detail: JSON.parse(event.newValue) }));
  }
  if (event.key === `sci_quest_student_score_${grade}_slot${slot}`) {
    window.dispatchEvent(new CustomEvent("score-changed", { detail: JSON.parse(event.newValue) }));
  }
  if (event.key === "sci_quest_game_phase") {
    window.dispatchEvent(new CustomEvent("phase-changed", { detail: event.newValue }));
  }
  if (event.key === "sci_quest_active_node") {
    window.dispatchEvent(new CustomEvent("active-node-changed", { detail: event.newValue }));
  }
  if (event.key === "sci_quest_student_list") {
    window.dispatchEvent(new CustomEvent("students-updated", { detail: JSON.parse(event.newValue) }));
  }
  if (event.key === "sci_quest_active_votes") {
    window.dispatchEvent(new CustomEvent("votes-updated", { detail: JSON.parse(event.newValue) }));
  }
  if (event.key === "sci_quest_student_responses") {
    window.dispatchEvent(new CustomEvent("responses-updated", { detail: JSON.parse(event.newValue) }));
  }
  if (event.key === "sci_quest_active_move") {
    window.dispatchEvent(new CustomEvent("active-move-changed", { detail: JSON.parse(event.newValue) }));
  }
  if (event.key === "sci_quest_questions") {
    window.dispatchEvent(new CustomEvent("questions-updated", { detail: JSON.parse(event.newValue) }));
  }
});

function showView(viewId) {
  SoundFX.playClick();
  
  // หากกด "เปิดหน้าจอเกมหลัก" (projector-view) ให้กลับไปที่หน้าเลือกระดับชั้นทุกครั้ง
  if (viewId === "projector-view") {
    localStorage.removeItem(gk("sci_quest_level_confirmed"));
    // เรียกอัปเดต UI ให้แสดงหน้าเลือกชั้นเรียนทันที (ฟังก์ชันจาก game.js)
    if (typeof updatePhaseUI === "function") {
      updatePhaseUI("map");
    }
  }
  
  const views = document.querySelectorAll(".app-view");
  views.forEach(v => v.classList.remove("active"));
  
  const activeView = document.getElementById(viewId);
  if (activeView) {
    activeView.classList.add("active");
  }
}

function showToast(message, isWarning = false) {
  let toastEl = document.getElementById("toast-notification");
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.id = "toast-notification";
    toastEl.className = "toast";
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = message;
  if (isWarning) {
    toastEl.style.borderColor = "var(--neon-red)";
    toastEl.style.boxShadow = "0 0 15px rgba(255, 46, 93, 0.2)";
  } else {
    toastEl.style.borderColor = "var(--neon-emerald)";
    toastEl.style.boxShadow = "0 0 15px rgba(0, 255, 102, 0.2)";
  }
  toastEl.classList.add("show");
  setTimeout(() => {
    toastEl.classList.remove("show");
  }, 3500);
}

document.addEventListener("DOMContentLoaded", function() {
  initAppData();
  const currentSettings = getSystemSettings();
  SoundFX.toggle(currentSettings.soundEnabled);
});

// ส่งออกทั้งหมด
window.App = {
  showView,
  getSystemSettings,
  saveSystemSettings,
  getModuleStates,
  saveModuleStates,
  getStudentScore,
  saveStudentScore,
  resetStudentGame,
  showToast,
  getGamePhase,
  setGamePhase,
  getActiveNode,
  setActiveNode,
  getStudentList,
  registerStudent,
  getActiveVotes,
  submitStudentVote,
  getStudentResponses,
  submitStudentResponse,
  getActiveMove,
  saveActiveMove,
  clearVotesAndResponses,
  hasSaveData,
  hasSaveDataInSlot,
  gk,
  getActiveGrade,
  getActiveSlot
};
