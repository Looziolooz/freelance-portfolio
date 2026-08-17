"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useLang } from "./LangProvider";
import {
  capabilitiesOf,
  isCapability,
  mainRun,
  type Localized,
  type WorkflowGraph,
  type WorkflowIcon,
  type WorkflowNode,
} from "@/lib/workflow-graph";
import type { Lang } from "@/i18n";

// The automation, drawn as the people who build automations draw it.
//
// The three-stage demo next door answers "what does it decide". This answers
// "what is it made of", and it answers it in the visual language a client who
// has ever opened n8n or Make already reads: a dotted ground, rounded node
// cards left to right, branch labels sitting on the wire, and the resources an
// action USES hanging underneath it on a dashed connector. What it does NOT
// borrow is that tool's palette — this is Parchment & Forest, ink borders and
// hard offset shadows, same as every other panel on the site (DESIGN.md).
//
// Four things are load-bearing:
//
//   1. Every label is real text in the DOM. The SVG carries wires and one bead
//      and nothing else, so it is `aria-hidden` and the diagram is still
//      readable with CSS off, selectable, and translated by `useLang`.
//   2. The geometry is data, not measurement. Positions come from `col`/`row`
//      and a pitch this file owns; the canvas reserves its exact height in CSS
//      before a single frame runs, so nothing shifts on load. This repo has
//      just been through a CLS incident and is not having another one.
//   3. It scales with a container query, not with JS. One unit `--u` drives
//      every position, size, border and font size, so the whole picture shrinks
//      as one thing and never pushes the page sideways. Below 600px it stops
//      pretending: a wide graph becomes a vertical list, which is the honest
//      answer on a phone.
//   4. Reduced motion removes the travel entirely — the path is simply shown
//      lit and complete on the first paint. Read with `useSyncExternalStore` so
//      the server and the client agree.

// ── Grid. Design units; `--u` maps one unit to at most one pixel. ────────────
// The column stride has to hold the card AND a branch label, because a decision
// writes its label in the gap. At 138 + 32 the pills landed on top of the next
// card. 126 + 74 fits the longest label (14 characters of 9.5-unit mono) in the
// gap where it belongs.
const COL_PITCH = 200;
const ROW_PITCH = 144;
const NODE_W = 126;
// 82 was a guess and it clipped: measured against the real graph copy, a card
// needs 93 units for two lines of name over two lines of sub. Cards carry
// `overflow: hidden`, so the cost of being a few units short is a sentence cut
// in half rather than a visible layout break.
const NODE_H = 116;
const CAP_W = 126;       // capability sub-node, drawn in a band below the run
const CAP_H = 108;
const CAP_DROP = 40;     // vertical air between the run and the capability band
const CAP_GAP_X = 12;
const PAD = 22;          // canvas margin, also the room the offset shadows need

// ── Bead timing. ────────────────────────────────────────────────────────────
const UNITS_PER_MS = 0.30;  // travel speed along the curve
const SEG_MIN_MS = 340;     // a short hop still reads as a move
const SEG_MAX_MS = 900;
const ARRIVE_HOLD_MS = 230; // the beat at each node, so arrival is legible
const LOOP_HOLD_MS = 1100;  // the beat at the end, before it runs again
const START_HOLD_MS = 260;

/** Joins ids into one key. Node ids are slugs, so this never collides. */
const SEP = "::";
const edgeKey = (from: string, to: string) => `${from}${SEP}${to}`;

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (onChange: () => void) => {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const readMotion = () => window.matchMedia(MOTION_QUERY).matches;
const readMotionOnServer = () => false;

function loc(value: Localized | undefined, lang: Lang): string {
  if (!value) return "";
  return value[lang] || value.it || Object.values(value).find(Boolean) || "";
}

// ── Icons ───────────────────────────────────────────────────────────────────
// One family: 24-unit box, 1.8 stroke, round caps and joins, `currentColor`,
// no fills except the two or three places a shape needs a solid dot.
const DOT = { fill: "currentColor", stroke: "none" } as const;

const ICONS: Record<WorkflowIcon, ReactNode> = {
  bolt: <path d="M13.2 3 5.5 13.4h5.2L10.8 21l7.7-10.4h-5.2z" />,
  chat: <path d="M4.5 5.5h15v10h-9.2L4.5 20z" />,
  mail: (
    <>
      <path d="M3.5 6h17v12h-17z" />
      <path d="m3.5 7.2 8.5 6 8.5-6" />
    </>
  ),
  form: (
    <>
      <path d="M6.5 3h11v18h-11z" />
      <path d="M9.5 8h5M9.5 12h5M9.5 16h2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.2l3.4 2" />
    </>
  ),
  webhook: (
    <>
      <circle cx="12" cy="6.2" r="2.8" />
      <path d="M10.1 8.4 6.4 15.4M13.9 8.4l3.7 7M5.5 18.6h13" />
    </>
  ),
  agent: (
    <>
      <path d="M6.5 8h11v9.5h-11z" />
      <path d="M12 3.6V8" />
      <circle cx="12" cy="3" r="1.3" />
      <circle cx="9.6" cy="12" r="1" {...DOT} />
      <circle cx="14.4" cy="12" r="1" {...DOT} />
      <path d="M9.8 15h4.4" />
    </>
  ),
  filter: <path d="M3.8 5h16.4l-6.4 7.2v6.3l-3.6 2.2v-8.5z" />,
  branch: (
    <>
      <path d="M5 4.5v15" />
      <path d="M5 9h7.5M5 15h7.5" />
      <path d="m10.5 6.2 2.8 2.8-2.8 2.8M10.5 12.2l2.8 2.8-2.8 2.8" />
    </>
  ),
  code: <path d="m9 7.5-4.5 4.5L9 16.5M15 7.5l4.5 4.5L15 16.5" />,
  merge: (
    <>
      <path d="M4.5 6.5h5.5l4 5.5M4.5 17.5H10l4-5.5" />
      <path d="M14 12h5.5" />
      <path d="m17 9.2 2.8 2.8L17 14.8" />
    </>
  ),
  model: (
    <>
      <path d="M8 8h8v8H8z" />
      <path d="M10.2 3.8V8M13.8 3.8V8M10.2 16v4.2M13.8 16v4.2M3.8 10.2H8M3.8 13.8H8M16 10.2h4.2M16 13.8h4.2" />
    </>
  ),
  memory: (
    <>
      <path d="M6 3.5h12v17l-6-4.2-6 4.2z" />
      <path d="M9.2 8.5h5.6" />
    </>
  ),
  tool: <path d="M14.8 4.4a4.6 4.6 0 0 0-5.9 5.9L4 15.2V20h4.8l4.9-4.9a4.6 4.6 0 0 0 5.9-5.9l-2.9 2.9-2.8-2.8z" />,
  database: (
    <>
      <path d="M18 6.4c0 1.6-2.7 2.9-6 2.9s-6-1.3-6-2.9 2.7-2.9 6-2.9 6 1.3 6 2.9z" />
      <path d="M6 6.4v11.2c0 1.6 2.7 2.9 6 2.9s6-1.3 6-2.9V6.4" />
      <path d="M6 12c0 1.6 2.7 2.9 6 2.9s6-1.3 6-2.9" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.4" />
      <path d="m15.6 15.6 4.2 4.2" />
    </>
  ),
  sheet: (
    <>
      <path d="M4 5h16v14H4z" />
      <path d="M4 10h16M4 14.6h16M9.6 5v14M15 5v14" />
    </>
  ),
  send: (
    <>
      <path d="m21 3-9 18-2.6-7.4L2 11z" />
      <path d="M21 3 9.4 13.6" />
    </>
  ),
  calendar: (
    <>
      <path d="M4 6h16v14.5H4z" />
      <path d="M4 10.4h16M8.2 3.5v4.2M15.8 3.5v4.2" />
    </>
  ),
  doc: (
    <>
      <path d="M6.2 3h7.6l4 4v14H6.2z" />
      <path d="M13.6 3v4.4h4.2" />
      <path d="M9.2 13h5.6M9.2 17h3.6" />
    </>
  ),
  tag: (
    <>
      <path d="M12.4 3.2H20v7.6l-8.9 8.9-7.6-7.6z" />
      <circle cx="16.4" cy="7" r="1.3" {...DOT} />
    </>
  ),
  bell: (
    <>
      <path d="M12 3.8a5.2 5.2 0 0 0-5.2 5.2c0 5-2 6.2-2 6.2h14.4s-2-1.2-2-6.2A5.2 5.2 0 0 0 12 3.8z" />
      <path d="M10.3 18.6a2.1 2.1 0 0 0 3.4 0" />
    </>
  ),
  cart: (
    <>
      <path d="M2.8 4h2.7l2.3 10.6h9.5L19.4 7H6" />
      <circle cx="9.2" cy="19" r="1.5" />
      <circle cx="16.8" cy="19" r="1.5" />
    </>
  ),
  chart: (
    <>
      <path d="M4 3.8v16.4h16.2" />
      <path d="M8.2 17v-4.4M12.2 17V8M16.2 17v-6.4" />
    </>
  ),
};

// A graph authored with a glyph this file has never heard of gets a neutral
// shape, never a crash and never a hole in the card.
const FALLBACK_ICON = <path d="M6.5 6.5h11v11h-11z" />;

function Glyph({ icon }: { icon: WorkflowIcon }) {
  return (
    <svg className="wfc__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {ICONS[icon] ?? FALLBACK_ICON}
    </svg>
  );
}

// ── Layout ──────────────────────────────────────────────────────────────────

type Box = {
  node: WorkflowNode;
  x: number;
  y: number;
  w: number;
  h: number;
  caps: Box[];
};

type Wire = {
  key: string;
  from: string;
  to: string;
  d: string;
  /** Capability connectors are dashed; a link the graph never declared is dotted. */
  dashed: boolean;
  synthetic: boolean;
  label?: Localized;
  lx: number;
  ly: number;
};

type Layout = {
  boxes: Map<string, Box>;
  /** Reading order: each main-run node followed by the capabilities it owns. */
  render: Box[];
  wires: Wire[];
  w: number;
  h: number;
};

const EMPTY_LAYOUT: Layout = { boxes: new Map(), render: [], wires: [], w: 0, h: 0 };

const r1 = (n: number) => Math.round(n * 10) / 10;

type Pt = { x: number; y: number };

/**
 * One curve between two boxes, the way a node editor draws it: cubic, control
 * points pushed straight out of the anchor so the wire leaves and arrives flat.
 * Into a capability it runs downward; everything else runs right edge to left.
 */
/**
 * How far out of the anchor to push a control point. Never past the far anchor:
 * a control point that overshoots makes the curve double back on itself, and
 * the bead — which walks arc length — then visibly runs backwards over the
 * loop. So the push is capped by the span it has to cross.
 */
function reach(span: number, want: number, back: number) {
  if (span > 8) return Math.max(span * 0.5, Math.min(want, span * 0.9));
  return Math.max(back, -span * 0.6);
}

function geom(a: Box, b: Box) {
  const down = isCapability(b.node);
  let p0: Pt, c1: Pt, c2: Pt, p3: Pt;
  if (down) {
    p0 = { x: a.x + a.w / 2, y: a.y + a.h };
    p3 = { x: b.x + b.w / 2, y: b.y };
    const push = reach(p3.y - p0.y, 34, 26);
    c1 = { x: p0.x, y: p0.y + push };
    c2 = { x: p3.x, y: p3.y - push };
  } else {
    p0 = { x: a.x + a.w, y: a.y + a.h / 2 };
    p3 = { x: b.x, y: b.y + b.h / 2 };
    const push = reach(p3.x - p0.x, 48, 40);
    c1 = { x: p0.x + push, y: p0.y };
    c2 = { x: p3.x - push, y: p3.y };
  }
  return {
    down,
    d: `M${r1(p0.x)} ${r1(p0.y)} C${r1(c1.x)} ${r1(c1.y)} ${r1(c2.x)} ${r1(c2.y)} ${r1(p3.x)} ${r1(p3.y)}`,
    // B(0.5) of a cubic — where the branch label sits.
    mid: {
      x: (p0.x + 3 * c1.x + 3 * c2.x + p3.x) / 8,
      y: (p0.y + 3 * c1.y + 3 * c2.y + p3.y) / 8,
    },
  };
}

function buildLayout(graph: WorkflowGraph | null | undefined): Layout {
  const nodes = graph?.nodes ?? [];
  if (!graph || nodes.length === 0) return EMPTY_LAYOUT;

  const boxes = new Map<string, Box>();
  const mains: Box[] = [];

  for (const n of mainRun(graph)) {
    const box: Box = {
      node: n,
      x: (n.col ?? 0) * COL_PITCH,
      y: (n.row ?? 0) * ROW_PITCH,
      w: NODE_W,
      h: NODE_H,
      caps: [],
    };
    boxes.set(n.id, box);
    mains.push(box);
  }

  // Capabilities hang in ONE band under the whole run, centred on their owner.
  //
  // Dropping each group straight under its own owner is what n8n does and it is
  // wrong here: these graphs use three lanes, so a capability under a lane-0
  // action landed exactly on the output sitting in lane 1. One band below the
  // deepest node cannot collide with the run at all.
  const runBottom = mains.length ? Math.max(...mains.map((b) => b.y + b.h)) : 0;
  const capY = runBottom + CAP_DROP;

  const groups: { owner: Box; boxes: Box[] }[] = [];
  for (const owner of mains) {
    const caps = capabilitiesOf(graph, owner.node.id).filter((c) => !boxes.has(c.id));
    if (caps.length === 0) continue;
    const total = caps.length * CAP_W + (caps.length - 1) * CAP_GAP_X;
    const startX = owner.x + owner.w / 2 - total / 2;
    const group = caps.map((c, i) => ({
      node: c,
      x: startX + i * (CAP_W + CAP_GAP_X),
      y: capY,
      w: CAP_W,
      h: CAP_H,
      caps: [] as Box[],
    }));
    groups.push({ owner, boxes: group });
  }

  // Two owners in neighbouring columns can want the same horizontal space. Walk
  // the groups left to right and push each one clear of the last.
  groups.sort((a, b) => a.boxes[0].x - b.boxes[0].x);
  let edgeX = -Infinity;
  for (const group of groups) {
    const shift = Math.max(0, edgeX + CAP_GAP_X * 2 - group.boxes[0].x);
    for (const box of group.boxes) {
      box.x += shift;
      boxes.set(box.node.id, box);
      group.owner.caps.push(box);
    }
    edgeX = group.boxes[group.boxes.length - 1].x + CAP_W;
  }

  // A capability whose `of` points nowhere is an authoring bug. Park it in a row
  // under the graph so it is visible rather than silently dropped.
  const orphans = nodes.filter((n) => isCapability(n) && !boxes.has(n.id));
  if (orphans.length > 0) {
    const placed = [...boxes.values()];
    const baseY = placed.length ? Math.max(...placed.map((b) => b.y + b.h)) + CAP_DROP : 0;
    const baseX = placed.length ? Math.min(...placed.map((b) => b.x)) : 0;
    orphans.forEach((c, i) => {
      boxes.set(c.id, {
        node: c,
        x: baseX + i * (CAP_W + CAP_GAP_X),
        y: baseY,
        w: CAP_W,
        h: CAP_H,
        caps: [],
      });
    });
  }

  // Normalise so the top-left box sits exactly PAD from the corner.
  const all = [...boxes.values()];
  const minX = Math.min(...all.map((b) => b.x));
  const minY = Math.min(...all.map((b) => b.y));
  const maxX = Math.max(...all.map((b) => b.x + b.w));
  const maxY = Math.max(...all.map((b) => b.y + b.h));
  for (const b of all) {
    b.x += PAD - minX;
    b.y += PAD - minY;
  }

  // Wires. Declared edges first, then the dashed capability connectors the
  // `of` field implies, deduped so an author who writes both gets one line.
  const seen = new Set<string>();
  const wires: Wire[] = [];
  const push = (from: string, to: string, label: Localized | undefined, synthetic: boolean) => {
    const key = edgeKey(from, to);
    if (seen.has(key)) return;
    const a = boxes.get(from);
    const b = boxes.get(to);
    if (!a || !b || a === b) return;
    seen.add(key);
    const g = geom(a, b);
    wires.push({
      key,
      from,
      to,
      d: g.d,
      dashed: g.down,
      synthetic,
      label,
      lx: g.mid.x,
      ly: g.mid.y,
    });
  };

  for (const e of graph.edges ?? []) push(e.from, e.to, e.label, false);
  for (const b of all) {
    if (isCapability(b.node) && b.node.of) push(b.node.of, b.node.id, undefined, false);
  }

  const render: Box[] = [];
  for (const m of mains) {
    render.push(m, ...m.caps);
  }
  for (const b of all) if (!render.includes(b)) render.push(b);

  return {
    boxes,
    render,
    wires,
    w: maxX - minX + PAD * 2,
    h: maxY - minY + PAD * 2,
  };
}

// ── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
.wfc { container-type: inline-size; }

/* The ground. Dotted, the way a node editor's canvas is, in ink at low alpha
   rather than the tool's own grey. The horizontal scroll is the safety valve:
   a graph wider than its slot scrolls INSIDE this box, never the page. */
.wfc__stage {
  border: 3px solid var(--ink-border);
  border-radius: var(--radius-lg);
  background-color: var(--canvas-panel-grey);
  background-image: radial-gradient(circle, color-mix(in oklch, var(--ink-border) 24%, transparent) 1.1px, transparent 1.2px);
  background-size: 17px 17px;
  background-position: -1px -1px;
  box-shadow: var(--shadow-card);
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
}

/* One unit drives everything: positions, sizes, borders, type. Falls back to a
   floor so the labels never shrink into illegibility — below that the graph
   scrolls, and below 600px it stops being a canvas at all. */
.wfc__plane {
  --u: clamp(0.74px, calc(var(--wfc-scale) * 1cqw), 1px);
  position: relative;
  width: calc(var(--u) * var(--wfc-w));
  height: calc(var(--u) * var(--wfc-h));
  margin: 0 auto;
}

.wfc__wires { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }
.wfc__wire {
  fill: none;
  stroke: var(--ink-border);
  stroke-width: 2.2;
  stroke-linecap: round;
  opacity: 0.5;
  transition: opacity 0.3s var(--ease), stroke 0.3s var(--ease);
}
.wfc__wire--dashed { stroke-dasharray: 5 5; }
.wfc__wire--ghost { stroke-dasharray: 2 5; opacity: 0.34; }
.wfc__wire.is-wait { opacity: 0.62; }
.wfc__wire.is-on { opacity: 1; stroke: var(--accent-green-deep); stroke-width: 2.8; }
.wfc__wire.is-rest { opacity: 0.62; }

.wfc__bead {
  fill: var(--accent-green);
  stroke: var(--ink-border);
  stroke-width: 2;
}

/* Node cards. Same chrome as every panel on the site: ink border, hard offset
   shadow, no blur. The left rail is the only place kind is colour-coded. */
.wfc__node {
  position: absolute;
  box-sizing: border-box;
  left: calc(var(--u) * var(--x));
  top: calc(var(--u) * var(--y));
  width: calc(var(--u) * var(--w));
  height: calc(var(--u) * var(--h));
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: calc(var(--u) * 4);
  overflow: hidden;
  padding: calc(var(--u) * 9) calc(var(--u) * 10) calc(var(--u) * 9) calc(var(--u) * 14);
  border: calc(var(--u) * 2.5) solid var(--ink-border);
  border-radius: calc(var(--u) * 10);
  background: var(--canvas-panel-grey);
  box-shadow: calc(var(--u) * 3) calc(var(--u) * 3) 0 var(--ink-shadow);
  transition: opacity 0.32s var(--ease), box-shadow 0.32s var(--ease), transform 0.32s var(--ease);
}
.wfc__node::before {
  content: "";
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: calc(var(--u) * 5);
  background: var(--wfc-rail, transparent);
}

.wfc__node--trigger {
  --wfc-rail: var(--accent-green-deep);
  background: var(--accent-green);
  border-top-left-radius: calc(var(--u) * 30);
  border-bottom-left-radius: calc(var(--u) * 30);
  padding-left: calc(var(--u) * 16);
}
.wfc__node--trigger::before { display: none; }
.wfc__node--action   { --wfc-rail: var(--accent-decor-green); }
.wfc__node--decision { --wfc-rail: var(--accent-green-deep); background: var(--accent-peach); }
.wfc__node--output   { --wfc-rail: var(--accent-green-deep); background: var(--canvas-panel-yellow); }

/* A capability is a resource, not a step: smaller, dashed, no shadow, so it
   reads as hanging off the run rather than sitting in it. */
.wfc__node--capability {
  border-style: dashed;
  border-width: calc(var(--u) * 2);
  background: var(--canvas-page);
  box-shadow: none;
  padding: calc(var(--u) * 7) calc(var(--u) * 9);
}
.wfc__node--capability::before { display: none; }
.wfc__node--capability .wfc__glyph { color: var(--accent-decor-green); }
.wfc__node--capability .wfc__label { font-size: calc(var(--u) * 10.5); }

.wfc__glyph {
  width: calc(var(--u) * 17);
  height: calc(var(--u) * 17);
  flex: none;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  color: var(--ink-body);
}
.wfc__label {
  font-family: var(--font-ui);
  font-weight: 500;
  font-size: calc(var(--u) * 11.5);
  line-height: 1.25;
  letter-spacing: -0.005em;
  color: var(--ink-body);
}
.wfc__sub {
  margin-top: auto;
  font-family: var(--font-mono);
  font-size: calc(var(--u) * 9.5);
  line-height: 1.3;
  letter-spacing: 0.02em;
  color: var(--ink-muted);
}
.wfc__node--trigger .wfc__sub,
.wfc__node--decision .wfc__sub { color: color-mix(in oklch, var(--ink-body) 66%, transparent); }

/* Branch label. Real text, positioned over the wire it belongs to. */
.wfc__pill {
  position: absolute;
  z-index: 3;
  left: calc(var(--u) * var(--x));
  top: calc(var(--u) * var(--y));
  transform: translate(-50%, -50%);
  /* The gap between two cards, so a pill can never reach a card. */
  max-width: calc(var(--u) * 74);
  padding: calc(var(--u) * 2.5) calc(var(--u) * 7);
  border: calc(var(--u) * 2) solid var(--ink-border);
  border-radius: 999px;
  background: var(--canvas-page);
  color: var(--ink-body);
  font-family: var(--font-mono);
  font-size: calc(var(--u) * 9.5);
  line-height: 1.3;
  letter-spacing: 0.05em;
  text-align: center;
  transition: opacity 0.32s var(--ease);
}

/* The three states of the run, and the only reason any of this dims. */
/* Dimming says "this branch did not fire". It must not say "do not read this":
   at 0.3 the branches that stayed quiet were illegible, and the branch that
   stayed quiet is half of what the diagram is explaining. The lit path is
   carried by colour and by the shadow instead, so an unlit card can sit at a
   contrast a person can actually read. */
.wfc__node.is-dim, .wfc__pill.is-dim {
  opacity: 0.78; box-shadow: none; filter: saturate(0.35);
}
.wfc__node.is-wait, .wfc__pill.is-wait { opacity: 0.92; filter: saturate(0.7); }
.wfc__node.is-on, .wfc__pill.is-on { opacity: 1; }
.wfc__node.is-on { animation: wfc-arrive 0.42s var(--ease) 1; }
@keyframes wfc-arrive {
  0%   { transform: none; }
  36%  { transform: translate(calc(var(--u) * -1.5), calc(var(--u) * -1.5)); }
  100% { transform: none; }
}

/* Under 600px a six-column canvas is a lie. It becomes what it actually is:
   an ordered list of steps, with the resources indented under their step. */
@container (max-width: 600px) {
  .wfc__stage { overflow: visible; padding: 12px; }
  .wfc__plane {
    --u: 1px;
    position: static;
    width: auto;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .wfc__wires { display: none; }
  /* One column, and the sub goes UNDER the name rather than beside it. Set
     side by side on a 390px screen the sub ran off the right edge of every
     card: "risponde nella lingua del me…". Stacked, it wraps and reads. */
  .wfc__node {
    position: static;
    width: auto;
    height: auto;
    min-height: 0;
    flex-direction: row;
    align-items: flex-start;
    gap: 10px;
  }
  .wfc__node { flex-wrap: wrap; }
  .wfc__node .wfc__label { flex: 1 1 auto; min-width: 0; }
  /* A flex-basis of 100% puts the sub on its own line without needing a
     wrapper element around the two of them. (No backticks in here: this whole
     block is a JS template literal and one would end it.) */
  .wfc__node .wfc__sub {
    flex: 1 0 100%;
    margin-top: 3px; margin-left: 0; padding-left: 0;
    text-align: left; white-space: normal;
  }
  .wfc__node--capability { margin-left: 26px; }
  .wfc__node--trigger { border-radius: var(--radius-lg); padding-left: 14px; }
  .wfc__pill {
    position: static;
    transform: none;
    align-self: flex-start;
    margin-left: 26px;
    max-width: none;
  }
  .wfc__node.is-on { animation: none; }
}

@media (prefers-reduced-motion: reduce) {
  .wfc__node, .wfc__pill, .wfc__wire { transition: none; }
  .wfc__node.is-on { animation: none; }
}
`;

// ── Component ───────────────────────────────────────────────────────────────

export default function WorkflowCanvas({
  graph,
  activePath,
  playing,
}: {
  graph: WorkflowGraph;
  /** Node ids the current input visits, in order. Empty means show everything at rest. */
  activePath: string[];
  /** When false the bead holds still. Comes from the parent's DemoPlayer. */
  playing: boolean;
}) {
  const { lang } = useLang();
  const reduced = useSyncExternalStore(subscribeMotion, readMotion, readMotionOnServer);

  // Both memos key off CONTENT, not identity. A parent that rebuilds `graph` or
  // `activePath` on every render — which is the normal thing for a component
  // reading from a lib and mapping — would otherwise restart the run every
  // render and the bead would never leave the first node.
  const graphKey = useMemo(() => {
    const ns = (graph?.nodes ?? [])
      .map((n) => `${n.id}|${n.kind}|${n.icon}|${n.col ?? ""}|${n.row ?? ""}|${n.of ?? ""}`)
      .join(";");
    const es = (graph?.edges ?? []).map((e) => `${e.from}>${e.to}`).join(";");
    return `${ns}${SEP}${es}`;
  }, [graph]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const layout = useMemo(() => buildLayout(graph), [graphKey]);

  const path = useMemo(
    () => (activePath ?? []).filter((id) => layout.boxes.has(id)),
    [activePath, layout],
  );
  const pathKey = path.join(SEP);

  // The segments the bead travels, in order. A pair the graph never declared
  // gets a synthesized dotted wire so the bead stays continuous and the missing
  // edge is visible rather than silent.
  const { segments, ghosts } = useMemo(() => {
    const ids = path;
    const segs: { key: string; from: string; to: string }[] = [];
    const extra: Wire[] = [];
    const known = new Set(layout.wires.map((w) => w.key));
    for (let i = 0; i < ids.length - 1; i++) {
      const from = ids[i];
      const to = ids[i + 1];
      const key = edgeKey(from, to);
      segs.push({ key, from, to });
      if (known.has(key)) continue;
      known.add(key);
      const a = layout.boxes.get(from);
      const b = layout.boxes.get(to);
      if (!a || !b || a === b) continue;
      const g = geom(a, b);
      extra.push({ key, from, to, d: g.d, dashed: g.down, synthetic: true, lx: g.mid.x, ly: g.mid.y });
    }
    return { segments: segs, ghosts: extra };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathKey, layout]);

  const wires = useMemo(() => [...layout.wires, ...ghosts], [layout, ghosts]);

  const paths = useRef(new Map<string, SVGPathElement>());
  const bead = useRef<SVGCircleElement | null>(null);
  const run = useRef({ seg: 0, t: 0, hold: START_HOLD_MS, done: false });

  // How many nodes of the path the bead has reached. Carried WITH the path it
  // belongs to, so a new pick resets it during render rather than in an effect
  // — no extra commit, and never one frame of the old run's lighting.
  const [litState, setLitState] = useState({ key: pathKey, lit: 1 });
  if (litState.key !== pathKey) setLitState({ key: pathKey, lit: 1 });
  const lit = litState.key === pathKey ? litState.lit : 1;
  const reachNode = useCallback(
    (n: number) => setLitState((s) => (s.key !== pathKey || s.lit >= n ? s : { key: pathKey, lit: n })),
    [pathKey],
  );
  const restartLit = useCallback(
    () => setLitState((s) => (s.key === pathKey && s.lit === 1 ? s : { key: pathKey, lit: 1 })),
    [pathKey],
  );

  // A new pick is a new run, from the top. Refs and the DOM only.
  useEffect(() => {
    run.current = { seg: 0, t: 0, hold: START_HOLD_MS, done: false };
    const first = segments[0] && paths.current.get(segments[0].key);
    if (first && bead.current) {
      const p = first.getPointAtLength(0);
      bead.current.setAttribute("cx", String(p.x));
      bead.current.setAttribute("cy", String(p.y));
      bead.current.style.opacity = "1";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathKey]);

  // The bead. rAF over the real path elements, so it follows the drawn curve
  // rather than a straight line pretending to be one.
  useEffect(() => {
    if (reduced || !playing || segments.length === 0) return;
    let frame = 0;
    let last = 0;

    const place = (el: SVGPathElement, at: number) => {
      const p = el.getPointAtLength(at);
      const c = bead.current;
      if (!c) return;
      c.setAttribute("cx", String(r1(p.x)));
      c.setAttribute("cy", String(r1(p.y)));
      c.style.opacity = "1";
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!last) { last = now; return; }
      const dt = Math.min(64, now - last);
      last = now;
      const st = run.current;

      if (st.hold > 0) {
        st.hold -= dt;
        return;
      }
      if (st.done) {
        st.done = false;
        st.seg = 0;
        st.t = 0;
        st.hold = START_HOLD_MS;
        restartLit();
        const first = paths.current.get(segments[0].key);
        if (first) place(first, 0);
        return;
      }

      const seg = segments[st.seg];
      const el = seg && paths.current.get(seg.key);
      if (!el) {
        // No geometry for this hop (a graph mid-edit). Step over it rather than
        // stalling the whole run.
        st.seg += 1;
        st.t = 0;
        st.hold = ARRIVE_HOLD_MS;
        reachNode(st.seg + 1);
        if (st.seg >= segments.length) { st.done = true; st.hold = LOOP_HOLD_MS; }
        return;
      }

      const len = el.getTotalLength();
      const dur = Math.min(SEG_MAX_MS, Math.max(SEG_MIN_MS, len / UNITS_PER_MS));
      st.t += dt / dur;

      if (st.t >= 1) {
        place(el, len);
        st.seg += 1;
        st.t = 0;
        st.hold = ARRIVE_HOLD_MS;
        reachNode(st.seg + 1);
        if (st.seg >= segments.length) { st.done = true; st.hold = LOOP_HOLD_MS; }
        return;
      }
      place(el, len * st.t);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, playing, segments, reachNode, restartLit]);

  if (layout.render.length === 0) return null;

  const resting = path.length === 0;
  const litCount = reduced ? path.length : lit;
  const litIds = new Set(path.slice(0, litCount));
  const onPath = new Set(path);
  const travelled = new Set(segments.slice(0, Math.max(0, litCount - 1)).map((s) => s.key));
  const onSegments = new Set(segments.map((s) => s.key));
  const showBead = !reduced && segments.length > 0;

  const state = (id: string) => (resting ? "is-rest" : litIds.has(id) ? "is-on" : onPath.has(id) ? "is-wait" : "is-dim");
  const wireState = (key: string) =>
    resting ? "is-rest" : travelled.has(key) ? "is-on" : onSegments.has(key) ? "is-wait" : "is-dim";

  return (
    <div className="wfc">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wfc__stage">
        <div
          className="wfc__plane"
          style={
            {
              "--wfc-w": layout.w,
              "--wfc-h": layout.h,
              // 1cqw of the container, divided across the design width, with a
              // little slack for the stage's own 3px border on each side.
              "--wfc-scale": Math.round(100000 / (layout.w + 14)) / 1000,
            } as React.CSSProperties
          }
        >
          {/* Decorative: every word on this canvas is real text in the DOM below. */}
          <svg
            className="wfc__wires"
            viewBox={`0 0 ${layout.w} ${layout.h}`}
            aria-hidden="true"
            focusable="false"
          >
            {wires.map((w) => (
              <path
                key={w.key}
                ref={(el) => {
                  if (el) paths.current.set(w.key, el);
                  else paths.current.delete(w.key);
                }}
                d={w.d}
                className={[
                  "wfc__wire",
                  w.dashed ? "wfc__wire--dashed" : "",
                  w.synthetic ? "wfc__wire--ghost" : "",
                  wireState(w.key),
                ].filter(Boolean).join(" ")}
              />
            ))}
            {showBead && <circle ref={bead} className="wfc__bead" r={5.5} cx={-20} cy={-20} style={{ opacity: 0 }} />}
          </svg>

          {layout.render.map((b) => {
            const outgoing = wires.filter((w) => w.from === b.node.id && w.label);
            const sub = loc(b.node.sub, lang);
            return (
              <Fragment key={`g-${b.node.id}`}>
                <div
                  className={`wfc__node wfc__node--${b.node.kind} ${state(b.node.id)}`}
                  style={{ "--x": b.x, "--y": b.y, "--w": b.w, "--h": b.h } as React.CSSProperties}
                >
                  <Glyph icon={b.node.icon} />
                  <span className="wfc__label">{loc(b.node.label, lang)}</span>
                  {sub && <span className="wfc__sub">{sub}</span>}
                </div>
                {outgoing.map((w) => (
                  <span
                    key={`p-${w.key}`}
                    className={`wfc__pill ${wireState(w.key)}`}
                    style={{ "--x": r1(w.lx), "--y": r1(w.ly) } as React.CSSProperties}
                  >
                    {loc(w.label, lang)}
                  </span>
                ))}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
