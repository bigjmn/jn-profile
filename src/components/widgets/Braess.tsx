"use client"
import { useEffect, useRef, useState } from "react";

/**
 * BraessParadoxExplorer
 * ---------------------
 * Interactive visualization of Braess's paradox: adding a free shortcut to
 * a road network can make everyone's commute *longer* under selfish routing.
 *
 * Mobile-first: single-column layout on small screens, stretches horizontally
 * beyond ~560px. Continuous car stream (no toggle). Drop into any React 18+
 * project — no external dependencies.
 */

type EdgeKey = "SA" | "AE" | "SB" | "BE" | "AB";

interface Route {
  path: EdgeKey[];
  fraction: number;
}

interface NetworkState {
  traffic: Record<EdgeKey, number>;
  times: Record<EdgeKey, number>;
  routes: Route[];
  currentTime: number;
  withoutShortcut: number;
  withShortcut: number;
}

interface Car {
  el: SVGCircleElement;
  route: EdgeKey[];
  legIndex: number;
  progress: number;
}

// Edge-time model:
//   SA, BE : proportional to traffic (t / 100)
//   AE, SB : constant 45 min
//   AB     : free shortcut (0 min)
function computeState(n: number, shortcutOpen: boolean): NetworkState {
  let traffic: Record<EdgeKey, number>;
  let routes: Route[];

  if (shortcutOpen) {
    // Nash equilibrium: every driver takes S→A→B→E
    traffic = { SA: n, AE: 0, SB: 0, BE: n, AB: n };
    routes = [{ path: ["SA", "AB", "BE"], fraction: 1 }];
  } else {
    // Nash equilibrium: split 50/50 between S→A→E and S→B→E
    traffic = { SA: n / 2, AE: n / 2, SB: n / 2, BE: n / 2, AB: 0 };
    routes = [
      { path: ["SA", "AE"], fraction: 0.5 },
      { path: ["SB", "BE"], fraction: 0.5 },
    ];
  }

  const times: Record<EdgeKey, number> = {
    SA: traffic.SA / 100,
    AE: 45,
    SB: 45,
    BE: traffic.BE / 100,
    AB: 0,
  };

  const currentTime = shortcutOpen
    ? times.SA + times.AB + times.BE
    : times.SA + times.AE;
  const withoutShortcut = n / 200 + 45;
  const withShortcut = n / 50;

  return { traffic, times, routes, currentTime, withoutShortcut, withShortcut };
}

function colorForTime(t: number): string {
  // Green (teal) at 0 min → red at 50+ min
  const f = Math.min(t / 50, 1);
  const hue = 165 * (1 - f);
  return `hsl(${hue}, 62%, 42%)`;
}

const PRESETS: { label: string; n: number }[] = [
  { label: "Low", n: 2000 },
  { label: "Crossover", n: 3000 },
  { label: "Classic", n: 4000 },
  { label: "Peak", n: 4500 },
];

const TARGET_CARS = 48;

export default function BraessParadoxExplorer() {
  const [n, setN] = useState(4000);
  const [shortcutOpen, setShortcutOpen] = useState(true);

  const carsGroupRef = useRef<SVGGElement>(null);
  const carsRef = useRef<Car[]>([]);

  // Path refs — used by the RAF loop to read geometry each frame
  const pathSA = useRef<SVGPathElement>(null);
  const pathAE = useRef<SVGPathElement>(null);
  const pathSB = useRef<SVGPathElement>(null);
  const pathBE = useRef<SVGPathElement>(null);
  const pathAB = useRef<SVGPathElement>(null);
  const pathRefs: Record<EdgeKey, React.RefObject<SVGPathElement>> = {
    SA: pathSA,
    AE: pathAE,
    SB: pathSB,
    BE: pathBE,
    AB: pathAB,
  };

  // Mirror the two inputs into a ref so the RAF loop can read current values
  // without needing to re-register on every slider change.
  const inputsRef = useRef({ n, shortcutOpen });
  inputsRef.current = { n, shortcutOpen };

  const state = computeState(n, shortcutOpen);

  // (Re)seed cars when routes change (i.e. when the shortcut toggles).
  // Slider changes to N don't re-seed — cars just flow at new speeds.
  useEffect(() => {
    const group = carsGroupRef.current;
    if (!group) return;

    while (group.firstChild) group.removeChild(group.firstChild);
    carsRef.current = [];

    const s = computeState(inputsRef.current.n, shortcutOpen);

    for (const route of s.routes) {
      const count = Math.max(1, Math.round(TARGET_CARS * route.fraction));

      // Route length in time-units — used to space cars uniformly.
      let totalTime = 0;
      for (const e of route.path) totalTime += Math.max(s.times[e], 3);

      for (let i = 0; i < count; i++) {
        // Jittered uniform phases so cars aren't perfectly locked-step.
        const phase = (i + 0.5 + (Math.random() - 0.5) * 0.15) / count;
        const targetT =
          Math.max(0.0001, Math.min(0.9999, phase)) * totalTime;

        // Convert the route-level phase into (legIndex, progress-on-leg).
        let acc = 0;
        let legIdx = 0;
        let legProg = 0;
        for (let j = 0; j < route.path.length; j++) {
          const lt = Math.max(s.times[route.path[j]], 3);
          if (acc + lt > targetT || j === route.path.length - 1) {
            legIdx = j;
            legProg = Math.max(0, Math.min(0.999, (targetT - acc) / lt));
            break;
          }
          acc += lt;
        }

        const el = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        el.setAttribute("r", "2.8");
        el.setAttribute("fill", "#3C3489");
        el.setAttribute("stroke", "#FFFFFF");
        el.setAttribute("stroke-width", "0.5");
        group.appendChild(el);

        carsRef.current.push({
          el,
          route: route.path.slice(),
          legIndex: legIdx,
          progress: legProg,
        });
      }
    }
  }, [shortcutOpen]);

  // Animation loop — runs once for the component's lifetime.
  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      const { n: curN, shortcutOpen: curOpen } = inputsRef.current;
      const s = computeState(curN, curOpen);

      for (const car of carsRef.current) {
        const edgeKey = car.route[car.legIndex];
        const edgeTime = Math.max(s.times[edgeKey], 3);
        const speed = Math.min(0.0022 * (30 / edgeTime), 0.018);
        car.progress += speed;

        while (car.progress >= 1) {
          car.progress -= 1;
          car.legIndex = (car.legIndex + 1) % car.route.length;
        }

        const pathEl = pathRefs[car.route[car.legIndex]].current;
        if (!pathEl) continue;
        const len = pathEl.getTotalLength();
        const pt = pathEl.getPointAtLength(car.progress * len);
        car.el.setAttribute("cx", pt.x.toString());
        car.el.setAttribute("cy", pt.y.toString());
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Derived display values -----------------------------------------------

  const base = 3;
  const maxAdd = 14;
  const edgeStroke = (key: EdgeKey): string => {
    if (key === "SA" || key === "BE") return colorForTime(state.times[key]);
    if (key === "AB") return "#D85A30";
    return "#888780";
  };
  const edgeWidth = (key: EdgeKey): number => {
    if (key === "AB" && !shortcutOpen) return 3;
    return base + (state.traffic[key] / n) * maxAdd;
  };
  const edgeOpacity = (key: EdgeKey): number => {
    if (key === "AB" && !shortcutOpen) return 0.3;
    return state.traffic[key] > 0 ? 1 : 0.25;
  };

  // Stat card styling for the third "compare" card
  let compareClass = "";
  let compareLabel = "";
  let compareValue = "";
  let altLabel = "";
  let altValue = "";

  if (shortcutOpen) {
    altLabel = "If shortcut closed";
    altValue = `${Math.round(state.withoutShortcut)} min`;
    const d = state.currentTime - state.withoutShortcut;
    if (d > 0.5) {
      compareClass = "bpx-paradox";
      compareLabel = "Paradox: shortcut hurts";
      compareValue = `+${Math.round(d)} min`;
    } else if (d < -0.5) {
      compareClass = "bpx-savings";
      compareLabel = "Shortcut helps everyone";
      compareValue = `−${Math.round(-d)} min`;
    } else {
      compareLabel = "At the crossover";
      compareValue = "0 min";
    }
  } else {
    altLabel = "If shortcut opened";
    altValue = `${Math.round(state.withShortcut)} min`;
    const d = state.withShortcut - state.currentTime;
    if (d > 0.5) {
      compareClass = "bpx-savings";
      compareLabel = "Closing was smart";
      compareValue = `−${Math.round(d)} min`;
    } else if (d < -0.5) {
      compareClass = "bpx-paradox";
      compareLabel = "Opening would help";
      compareValue = `${Math.round(-d)} min`;
    } else {
      compareLabel = "At the crossover";
      compareValue = "0 min";
    }
  }

  return (
    <div className="bpx-root">
      <style>{CSS}</style>

      <svg
        className="bpx-svg"
        viewBox="0 0 680 300"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Road network with Start, A, B and End nodes, and a toggleable shortcut between A and B"
      >
        <title>Braess's paradox road network</title>
        <desc>
          Interactive visualization of a four-node network. Drag the slider to
          change demand; tap the shortcut label to open or close the A–B link.
        </desc>

        {/* Edges */}
        <path
          ref={pathSA}
          className="bpx-edge"
          d="M 117 150 C 200 70, 260 50, 335 64"
          stroke={edgeStroke("SA")}
          strokeWidth={edgeWidth("SA")}
          opacity={edgeOpacity("SA")}
          fill="none"
          strokeLinecap="round"
        />
        <path
          ref={pathAE}
          className="bpx-edge"
          d="M 345 64 C 420 50, 480 70, 563 150"
          stroke={edgeStroke("AE")}
          strokeWidth={edgeWidth("AE")}
          opacity={edgeOpacity("AE")}
          fill="none"
          strokeLinecap="round"
        />
        <path
          ref={pathSB}
          className="bpx-edge"
          d="M 117 150 C 200 230, 260 250, 335 236"
          stroke={edgeStroke("SB")}
          strokeWidth={edgeWidth("SB")}
          opacity={edgeOpacity("SB")}
          fill="none"
          strokeLinecap="round"
        />
        <path
          ref={pathBE}
          className="bpx-edge"
          d="M 345 236 C 420 250, 480 230, 563 150"
          stroke={edgeStroke("BE")}
          strokeWidth={edgeWidth("BE")}
          opacity={edgeOpacity("BE")}
          fill="none"
          strokeLinecap="round"
        />
        <path
          ref={pathAB}
          className={`bpx-edge${shortcutOpen ? "" : " bpx-edge-closed"}`}
          d="M 340 88 L 340 212"
          stroke="#D85A30"
          strokeWidth={edgeWidth("AB")}
          opacity={edgeOpacity("AB")}
          fill="none"
          strokeLinecap="round"
        />

        {/* Nodes */}
        <circle cx="90" cy="150" r="28" fill="#D3D1C7" stroke="#5F5E5A" strokeWidth="1" />
        <text className="bpx-node-label" x="90" y="150" textAnchor="middle" dominantBaseline="central" fill="#2C2C2A">
          Start
        </text>

        <circle cx="340" cy="60" r="24" fill="#CECBF6" stroke="#534AB7" strokeWidth="1" />
        <text className="bpx-node-label" x="340" y="60" textAnchor="middle" dominantBaseline="central" fill="#26215C">
          A
        </text>

        <circle cx="340" cy="240" r="24" fill="#CECBF6" stroke="#534AB7" strokeWidth="1" />
        <text className="bpx-node-label" x="340" y="240" textAnchor="middle" dominantBaseline="central" fill="#26215C">
          B
        </text>

        <circle cx="590" cy="150" r="28" fill="#D3D1C7" stroke="#5F5E5A" strokeWidth="1" />
        <text className="bpx-node-label" x="590" y="150" textAnchor="middle" dominantBaseline="central" fill="#2C2C2A">
          End
        </text>

        {/* Edge labels — flow-dependent edges carry the formula */}
        <g>
          <rect className="bpx-label-bg" x="178" y="81" width="70" height="36" rx="4" />
          <text className="bpx-label-formula" x="213" y="93" textAnchor="middle" dominantBaseline="central">
            t ÷ 100
          </text>
          <text className="bpx-label-value" x="213" y="108" textAnchor="middle" dominantBaseline="central">
            {Math.round(state.times.SA)} min
          </text>
        </g>
        <g>
          <rect className="bpx-label-bg" x="432" y="87" width="66" height="26" rx="4" />
          <text className="bpx-label-value" x="465" y="100" textAnchor="middle" dominantBaseline="central">
            45 min
          </text>
        </g>
        <g>
          <rect className="bpx-label-bg" x="178" y="187" width="66" height="26" rx="4" />
          <text className="bpx-label-value" x="211" y="200" textAnchor="middle" dominantBaseline="central">
            45 min
          </text>
        </g>
        <g>
          <rect className="bpx-label-bg" x="430" y="182" width="70" height="36" rx="4" />
          <text className="bpx-label-formula" x="465" y="194" textAnchor="middle" dominantBaseline="central">
            t ÷ 100
          </text>
          <text className="bpx-label-value" x="465" y="209" textAnchor="middle" dominantBaseline="central">
            {Math.round(state.times.BE)} min
          </text>
        </g>
        <g opacity={shortcutOpen ? 1 : 0.3}>
          <rect className="bpx-label-bg" x="352" y="139" width="48" height="24" rx="4" />
          <text className="bpx-label-value" x="376" y="151" textAnchor="middle" dominantBaseline="central">
            0 min
          </text>
        </g>

        {/* Cars — injected imperatively for perf */}
        <g ref={carsGroupRef} />
      </svg>

      <div className="bpx-controls">
        <div className="bpx-slider-wrap">
          <div className="bpx-slider-header">
            <span className="bpx-muted">Cars per hour</span>
            <span className="bpx-bold">{n.toLocaleString()}</span>
          </div>
          <input
            type="range"
            className="bpx-slider"
            min={1000}
            max={4500}
            step={100}
            value={n}
            onChange={(e) => setN(parseInt(e.target.value, 10))}
            aria-label="Cars per hour"
          />
        </div>

        <button
          type="button"
          className="bpx-toggle"
          onClick={() => setShortcutOpen((v) => !v)}
          aria-pressed={shortcutOpen}
        >
          <span
            className={`bpx-toggle-track${shortcutOpen ? " bpx-on" : ""}`}
            aria-hidden="true"
          >
            <span className="bpx-toggle-dot" />
          </span>
          <span className="bpx-toggle-text">
            A→B shortcut {shortcutOpen ? "open" : "closed"}
          </span>
        </button>
      </div>

      <div className="bpx-stats">
        <div className="bpx-stat">
          <div className="bpx-stat-label">Travel time per driver</div>
          <div className="bpx-stat-value">{Math.round(state.currentTime)} min</div>
        </div>
        <div className="bpx-stat">
          <div className="bpx-stat-label">{altLabel}</div>
          <div className="bpx-stat-value">{altValue}</div>
        </div>
        <div className={`bpx-stat ${compareClass}`}>
          <div className="bpx-stat-label">{compareLabel}</div>
          <div className="bpx-stat-value">{compareValue}</div>
        </div>
      </div>

      <div className="bpx-presets" role="group" aria-label="Traffic presets">
        {PRESETS.map((p) => (
          <button
            key={p.n}
            type="button"
            className={`bpx-preset${n === p.n && shortcutOpen ? " bpx-preset-active" : ""}`}
            onClick={() => {
              setN(p.n);
              setShortcutOpen(true);
            }}
          >
            {p.label} · {p.n.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Styles — scoped under .bpx-root. Mobile-first: single column until 560px.
// ---------------------------------------------------------------------------

const CSS = `
.bpx-root {
  --bpx-text: #2C2C2A;
  --bpx-muted: #5F5E5A;
  --bpx-surface: #F1EFE8;
  --bpx-surface-hover: #E6E4DC;
  --bpx-border: #D3D1C7;
  --bpx-label-bg: #FFFFFF;
  --bpx-accent: #3C3489;
  --bpx-shortcut: #D85A30;
  --bpx-paradox-bg: #FCEBEB;
  --bpx-paradox-label: #A32D2D;
  --bpx-paradox-value: #791F1F;
  --bpx-savings-bg: #EAF3DE;
  --bpx-savings-label: #3B6D11;
  --bpx-savings-value: #27500A;

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, system-ui, sans-serif;
  color: var(--bpx-text);
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}
.bpx-root *, .bpx-root *::before, .bpx-root *::after { box-sizing: border-box; }

@media (prefers-color-scheme: dark) {
  .bpx-root {
    --bpx-text: #F1EFE8;
    --bpx-muted: #B4B2A9;
    --bpx-surface: #2C2C2A;
    --bpx-surface-hover: #3A3A37;
    --bpx-border: #444441;
    --bpx-label-bg: #1A1A18;
    --bpx-accent: #AFA9EC;
    --bpx-paradox-bg: #501313;
    --bpx-paradox-label: #F7C1C1;
    --bpx-paradox-value: #FCEBEB;
    --bpx-savings-bg: #173404;
    --bpx-savings-label: #C0DD97;
    --bpx-savings-value: #EAF3DE;
  }
}

.bpx-svg {
  display: block;
  width: 100%;
  height: auto;
  max-width: 100%;
}
.bpx-edge {
  fill: none;
  stroke-linecap: round;
  transition: stroke-width 0.35s ease, stroke 0.35s ease, opacity 0.3s ease;
}
.bpx-edge-closed { stroke-dasharray: 5 5; opacity: 0.3; }
.bpx-label-bg { fill: var(--bpx-label-bg); }
.bpx-label-value {
  font-size: 14px;
  font-weight: 500;
  fill: var(--bpx-text);
}
.bpx-label-formula {
  font-size: 12px;
  font-weight: 400;
  fill: var(--bpx-muted);
  font-style: italic;
}
.bpx-node-label { font-size: 16px; font-weight: 500; }

/* Controls: stacked on mobile, row layout from 560px up */
.bpx-controls {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 20px;
}
@media (min-width: 560px) {
  .bpx-controls {
    flex-direction: row;
    gap: 28px;
    align-items: flex-end;
  }
}

.bpx-slider-wrap { flex: 1; min-width: 0; }
.bpx-slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 10px;
}
.bpx-muted { color: var(--bpx-muted); }
.bpx-bold {
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--bpx-text);
}

.bpx-slider {
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  background: var(--bpx-border);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  touch-action: manipulation;
}
.bpx-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bpx-accent);
  border: 2px solid #FFFFFF;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
}
.bpx-slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bpx-accent);
  border: 2px solid #FFFFFF;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
}
.bpx-slider:focus-visible::-webkit-slider-thumb {
  box-shadow: 0 0 0 4px rgba(60, 52, 137, 0.25);
}

.bpx-toggle {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  font-weight: 500;
  min-height: 44px;
  padding: 6px 0;
  background: transparent;
  border: none;
  color: inherit;
  font-family: inherit;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
.bpx-toggle:focus-visible {
  outline: 2px solid var(--bpx-accent);
  outline-offset: 4px;
  border-radius: 4px;
}
.bpx-toggle-track {
  position: relative;
  width: 44px;
  height: 24px;
  background: var(--bpx-muted);
  border-radius: 12px;
  transition: background 0.2s ease;
  flex-shrink: 0;
}
.bpx-toggle-track.bpx-on { background: var(--bpx-shortcut); }
.bpx-toggle-dot {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #FFFFFF;
  border-radius: 50%;
  transition: transform 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
.bpx-toggle-track.bpx-on .bpx-toggle-dot { transform: translateX(20px); }
.bpx-toggle-text { text-align: left; }

/* Stats: 1 column on mobile, 3 columns from 480px up */
.bpx-stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-top: 20px;
}
@media (min-width: 480px) {
  .bpx-stats { grid-template-columns: repeat(3, 1fr); }
}

.bpx-stat {
  background: var(--bpx-surface);
  border-radius: 10px;
  padding: 14px 16px;
  transition: background 0.35s ease;
}
.bpx-stat-label {
  font-size: 13px;
  color: var(--bpx-muted);
  transition: color 0.35s ease;
  line-height: 1.3;
}
.bpx-stat-value {
  font-size: 24px;
  font-weight: 500;
  margin-top: 6px;
  font-variant-numeric: tabular-nums;
  transition: color 0.35s ease;
}
.bpx-paradox { background: var(--bpx-paradox-bg); }
.bpx-paradox .bpx-stat-label { color: var(--bpx-paradox-label); }
.bpx-paradox .bpx-stat-value { color: var(--bpx-paradox-value); }
.bpx-savings { background: var(--bpx-savings-bg); }
.bpx-savings .bpx-stat-label { color: var(--bpx-savings-label); }
.bpx-savings .bpx-stat-value { color: var(--bpx-savings-value); }

/* Presets */
.bpx-presets {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 16px;
}
.bpx-preset {
  font-size: 13px;
  padding: 10px 14px;
  background: transparent;
  border: 1px solid var(--bpx-border);
  border-radius: 8px;
  color: var(--bpx-muted);
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  min-height: 40px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
.bpx-preset:hover { background: var(--bpx-surface); color: var(--bpx-text); }
.bpx-preset:active { background: var(--bpx-surface-hover); }
.bpx-preset-active {
  background: var(--bpx-surface);
  color: var(--bpx-text);
  border-color: var(--bpx-text);
}
.bpx-preset:focus-visible {
  outline: 2px solid var(--bpx-accent);
  outline-offset: 2px;
}
`;
