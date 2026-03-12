import { useState, useEffect, useRef, useCallback } from "react";
import { Timer, ChevronLeft } from "lucide-react";

/* ─── helpers ─────────────────────────────────────────────── */
const uid = () => Math.random().toString(36).slice(2, 9);

const fmt = (s) => {
  const h = Math.floor(s / 3600),
    m = Math.floor((s % 3600) / 60),
    sec = s % 60;
  return h > 0
    ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const toSec = (h, m, s) => (+h || 0) * 3600 + (+m || 0) * 60 + (+s || 0);

const BUILT_IN_SOUNDS = [
  { id: "beep", label: "Beep" },
  { id: "bell", label: "Bell" },
  { id: "chime", label: "Chime" },
  { id: "alert", label: "Alert" },
];

const CUSTOM_SOUNDS_KEY = "mt_custom_sounds";

const loadCustomSounds = () => {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_SOUNDS_KEY)) || [];
  } catch {
    return [];
  }
};

function playSound(type, customSounds = []) {
  const custom = customSounds.find((s) => s.id === type);
  if (custom) {
    const audio = new Audio(custom.dataUrl);
    audio.play().catch(() => {});
    return;
  }

  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  ({
    beep: () => {
      const o = ctx.createOscillator(),
        g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = 880;
      o.type = "sine";
      g.gain.setValueAtTime(0.3, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      o.start();
      o.stop(ctx.currentTime + 0.5);
    },
    bell: () =>
      [523, 659, 784].forEach((f, i) => {
        const o = ctx.createOscillator(),
          g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = f;
        o.type = "sine";
        g.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
        g.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.15 + 0.05);
        g.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + i * 0.15 + 0.8,
        );
        o.start(ctx.currentTime + i * 0.15);
        o.stop(ctx.currentTime + i * 0.15 + 0.8);
      }),
    chime: () =>
      [1047, 1319, 1568, 2093].forEach((f, i) => {
        const o = ctx.createOscillator(),
          g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = f;
        o.type = "triangle";
        g.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
        g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.1 + 0.02);
        g.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + i * 0.1 + 1,
        );
        o.start(ctx.currentTime + i * 0.1);
        o.stop(ctx.currentTime + i * 0.1 + 1);
      }),
    alert: () =>
      [440, 880, 440, 880].forEach((f, i) => {
        const o = ctx.createOscillator(),
          g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = f;
        o.type = "square";
        g.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.12);
        g.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + i * 0.12 + 0.1,
        );
        o.start(ctx.currentTime + i * 0.12);
        o.stop(ctx.currentTime + i * 0.12 + 0.1);
      }),
  })[type]?.();
}

const STORAGE_KEY = "mt_v2";
const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

/* ─── CSS-in-JS tokens ────────────────────────────────────── */
const C = {
  bg: "#080808",
  surface: "#111111",
  card: "#161616",
  border: "#222222",
  border2: "#2a2a2a",
  green: "#FFF8F0",
  greenDim: "#A0D585",
  white: "#f4f4f4",
  muted: "#555555",
  muted2: "#333333",
  danger: "#ef4444",
};

/* ─── tiny shared style blocks ───────────────────────────── */
const pill = (active) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "5px 14px",
  borderRadius: 9999,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  border: "1px solid",
  borderColor: active ? C.green : C.border2,
  background: active ? C.green + "22" : "transparent",
  color: active ? C.green : C.muted,
  transition: "all .15s",
});

const glassCard = (extra = {}) => ({
  background: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  ...extra,
});

/* ─── Ring SVG ────────────────────────────────────────────── */
function Ring({ pct, remaining, done, running, size = 88 }) {
  const r = 46,
    c = 2 * Math.PI * r,
    cx = size / 2,
    cy = size / 2;
  const stroke = done ? C.green : running ? C.white : C.muted2;
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={C.border2}
        strokeWidth={3}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={stroke}
        strokeWidth={3}
        strokeLinecap={pct > 0.98 || done ? "butt" : "round"}
        strokeDasharray={done ? `${c} 0` : `${c * pct} ${c}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray .5s ease, stroke .3s" }}
      />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fill={done ? C.green : C.white}
        fontSize={done ? 14 : 14}
        fontWeight={700}
        fontFamily="'Poppins', sans-serif"
      >
        {done ? "DONE" : fmt(remaining)}
      </text>
    </svg>
  );
}

/* ─── Edit drawer for a single timer ─────────────────────── */
function EditTimer({ timer, onSave, onClose }) {
  const dur = timer.duration;
  const [name, setName] = useState(timer.name);
  const [h, setH] = useState(String(Math.floor(dur / 3600)));
  const [m, setM] = useState(String(Math.floor((dur % 3600) / 60)));
  const [s, setS] = useState(String(dur % 60));
  const [sound, setSound] = useState(timer.sound);
  const [customSounds, setCustomSounds] = useState(loadCustomSounds);

  const save = () => {
    const d = toSec(h, m, s);
    if (d <= 0) return;
    onSave({
      ...timer,
      name: name || "Timer",
      duration: d,
      remaining: d,
      sound,
    });
  };

  const handleCustomSoundUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const newSound = {
        id: `custom_${uid()}`,
        label: file.name.replace(/\.[^.]+$/, ""), // nama file tanpa ekstensi
        dataUrl: ev.target.result, // base64
      };
      const updated = [...customSounds, newSound];
      setCustomSounds(updated);
      localStorage.setItem(CUSTOM_SOUNDS_KEY, JSON.stringify(updated));
      setSound(newSound.id); // langsung pilih sound baru
    };
    reader.readAsDataURL(file);
  };

  const previewSound = (cs) => {
    const audio = new Audio(cs.dataUrl);
    audio.play().catch(() => {});
  };

  const deleteCustomSound = (id) => {
    const updated = customSounds.filter((s) => s.id !== id);
    setCustomSounds(updated);
    localStorage.setItem(CUSTOM_SOUNDS_KEY, JSON.stringify(updated));
    if (sound === id) setSound("beep"); // fallback ke built-in
  };

  const fieldStyle = {
    background: C.surface,
    border: `1px solid ${C.border2}`,
    borderRadius: 10,
    color: C.white,
    padding: "10px 14px",
    fontSize: 14,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "'Poppins', sans-serif",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.75)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: C.surface,
          borderRadius: "20px 20px 0 0",
          border: `1px solid ${C.border2}`,
          padding: 28,
          width: "100%",
          maxWidth: 520,
          boxSizing: "border-box",
          animation: "slideUp .25s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
          }}
        >
          <span
            style={{
              color: C.white,
              fontWeight: 700,
              fontSize: 16,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Edit Timer
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: C.muted,
              cursor: "pointer",
              fontSize: 20,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Timer name"
            style={fieldStyle}
          />

          <div style={{ display: "flex", gap: 10 }}>
            {[
              ["h", "hr", setH, h],
              ["m", "min", setM, m],
              ["s", "sec", setS, s],
            ].map(([k, lbl, setter, val]) => (
              <div key={k} style={{ flex: 1, textAlign: "center" }}>
                <input
                  type="number"
                  min="0"
                  max={k === "h" ? 99 : 59}
                  value={val}
                  onChange={(e) => setter(e.target.value)}
                  style={{
                    ...fieldStyle,
                    textAlign: "center",
                    fontSize: 22,
                    fontWeight: 700,
                    padding: "10px 6px",
                  }}
                />
                <div
                  style={{
                    fontSize: 10,
                    color: C.muted,
                    marginTop: 5,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {lbl}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {BUILT_IN_SOUNDS.map((snd) => (
              <button
                key={snd.id}
                onClick={() => setSound(snd.id)}
                style={pill(sound === snd.id)}
              >
                {snd.label}
              </button>
            ))}

            <div
              style={{ borderTop: `1px solid ${C.border2}`, paddingTop: 14 }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: C.muted,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 10,
                }}
              >
                Custom Sound
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: C.surface,
                  border: `1px dashed ${C.border2}`,
                  borderRadius: 10,
                  padding: "10px 14px",
                  cursor: "pointer",
                  transition: "border-color .15s",
                }}
              >
                <span style={{ fontSize: 18 }}>🎵</span>
                <span style={{ fontSize: 13, color: C.muted }}>
                  Upload audio file (.mp3 .wav .ogg)
                </span>
                <input
                  type="file"
                  accept="audio/*"
                  style={{ display: "none" }}
                  onChange={handleCustomSoundUpload}
                />
              </label>

              {customSounds.map((cs) => (
                <div
                  key={cs.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 8,
                    padding: "8px 12px",
                    background: sound === cs.id ? C.green + "18" : C.surface,
                    border: `1px solid ${sound === cs.id ? C.green : C.border2}`,
                    borderRadius: 8,
                  }}
                >
                  <button
                    onClick={() => setSound(cs.id)}
                    style={{
                      flex: 1,
                      background: "none",
                      border: "none",
                      color: sound === cs.id ? C.green : C.white,
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {cs.label}
                  </button>
                  <button
                    onClick={() => previewSound(cs)}
                    style={{
                      background: "none",
                      border: "none",
                      color: C.muted,
                      cursor: "pointer",
                      fontSize: 16,
                      padding: "0 4px",
                    }}
                  >
                    ▶
                  </button>
                  <button
                    onClick={() => deleteCustomSound(cs.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: C.muted,
                      cursor: "pointer",
                      fontSize: 14,
                      padding: "0 4px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = C.danger)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = C.muted)
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={save}
            style={{
              background: C.green,
              color: "#000",
              border: "none",
              borderRadius: 10,
              padding: "12px 0",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: 0.3,
            }}
          >
            Save Timer
          </button>
        </div>
      </div>
      <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </div>
  );
}

/* ─── Single Timer Card ───────────────────────────────────── */
function TimerCard({ timer, running, onToggle, onReset, onEdit, onDelete }) {
  const done = timer.remaining === 0 && timer.duration > 0;
  const pct = timer.remaining / timer.duration;
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        ...glassCard(),
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        border: `1px solid ${done ? C.greenDim + "55" : hover ? C.border2 : C.border}`,
        transition: "border .2s, box-shadow .2s",
        boxShadow: done
          ? `0 0 24px ${C.greenDim}22`
          : hover
            ? "0 8px 32px rgba(0,0,0,.5)"
            : "none",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {done && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at top right,${C.greenDim}0d 0%,transparent 60%)`,
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: done ? C.green : C.white,
              fontFamily: "'Poppins', sans-serif",
              marginBottom: 3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {timer.name}
          </div>
          <div
            style={{
              fontSize: 13,
              color: C.muted,
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            {BUILT_IN_SOUNDS.find((s) => s.id === timer.sound)?.label} ·{" "}
            {fmt(timer.duration)}
          </div>
        </div>
        <Ring
          pct={pct}
          remaining={timer.remaining}
          done={done}
          running={running}
          size={110}
        />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          disabled={done}
          onClick={() => onToggle(timer.id)}
          style={{
            flex: 1,
            background: running ? C.border2 : C.green,
            color: running ? C.white : "#000",
            border: "none",
            borderRadius: 8,
            padding: "9px 0",
            fontWeight: 700,
            fontSize: 13,
            cursor: done ? "not-allowed" : "pointer",
            fontFamily: "'Poppins', sans-serif",
            opacity: done ? 0.4 : 1,
            transition: "all .15s",
          }}
        >
          {running ? "⏸ Pause" : "▶ Start"}
        </button>
        <button
          onClick={() => onReset(timer.id)}
          style={{
            background: C.surface,
            border: `1px solid ${C.border2}`,
            borderRadius: 8,
            color: C.muted,
            cursor: "pointer",
            padding: "9px 13px",
            fontSize: 14,
            transition: "color .15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
        >
          ↺
        </button>
        <button
          onClick={() => onEdit(timer)}
          style={{
            background: C.surface,
            border: `1px solid ${C.border2}`,
            borderRadius: 8,
            color: C.muted,
            cursor: "pointer",
            padding: "9px 13px",
            fontSize: 14,
            transition: "color .15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
        >
          ✎
        </button>
        <button
          onClick={() => onDelete(timer.id)}
          style={{
            background: "transparent",
            border: `1px solid transparent`,
            borderRadius: 8,
            color: C.muted,
            cursor: "pointer",
            padding: "9px 13px",
            fontSize: 14,
            transition: "all .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = C.danger;
            e.currentTarget.style.borderColor = C.danger + "44";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = C.muted;
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/* ─── APP ─────────────────────────────────────────────────── */
export default function App() {
  const [sets, setSets] = useState(load);
  const [activeSet, setActiveSet] = useState(null); // { id, name }
  const [timers, setTimers] = useState([]);
  const [running, setRunning] = useState({});
  const [editTimer, setEditTimer] = useState(null);
  const [newSetName, setNewSetName] = useState("");
  const [editingSet, setEditingSet] = useState(null); // { id, name }
  const [view, setView] = useState("sets"); // "sets" | "timers"
  const intervalRef = useRef(null);

  /* persist */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
  }, [sets]);

  /* tick */
  useEffect(() => {
    clearInterval(intervalRef.current);
    if (!Object.values(running).some(Boolean)) return;
    intervalRef.current = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) => {
          if (!running[t.id] || t.remaining <= 0) return t;
          if (t.remaining === 1) {
            setRunning((r) => ({ ...r, [t.id]: false }));
            playSound(t.sound, loadCustomSounds());
            return { ...t, remaining: 0 };
          }
          return { ...t, remaining: t.remaining - 1 };
        }),
      );
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const save = (ts = timers) =>
    setSets((prev) =>
      prev.map((s) => (s.id === activeSet?.id ? { ...s, timers: ts } : s)),
    );

  const openSet = (set) => {
    setActiveSet({ id: set.id, name: set.name });
    setTimers(set.timers || []);
    setRunning({});
    setView("timers");
  };

  const addSet = () => {
    const name = newSetName.trim() || `Set ${sets.length + 1}`;
    const s = { id: uid(), name, timers: [], createdAt: Date.now() };
    setSets((p) => [...p, s]);
    setNewSetName("");
    openSet(s);
  };

  const addTimer = () => {
    const t = {
      id: uid(),
      name: `Timer ${timers.length + 1}`,
      duration: 300,
      remaining: 300,
      sound: "beep",
    };
    const next = [...timers, t];
    setTimers(next);
    save(next);
  };

  const applyEdit = (upd) => {
    const next = timers.map((t) => (t.id === upd.id ? upd : t));
    setTimers(next);
    save(next);
    setEditTimer(null);
  };

  const delTimer = (id) => {
    const next = timers.filter((t) => t.id !== id);
    setTimers(next);
    setRunning((r) => {
      const n = { ...r };
      delete n[id];
      return n;
    });
    save(next);
  };
  const toggleT = (id) => setRunning((r) => ({ ...r, [id]: !r[id] }));
  const resetT = (id) => {
    setRunning((r) => ({ ...r, [id]: false }));
    setTimers((p) =>
      p.map((t) => (t.id === id ? { ...t, remaining: t.duration } : t)),
    );
  };

  const anyRunning = Object.values(running).some(Boolean);
  const doneCount = timers.filter(
    (t) => t.remaining === 0 && t.duration > 0,
  ).length;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: C.bg,
        fontFamily: "'Poppins', sans-serif",
        color: C.white,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* ── TOPBAR ── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          height: 60,
          flexShrink: 0,
          borderBottom: `1px solid ${C.border}`,
          background: C.bg,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {view === "timers" && (
            <button
              onClick={() => {
                setView("sets");
                setRunning({});
              }}
              style={{
                background: "none",
                border: "none",
                color: C.muted,
                cursor: "pointer",
                fontSize: 18,
                padding: 0,
                display: "flex",
                alignItems: "center",
                marginRight: 4,
                transition: "color .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            >
              <ChevronLeft />
            </button>
          )}
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: C.green,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Timer className="text-[#080808]" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: -0.3 }}>
            {view === "sets" ? "Multi Timer" : activeSet?.name}
          </span>
          {view === "timers" && (
            <span
              style={{
                fontSize: 11,
                color: C.muted,
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 20,
                padding: "2px 10px",
                marginLeft: 4,
              }}
            >
              {timers.length} timer{timers.length !== 1 ? "s" : ""}
              {doneCount > 0 && (
                <span style={{ color: C.green, marginLeft: 6 }}>
                  · {doneCount} done
                </span>
              )}
            </span>
          )}
        </div>

        {view === "timers" && timers.length > 0 && (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={
                anyRunning
                  ? () => setRunning({})
                  : () => {
                      const r = {};
                      timers.forEach((t) => {
                        if (t.remaining > 0) r[t.id] = true;
                      });
                      setRunning(r);
                    }
              }
              style={{
                background: anyRunning ? C.surface : C.green,
                color: anyRunning ? C.white : "#000",
                border: `1px solid ${anyRunning ? C.border2 : C.green}`,
                borderRadius: 8,
                padding: "7px 18px",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "'Poppins', sans-serif",
                transition: "all .15s",
              }}
            >
              {anyRunning ? "⏸ Pause All" : "▶ Start All"}
            </button>
            <button
              onClick={() => {
                setRunning({});
                setTimers((p) =>
                  p.map((t) => ({ ...t, remaining: t.duration })),
                );
              }}
              style={{
                background: "transparent",
                border: `1px solid ${C.border2}`,
                borderRadius: 8,
                color: C.muted,
                padding: "7px 14px",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "'Poppins', sans-serif",
                transition: "all .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            >
              ↺ Reset
            </button>
          </div>
        )}
      </header>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, overflow: "auto", padding: 28 }}>
        {/* ── SETS VIEW ── */}
        {view === "sets" && (
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* hero row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 32,
                    fontWeight: 800,
                    letterSpacing: -1,
                    lineHeight: 1.1,
                  }}
                >
                  Timer <span style={{ color: C.green }}>Sets</span>
                </h1>
                <p style={{ margin: "6px 0 0", color: C.muted, fontSize: 13 }}>
                  Manage your saved timer collections
                </p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  value={newSetName}
                  onChange={(e) => setNewSetName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSet()}
                  placeholder="New set name…"
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border2}`,
                    borderRadius: 10,
                    color: C.white,
                    padding: "10px 16px",
                    fontSize: 14,
                    outline: "none",
                    width: 200,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                />
                <button
                  onClick={addSet}
                  style={{
                    background: C.green,
                    color: "#000",
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 20px",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "'Poppins', sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  + New Set
                </button>
              </div>
            </div>

            {/* grid */}
            {sets.length === 0 ? (
              <div
                style={{
                  border: `1px dashed ${C.border2}`,
                  borderRadius: 20,
                  padding: "80px 40px",
                  textAlign: "center",
                  color: C.muted,
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>⏱</div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: C.white,
                    marginBottom: 6,
                  }}
                >
                  No sets yet
                </div>
                <div style={{ fontSize: 13 }}>
                  Create your first timer set to get started
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
                  gap: 14,
                }}
              >
                {sets.map((set) => (
                  <div
                    key={set.id}
                    style={{
                      ...glassCard({ padding: 22, cursor: "pointer" }),
                      transition: "all .2s",
                    }}
                    onClick={() => {
                      if (editingSet?.id === set.id) return;
                      openSet(set);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = C.border2;
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 14,
                      }}
                    >
                      {editingSet?.id === set.id ? (
                        <input
                          autoFocus
                          value={editingSet.name}
                          onChange={(e) =>
                            setEditingSet((s) => ({
                              ...s,
                              name: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setSets((p) =>
                                p.map((s) =>
                                  s.id === set.id
                                    ? { ...s, name: editingSet.name || s.name }
                                    : s,
                                ),
                              );
                              setEditingSet(null);
                            }
                            if (e.key === "Escape") setEditingSet(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            background: "transparent",
                            border: "none",
                            borderBottom: `1px solid ${C.green}`,
                            color: C.white,
                            fontSize: 15,
                            fontWeight: 700,
                            outline: "none",
                            width: "100%",
                            fontFamily: "'Poppins', sans-serif",
                            padding: "2px 0",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 15,
                            letterSpacing: -0.2,
                          }}
                        >
                          {set.name}
                        </div>
                      )}
                      <div
                        style={{ display: "flex", gap: 6, marginLeft: 10 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            setEditingSet({ id: set.id, name: set.name })
                          }
                          style={{
                            background: "none",
                            border: "none",
                            color: C.muted,
                            cursor: "pointer",
                            fontSize: 14,
                            padding: 4,
                            transition: "color .15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = C.white)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = C.muted)
                          }
                        >
                          ✎
                        </button>
                        <button
                          onClick={() =>
                            setSets((p) => p.filter((s) => s.id !== set.id))
                          }
                          style={{
                            background: "none",
                            border: "none",
                            color: C.muted,
                            cursor: "pointer",
                            fontSize: 14,
                            padding: 4,
                            transition: "color .15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = C.danger)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = C.muted)
                          }
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: 12, color: C.muted }}>
                        {(set.timers || []).length} timer
                        {(set.timers || []).length !== 1 ? "s" : ""}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: C.green,
                          background: C.green + "18",
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontWeight: 600,
                        }}
                      >
                        Open →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TIMERS VIEW ── */}
        {view === "timers" && (
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* stats bar */}
            {timers.length > 0 && (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[
                  ["Total", timers.length, "timers"],
                  [
                    "Running",
                    Object.values(running).filter(Boolean).length,
                    "active",
                  ],
                  ["Done", doneCount, "completed"],
                ].map(([lbl, val, sub]) => (
                  <div
                    key={lbl}
                    style={{
                      ...glassCard({
                        padding: "12px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }),
                    }}
                  >
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: lbl === "Done" && val > 0 ? C.green : C.white,
                      }}
                    >
                      {val}
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          color: C.muted,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                        }}
                      >
                        {lbl}
                      </div>
                      <div style={{ fontSize: 11, color: C.muted2 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* timer grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
                gap: 14,
              }}
            >
              {timers.map((t) => (
                <TimerCard
                  key={t.id}
                  timer={t}
                  running={!!running[t.id]}
                  onToggle={toggleT}
                  onReset={resetT}
                  onEdit={setEditTimer}
                  onDelete={delTimer}
                />
              ))}

              {/* add card */}
              <button
                onClick={addTimer}
                style={{
                  background: "transparent",
                  border: `1.5px dashed ${C.border2}`,
                  borderRadius: 16,
                  padding: "40px 20px",
                  color: C.muted,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  transition: "all .2s",
                  fontFamily: "'Poppins', sans-serif",
                  minHeight: 160,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.green;
                  e.currentTarget.style.color = C.green;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border2;
                  e.currentTarget.style.color = C.muted;
                }}
              >
                <span style={{ fontSize: 28 }}>+</span>
                <span>Add Timer</span>
              </button>
            </div>

            {timers.length === 0 && (
              <div
                style={{
                  border: `1px dashed ${C.border2}`,
                  borderRadius: 20,
                  padding: "60px 40px",
                  textAlign: "center",
                  color: C.muted,
                }}
              >
                <div style={{ fontSize: 13 }}>
                  No timers yet — click{" "}
                  <strong style={{ color: C.white }}>Add Timer</strong> to start
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── EDIT MODAL ── */}
      {editTimer && (
        <EditTimer
          timer={editTimer}
          onSave={applyEdit}
          onClose={() => setEditTimer(null)}
        />
      )}

      {/* ── FOOTER ── */}
      {view === "sets" && (
        <footer
          style={{
            borderTop: `1px solid ${C.border}`,
            padding: "32px 28px 28px",
            marginTop: 16,
          }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div
              style={{
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: "28px 28px 24px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C.green,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.green,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  Open Source
                </span>
              </div>

              {/* heading */}
              <h2
                style={{
                  margin: "0 0 10px",
                  fontSize: 22,
                  fontWeight: 800,
                  color: C.white,
                  lineHeight: 1.2,
                  letterSpacing: -0.3,
                }}
              >
                Help make MultiTimer{" "}
                <span style={{ color: C.green }}>even better.</span>
              </h2>

              <p
                style={{
                  margin: "0 0 20px",
                  fontSize: 13,
                  color: C.muted,
                  lineHeight: 1.6,
                  maxWidth: 420,
                }}
              >
                Free and open source — bug fixes, new features, or docs
                improvements are all welcome.
              </p>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                {[
                  {
                    label: "Contribute on GitHub",
                    href: `https://github.com/FadhelRaihan/multi-timer`,
                    primary: true,
                  },
                  {
                    label: "Report a Bug",
                    href: `https://github.com/FadhelRaihan/multi-timer/issues/new?template=bug_report.md`,
                  },
                  {
                    label: "Request a Feature",
                    href: `https://github.com/FadhelRaihan/multi-timer/issues/new?template=feature_request.md`,
                  },
                ].map((btn) => (
                  <a
                    key={btn.label}
                    href={btn.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: btn.primary ? C.green : "transparent",
                      color: btn.primary ? "#000" : C.white,
                      border: btn.primary ? "none" : `1px solid ${C.border2}`,
                      borderRadius: 8,
                      padding: "8px 16px",
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    {btn.label}
                  </a>
                ))}
              </div>

              {/* Info Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 8,
                }}
              >
                {[
                  ["MIT", "Free to use & modify"],
                  ["PRs", "All skill levels welcome"],
                  ["React", "Vite + localStorage"],
                ].map(([t, s]) => (
                  <div
                    key={t}
                    style={{
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      padding: "10px 14px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: C.white,
                        marginBottom: 2,
                      }}
                    >
                      {t}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 16,
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    // background: C.green,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                  }}
                >
                  <Timer />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>
                  MultiTimer
                </span>
                <span style={{ fontSize: 12, color: C.muted2 }}>
                  — free forever
                </span>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                {[
                  ["GitHub", "https://github.com/FadhelRaihan/multi-timer"],
                  [
                    "Contributing",
                    "https://github.com/FadhelRaihan/multi-timer/blob/main/CONTRIBUTING.md",
                  ],
                  [
                    "License",
                    "https://github.com/FadhelRaihan/multi-timer/blob/main/LICENSE",
                  ],
                ].map(([l, h]) => (
                  <a
                    key={l}
                    href={h}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 12,
                      color: C.muted,
                      textDecoration: "none",
                    }}
                  >
                    {l}
                  </a>
                ))}
              </div>
              <span style={{ fontSize: 11, color: C.muted2 }}>
                © 2026 MultiTimer
              </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
