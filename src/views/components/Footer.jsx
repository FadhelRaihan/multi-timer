import { Timer } from "lucide-react";

const GITHUB = "https://github.com/FadhelRaihan/multi-timer";

export function Footer() {
  return (
    <footer className="border-t border-mt-border mt-4 px-7 pt-8 pb-7">
      <div className="max-w-[1400px] mx-auto">
        {/* CTA box */}
        <div className="border border-mt-border rounded-2xl p-7 relative overflow-hidden">
          {/* badge */}
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-mt-green" />
            <span className="text-[11px] font-bold text-mt-green uppercase tracking-[2px]">
              Open Source
            </span>
          </div>

          <h2 className="text-[22px] font-extrabold text-mt-white leading-tight tracking-tight mb-2.5">
            Help make MultiTimer{" "}
            <span className="text-mt-green">even better.</span>
          </h2>

          <p className="text-[13px] text-mt-muted leading-relaxed max-w-[420px] mb-5">
            Free and open source — bug fixes, new features, or docs improvements
            are all welcome.
          </p>

          {/* buttons */}
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { label: "Contribute on GitHub", href: GITHUB, primary: true },
              {
                label: "Report a Bug",
                href: `${GITHUB}/issues/new?template=bug_report.md`,
              },
              {
                label: "Request a Feature",
                href: `${GITHUB}/issues/new?template=feature_request.md`,
              },
            ].map((btn) => (
              <a
                key={btn.label}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold no-underline transition-colors ${
                  btn.primary
                    ? "bg-mt-green text-mt-bg border-none"
                    : "bg-transparent text-mt-white border border-mt-border2"
                }`}
              >
                {btn.label}
              </a>
            ))}
          </div>

          {/* info cards */}
          <div className="grid grid-cols-3 gap-2">
            {[
              ["MIT", "Free to use & modify"],
              ["PRs", "All skill levels welcome"],
              ["React", "Vite + localStorage"],
            ].map(([t, s]) => (
              <div
                key={t}
                className="bg-mt-surface border border-mt-border rounded-[10px] px-[14px] py-[10px]"
              >
                <div className="text-[13px] font-bold text-mt-white mb-0.5">
                  {t}
                </div>
                <div className="text-[11px] text-mt-muted">{s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex justify-between items-center mt-4 flex-wrap gap-2.5">
          <div className="flex items-end gap-2">
            <div className="w-[22px] h-[22px] rounded-md flex items-center justify-center">
              <Timer />
            </div>
            <span className="text-[13px] font-bold text-mt-white">
              MultiTimer
            </span>
            <span className="text-[12px] text-mt-muted2">— free forever</span>
          </div>

          <div className="flex gap-4">
            {[
              ["GitHub", GITHUB],
              ["Contributing", `${GITHUB}/blob/main/CONTRIBUTING.md`],
              ["License", `${GITHUB}/blob/main/LICENSE`],
            ].map(([l, h]) => (
              <a
                key={l}
                href={h}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-mt-muted hover:text-mt-white no-underline transition-colors"
              >
                {l}
              </a>
            ))}
          </div>

          <span className="text-[11px] text-mt-muted2">© 2026 MultiTimer</span>
        </div>
      </div>
    </footer>
  );
}
