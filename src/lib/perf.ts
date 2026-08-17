// Performance instrumentation, borrowed in spirit from Reactotron
// (github.com/infinitered/reactotron). Reactotron itself is a desktop app that
// talks to a React Native / React client over a socket; wiring it into a Next.js
// app buys little, because most of the cost here is network, images and
// hydration, and none of that is what Reactotron watches.
//
// What DOES transfer is its method, and that is what this file implements:
//
//   1. `bench(name)` → `.step(label)` → `.stop(label)`, Reactotron's benchmark
//      plugin exactly. Each step prints the time since the previous one, so you
//      find the slow SEGMENT instead of staring at one total.
//   2. A timeline of events with durations. Reactotron shows it in a window; in
//      a browser the same data already exists in the User Timing and Performance
//      Observer APIs, so `perfTimeline()` subscribes to the entries that
//      actually predict a slow page — long tasks, layout shifts, LCP, and any
//      resource over a threshold — and prints them as one grouped table.
//
// Everything here is DEV ONLY and tree-shakes to nothing in a production build:
// the guards are on `process.env.NODE_ENV`, which Next replaces with a literal.
//
// Worked example, and the reason this file exists. Measuring a production build
// of /work/[slug] gave TTFB 29 ms, DOM ready 252 ms, `load` 5582 ms. The gap was
// one embedded demo iframe pulling a second deployment into the page before
// anybody asked for it (see DemoFrame). Totals hide that; a timeline does not.

const DEV = process.env.NODE_ENV !== "production";

type Bench = {
  /** Close the segment that was open and start a new one. */
  step: (label: string) => void;
  /** Close the last segment and print the table. Forgetting this prints nothing. */
  stop: (label?: string) => void;
};

const noop: Bench = { step: () => {}, stop: () => {} };

/**
 * Time a sequence of steps and print each segment's duration.
 *
 *   const b = bench("brand deck first paint");
 *   b.step("kit resolved");
 *   b.step("slides built");
 *   b.stop("mounted");
 */
export function bench(name: string): Bench {
  if (!DEV || typeof performance === "undefined") return noop;

  const t0 = performance.now();
  let last = t0;
  const rows: Array<{ segment: string; ms: number }> = [];

  const record = (label: string) => {
    const now = performance.now();
    rows.push({ segment: label, ms: Math.round((now - last) * 100) / 100 });
    last = now;
  };

  return {
    step: record,
    stop: (label = "done") => {
      record(label);
      const total = Math.round((performance.now() - t0) * 100) / 100;
      // A measure, so the run also shows up in the DevTools performance panel
      // next to everything else the browser recorded.
      performance.measure(`bench: ${name}`, { start: t0, end: performance.now() });
      console.groupCollapsed(`⏱ ${name} — ${total}ms`);
      console.table(rows);
      console.groupEnd();
    },
  };
}

type TimelineOptions = {
  /** Report resources slower than this. 300 ms is roughly "a visitor noticed". */
  slowResourceMs?: number;
  /** Report tasks that blocked the main thread for longer than this. */
  longTaskMs?: number;
};

/**
 * Subscribe to the entries that predict a slow page and print them as they
 * happen. Returns a disposer. Safe to call more than once; the second call
 * replaces the first.
 */
export function perfTimeline(options: TimelineOptions = {}): () => void {
  if (!DEV || typeof PerformanceObserver === "undefined") return () => {};

  const slowResourceMs = options.slowResourceMs ?? 300;
  const longTaskMs = options.longTaskMs ?? 50;
  const observers: PerformanceObserver[] = [];

  const watch = (type: string, handle: (entry: PerformanceEntry) => void) => {
    try {
      const obs = new PerformanceObserver((list) => list.getEntries().forEach(handle));
      // buffered replays whatever the browser recorded before this ran, which is
      // the half of the story that a late-mounting component would otherwise miss.
      obs.observe({ type, buffered: true } as PerformanceObserverInit);
      observers.push(obs);
    } catch {
      // Not every entry type exists in every browser; a missing one is not an error.
    }
  };

  const log = (kind: string, detail: string, ms?: number) => {
    console.log(`%c${kind}%c ${ms !== undefined ? `${Math.round(ms)}ms ` : ""}${detail}`,
      "background:#143A2B;color:#F4EDDF;padding:1px 6px;border-radius:3px", "");
  };

  watch("longtask", (e) => {
    if (e.duration >= longTaskMs) log("long task", "blocked the main thread", e.duration);
  });

  watch("largest-contentful-paint", (e) => {
    const el = (e as PerformanceEntry & { element?: Element }).element;
    log("LCP", el ? `${el.tagName.toLowerCase()}${el.className ? `.${String(el.className).split(" ")[0]}` : ""}` : "—", e.startTime);
  });

  watch("layout-shift", (e) => {
    const shift = e as PerformanceEntry & { value: number; hadRecentInput: boolean };
    if (!shift.hadRecentInput && shift.value > 0.01) log("layout shift", `score ${shift.value.toFixed(3)}`);
  });

  watch("resource", (e) => {
    const r = e as PerformanceResourceTiming;
    if (r.duration < slowResourceMs) return;
    const size = r.transferSize ? ` · ${Math.round(r.transferSize / 1024)}KB` : "";
    log("slow resource", `${r.initiatorType}${size} · ${r.name.replace(/^https?:\/\//, "").slice(0, 70)}`, r.duration);
  });

  return () => observers.forEach((o) => o.disconnect());
}

/**
 * One-shot summary of everything the page has fetched so far, grouped the way a
 * budget is argued about: by kind, with a total. Call it from the console at any
 * moment, or after a flow, to answer "what did that cost".
 */
export function perfSummary(): void {
  if (!DEV || typeof performance === "undefined") return;

  const entries = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
  const groups = new Map<string, { requests: number; kb: number; slowestMs: number }>();
  let bytes = 0;

  for (const e of entries) {
    const kind = e.initiatorType || "other";
    const row = groups.get(kind) ?? { requests: 0, kb: 0, slowestMs: 0 };
    row.requests += 1;
    row.kb += Math.round((e.transferSize || 0) / 1024);
    row.slowestMs = Math.max(row.slowestMs, Math.round(e.duration));
    groups.set(kind, row);
    bytes += e.transferSize || 0;
  }

  console.groupCollapsed(`📦 ${entries.length} requests · ${Math.round(bytes / 1024)} KB`);
  console.table(Object.fromEntries(groups));
  console.groupEnd();
}
