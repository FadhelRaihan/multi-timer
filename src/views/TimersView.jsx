import { TimerCard } from "./components/TimerCard";

export function TimersView({ timers, running, doneCount, onAddTimer, onToggle, onReset, onEdit, onDelete }) {
  const runningCount = Object.values(running).filter(Boolean).length;

  return (
    <div className="max-w-[1100px] mx-auto flex flex-col gap-5">

      {/* stats bar */}
      {timers.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {[["Total", timers.length, "timers"], ["Running", runningCount, "active"], ["Done", doneCount, "completed"]].map(([lbl, val, sub]) => (
            <div key={lbl} className="bg-mt-card border border-mt-border rounded-2xl px-5 py-3 flex items-center gap-3">
              <span className={`text-[22px] font-extrabold ${lbl === "Done" && val > 0 ? "text-mt-green" : "text-mt-white"}`}>{val}</span>
              <div>
                <div className="text-[11px] text-mt-muted uppercase tracking-[0.8px]">{lbl}</div>
                <div className="text-[11px] text-mt-muted2">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* grid */}
      <div className="grid gap-[14px]" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))" }}>
        {timers.map((t) => (
          <TimerCard key={t.id} timer={t} running={!!running[t.id]}
            onToggle={onToggle} onReset={onReset} onEdit={onEdit} onDelete={onDelete}
          />
        ))}

        {/* add card */}
        <button onClick={onAddTimer}
          className="bg-transparent border-[1.5px] border-dashed border-mt-border2 rounded-2xl py-10 px-5 text-mt-muted hover:border-mt-green hover:text-mt-green cursor-pointer text-[14px] font-semibold flex flex-col items-center gap-2.5 transition-all min-h-[160px] font-poppins"
        >
          <span className="text-[28px]">+</span>
          <span>Add Timer</span>
        </button>
      </div>

      {/* empty hint */}
      {timers.length === 0 && (
        <div className="border border-dashed border-mt-border2 rounded-[20px] py-[60px] px-10 text-center text-mt-muted">
          <div className="text-[13px]">
            No timers yet — click <strong className="text-mt-white">Add Timer</strong> to start
          </div>
        </div>
      )}
    </div>
  );
}
