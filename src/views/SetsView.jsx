export function SetsView({
  sets, newSetName, editingSet,
  onNewSetNameChange, onAddSet,
  onOpenSet, onDeleteSet,
  onStartEditSet, onRenameSet, onEditingSetChange,
}) {
  return (
    <div className="max-w-[900px] mx-auto flex flex-col gap-6">

      {/* hero row */}
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="m-0 text-[32px] font-extrabold tracking-[-1px] leading-[1.1] text-mt-white">
            Timer <span className="text-mt-green">Sets</span>
          </h1>
          <p className="mt-1.5 mb-0 text-mt-muted text-[13px]">Manage your saved timer collections</p>
        </div>

        <div className="flex gap-2.5">
          <input
            value={newSetName}
            onChange={(e) => onNewSetNameChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAddSet()}
            placeholder="New set name…"
            className="w-[200px] bg-mt-surface border border-mt-border2 rounded-[10px] text-mt-white px-4 py-2.5 text-[14px] outline-none font-poppins"
          />
          <button onClick={onAddSet}
            className="bg-mt-green text-mt-bg border-none rounded-[10px] px-5 py-2.5 font-bold text-[14px] cursor-pointer font-poppins whitespace-nowrap"
          >+ New Set</button>
        </div>
      </div>

      {/* empty state */}
      {sets.length === 0 ? (
        <div className="border border-dashed border-mt-border2 rounded-[20px] py-20 px-10 text-center text-mt-muted">
          <div className="text-[36px] mb-3">⏱</div>
          <div className="text-[16px] font-bold text-mt-white mb-1.5">No sets yet</div>
          <div className="text-[13px]">Create your first timer set to get started</div>
        </div>
      ) : (
        <div className="grid gap-[14px]" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>
          {sets.map((set) => (
            <div key={set.id}
              className="bg-mt-card border border-mt-border rounded-2xl p-[22px] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-mt-border2"
              onClick={() => { if (editingSet?.id === set.id) return; onOpenSet(set); }}
            >
              <div className="flex justify-between items-start mb-[14px]">
                {editingSet?.id === set.id ? (
                  <input
                    autoFocus
                    value={editingSet.name}
                    onChange={(e) => onEditingSetChange({ ...editingSet, name: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onRenameSet(set.id, editingSet.name);
                      if (e.key === "Escape") onEditingSetChange(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-transparent border-none border-b border-mt-green text-mt-white text-[15px] font-bold outline-none w-full font-poppins py-0.5"
                  />
                ) : (
                  <div className="font-bold text-[15px] tracking-tight text-mt-white">{set.name}</div>
                )}

                <div className="flex gap-1.5 ml-2.5" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => onStartEditSet(set)}
                    className="bg-transparent border-none text-mt-muted hover:text-mt-white cursor-pointer text-[14px] p-1 transition-colors"
                  >✎</button>
                  <button onClick={() => onDeleteSet(set.id)}
                    className="bg-transparent border-none text-mt-muted hover:text-mt-danger cursor-pointer text-[14px] p-1 transition-colors"
                  >✕</button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[12px] text-mt-muted">
                  {(set.timers || []).length} timer{(set.timers || []).length !== 1 ? "s" : ""}
                </span>
                <span className="text-[11px] text-mt-green bg-mt-green/10 px-2.5 py-[3px] rounded-full font-semibold">
                  Open →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
