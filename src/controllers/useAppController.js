import { useState, useEffect, useRef } from "react";
import {
  uid,
  loadSets,
  saveSets,
  loadCustomSounds,
  playSound,
} from "../models/timerModel";

export function useAppController() {
  const [sets, setSets]           = useState(loadSets);
  const [activeSet, setActiveSet] = useState(null);   // { id, name }
  const [timers, setTimers]       = useState([]);
  const [running, setRunning]     = useState({});
  const [editTimer, setEditTimer] = useState(null);
  const [newSetName, setNewSetName] = useState("");
  const [editingSet, setEditingSet] = useState(null); // { id, name }
  const [view, setView]           = useState("sets"); // "sets" | "timers"
  const intervalRef               = useRef(null);

  /* ── persist sets ── */
  useEffect(() => { saveSets(sets); }, [sets]);

  /* ── tick ── */
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

  /* ── sync timers back into sets ── */
  const syncToSet = (ts = timers) =>
    setSets((prev) =>
      prev.map((s) => (s.id === activeSet?.id ? { ...s, timers: ts } : s)),
    );

  /* ── SETS ── */
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

  const deleteSet = (id) =>
    setSets((p) => p.filter((s) => s.id !== id));

  const renameSet = (id, name) => {
    setSets((p) => p.map((s) => (s.id === id ? { ...s, name: name || s.name } : s)));
    setEditingSet(null);
  };

  /* ── TIMERS ── */
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
    syncToSet(next);
  };

  const applyEdit = (upd) => {
    const next = timers.map((t) => (t.id === upd.id ? upd : t));
    setTimers(next);
    syncToSet(next);
    setEditTimer(null);
  };

  const deleteTimer = (id) => {
    const next = timers.filter((t) => t.id !== id);
    setTimers(next);
    setRunning((r) => { const n = { ...r }; delete n[id]; return n; });
    syncToSet(next);
  };

  const toggleTimer = (id) =>
    setRunning((r) => ({ ...r, [id]: !r[id] }));

  const resetTimer = (id) => {
    setRunning((r) => ({ ...r, [id]: false }));
    setTimers((p) => p.map((t) => (t.id === id ? { ...t, remaining: t.duration } : t)));
  };

  const startAll = () => {
    const r = {};
    timers.forEach((t) => { if (t.remaining > 0) r[t.id] = true; });
    setRunning(r);
  };

  const pauseAll  = () => setRunning({});

  const resetAll  = () => {
    setRunning({});
    setTimers((p) => p.map((t) => ({ ...t, remaining: t.duration })));
  };

  const goToSets = () => {
    setView("sets");
    setRunning({});
  };

  /* ── derived ── */
  const anyRunning = Object.values(running).some(Boolean);
  const doneCount  = timers.filter((t) => t.remaining === 0 && t.duration > 0).length;

  return {
    // state
    sets, timers, running, editTimer, newSetName,
    editingSet, view, activeSet, anyRunning, doneCount,
    // setters
    setNewSetName, setEditTimer, setEditingSet,
    // actions
    openSet, addSet, deleteSet, renameSet,
    addTimer, applyEdit, deleteTimer, toggleTimer, resetTimer,
    startAll, pauseAll, resetAll, goToSets,
  };
}
