"use client"

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Info,
  X,
  Plus,
  Minus,
  Crosshair,
  Hash,
  Infinity as InfinityIcon,
} from "lucide-react";

// --- Grid & visual constants ---------------------------------------------
const GRID = 801;
const CENTER = Math.floor(GRID / 2);
const MIN_SCALE = 1;
const MAX_SCALE = 96;
const DEFAULT_SCALE = 34;
const COUNT_MIN_SCALE = 22;
const LONG_PRESS_MS = 500;
const TAP_MOVEMENT_PX = 6;

const COLOR_BG = "#f5f1e8";              // warm cream — "white" cells
const COLOR_INK = "#1a1714";             // warm near-black — "black" cells
const COLOR_ANT_REGULAR = "#e94b3c";     // vermillion
const COLOR_ANT_INVERSE = "#0f7a82";     // deep teal
const COLOR_TEXT = "#f5ebd7";
const COLOR_COUNT_ON_LIGHT = "rgba(26, 23, 20, 0.42)";
const COLOR_COUNT_ON_DARK = "rgba(245, 241, 232, 0.38)";

const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];
// Steps per 60fps frame. Values below 1 mean "one step every N frames" — e.g.
// 2/60 ≈ 1 step every 30 frames ≈ 2 steps per second. A fractional accumulator
// in the animation loop handles values below 1.
const SPEEDS = [2 / 60, 4, 20, 100, 500, 2500];
const SPEED_LABELS = ["2/s", "240/s", "1.2k/s", "6k/s", "30k/s", "150k/s"];

// --- Types ---------------------------------------------------------------
type AntType = "regular" | "inverse";
type Ant = { id: number; x: number; y: number; dir: number; type: AntType };
type Point = { x: number; y: number };

type TapState = {
  type: "tap";
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  antId: number | null; // ant id under the initial press, if any
  longPressTimer: number | null;
  consumed: boolean; // becomes true once long-press fires
};

type DragState =
  | TapState
  | { type: "pan"; lastX: number; lastY: number }
  | { type: "dragAnt"; antId: number }
  | {
      type: "pinch";
      startDist: number;
      startScale: number;
      cx: number;
      cy: number;
      startOffset: Point;
    };

function makeInitialAnts(): Ant[] {
  return [{ id: 1, x: CENTER, y: CENTER, dir: 0, type: "regular" }];
}

// -------------------------------------------------------------------------

export default function LangtonsAntApp() {
  // Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation state
  const cellsRef = useRef<Uint8Array>(new Uint8Array(GRID * GRID));
  const countsRef = useRef<Uint32Array>(new Uint32Array(GRID * GRID));
  const antsRef = useRef<Ant[]>(makeInitialAnts());
  const nextAntIdRef = useRef<number>(2);
  const stepCountRef = useRef<number>(0);

  // View
  const scaleRef = useRef<number>(DEFAULT_SCALE);
  const offsetRef = useRef<Point>({ x: 0, y: 0 });

  // Loop
  const runningRef = useRef<boolean>(false);
  const speedRef = useRef<number>(2);
  // Fractional step budget — advanced each frame by SPEEDS[speedRef]; a step
  // fires each time it crosses an integer boundary. Lets slow speeds pace
  // themselves across multiple frames without sub-frame timing.
  const stepAccumulatorRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Option refs (mirror state so the sim loop & draw can read without re-subscribing)
  const showCountsRef = useRef<boolean>(false);
  const torusRef = useRef<boolean>(false);

  // Gestures
  const pointersRef = useRef<Map<number, Point>>(new Map());
  const dragStateRef = useRef<DragState | null>(null);

  // UI state
  const [running, setRunning] = useState<boolean>(false);
  const [stepCount, setStepCount] = useState<number>(0);
  const [speedIdx, setSpeedIdx] = useState<number>(2);
  const [scaleDisplay, setScaleDisplay] = useState<number>(DEFAULT_SCALE);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [showCounts, setShowCounts] = useState<boolean>(false);
  const [torus, setTorus] = useState<boolean>(false);
  // Bumped whenever the ants list changes shape (add/remove/type).
  const [antVersion, setAntVersion] = useState<number>(0);

  // --- Offscreen canvas --------------------------------------------------
  useEffect(() => {
    const oc = document.createElement("canvas");
    oc.width = GRID;
    oc.height = GRID;
    const octx = oc.getContext("2d");
    if (octx) {
      octx.fillStyle = COLOR_BG;
      octx.fillRect(0, 0, GRID, GRID);
    }
    offscreenRef.current = oc;
  }, []);

  // --- Ant helpers -------------------------------------------------------
  const findAntIdAt = useCallback(
    (gx: number, gy: number): number | null => {
      const ants = antsRef.current;
      // Iterate top-most first (later-added ants win)
      for (let i = ants.length - 1; i >= 0; i--) {
        if (ants[i].x === gx && ants[i].y === gy) return ants[i].id;
      }
      return null;
    },
    []
  );

  const findAntIndexById = useCallback((id: number): number => {
    const ants = antsRef.current;
    for (let i = 0; i < ants.length; i++) if (ants[i].id === id) return i;
    return -1;
  }, []);

  // --- Draw --------------------------------------------------------------
  const draw = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.fillStyle = "#120f0c";
    ctx.fillRect(0, 0, w, h);

    const scale = scaleRef.current;
    const offset = offsetRef.current;

    if (offscreenRef.current) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        offscreenRef.current,
        -offset.x * scale,
        -offset.y * scale,
        GRID * scale,
        GRID * scale
      );
    }

    const startX = Math.max(0, Math.floor(offset.x));
    const startY = Math.max(0, Math.floor(offset.y));
    const endX = Math.min(GRID, Math.ceil(offset.x + w / scale) + 1);
    const endY = Math.min(GRID, Math.ceil(offset.y + h / scale) + 1);

    // Grid lines when zoomed in
    if (scale >= 14) {
      ctx.strokeStyle = "rgba(26, 23, 20, 0.09)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = startX; x <= endX; x++) {
        const px = Math.round((x - offset.x) * scale) + 0.5;
        ctx.moveTo(px, 0);
        ctx.lineTo(px, h);
      }
      for (let y = startY; y <= endY; y++) {
        const py = Math.round((y - offset.y) * scale) + 0.5;
        ctx.moveTo(0, py);
        ctx.lineTo(w, py);
      }
      ctx.stroke();
    }

    // Visit count overlay
    if (showCountsRef.current && scale >= COUNT_MIN_SCALE) {
      const fontSize = Math.min(scale * 0.42, 14);
      ctx.font = `500 ${fontSize}px "IBM Plex Mono", ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const cells = cellsRef.current;
      const counts = countsRef.current;
      let lastColor = "";
      for (let y = startY; y < endY; y++) {
        const row = y * GRID;
        for (let x = startX; x < endX; x++) {
          const idx = row + x;
          const c = counts[idx];
          if (c === 0) continue;
          const color = cells[idx] ? COLOR_COUNT_ON_DARK : COLOR_COUNT_ON_LIGHT;
          if (color !== lastColor) {
            ctx.fillStyle = color;
            lastColor = color;
          }
          const cx = (x + 0.5 - offset.x) * scale;
          const cy = (y + 0.5 - offset.y) * scale;
          ctx.fillText(String(c), cx, cy);
        }
      }
    }

    // Draw all ants — pass 1: colored squares
    const ants = antsRef.current;
    const pad = Math.max(1, scale * 0.14);
    for (let i = 0; i < ants.length; i++) {
      const ant = ants[i];
      const ax = (ant.x - offset.x) * scale;
      const ay = (ant.y - offset.y) * scale;
      if (ax + scale <= 0 || ax >= w || ay + scale <= 0 || ay >= h) continue;
      ctx.fillStyle =
        ant.type === "regular" ? COLOR_ANT_REGULAR : COLOR_ANT_INVERSE;
      ctx.fillRect(ax + pad, ay + pad, scale - pad * 2, scale - pad * 2);
    }

    // Pass 2: direction triangles (all cream)
    ctx.fillStyle = COLOR_BG;
    for (let i = 0; i < ants.length; i++) {
      const ant = ants[i];
      const ax = (ant.x - offset.x) * scale;
      const ay = (ant.y - offset.y) * scale;
      if (ax + scale <= 0 || ax >= w || ay + scale <= 0 || ay >= h) continue;
      ctx.beginPath();
      const cx = ax + scale / 2;
      const cy = ay + scale / 2;
      const ts = Math.max(1.5, scale * 0.22);
      if (ant.dir === 0) {
        ctx.moveTo(cx, cy - ts);
        ctx.lineTo(cx - ts * 0.7, cy + ts * 0.5);
        ctx.lineTo(cx + ts * 0.7, cy + ts * 0.5);
      } else if (ant.dir === 1) {
        ctx.moveTo(cx + ts, cy);
        ctx.lineTo(cx - ts * 0.5, cy - ts * 0.7);
        ctx.lineTo(cx - ts * 0.5, cy + ts * 0.7);
      } else if (ant.dir === 2) {
        ctx.moveTo(cx, cy + ts);
        ctx.lineTo(cx - ts * 0.7, cy - ts * 0.5);
        ctx.lineTo(cx + ts * 0.7, cy - ts * 0.5);
      } else {
        ctx.moveTo(cx - ts, cy);
        ctx.lineTo(cx + ts * 0.5, cy - ts * 0.7);
        ctx.lineTo(cx + ts * 0.5, cy + ts * 0.7);
      }
      ctx.closePath();
      ctx.fill();
    }
  }, []);

  // --- Simulation step ---------------------------------------------------
  const step = useCallback(
    (n: number): { removed: boolean; allGone: boolean } => {
      const cells = cellsRef.current;
      const counts = countsRef.current;
      const ants = antsRef.current;
      const oc = offscreenRef.current;
      if (!oc) return { removed: false, allGone: ants.length === 0 };
      const octx = oc.getContext("2d");
      if (!octx) return { removed: false, allGone: ants.length === 0 };

      const torusOn = torusRef.current;
      let removed = false;
      let steps = 0;
      const cellCounts = new Map<number, number>();

      for (let i = 0; i < n; i++) {
        if (ants.length === 0) break;

        // Phase 1: every ant reads its current cell and decides its new
        // direction. We read the PRE-flip color so the rule is correct.
        for (let k = 0; k < ants.length; k++) {
          const ant = ants[k];
          const idx = ant.y * GRID + ant.x;
          const cell = cells[idx];
          if (ant.type === "regular") {
            // white → turn right; black → turn left
            ant.dir = cell ? (ant.dir + 3) & 3 : (ant.dir + 1) & 3;
          } else {
            // inverse: white → turn left; black → turn right
            ant.dir = cell ? (ant.dir + 1) & 3 : (ant.dir + 3) & 3;
          }
        }

        // Phase 2: tally how many ants stand on each cell this tick; apply
        // the flip only where the count is odd (even count cancels out).
        cellCounts.clear();
        for (let k = 0; k < ants.length; k++) {
          const a = ants[k];
          const idx = a.y * GRID + a.x;
          cellCounts.set(idx, (cellCounts.get(idx) ?? 0) + 1);
        }
        cellCounts.forEach((cnt, idx) => {
          counts[idx] += cnt;
          if (cnt & 1) {
            const newVal = (cells[idx] ^ 1) as 0 | 1;
            cells[idx] = newVal;
            octx.fillStyle = newVal ? COLOR_INK : COLOR_BG;
            octx.fillRect(idx % GRID, Math.floor(idx / GRID), 1, 1);
          }
        });

        // Phase 3: everyone moves forward (with optional torus wrap).
        for (let k = 0; k < ants.length; k++) {
          const a = ants[k];
          a.x += DX[a.dir];
          a.y += DY[a.dir];
          if (torusOn) {
            if (a.x < 0) a.x += GRID;
            else if (a.x >= GRID) a.x -= GRID;
            if (a.y < 0) a.y += GRID;
            else if (a.y >= GRID) a.y -= GRID;
          }
        }

        // Phase 4: remove any ants that walked off the edge.
        if (!torusOn) {
          for (let k = ants.length - 1; k >= 0; k--) {
            const a = ants[k];
            if (a.x < 0 || a.x >= GRID || a.y < 0 || a.y >= GRID) {
              ants.splice(k, 1);
              removed = true;
            }
          }
        }

        steps++;
        if (ants.length === 0) break;
      }

      stepCountRef.current += steps;
      return { removed, allGone: ants.length === 0 };
    },
    []
  );

  // --- View helpers ------------------------------------------------------
  const centerOnAnts = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ants = antsRef.current;
    let cx = CENTER;
    let cy = CENTER;
    if (ants.length > 0) {
      // Center on the centroid of all ants — useful when they've spread.
      let sx = 0;
      let sy = 0;
      for (const a of ants) {
        sx += a.x;
        sy += a.y;
      }
      cx = sx / ants.length;
      cy = sy / ants.length;
    }
    offsetRef.current = {
      x: cx + 0.5 - rect.width / scaleRef.current / 2,
      y: cy + 0.5 - rect.height / scaleRef.current / 2,
    };
    draw();
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = false;
      }
      centerOnAnts();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("resize", resize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [centerOnAnts]);

  // --- Animation loop ----------------------------------------------------
  useEffect(() => {
    const loop = () => {
      if (!runningRef.current) return;
      stepAccumulatorRef.current += SPEEDS[speedRef.current];
      const whole = Math.floor(stepAccumulatorRef.current);
      let removed = false;
      let allGone = false;
      if (whole > 0) {
        stepAccumulatorRef.current -= whole;
        const res = step(whole);
        removed = res.removed;
        allGone = res.allGone;
      }
      draw();
      if (whole > 0) setStepCount(stepCountRef.current);
      if (removed) setAntVersion((v) => v + 1);
      if (allGone) {
        runningRef.current = false;
        setRunning(false);
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    if (running) {
      runningRef.current = true;
      setHasStarted(true);
      // Prime so the very first frame fires a step — otherwise at 2/s the
      // user would wait ~500ms for anything to happen after hitting play.
      stepAccumulatorRef.current = 1;
      rafRef.current = requestAnimationFrame(loop);
    } else {
      runningRef.current = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      draw();
    }
    return () => {
      runningRef.current = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [running, draw, step]);

  useEffect(() => {
    speedRef.current = speedIdx;
  }, [speedIdx]);

  useEffect(() => {
    showCountsRef.current = showCounts;
    draw();
  }, [showCounts, draw]);

  useEffect(() => {
    torusRef.current = torus;
  }, [torus]);

  // --- Controls ----------------------------------------------------------
  const reset = useCallback((): void => {
    cellsRef.current.fill(0);
    countsRef.current.fill(0);
    antsRef.current = makeInitialAnts();
    nextAntIdRef.current = 2;
    stepCountRef.current = 0;
    setStepCount(0);
    setRunning(false);
    setHasStarted(false);
    setAntVersion((v) => v + 1);
    const oc = offscreenRef.current;
    if (oc) {
      const octx = oc.getContext("2d");
      if (octx) {
        octx.fillStyle = COLOR_BG;
        octx.fillRect(0, 0, GRID, GRID);
      }
    }
    scaleRef.current = DEFAULT_SCALE;
    setScaleDisplay(DEFAULT_SCALE);
    centerOnAnts();
  }, [centerOnAnts]);

  const stepOnce = useCallback((): void => {
    if (running || antsRef.current.length === 0) return;
    const { removed, allGone } = step(1);
    draw();
    setStepCount(stepCountRef.current);
    setHasStarted(true);
    if (removed) setAntVersion((v) => v + 1);
    if (allGone) setRunning(false);
  }, [running, step, draw]);

  const addAnt = useCallback(
    (type: AntType): void => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scale = scaleRef.current;
      const cx = Math.floor(offsetRef.current.x + rect.width / scale / 2);
      const cy = Math.floor(offsetRef.current.y + rect.height / scale / 2);
      const x = Math.max(0, Math.min(GRID - 1, cx));
      const y = Math.max(0, Math.min(GRID - 1, cy));
      antsRef.current.push({
        id: nextAntIdRef.current++,
        x,
        y,
        dir: 0,
        type,
      });
      setAntVersion((v) => v + 1);
      draw();
    },
    [draw]
  );

  const zoomAt = useCallback(
    (factor: number, sx?: number, sy?: number): void => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (sx === undefined) sx = rect.width / 2;
      if (sy === undefined) sy = rect.height / 2;
      const oldScale = scaleRef.current;
      const newScale = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, oldScale * factor)
      );
      if (newScale === oldScale) return;
      offsetRef.current.x += sx * (1 / oldScale - 1 / newScale);
      offsetRef.current.y += sy * (1 / oldScale - 1 / newScale);
      scaleRef.current = newScale;
      setScaleDisplay(newScale);
      draw();
    },
    [draw]
  );

  // --- Pointer gestures --------------------------------------------------
  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 1) {
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const gx = Math.floor(sx / scaleRef.current + offsetRef.current.x);
      const gy = Math.floor(sy / scaleRef.current + offsetRef.current.y);
      // Ant interactions only work while paused (per spec: "before the simulation").
      const antId = !runningRef.current ? findAntIdAt(gx, gy) : null;

      let longPressTimer: number | null = null;
      if (antId !== null) {
        const targetId = antId;
        longPressTimer = window.setTimeout(() => {
          const ds = dragStateRef.current;
          if (
            ds?.type === "tap" &&
            ds.antId === targetId &&
            !ds.consumed &&
            !runningRef.current
          ) {
            const idx = findAntIndexById(targetId);
            if (idx !== -1) {
              antsRef.current.splice(idx, 1);
              setAntVersion((v) => v + 1);
              draw();
            }
            ds.consumed = true;
          }
        }, LONG_PRESS_MS);
      }

      dragStateRef.current = {
        type: "tap",
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        antId,
        longPressTimer,
        consumed: false,
      };
    } else if (pointersRef.current.size === 2) {
      const prev = dragStateRef.current;
      if (prev?.type === "tap" && prev.longPressTimer !== null) {
        window.clearTimeout(prev.longPressTimer);
      }
      const pts = [...pointersRef.current.values()];
      const p1 = pts[0];
      const p2 = pts[1];
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      dragStateRef.current = {
        type: "pinch",
        startDist: dist,
        startScale: scaleRef.current,
        cx: (p1.x + p2.x) / 2,
        cy: (p1.y + p2.y) / 2,
        startOffset: { ...offsetRef.current },
      };
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>): void => {
    const existing = pointersRef.current.get(e.pointerId);
    if (!existing) return;
    existing.x = e.clientX;
    existing.y = e.clientY;

    const ds = dragStateRef.current;
    if (!ds) return;

    // Promote tap to drag/pan once threshold is crossed.
    if (ds.type === "tap" && !ds.consumed) {
      const dx = e.clientX - ds.startX;
      const dy = e.clientY - ds.startY;
      if (Math.hypot(dx, dy) > TAP_MOVEMENT_PX) {
        if (ds.longPressTimer !== null) window.clearTimeout(ds.longPressTimer);
        if (ds.antId !== null && !runningRef.current) {
          dragStateRef.current = { type: "dragAnt", antId: ds.antId };
        } else {
          dragStateRef.current = {
            type: "pan",
            lastX: ds.lastX,
            lastY: ds.lastY,
          };
        }
      }
    }

    const curr = dragStateRef.current;
    if (!curr) return;

    if (curr.type === "pan") {
      const dx = e.clientX - curr.lastX;
      const dy = e.clientY - curr.lastY;
      offsetRef.current.x -= dx / scaleRef.current;
      offsetRef.current.y -= dy / scaleRef.current;
      curr.lastX = e.clientX;
      curr.lastY = e.clientY;
      if (!runningRef.current) draw();
    } else if (curr.type === "dragAnt") {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const gx = Math.floor(sx / scaleRef.current + offsetRef.current.x);
      const gy = Math.floor(sy / scaleRef.current + offsetRef.current.y);
      const clampedX = Math.max(0, Math.min(GRID - 1, gx));
      const clampedY = Math.max(0, Math.min(GRID - 1, gy));
      const idx = findAntIndexById(curr.antId);
      if (idx !== -1) {
        const ant = antsRef.current[idx];
        if (ant.x !== clampedX || ant.y !== clampedY) {
          ant.x = clampedX;
          ant.y = clampedY;
          draw();
        }
      }
    } else if (curr.type === "pinch" && pointersRef.current.size >= 2) {
      const pts = [...pointersRef.current.values()];
      const p1 = pts[0];
      const p2 = pts[1];
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const ratio = dist / curr.startDist;
      const newScale = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, curr.startScale * ratio)
      );
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cx0 = curr.cx - rect.left;
      const cy0 = curr.cy - rect.top;
      const cxNow = (p1.x + p2.x) / 2 - rect.left;
      const cyNow = (p1.y + p2.y) / 2 - rect.top;
      const oldScale = curr.startScale;
      offsetRef.current.x =
        curr.startOffset.x + cx0 / oldScale - cxNow / newScale;
      offsetRef.current.y =
        curr.startOffset.y + cy0 / oldScale - cyNow / newScale;
      scaleRef.current = newScale;
      setScaleDisplay(newScale);
      if (!runningRef.current) draw();
    }
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLCanvasElement>): void => {
    const ds = dragStateRef.current;

    if (ds?.type === "tap" && ds.longPressTimer !== null) {
      window.clearTimeout(ds.longPressTimer);
    }

    if (
      ds?.type === "tap" &&
      !ds.consumed &&
      pointersRef.current.size === 1 &&
      pointersRef.current.has(e.pointerId)
    ) {
      if (ds.antId === null) {
        // Tap on empty cell: toggle its color.
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const sx = e.clientX - rect.left;
          const sy = e.clientY - rect.top;
          const gx = Math.floor(sx / scaleRef.current + offsetRef.current.x);
          const gy = Math.floor(sy / scaleRef.current + offsetRef.current.y);
          if (gx >= 0 && gx < GRID && gy >= 0 && gy < GRID) {
            const idx = gy * GRID + gx;
            const newVal = cellsRef.current[idx] ? 0 : 1;
            cellsRef.current[idx] = newVal;
            const oc = offscreenRef.current;
            if (oc) {
              const octx = oc.getContext("2d");
              if (octx) {
                octx.fillStyle = newVal ? COLOR_INK : COLOR_BG;
                octx.fillRect(gx, gy, 1, 1);
              }
            }
            draw();
          }
        }
      }
      // Tap on ant — no immediate action. Long-press removes; drag moves.
    }

    pointersRef.current.delete(e.pointerId);

    if (pointersRef.current.size === 0) {
      dragStateRef.current = null;
    } else if (
      pointersRef.current.size === 1 &&
      dragStateRef.current?.type === "pinch"
    ) {
      const remaining = [...pointersRef.current.values()][0];
      dragStateRef.current = {
        type: "pan",
        lastX: remaining.x,
        lastY: remaining.y,
      };
    }
  };

  const onWheel = (e: ReactWheelEvent<HTMLCanvasElement>): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const factor = Math.exp(-e.deltaY * 0.0015);
    zoomAt(factor, sx, sy);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const prevent = (ev: Event) => ev.preventDefault();
    canvas.addEventListener("wheel", prevent, { passive: false });
    canvas.addEventListener("touchmove", prevent, { passive: false });
    return () => {
      canvas.removeEventListener("wheel", prevent);
      canvas.removeEventListener("touchmove", prevent);
    };
  }, []);

  // --- Derived values ----------------------------------------------------
  const zoomPct = Math.round((scaleDisplay / DEFAULT_SCALE) * 100);

  // useMemo here makes antVersion an explicit dependency so React recomputes
  // these when the ants list changes shape.
  const antStats = useMemo(() => {
    const a = antsRef.current;
    let regular = 0;
    let inverse = 0;
    for (const x of a) {
      if (x.type === "regular") regular++;
      else inverse++;
    }
    return { total: a.length, regular, inverse };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [antVersion]);
  const noAnts = antStats.total === 0;

  // --- Render ------------------------------------------------------------
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .ff-display { font-family: 'Fraunces', 'Iowan Old Style', 'Palatino', serif; font-optical-sizing: auto; }
        .ff-mono    { font-family: 'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace; }
        .app-canvas { touch-action: none; cursor: crosshair; user-select: none; -webkit-user-select: none; }
        .ant-range { -webkit-appearance: none; appearance: none; background: transparent; }
        .ant-range::-webkit-slider-runnable-track { height: 2px; background: rgba(245,235,215,0.18); border-radius: 999px; }
        .ant-range::-moz-range-track { height: 2px; background: rgba(245,235,215,0.18); border-radius: 999px; }
        .ant-range::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          height: 16px; width: 16px; border-radius: 999px;
          background: ${COLOR_ANT_REGULAR}; margin-top: -7px;
          border: 2px solid ${COLOR_INK};
          box-shadow: 0 0 0 1px rgba(245,235,215,0.25);
          cursor: pointer;
        }
        .ant-range::-moz-range-thumb {
          height: 16px; width: 16px; border-radius: 999px;
          background: ${COLOR_ANT_REGULAR}; border: 2px solid ${COLOR_INK};
          box-shadow: 0 0 0 1px rgba(245,235,215,0.25);
          cursor: pointer;
        }
        .spawn-btn { transition: transform 0.12s ease, box-shadow 0.12s ease; }
        .spawn-btn:active { transform: scale(0.92); }
      `}</style>

      <div
        className="relative w-full flex flex-col overflow-hidden rounded-2xl"
        style={{ background: COLOR_INK, color: COLOR_TEXT, height: "clamp(420px, 65vh, 640px)" }}
      >
        {/* Top bar */}
        <header className="flex items-center justify-between gap-3 px-4 pt-3 pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <ToggleButton
              active={showCounts}
              onClick={() => setShowCounts((v) => !v)}
              label="Toggle visit counts"
              activeLabel="counts"
            >
              <Hash size={15} strokeWidth={2} />
            </ToggleButton>
            <ToggleButton
              active={torus}
              onClick={() => setTorus((v) => !v)}
              label="Toggle torus topology"
              activeLabel="wrap"
            >
              <InfinityIcon size={17} strokeWidth={2} />
            </ToggleButton>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="ff-mono text-right hidden min-[380px]:block">
              <div className="text-[9px] uppercase tracking-[0.18em] opacity-40 leading-none mb-1">
                ants
              </div>
              <div className="text-sm tabular-nums leading-none flex items-baseline gap-1 justify-end">
                <span>{antStats.total}</span>
                {antStats.regular > 0 && antStats.inverse > 0 && (
                  <span className="text-[10px] opacity-50">
                    <span style={{ color: COLOR_ANT_REGULAR }}>
                      {antStats.regular}
                    </span>
                    <span className="opacity-40">/</span>
                    <span style={{ color: COLOR_ANT_INVERSE }}>
                      {antStats.inverse}
                    </span>
                  </span>
                )}
              </div>
            </div>
            <div className="ff-mono text-right">
              <div className="text-[9px] uppercase tracking-[0.18em] opacity-40 leading-none mb-1">
                steps
              </div>
              <div className="text-sm tabular-nums leading-none">
                {stepCount.toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => setShowInfo(true)}
              className="p-2 -mr-2 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="About"
            >
              <Info size={18} strokeWidth={1.5} />
            </button>
          </div>
        </header>

        {/* Canvas area */}
        <main className="flex-1 relative overflow-hidden">
          <canvas
            ref={canvasRef}
            className="app-canvas w-full h-full block"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={onWheel}
          />

          {/* Top-left: ant spawners + zoom readout */}
          <div className="absolute left-3 top-3 flex flex-col gap-2 items-start">
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => addAnt("regular")}
                className="spawn-btn h-10 w-10 flex items-center justify-center rounded-full"
                style={{
                  background: COLOR_ANT_REGULAR,
                  color: COLOR_BG,
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.35), inset 0 0 0 2px rgba(0,0,0,0.1)",
                }}
                aria-label="Add regular ant"
                title="Add a regular ant at the center of the view"
              >
                <Plus size={18} strokeWidth={2.75} />
              </button>
              <button
                onClick={() => addAnt("inverse")}
                className="spawn-btn h-10 w-10 flex items-center justify-center rounded-full"
                style={{
                  background: COLOR_ANT_INVERSE,
                  color: COLOR_BG,
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.35), inset 0 0 0 2px rgba(0,0,0,0.1)",
                }}
                aria-label="Add inverse ant"
                title="Add an inverse ant at the center of the view"
              >
                <Plus size={18} strokeWidth={2.75} />
              </button>
            </div>
            <div className="ff-mono text-[10px] uppercase tracking-[0.18em] opacity-55 bg-[#120f0c]/70 backdrop-blur px-2 py-1 rounded-sm">
              {zoomPct}%
            </div>
          </div>

          {/* Top-right: zoom + center */}
          <div className="absolute right-3 top-3 flex flex-col gap-1.5">
            <button
              onClick={() => zoomAt(1.4)}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-[#120f0c]/85 backdrop-blur border border-white/10 hover:bg-[#120f0c] transition"
              aria-label="Zoom in"
            >
              <Plus size={16} strokeWidth={1.75} />
            </button>
            <button
              onClick={() => zoomAt(1 / 1.4)}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-[#120f0c]/85 backdrop-blur border border-white/10 hover:bg-[#120f0c] transition"
              aria-label="Zoom out"
            >
              <Minus size={16} strokeWidth={1.75} />
            </button>
            <button
              onClick={centerOnAnts}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-[#120f0c]/85 backdrop-blur border border-white/10 hover:bg-[#120f0c] transition"
              aria-label="Center on ants"
            >
              <Crosshair size={15} strokeWidth={1.75} />
            </button>
          </div>

          {/* Bottom-left: grid dims */}
          <div className="absolute left-3 bottom-3 ff-mono text-[10px] uppercase tracking-[0.18em] opacity-40">
            {GRID} × {GRID}
            {torus && <span className="ml-2 opacity-70">· torus</span>}
          </div>

          {/* Onboarding hint */}
          {!hasStarted && stepCount === 0 && !showInfo && !noAnts && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none px-3 max-w-[92vw]">
              <div
                className="ff-mono text-[10.5px] tracking-wide text-center px-3.5 py-2 rounded-sm border leading-relaxed"
                style={{
                  background: "rgba(18,15,12,0.92)",
                  borderColor: "rgba(245,235,215,0.15)",
                  color: "rgba(245,235,215,0.72)",
                }}
              >
                <div>tap cells to paint · drag ants to position</div>
                <div className="opacity-70 mt-0.5">
                  <span style={{ color: COLOR_ANT_REGULAR }}>＋</span> add ants ·
                  long-press to remove
                </div>
              </div>
            </div>
          )}

          {/* Counts visible but too zoomed out */}
          {showCounts && scaleDisplay < COUNT_MIN_SCALE && hasStarted && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none px-3">
              <div
                className="ff-mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-sm"
                style={{
                  background: "rgba(18,15,12,0.8)",
                  color: "rgba(245,235,215,0.55)",
                }}
              >
                zoom in to read counts
              </div>
            </div>
          )}

          {/* No ants */}
          {noAnts && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none px-3">
              <div
                className="ff-mono text-[11px] uppercase tracking-[0.2em] font-semibold px-3.5 py-2 rounded-sm"
                style={{ background: COLOR_ANT_REGULAR, color: COLOR_INK }}
              >
                no ants · add one to continue
              </div>
            </div>
          )}
        </main>

        {/* Footer controls */}
        <footer
          className="border-t border-white/10 px-3 pt-3 pb-3 shrink-0"
          style={{ background: COLOR_INK }}
        >
          <div className="flex items-stretch gap-2 max-w-3xl mx-auto">
            <button
              onClick={() => setRunning((r) => !r)}
              disabled={noAnts}
              className="h-12 w-14 flex items-center justify-center rounded-sm font-semibold transition disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: noAnts ? "rgba(255,255,255,0.06)" : COLOR_ANT_REGULAR,
                color: COLOR_INK,
              }}
              aria-label={running ? "Pause" : "Play"}
            >
              {running ? (
                <Pause size={20} strokeWidth={2} fill={COLOR_INK} />
              ) : (
                <Play
                  size={20}
                  strokeWidth={2}
                  fill={COLOR_INK}
                  className="ml-0.5"
                />
              )}
            </button>

            <button
              onClick={stepOnce}
              disabled={running || noAnts}
              className="h-12 w-12 flex items-center justify-center rounded-sm border border-white/15 hover:bg-white/5 disabled:opacity-25 transition"
              aria-label="Step once"
            >
              <SkipForward size={17} strokeWidth={1.75} />
            </button>

            <button
              onClick={reset}
              className="h-12 w-12 flex items-center justify-center rounded-sm border border-white/15 hover:bg-white/5 transition"
              aria-label="Reset"
            >
              <RotateCcw size={16} strokeWidth={1.75} />
            </button>

            <div className="flex-1 flex flex-col justify-center gap-1.5 pl-2 min-w-0">
              <div className="flex items-baseline justify-between">
                <span className="ff-mono text-[9px] uppercase tracking-[0.18em] opacity-40">
                  speed
                </span>
                <span className="ff-mono text-[11px] tabular-nums opacity-70">
                  {SPEED_LABELS[speedIdx]}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={SPEEDS.length - 1}
                step={1}
                value={speedIdx}
                onChange={(e) => setSpeedIdx(parseInt(e.target.value, 10))}
                className="ant-range w-full"
              />
            </div>
          </div>
        </footer>

        {/* Info modal */}
        {showInfo && (
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
            onClick={() => setShowInfo(false)}
          >
            <div
              className="w-full sm:max-w-md relative border-t sm:border max-h-[90vh] overflow-y-auto"
              style={{
                background: COLOR_BG,
                color: COLOR_INK,
                borderColor: "rgba(26,23,20,0.12)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowInfo(false)}
                className="absolute top-3 right-3 p-2 hover:bg-black/5 rounded-sm z-10"
                aria-label="Close"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
              <div className="p-6 sm:p-7 pb-[max(env(safe-area-inset-bottom),1.75rem)]">
                <h2 className="ff-display italic text-3xl leading-none mb-1">
                  Langton&rsquo;s ant
                </h2>
                <p className="ff-mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-5">
                  Two-state Turmite · 1986
                </p>

                <div className="space-y-4 text-[14px] leading-relaxed">
                  <p>
                    An ant walks on an infinite grid. At every step it follows
                    two rules and nothing else:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex gap-3 items-start">
                      <span
                        className="w-4 h-4 mt-0.5 shrink-0 border"
                        style={{
                          background: COLOR_BG,
                          borderColor: "rgba(26,23,20,0.4)",
                        }}
                      />
                      <span>
                        On a <b>white</b> square &mdash; turn 90° right, flip
                        the square to black, step forward.
                      </span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ background: COLOR_INK }}
                      />
                      <span>
                        On a <b>black</b> square &mdash; turn 90° left, flip
                        the square to white, step forward.
                      </span>
                    </li>
                  </ul>
                  <p className="opacity-75 text-[13px] pt-1">
                    From this tiny rule emerge three phases: a brief symmetric
                    start, roughly ten thousand steps of apparent chaos, and
                    then &mdash; from any starting pattern ever tested &mdash; a
                    diagonal &ldquo;highway&rdquo; the ant builds forever.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1a1714]/10">
                  <p className="ff-mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3">
                    Ants
                  </p>
                  <div className="space-y-3 text-[13px] leading-relaxed">
                    <div className="flex gap-3 items-start">
                      <span
                        className="w-5 h-5 mt-0.5 shrink-0 rounded-[3px]"
                        style={{ background: COLOR_ANT_REGULAR }}
                      />
                      <span>
                        <b>Regular ant.</b> Right on white, left on black &mdash;
                        the classic rule.
                      </span>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span
                        className="w-5 h-5 mt-0.5 shrink-0 rounded-[3px]"
                        style={{ background: COLOR_ANT_INVERSE }}
                      />
                      <span>
                        <b>Inverse ant.</b> The mirrored rule &mdash; left on
                        white, right on black.
                      </span>
                    </div>
                    <p className="text-[12.5px] opacity-75 pt-1">
                      All ants step at the same time. If an even number of ants
                      leave the same square in one tick, their flips cancel and
                      that square keeps its color.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1a1714]/10">
                  <p className="ff-mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3">
                    Options
                  </p>
                  <dl className="text-[12.5px] grid grid-cols-[auto,1fr] gap-x-3 gap-y-2.5 items-start">
                    <dt className="flex items-center justify-center w-6 h-6 rounded-sm border border-[#1a1714]/25">
                      <Hash size={13} strokeWidth={2} />
                    </dt>
                    <dd>
                      <b>Visit counts.</b> Overlays each square with how many
                      ant-steps have originated from it.
                    </dd>
                    <dt className="flex items-center justify-center w-6 h-6 rounded-sm border border-[#1a1714]/25">
                      <InfinityIcon size={14} strokeWidth={2} />
                    </dt>
                    <dd>
                      <b>Torus topology.</b> Wraps the board at every edge, so
                      ants walk on a donut &mdash; none can fall off.
                    </dd>
                  </dl>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1a1714]/10">
                  <p className="ff-mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3">
                    Controls
                  </p>
                  <dl className="ff-mono text-[11.5px] grid grid-cols-[auto,1fr] gap-x-4 gap-y-1.5">
                    <dt className="opacity-50">tap cell</dt>
                    <dd>toggle it black / white</dd>
                    <dt className="opacity-50">drag ant</dt>
                    <dd>reposition it (while paused)</dd>
                    <dt className="opacity-50">long-press ant</dt>
                    <dd>remove it (while paused)</dd>
                    <dt className="opacity-50">＋ buttons</dt>
                    <dd>spawn an ant at the view center</dd>
                    <dt className="opacity-50">drag empty</dt>
                    <dd>pan the board</dd>
                    <dt className="opacity-50">pinch / scroll</dt>
                    <dd>zoom</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// --- Header toggle button ------------------------------------------------
type ToggleButtonProps = {
  active: boolean;
  onClick: () => void;
  label: string;
  activeLabel: string;
  children: React.ReactNode;
};

function ToggleButton({
  active,
  onClick,
  label,
  activeLabel,
  children,
}: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`h-9 pl-2 pr-2 sm:pr-2.5 flex items-center gap-1.5 rounded-sm border transition select-none ${
        active
          ? "border-transparent"
          : "border-white/15 opacity-60 hover:opacity-100 hover:bg-white/5"
      }`}
      style={
        active
          ? { background: COLOR_ANT_REGULAR, color: COLOR_INK }
          : { background: "transparent", color: COLOR_TEXT }
      }
    >
      {children}
      <span
        className={`ff-mono text-[10px] uppercase tracking-[0.16em] hidden sm:inline ${
          active ? "font-semibold" : ""
        }`}
      >
        {activeLabel}
      </span>
    </button>
  );
}
