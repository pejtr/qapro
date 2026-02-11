import { useState, useCallback, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Workflow,
  Plus,
  Play,
  Trash2,
  MousePointer,
  Type,
  Clock,
  GitBranch,
  RotateCw,
  Eye,
  ArrowRight,
  GripVertical,
  Save,
} from "lucide-react";
import { toast } from "sonner";

interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

const NODE_TYPES = [
  { type: "click", label: "Click", icon: MousePointer, color: "#6366f1", description: "Click on an element" },
  { type: "type", label: "Type Text", icon: Type, color: "#8b5cf6", description: "Type text into a field" },
  { type: "wait", label: "Wait", icon: Clock, color: "#a78bfa", description: "Wait for a duration or element" },
  { type: "condition", label: "Condition", icon: GitBranch, color: "#c084fc", description: "Branch based on condition" },
  { type: "loop", label: "Loop", icon: RotateCw, color: "#e879f9", description: "Repeat actions" },
  { type: "screenshot", label: "Screenshot", icon: Eye, color: "#f472b6", description: "Capture a screenshot" },
  { type: "navigate", label: "Navigate", icon: ArrowRight, color: "#fb923c", description: "Go to a URL" },
];

function NodePalette({ onAddNode }: { onAddNode: (type: string) => void }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
        Actions
      </h3>
      {NODE_TYPES.map((nt) => (
        <button
          key={nt.type}
          onClick={() => onAddNode(nt.type)}
          className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent transition-colors text-left group"
        >
          <div
            className="h-8 w-8 rounded-md flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${nt.color}20` }}
          >
            <nt.icon className="h-4 w-4" style={{ color: nt.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{nt.label}</p>
            <p className="text-xs text-muted-foreground truncate">{nt.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function WorkflowCanvas({
  nodes,
  edges,
  selectedNode,
  onSelectNode,
  onRemoveNode,
  onMoveNode,
}: {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNode: string | null;
  onSelectNode: (id: string | null) => void;
  onRemoveNode: (id: string) => void;
  onMoveNode: (id: string, pos: { x: number; y: number }) => void;
}) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string, nodePos: { x: number; y: number }) => {
      e.stopPropagation();
      setDragging(nodeId);
      setDragOffset({ x: e.clientX - nodePos.x, y: e.clientY - nodePos.y });
      onSelectNode(nodeId);
    },
    [onSelectNode]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      onMoveNode(dragging, { x: Math.max(0, newX), y: Math.max(0, newY) });
    },
    [dragging, dragOffset, onMoveNode]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  return (
    <div
      className="relative w-full h-full bg-secondary/30 rounded-lg overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={() => onSelectNode(null)}
    >
      {/* Edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {edges.map((edge) => {
          const source = nodes.find((n) => n.id === edge.source);
          const target = nodes.find((n) => n.id === edge.target);
          if (!source || !target) return null;
          const sx = source.position.x + 100;
          const sy = source.position.y + 28;
          const tx = target.position.x;
          const ty = target.position.y + 28;
          const mx = (sx + tx) / 2;
          return (
            <path
              key={edge.id}
              d={`M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${tx} ${ty}`}
              stroke="#6366f1"
              strokeWidth={2}
              fill="none"
              strokeDasharray="6 3"
              opacity={0.6}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => {
        const nodeType = NODE_TYPES.find((nt) => nt.type === node.type);
        const isSelected = selectedNode === node.id;
        return (
          <div
            key={node.id}
            className={`absolute flex items-center gap-2 px-3 py-2 rounded-lg border cursor-move select-none transition-shadow ${
              isSelected
                ? "border-primary shadow-lg shadow-primary/20 bg-card"
                : "border-border bg-card hover:border-primary/50"
            }`}
            style={{
              left: node.position.x,
              top: node.position.y,
              minWidth: 200,
            }}
            onMouseDown={(e) => handleMouseDown(e, node.id, node.position)}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
            <div
              className="h-7 w-7 rounded flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${nodeType?.color || "#6366f1"}20` }}
            >
              {nodeType && (
                <nodeType.icon
                  className="h-3.5 w-3.5"
                  style={{ color: nodeType.color }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {(node.data.label as string) || nodeType?.label || node.type}
              </p>
              {node.data.selector ? (
                <p className="text-xs text-muted-foreground truncate">
                  {String(node.data.selector)}
                </p>
              ) : null}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveNode(node.id);
              }}
              className="h-6 w-6 flex items-center justify-center rounded hover:bg-destructive/10 transition-colors shrink-0"
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </button>
          </div>
        );
      })}

      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Workflow className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">
              Drag actions from the palette to build your workflow
            </p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              Or click an action to add it to the canvas
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function NodeProperties({
  node,
  onUpdate,
}: {
  node: WorkflowNode;
  onUpdate: (data: Record<string, unknown>) => void;
}) {
  const nodeType = NODE_TYPES.find((nt) => nt.type === node.type);
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Properties
      </h3>
      <div className="space-y-3">
        <div>
          <Label className="text-xs">Label</Label>
          <Input
            value={(node.data.label as string) || ""}
            onChange={(e) => onUpdate({ ...node.data, label: e.target.value })}
            placeholder={nodeType?.label}
            className="mt-1 h-8 text-sm"
          />
        </div>
        {(node.type === "click" || node.type === "type") && (
          <div>
            <Label className="text-xs">CSS Selector</Label>
            <Input
              value={(node.data.selector as string) || ""}
              onChange={(e) =>
                onUpdate({ ...node.data, selector: e.target.value })
              }
              placeholder='e.g. #submit-btn, .login-form input[type="email"]'
              className="mt-1 h-8 text-sm"
            />
          </div>
        )}
        {node.type === "type" && (
          <div>
            <Label className="text-xs">Text to Type</Label>
            <Input
              value={(node.data.text as string) || ""}
              onChange={(e) => onUpdate({ ...node.data, text: e.target.value })}
              placeholder="Enter text..."
              className="mt-1 h-8 text-sm"
            />
          </div>
        )}
        {node.type === "wait" && (
          <div>
            <Label className="text-xs">Duration (ms)</Label>
            <Input
              type="number"
              value={(node.data.duration as number) || 1000}
              onChange={(e) =>
                onUpdate({ ...node.data, duration: parseInt(e.target.value) })
              }
              className="mt-1 h-8 text-sm"
            />
          </div>
        )}
        {node.type === "navigate" && (
          <div>
            <Label className="text-xs">URL</Label>
            <Input
              value={(node.data.url as string) || ""}
              onChange={(e) => onUpdate({ ...node.data, url: e.target.value })}
              placeholder="https://example.com"
              className="mt-1 h-8 text-sm"
            />
          </div>
        )}
        {node.type === "condition" && (
          <div>
            <Label className="text-xs">Condition Expression</Label>
            <Input
              value={(node.data.expression as string) || ""}
              onChange={(e) =>
                onUpdate({ ...node.data, expression: e.target.value })
              }
              placeholder='e.g. element.visible("#modal")'
              className="mt-1 h-8 text-sm"
            />
          </div>
        )}
        {node.type === "loop" && (
          <div>
            <Label className="text-xs">Iterations</Label>
            <Input
              type="number"
              value={(node.data.iterations as number) || 5}
              onChange={(e) =>
                onUpdate({ ...node.data, iterations: parseInt(e.target.value) })
              }
              className="mt-1 h-8 text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScriptBuilder() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [scriptName, setScriptName] = useState("Untitled Script");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: scriptsList } = trpc.scripts.list.useQuery();
  const createScript = trpc.scripts.create.useMutation({
    onSuccess: () => {
      toast.success("Script saved successfully");
      setShowCreateDialog(false);
    },
  });
  const utils = trpc.useUtils();

  const addNode = useCallback(
    (type: string) => {
      const id = `node_${Date.now()}`;
      const yOffset = nodes.length * 80 + 40;
      const newNode: WorkflowNode = {
        id,
        type,
        position: { x: 120, y: yOffset },
        data: {},
      };
      setNodes((prev) => {
        const updated = [...prev, newNode];
        // Auto-connect to previous node
        if (prev.length > 0) {
          const lastNode = prev[prev.length - 1];
          setEdges((prevEdges) => [
            ...prevEdges,
            { id: `edge_${Date.now()}`, source: lastNode.id, target: id },
          ]);
        }
        return updated;
      });
      setSelectedNode(id);
    },
    [nodes.length]
  );

  const removeNode = useCallback((id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) =>
      prev.filter((e) => e.source !== id && e.target !== id)
    );
    setSelectedNode(null);
  }, []);

  const moveNode = useCallback(
    (id: string, pos: { x: number; y: number }) => {
      setNodes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, position: pos } : n))
      );
    },
    []
  );

  const updateNodeData = useCallback(
    (data: Record<string, unknown>) => {
      if (!selectedNode) return;
      setNodes((prev) =>
        prev.map((n) => (n.id === selectedNode ? { ...n, data } : n))
      );
    },
    [selectedNode]
  );

  const selectedNodeObj = useMemo(
    () => nodes.find((n) => n.id === selectedNode),
    [nodes, selectedNode]
  );

  const handleSave = () => {
    createScript.mutate({
      name: scriptName,
      description: `Workflow with ${nodes.length} steps`,
      nodes,
      edges,
    });
    utils.scripts.list.invalidate();
  };

  return (
    <div className="space-y-4 h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Workflow className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Script Builder</h1>
          <Badge variant="outline" className="text-xs">
            {nodes.length} nodes
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={scriptName}
            onChange={(e) => setScriptName(e.target.value)}
            className="w-48 h-8 text-sm"
          />
          <Button size="sm" variant="outline" onClick={handleSave}>
            <Save className="h-3.5 w-3.5 mr-1" />
            Save
          </Button>
          <Button size="sm" disabled={nodes.length === 0}>
            <Play className="h-3.5 w-3.5 mr-1" />
            Run
          </Button>
        </div>
      </div>

      {/* Builder Layout */}
      <div className="grid grid-cols-[220px_1fr_260px] gap-4 h-[calc(100%-3rem)]">
        {/* Left: Node Palette */}
        <Card className="bg-card border-border overflow-y-auto">
          <CardContent className="p-3">
            <NodePalette onAddNode={addNode} />
            {/* Saved Scripts */}
            {scriptsList && scriptsList.length > 0 && (
              <div className="mt-6 space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                  Saved Scripts
                </h3>
                {scriptsList.map((s) => (
                  <button
                    key={s.id}
                    className="w-full text-left p-2 rounded-lg hover:bg-accent transition-colors"
                    onClick={() => {
                      setNodes((s.nodes as WorkflowNode[]) || []);
                      setEdges((s.edges as WorkflowEdge[]) || []);
                      setScriptName(s.name);
                    }}
                  >
                    <p className="text-sm font-medium text-foreground truncate">
                      {s.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.status} · {Array.isArray(s.nodes) ? s.nodes.length : 0} steps
                    </p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Center: Canvas */}
        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
          onRemoveNode={removeNode}
          onMoveNode={moveNode}
        />

        {/* Right: Properties Panel */}
        <Card className="bg-card border-border overflow-y-auto">
          <CardContent className="p-3">
            {selectedNodeObj ? (
              <NodeProperties
                node={selectedNodeObj}
                onUpdate={updateNodeData}
              />
            ) : (
              <div className="text-center py-8">
                <MousePointer className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Select a node to edit its properties
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
