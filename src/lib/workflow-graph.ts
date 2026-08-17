import type { Lang } from "@/i18n";

// The shape of an automation, drawn the way the people who build automations
// draw them: a node canvas.
//
// Why this exists alongside the three-stage demo in `workflows.ts`. That demo
// answers "what does it decide", which is the question a buyer has. It does not
// answer "what is this thing made of" — and for the automation projects that is
// the other half of the sale, because a client who has seen an n8n or Make
// canvas recognises this language immediately and a client who has not still
// reads a diagram faster than a paragraph.
//
// The canvas is NOT a screenshot of n8n. It borrows the grammar (a dotted
// ground, rounded node cards, labelled branch edges, capability nodes hanging
// underneath on dashed connectors) and drops the tool's own palette: this is
// Parchment & Forest, ink borders and offset shadows, same as every other panel
// on the site. See DESIGN.md.
//
// One graph per project, and the graph is language-independent apart from its
// labels, which is why every label is a `Localized`.

export type Localized = Record<Lang, string>;

/**
 * What a node is FOR, which decides how it is drawn: where it sits, what shape
 * it takes, and which icon it carries.
 *
 * - `trigger`   starts the run. Always leftmost, always exactly one.
 * - `action`    does something to the data and passes it on.
 * - `decision`  splits the flow. Its outgoing edges carry branch labels.
 * - `output`    the last thing in a branch. Nothing leaves it.
 * - `capability` a resource an action USES rather than passes to: a model, a
 *   memory, a tool, a data source. Drawn below its owner on a dashed connector,
 *   which is exactly how n8n draws a sub-node, and it is the detail that makes
 *   the picture legible to anyone who has seen one.
 */
export type WorkflowNodeKind =
  | "trigger"
  | "action"
  | "decision"
  | "output"
  | "capability";

/** Picked from a fixed set so a new workflow cannot invent an unstyled glyph. */
export type WorkflowIcon =
  | "bolt" | "chat" | "mail" | "form" | "clock" | "webhook"
  | "agent" | "filter" | "branch" | "code" | "merge"
  | "model" | "memory" | "tool" | "database" | "search" | "sheet"
  | "send" | "calendar" | "doc" | "tag" | "bell" | "cart" | "chart";

export type WorkflowNode = {
  id: string;
  kind: WorkflowNodeKind;
  icon: WorkflowIcon;
  /** The node's name, e.g. "Quando arriva un messaggio". */
  label: Localized;
  /** The small grey second line, e.g. "WhatsApp Business". Optional. */
  sub?: Localized;
  /**
   * Column and row on the canvas grid, both zero-based. The renderer owns the
   * pixel spacing; authors only say what sits where. Capability nodes take the
   * row below their owner and are laid out by the renderer, so they may omit it.
   */
  col?: number;
  row?: number;
  /** For `capability` nodes: the id of the action node they hang from. */
  of?: string;
};

export type WorkflowEdge = {
  from: string;
  to: string;
  /** Shown on the edge. Only decisions need it, e.g. "urgente" / "normale". */
  label?: Localized;
};

export type WorkflowGraph = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  /**
   * The node ids that light up for each case in `WorkflowCopy.cases`, keyed by
   * case id and given in the order the run visits them. This is what makes the
   * canvas an animation rather than a picture: picking a different input sends
   * the bead down a different branch, and the branch that did NOT fire stays
   * dimmed. A case whose path is missing lights the whole graph, which is a
   * visible authoring bug rather than a silent one.
   */
  paths: Record<string, string[]>;
};

/** Nodes drawn below their owner rather than in the main left-to-right run. */
export function isCapability(node: WorkflowNode): boolean {
  return node.kind === "capability";
}

/**
 * Every node on the main run, in column order, with capabilities removed.
 * Exported so the renderer and the tests agree on what "the flow" means.
 */
export function mainRun(graph: WorkflowGraph): WorkflowNode[] {
  return graph.nodes
    .filter((n) => !isCapability(n))
    .slice()
    .sort((a, b) => (a.col ?? 0) - (b.col ?? 0) || (a.row ?? 0) - (b.row ?? 0));
}

/** The capabilities hanging off one action, in author order. */
export function capabilitiesOf(graph: WorkflowGraph, nodeId: string): WorkflowNode[] {
  return graph.nodes.filter((n) => isCapability(n) && n.of === nodeId);
}
