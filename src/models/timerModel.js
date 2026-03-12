/* ─── CONSTANTS ─────────────────────────────────────────────── */
export const STORAGE_KEY = "mt_v2";
export const CUSTOM_SOUNDS_KEY = "mt_custom_sounds";

export const BUILT_IN_SOUNDS = [
  { id: "beep",  label: "Beep"  },
  { id: "bell",  label: "Bell"  },
  { id: "chime", label: "Chime" },
  { id: "alert", label: "Alert" },
];

/* ─── ID GENERATOR ──────────────────────────────────────────── */
export const uid = () => Math.random().toString(36).slice(2, 9);

/* ─── TIME HELPERS ──────────────────────────────────────────── */
export const fmt = (s) => {
  const h   = Math.floor(s / 3600);
  const m   = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0
    ? `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`
    : `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
};

export const toSec = (h, m, s) => (+h || 0) * 3600 + (+m || 0) * 60 + (+s || 0);

/* ─── STORAGE ───────────────────────────────────────────────── */
export const loadSets = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
};

export const saveSets = (sets) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));

export const loadCustomSounds = () => {
  try { return JSON.parse(localStorage.getItem(CUSTOM_SOUNDS_KEY)) || []; }
  catch { return []; }
};

export const saveCustomSounds = (sounds) =>
  localStorage.setItem(CUSTOM_SOUNDS_KEY, JSON.stringify(sounds));

/* ─── SOUND ENGINE ──────────────────────────────────────────── */
export function playSound(type, customSounds = []) {
  const custom = customSounds.find((s) => s.id === type);
  if (custom) {
    new Audio(custom.dataUrl).play().catch(() => {});
    return;
  }

  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  ({
    beep: () => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 880; o.type = "sine";
      g.gain.setValueAtTime(0.3, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      o.start(); o.stop(ctx.currentTime + 0.5);
    },
    bell: () =>
      [523, 659, 784].forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = f; o.type = "sine";
        g.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
        g.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.15 + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.8);
        o.start(ctx.currentTime + i * 0.15);
        o.stop(ctx.currentTime + i * 0.15 + 0.8);
      }),
    chime: () =>
      [1047, 1319, 1568, 2093].forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = f; o.type = "triangle";
        g.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
        g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.1 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 1);
        o.start(ctx.currentTime + i * 0.1);
        o.stop(ctx.currentTime + i * 0.1 + 1);
      }),
    alert: () =>
      [440, 880, 440, 880].forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = f; o.type = "square";
        g.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.1);
        o.start(ctx.currentTime + i * 0.12);
        o.stop(ctx.currentTime + i * 0.12 + 0.1);
      }),
  })[type]?.();
}
