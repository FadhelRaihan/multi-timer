import { C } from "../../models/theme";
import { fmt } from "../../models/timerModel";

export function Ring({ pct, remaining, done, running, size = 88 }) {
  const r  = 46;
  const c  = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  const stroke = done ? C.green : running ? C.white : C.muted2;

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border2} strokeWidth={3} />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={stroke} strokeWidth={3}
        strokeLinecap={pct > 0.98 || done ? "butt" : "round"}
        strokeDasharray={done ? `${c} 0` : `${c * pct} ${c}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray .5s ease, stroke .3s" }}
      />
      <text x={cx} y={cy + 5} textAnchor="middle"
        fill={done ? C.green : C.white}
        fontSize={14} fontWeight={700} fontFamily="'Poppins', sans-serif"
      >
        {done ? "DONE" : fmt(remaining)}
      </text>
    </svg>
  );
}
