import { useState } from "react";
import { C } from "../../models/theme";
import { BUILT_IN_SOUNDS, fmt } from "../../models/timerModel";
import { Ring } from "./Ring";

export function TimerCard({ timer, running, onToggle, onReset, onEdit, onDelete }) {
  const done = timer.remaining === 0 && timer.duration > 0;
  const pct  = timer.remaining / timer.duration;
  const [hover, setHover] = useState(false);

  return (
    <div
      className="bg-mt-card rounded-2xl p-7 flex flex-col gap-4 relative overflow-hidden transition-all duration-200"
      style={{
        border: `1px solid ${done ? C.greenDim + "55" : hover ? C.border2 : C.border}`,
        boxShadow: done ? `0 0 24px ${C.greenDim}22` : hover ? "0 8px 32px rgba(0,0,0,.5)" : "none",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {done && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at top right,${C.greenDim}0d 0%,transparent 60%)` }}
        />
      )}

      {/* top row */}
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-[18px] font-poppins mb-[3px] overflow-hidden text-ellipsis whitespace-nowrap ${done ? "text-mt-green" : "text-mt-white"}`}>
            {timer.name}
          </div>
          <div className="text-[13px] text-mt-muted uppercase tracking-[0.8px]">
            {BUILT_IN_SOUNDS.find((s) => s.id === timer.sound)?.label} · {fmt(timer.duration)}
          </div>
        </div>
        <Ring pct={pct} remaining={timer.remaining} done={done} running={running} size={110} />
      </div>

      {/* controls */}
      <div className="flex gap-2">
        <button
          disabled={done}
          onClick={() => onToggle(timer.id)}
          className={`flex-1 rounded-lg py-[9px] font-bold text-[13px] font-poppins border-none transition-all cursor-pointer ${
            done ? "opacity-40 cursor-not-allowed" : ""
          } ${running ? "bg-mt-border2 text-mt-white" : "bg-mt-green text-mt-bg"}`}
        >
          {running ? "⏸ Pause" : "▶ Start"}
        </button>

        <button onClick={() => onReset(timer.id)}
          className="bg-mt-surface border border-mt-border2 rounded-lg text-mt-muted hover:text-mt-white px-[13px] py-[9px] text-[14px] cursor-pointer transition-colors"
        >↺</button>

        <button onClick={() => onEdit(timer)}
          className="bg-mt-surface border border-mt-border2 rounded-lg text-mt-muted hover:text-mt-white px-[13px] py-[9px] text-[14px] cursor-pointer transition-colors"
        >✎</button>

        <button onClick={() => onDelete(timer.id)}
          className="bg-transparent border border-transparent rounded-lg text-mt-muted hover:text-mt-danger hover:border-mt-danger/30 px-[13px] py-[9px] text-[14px] cursor-pointer transition-all"
        >✕</button>
      </div>
    </div>
  );
}
