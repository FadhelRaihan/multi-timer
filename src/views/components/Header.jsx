import { Timer, ChevronLeft } from "lucide-react";

export function Header({ view, activeSet, timers, doneCount, anyRunning, onBack, onStartAll, onPauseAll, onResetAll }) {
  return (
    <header className="flex items-center justify-between px-7 h-[60px] shrink-0 border-b border-mt-border bg-mt-bg sticky top-0 z-[100]">
      {/* left */}
      <div className="flex items-center gap-3">
        {view === "timers" && (
          <button onClick={onBack}
            className="text-mt-muted hover:text-mt-white transition-colors bg-transparent border-none cursor-pointer flex items-center mr-1 p-0"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <div className="w-[30px] h-[30px] rounded-lg bg-mt-green flex items-center justify-center">
          <Timer size={16} className="text-mt-bg" />
        </div>

        <span className="font-extrabold text-[15px] tracking-tight text-mt-white">
          {view === "sets" ? "Multi Timer" : activeSet?.name}
        </span>

        {view === "timers" && (
          <span className="text-[11px] text-mt-muted bg-mt-surface border border-mt-border rounded-full px-[10px] py-[2px] ml-1">
            {timers.length} timer{timers.length !== 1 ? "s" : ""}
            {doneCount > 0 && <span className="text-mt-green ml-1.5">· {doneCount} done</span>}
          </span>
        )}
      </div>

      {/* right */}
      {view === "timers" && timers.length > 0 && (
        <div className="flex gap-2">
          <button
            onClick={anyRunning ? onPauseAll : onStartAll}
            className={`px-[18px] py-[7px] rounded-lg font-bold text-[13px] cursor-pointer font-poppins transition-all border ${
              anyRunning
                ? "bg-mt-surface text-mt-white border-mt-border2"
                : "bg-mt-green text-mt-bg border-mt-green"
            }`}
          >
            {anyRunning ? "⏸ Pause All" : "▶ Start All"}
          </button>
          <button onClick={onResetAll}
            className="px-[14px] py-[7px] rounded-lg text-[13px] text-mt-muted hover:text-mt-white border border-mt-border2 bg-transparent cursor-pointer font-poppins transition-colors"
          >
            ↺ Reset
          </button>
        </div>
      )}
    </header>
  );
}
