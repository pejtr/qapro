import { useCallback, useRef, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  Handle,
  Position,
  Panel,
  BackgroundVariant,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus, Trash2, Download, Save, ZoomIn, ZoomOut,
  Square, Circle, Diamond, ArrowRight, Type,
  Layers, GitBranch, Database, Server, Smartphone,
  TestTube, Code2, Shield, Workflow, RotateCcw,
} from "lucide-react";

// ─── Custom Node Types ──────────────────────────────────────────────────────

function ProcessNode({ data, selected }: { data: NodeData; selected: boolean }) {
  return (
    <div className={`px-4 py-3 rounded-lg border-2 min-w-[140px] text-center cursor-grab active:cursor-grabbing transition-all
      ${selected ? "border-blue-400 shadow-lg shadow-blue-400/30" : "border-blue-500/60"}
      bg-blue-950/80 backdrop-blur-sm`}>
      <Handle type="target" position={Position.Top} className="!bg-blue-400 !border-blue-300" />
      <Handle type="target" position={Position.Left} className="!bg-blue-400 !border-blue-300" />
      <div className="flex items-center justify-center gap-2">
        {data.icon && <span className="text-blue-300 text-sm">{data.icon}</span>}
        <span className="text-blue-100 font-semibold text-sm">{data.label}</span>
      </div>
      {data.sublabel && <div className="text-blue-300/70 text-xs mt-1">{data.sublabel}</div>}
      <Handle type="source" position={Position.Bottom} className="!bg-blue-400 !border-blue-300" />
      <Handle type="source" position={Position.Right} className="!bg-blue-400 !border-blue-300" />
    </div>
  );
}

function ToolNode({ data, selected }: { data: NodeData; selected: boolean }) {
  return (
    <div className={`px-4 py-3 rounded-lg border-2 min-w-[140px] text-center cursor-grab active:cursor-grabbing transition-all
      ${selected ? "border-green-400 shadow-lg shadow-green-400/30" : "border-green-500/60"}
      bg-green-950/80 backdrop-blur-sm`}>
      <Handle type="target" position={Position.Top} className="!bg-green-400 !border-green-300" />
      <Handle type="target" position={Position.Left} className="!bg-green-400 !border-green-300" />
      <div className="flex items-center justify-center gap-2">
        {data.icon && <span className="text-green-300 text-sm">{data.icon}</span>}
        <span className="text-green-100 font-semibold text-sm">{data.label}</span>
      </div>
      {data.sublabel && <div className="text-green-300/70 text-xs mt-1">{data.sublabel}</div>}
      <Handle type="source" position={Position.Bottom} className="!bg-green-400 !border-green-300" />
      <Handle type="source" position={Position.Right} className="!bg-green-400 !border-green-300" />
    </div>
  );
}

function DecisionNode({ data, selected }: { data: NodeData; selected: boolean }) {
  return (
    <div className={`relative cursor-grab active:cursor-grabbing`} style={{ width: 140, height: 70 }}>
      <Handle type="target" position={Position.Top} className="!bg-amber-400 !border-amber-300" />
      <Handle type="target" position={Position.Left} className="!bg-amber-400 !border-amber-300" style={{ top: "50%" }} />
      <svg width="140" height="70" className="absolute inset-0">
        <polygon
          points="70,4 136,35 70,66 4,35"
          fill={selected ? "rgba(120,80,0,0.9)" : "rgba(80,50,0,0.8)"}
          stroke={selected ? "#fbbf24" : "#d97706"}
          strokeWidth={selected ? 2.5 : 1.5}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-amber-100 font-semibold text-xs text-center px-4 leading-tight">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-amber-400 !border-amber-300" />
      <Handle type="source" position={Position.Right} className="!bg-amber-400 !border-amber-300" style={{ top: "50%" }} />
    </div>
  );
}

function DatabaseNode({ data, selected }: { data: NodeData; selected: boolean }) {
  return (
    <div className={`px-4 py-3 rounded-lg border-2 min-w-[140px] text-center cursor-grab active:cursor-grabbing transition-all
      ${selected ? "border-purple-400 shadow-lg shadow-purple-400/30" : "border-purple-500/60"}
      bg-purple-950/80 backdrop-blur-sm`}>
      <Handle type="target" position={Position.Top} className="!bg-purple-400 !border-purple-300" />
      <Handle type="target" position={Position.Left} className="!bg-purple-400 !border-purple-300" />
      <div className="flex items-center justify-center gap-2">
        {data.icon && <span className="text-purple-300 text-sm">{data.icon}</span>}
        <span className="text-purple-100 font-semibold text-sm">{data.label}</span>
      </div>
      {data.sublabel && <div className="text-purple-300/70 text-xs mt-1">{data.sublabel}</div>}
      <Handle type="source" position={Position.Bottom} className="!bg-purple-400 !border-purple-300" />
      <Handle type="source" position={Position.Right} className="!bg-purple-400 !border-purple-300" />
    </div>
  );
}

function NoteNode({ data, selected }: { data: NodeData; selected: boolean }) {
  return (
    <div className={`px-3 py-2 rounded border min-w-[120px] max-w-[200px] cursor-grab active:cursor-grabbing transition-all
      ${selected ? "border-yellow-400/80 shadow-md" : "border-yellow-600/40"}
      bg-yellow-950/60 backdrop-blur-sm`}>
      <Handle type="target" position={Position.Top} className="!bg-yellow-400 !border-yellow-300 !opacity-50" />
      <Handle type="target" position={Position.Left} className="!bg-yellow-400 !border-yellow-300 !opacity-50" />
      <span className="text-yellow-200/90 text-xs italic leading-snug">{data.label}</span>
      <Handle type="source" position={Position.Bottom} className="!bg-yellow-400 !border-yellow-300 !opacity-50" />
      <Handle type="source" position={Position.Right} className="!bg-yellow-400 !border-yellow-300 !opacity-50" />
    </div>
  );
}

type NodeData = { label: string; sublabel?: string; icon?: string };

const nodeTypes: NodeTypes = {
  process: ProcessNode as any,
  tool: ToolNode as any,
  decision: DecisionNode as any,
  database: DatabaseNode as any,
  note: NoteNode as any,
};

// ─── Pre-built QA Architecture Diagram ─────────────────────────────────────

const QA_NODES: Node[] = [
  // Layer 0 – Strategy
  { id: "strategy", type: "process", position: { x: 400, y: 20 }, data: { label: "Test Strategy", sublabel: "SCRUM / Agile", icon: "📋" } },

  // Layer 1 – Requirements
  { id: "req-jira", type: "tool", position: { x: 100, y: 140 }, data: { label: "Jira", sublabel: "User Stories / Bugs", icon: "🎯" } },
  { id: "req-docs", type: "tool", position: { x: 300, y: 140 }, data: { label: "Confluence / Docs", sublabel: "Test Scenarios", icon: "📄" } },
  { id: "req-uml", type: "tool", position: { x: 520, y: 140 }, data: { label: "UML / EA", sublabel: "Architecture Models", icon: "🏗️" } },
  { id: "req-review", type: "process", position: { x: 720, y: 140 }, data: { label: "Code Review", sublabel: "GitHub PRs", icon: "👁️" } },

  // Layer 2 – Test Design
  { id: "pop", type: "process", position: { x: 200, y: 280 }, data: { label: "Page Object Pattern", sublabel: "Maintainable Selectors", icon: "🧩" } },
  { id: "bdd", type: "process", position: { x: 450, y: 280 }, data: { label: "BDD / Gherkin", sublabel: "Given / When / Then", icon: "🥒" } },
  { id: "decision-platform", type: "decision", position: { x: 680, y: 270 }, data: { label: "Platform?" } },

  // Layer 3 – Tools
  { id: "appium", type: "tool", position: { x: 50, y: 420 }, data: { label: "Appium", sublabel: "Mobile Automation", icon: "📱" } },
  { id: "selenium", type: "tool", position: { x: 230, y: 420 }, data: { label: "Selenium", sublabel: "Web Automation", icon: "🌐" } },
  { id: "kotlin", type: "tool", position: { x: 420, y: 420 }, data: { label: "Kotlin / Java", sublabel: "OOP Test Code", icon: "⚡" } },
  { id: "unit", type: "tool", position: { x: 610, y: 420 }, data: { label: "Unit Tests", sublabel: "JUnit / TestNG", icon: "🔬" } },
  { id: "system", type: "tool", position: { x: 790, y: 420 }, data: { label: "System Tests", sublabel: "E2E Scenarios", icon: "🔭" } },

  // Layer 4 – CI/CD
  { id: "github", type: "tool", position: { x: 150, y: 560 }, data: { label: "GitHub", sublabel: "Source Control", icon: "🐙" } },
  { id: "actions", type: "tool", position: { x: 380, y: 560 }, data: { label: "GitHub Actions", sublabel: "CI/CD Pipeline", icon: "⚙️" } },
  { id: "docker", type: "tool", position: { x: 610, y: 560 }, data: { label: "Docker", sublabel: "Test Environment", icon: "🐳" } },

  // Layer 5 – Reporting
  { id: "report", type: "database", position: { x: 200, y: 700 }, data: { label: "Test Reports", sublabel: "Allure / HTML", icon: "📊" } },
  { id: "analytics", type: "database", position: { x: 450, y: 700 }, data: { label: "Analytics", sublabel: "Pass/Fail Trends", icon: "📈" } },
  { id: "notify", type: "process", position: { x: 680, y: 700 }, data: { label: "Notifications", sublabel: "Slack / Email", icon: "🔔" } },

  // Notes
  { id: "note1", type: "note", position: { x: 950, y: 140 }, data: { label: "Enterprise Architect used for UML diagrams & architecture documentation" } },
  { id: "note2", type: "note", position: { x: 950, y: 420 }, data: { label: "Tool selection is variable – Appium/Selenium/Playwright can be swapped based on project needs" } },
];

const QA_EDGES: Edge[] = [
  // Strategy → Requirements
  { id: "e-s-jira", source: "strategy", target: "req-jira", animated: true, style: { stroke: "#60a5fa" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#60a5fa" } },
  { id: "e-s-docs", source: "strategy", target: "req-docs", animated: true, style: { stroke: "#60a5fa" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#60a5fa" } },
  { id: "e-s-uml", source: "strategy", target: "req-uml", animated: true, style: { stroke: "#60a5fa" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#60a5fa" } },
  { id: "e-s-rev", source: "strategy", target: "req-review", animated: true, style: { stroke: "#60a5fa" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#60a5fa" } },
  // Requirements → Test Design
  { id: "e-jira-pop", source: "req-jira", target: "pop", style: { stroke: "#4ade80" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#4ade80" } },
  { id: "e-docs-bdd", source: "req-docs", target: "bdd", style: { stroke: "#4ade80" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#4ade80" } },
  { id: "e-rev-dec", source: "req-review", target: "decision-platform", style: { stroke: "#4ade80" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#4ade80" } },
  // Test Design → Tools
  { id: "e-pop-appium", source: "pop", target: "appium", style: { stroke: "#a78bfa" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#a78bfa" } },
  { id: "e-pop-selenium", source: "pop", target: "selenium", style: { stroke: "#a78bfa" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#a78bfa" } },
  { id: "e-bdd-kotlin", source: "bdd", target: "kotlin", style: { stroke: "#a78bfa" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#a78bfa" } },
  { id: "e-dec-unit", source: "decision-platform", target: "unit", style: { stroke: "#fbbf24", strokeDasharray: "5,5" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#fbbf24" }, label: "Unit", labelStyle: { fill: "#fbbf24", fontSize: 10 } },
  { id: "e-dec-sys", source: "decision-platform", target: "system", style: { stroke: "#fbbf24", strokeDasharray: "5,5" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#fbbf24" }, label: "E2E", labelStyle: { fill: "#fbbf24", fontSize: 10 } },
  // Tools → CI/CD
  { id: "e-appium-gh", source: "appium", target: "github", style: { stroke: "#fb923c" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#fb923c" } },
  { id: "e-selenium-gh", source: "selenium", target: "github", style: { stroke: "#fb923c" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#fb923c" } },
  { id: "e-kotlin-actions", source: "kotlin", target: "actions", style: { stroke: "#fb923c" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#fb923c" } },
  { id: "e-gh-actions", source: "github", target: "actions", animated: true, style: { stroke: "#fb923c" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#fb923c" } },
  { id: "e-actions-docker", source: "actions", target: "docker", style: { stroke: "#fb923c" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#fb923c" } },
  // CI/CD → Reporting
  { id: "e-actions-report", source: "actions", target: "report", animated: true, style: { stroke: "#c084fc" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#c084fc" } },
  { id: "e-docker-analytics", source: "docker", target: "analytics", style: { stroke: "#c084fc" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#c084fc" } },
  { id: "e-analytics-notify", source: "analytics", target: "notify", style: { stroke: "#c084fc" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#c084fc" } },
  // Notes
  { id: "e-uml-note1", source: "req-uml", target: "note1", style: { stroke: "#fef08a", strokeDasharray: "3,3", opacity: 0.5 } },
  { id: "e-kotlin-note2", source: "kotlin", target: "note2", style: { stroke: "#fef08a", strokeDasharray: "3,3", opacity: 0.5 } },
];

// ─── Node palette items ─────────────────────────────────────────────────────
const NODE_PALETTE = [
  { type: "process", label: "Process", icon: Square, color: "text-blue-400", desc: "Step / Activity" },
  { type: "tool", label: "Tool", icon: Code2, color: "text-green-400", desc: "Technology" },
  { type: "decision", label: "Decision", icon: Diamond, color: "text-amber-400", desc: "Branch / Choice" },
  { type: "database", label: "Data", icon: Database, color: "text-purple-400", desc: "Storage / Report" },
  { type: "note", label: "Note", icon: Type, color: "text-yellow-300", desc: "Annotation" },
];

let nodeIdCounter = 100;

// ─── Main Component ─────────────────────────────────────────────────────────
export default function ArchitectureWhiteboard() {
  const [nodes, setNodes, onNodesChange] = useNodesState(QA_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(QA_EDGES);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editSublabel, setEditSublabel] = useState("");
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" }, style: { stroke: "#94a3b8" } }, eds)
      ),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setEditLabel((node.data as NodeData).label ?? "");
    setEditSublabel((node.data as NodeData).sublabel ?? "");
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateSelectedLabel = useCallback(() => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? { ...n, data: { ...n.data, label: editLabel, sublabel: editSublabel } }
          : n
      )
    );
  }, [selectedNode, editLabel, editSublabel, setNodes]);

  const deleteSelected = useCallback(() => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  const addNode = useCallback((type: string) => {
    const id = `node-${++nodeIdCounter}`;
    const newNode: Node = {
      id,
      type,
      position: { x: 300 + Math.random() * 200, y: 300 + Math.random() * 100 },
      data: { label: "New Node", sublabel: "" },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const resetDiagram = useCallback(() => {
    setNodes(QA_NODES);
    setEdges(QA_EDGES);
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  const exportPNG = useCallback(() => {
    const svgEl = reactFlowWrapper.current?.querySelector(".react-flow__renderer svg");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const a = document.createElement("a");
      a.download = "qa-architecture.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-3">
          <GitBranch className="h-5 w-5 text-blue-400" />
          <h1 className="text-lg font-bold text-slate-100">Architecture Whiteboard</h1>
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">QA Automation Framework</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetDiagram} className="gap-1 text-xs border-slate-600 text-slate-300 hover:bg-slate-800">
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>
          <Button variant="outline" size="sm" onClick={exportPNG} className="gap-1 text-xs border-slate-600 text-slate-300 hover:bg-slate-800">
            <Download className="h-3 w-3" /> Export PNG
          </Button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left Toolbar */}
        <div className="w-48 bg-slate-900 border-r border-slate-700 flex flex-col gap-1 p-3 shrink-0 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Add Node</div>
          {NODE_PALETTE.map((item) => (
            <button
              key={item.type}
              onClick={() => addNode(item.type)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors text-left group"
            >
              <item.icon className={`h-4 w-4 ${item.color} shrink-0`} />
              <div>
                <div className={`text-sm font-medium ${item.color}`}>{item.label}</div>
                <div className="text-xs text-slate-500">{item.desc}</div>
              </div>
            </button>
          ))}

          <div className="border-t border-slate-700 mt-3 pt-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Legend</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-900 border border-blue-500/60" /><span className="text-slate-400">Process / Step</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-900 border border-green-500/60" /><span className="text-slate-400">Tool / Technology</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rotate-45 bg-amber-900 border border-amber-500/60" /><span className="text-slate-400">Decision</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-purple-900 border border-purple-500/60" /><span className="text-slate-400">Data / Report</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-yellow-950 border border-yellow-600/40" /><span className="text-slate-400">Note</span></div>
            </div>
          </div>

          {/* Node editor */}
          {selectedNode && (
            <div className="border-t border-slate-700 mt-3 pt-3 space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Edit Node</div>
              <Input
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                placeholder="Label"
                className="h-7 text-xs bg-slate-800 border-slate-600 text-slate-200"
              />
              <Input
                value={editSublabel}
                onChange={(e) => setEditSublabel(e.target.value)}
                placeholder="Sublabel (optional)"
                className="h-7 text-xs bg-slate-800 border-slate-600 text-slate-200"
              />
              <div className="flex gap-1">
                <Button size="sm" onClick={updateSelectedLabel} className="flex-1 h-7 text-xs bg-blue-700 hover:bg-blue-600">
                  <Save className="h-3 w-3 mr-1" /> Save
                </Button>
                <Button size="sm" variant="destructive" onClick={deleteSelected} className="h-7 text-xs">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div ref={reactFlowWrapper} className="flex-1 min-w-0">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            minZoom={0.2}
            maxZoom={2}
            style={{ background: "#0f172a" }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e293b" />
            <Controls className="!bg-slate-800 !border-slate-600 !rounded-lg" />
            <MiniMap
              style={{ background: "#1e293b", border: "1px solid #334155" }}
              nodeColor={(n) => {
                if (n.type === "process") return "#1d4ed8";
                if (n.type === "tool") return "#15803d";
                if (n.type === "decision") return "#b45309";
                if (n.type === "database") return "#7e22ce";
                return "#854d0e";
              }}
              maskColor="rgba(15,23,42,0.7)"
            />
            <Panel position="top-center">
              <div className="flex gap-2 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg px-3 py-1.5 text-xs text-slate-400">
                <span>🖱️ Drag nodes to move</span>
                <span>•</span>
                <span>🔗 Drag handle → handle to connect</span>
                <span>•</span>
                <span>🖱️ Scroll to zoom</span>
                <span>•</span>
                <span>Click node to edit</span>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
