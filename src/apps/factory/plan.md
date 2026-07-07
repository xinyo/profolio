# Workflow builder — build plan

## Reference analysis

The reference screenshot shows a stateful visual editor, not just a static diagram:

- **Top tab bar** — five workflow categories (Outbound Prospecting, Inbound Qualification, Content Marketing, Customer Success, Meeting Preparation), one active at a time with an underline indicator.
- **Trigger nodes** — a small pill badge ("⚡ Trigger") floating above a rounded card, with a clock or mail icon. Visually distinct from agent nodes: no avatar, no tool icons.
- **Agent nodes** — a pixel-art avatar, a title (e.g. "Lead Sourcer"), and a row of small integration icon chips (LinkedIn, Gmail, Slack, a doc icon) showing what tools that agent can call.
- **Router node** ("AI routing") — a bare pill with a lightning icon, no avatar, sitting at a branch point and fanning out into two agent nodes. A conditional/branching primitive, not an agent.
- **Edges** — orthogonal elbow connectors with arrowheads and dot terminals. One edge (Lead Sourcer → Email Copywriter) is dashed and indigo, and its target node has a colored border and status dot — "this is the path currently being tested," distinct from the plain gray edges elsewhere.
- **Bottom status bar** — a live indicator ("Testing prompt variant B for Email Copywriter…") with a percentage on the right. Global run/experiment state, not part of the canvas.

## Recommended stack

The dotted background grid, elbow connectors with dot terminals, and pan/zoom are the default look of **React Flow (`@xyflow/react`)** — build on that rather than hand-rolling canvas/SVG logic. Paired with:

- `shadcn/ui` `Tabs` for the top bar
- Tailwind + `lucide-react` for node chrome and integration icons
- `zustand` for the workflow store — React Flow's docs recommend it for node/edge state, and it also naturally holds "which edge/node is in an active test" without threading that through props

## Data model (sketch)

```ts
type NodeKind = "trigger" | "agent" | "router";

interface WorkflowNode {
  id: string;
  kind: NodeKind;
  position: { x: number; y: number };
  data: {
    title: string;
    icon?: string;          // clock, mail, etc. for triggers
    avatar?: string;        // agent portrait
    tools?: string[];       // integration keys: "gmail" | "linkedin" | "slack" | "docs"
  };
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  status?: "default" | "testing";   // drives dashed/animated style
}

interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}
```

## Component breakdown

| Component | Responsibility |
|---|---|
| `WorkflowBuilder` | Top-level, holds the active workflow id |
| `WorkflowTabs` | Thin wrapper around shadcn `Tabs`, one tab per workflow |
| `WorkflowCanvas` | `ReactFlowProvider` + `<ReactFlow>`, wired to the zustand store, dotted `<Background variant="dots">` |
| `TriggerNode` / `AgentNode` / `RouterNode` | Custom node renderers, registered via `nodeTypes` |
| `WorkflowEdge` | Custom edge renderer — step-style path, switches to dashed + animated when `status === "testing"` |
| `IntegrationIcon` | Shared chip component mapping a tool key to an icon |
| `StatusBar` | Reads run/test state from the store, renders the live message + percentage |

## Phased build order

1. **Static replica** — hardcode one workflow's nodes/edges, get `TriggerNode` / `AgentNode` / `RouterNode` and the elbow-edge styling pixel-close to the reference, tabs switch between hardcoded datasets.
2. **Interactivity** — drag to reposition, connect nodes by dragging handles, click to select (border + dot highlight).
3. **Branching UI** — router node with multiple typed output handles, basic condition editing.
4. **Node inspector** — side panel to edit an agent's prompt/tools once selected (not in the reference image, but needed).
5. **Live test state** — wire the status bar + dashed/animated edge to real run data instead of hardcoded strings.
6. **Persistence** — save/load workflow JSON; reuse the save/select/delete pattern from the earlier view selector, but for whole workflows instead of filter presets.

## Open question

Which phase to start with — leaning toward Phase 1 (static replica) first, to lock in visual fidelity before adding interaction logic.
