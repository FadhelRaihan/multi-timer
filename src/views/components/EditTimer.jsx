import { useState } from "react";
import { C } from "../../models/theme";
import { uid, toSec, BUILT_IN_SOUNDS, loadCustomSounds, saveCustomSounds } from "../../models/timerModel";

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-[14px] py-[5px] rounded-full text-[12px] font-semibold cursor-pointer transition-all border ${
        active
          ? "border-mt-green bg-mt-green/10 text-mt-green"
          : "border-mt-border2 bg-transparent text-mt-muted"
      }`}
    >
      {children}
    </button>
  );
}

export function EditTimer({ timer, onSave, onClose }) {
  const dur = timer.duration;
  const [name, setName]   = useState(timer.name);
  const [h, setH]         = useState(String(Math.floor(dur / 3600)));
  const [m, setM]         = useState(String(Math.floor((dur % 3600) / 60)));
  const [s, setS]         = useState(String(dur % 60));
  const [sound, setSound] = useState(timer.sound);
  const [customSounds, setCustomSounds] = useState(loadCustomSounds);

  const save = () => {
    const d = toSec(h, m, s);
    if (d <= 0) return;
    onSave({ ...timer, name: name || "Timer", duration: d, remaining: d, sound });
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newSound = { id: `custom_${uid()}`, label: file.name.replace(/\.[^.]+$/, ""), dataUrl: ev.target.result };
      const updated = [...customSounds, newSound];
      setCustomSounds(updated);
      saveCustomSounds(updated);
      setSound(newSound.id);
    };
    reader.readAsDataURL(file);
  };

  const previewSound    = (cs) => new Audio(cs.dataUrl).play().catch(() => {});
  const deleteCustomSound = (id) => {
    const updated = customSounds.filter((s) => s.id !== id);
    setCustomSounds(updated);
    saveCustomSounds(updated);
    if (sound === id) setSound("beep");
  };

  const fieldCls = "w-full bg-mt-surface border border-mt-border2 rounded-[10px] text-mt-white px-[14px] py-[10px] text-[14px] outline-none font-poppins box-border";

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-end justify-center z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-mt-surface border border-mt-border2 rounded-t-[20px] p-7 w-full max-w-[520px] box-border animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex justify-between items-center mb-[22px]">
          <span className="text-mt-white font-bold text-[16px]">Edit Timer</span>
          <button onClick={onClose} className="bg-transparent border-none text-mt-muted cursor-pointer text-[20px] leading-none">✕</button>
        </div>

        <div className="flex flex-col gap-[14px]">
          {/* name */}
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Timer name" className={fieldCls} />

          {/* h / m / s */}
          <div className="flex gap-2.5">
            {[["h","hr",setH,h],["m","min",setM,m],["s","sec",setS,s]].map(([k,lbl,setter,val]) => (
              <div key={k} className="flex-1 text-center">
                <input
                  type="number" min="0" max={k === "h" ? 99 : 59} value={val}
                  onChange={(e) => setter(e.target.value)}
                  className={`${fieldCls} text-center text-[22px] font-bold px-1.5 py-2.5`}
                />
                <div className="text-[10px] text-mt-muted mt-[5px] uppercase tracking-[1px]">{lbl}</div>
              </div>
            ))}
          </div>

          {/* built-in sounds */}
          <div className="flex gap-2 flex-wrap">
            {BUILT_IN_SOUNDS.map((snd) => (
              <Pill key={snd.id} active={sound === snd.id} onClick={() => setSound(snd.id)}>{snd.label}</Pill>
            ))}
          </div>

          {/* custom sounds */}
          <div className="border-t border-mt-border2 pt-[14px]">
            <div className="text-[11px] text-mt-muted uppercase tracking-[0.8px] mb-2.5">Custom Sound</div>
            <label className="flex items-center gap-2.5 bg-mt-surface border border-dashed border-mt-border2 rounded-[10px] px-[14px] py-[10px] cursor-pointer">
              <span className="text-[18px]">🎵</span>
              <span className="text-[13px] text-mt-muted">Upload audio file (.mp3 .wav .ogg)</span>
              <input type="file" accept="audio/*" className="hidden" onChange={handleUpload} />
            </label>

            {customSounds.map((cs) => (
              <div key={cs.id}
                className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg border transition-colors"
                style={{
                  background: sound === cs.id ? C.green + "18" : C.surface,
                  borderColor: sound === cs.id ? C.green : C.border2,
                }}
              >
                <button onClick={() => setSound(cs.id)}
                  className="flex-1 bg-transparent border-none text-left cursor-pointer text-[13px] font-semibold"
                  style={{ color: sound === cs.id ? C.green : C.white }}
                >{cs.label}</button>
                <button onClick={() => previewSound(cs)}
                  className="bg-transparent border-none text-mt-muted cursor-pointer text-[16px] px-1"
                >▶</button>
                <button onClick={() => deleteCustomSound(cs.id)}
                  className="bg-transparent border-none text-mt-muted hover:text-mt-danger cursor-pointer text-[14px] px-1 transition-colors"
                >✕</button>
              </div>
            ))}
          </div>

          {/* save */}
          <button onClick={save}
            className="w-full bg-mt-green text-mt-bg border-none rounded-[10px] py-3 font-bold text-[15px] cursor-pointer font-poppins tracking-[0.3px]"
          >Save Timer</button>
        </div>
      </div>
    </div>
  );
}
