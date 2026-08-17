"use client";

import { useEffect } from "react";
import { bench, perfSummary, perfTimeline } from "@/lib/perf";

// Turns the perf instrument on in development and puts it on the console, so
// finding a regression does not start with wiring anything up.
//
// In the browser console:
//   __perf.summary()          what has this page fetched, by kind, with a total
//   __perf.bench("thing")     Reactotron-style benchmark: .step(…) .stop(…)
//
// Renders nothing, and `process.env.NODE_ENV` is a literal at build time, so the
// whole module drops out of the production bundle.
export default function PerfProbe() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const stop = perfTimeline();
    (window as unknown as Record<string, unknown>).__perf = { bench, summary: perfSummary };
    return stop;
  }, []);

  return null;
}
