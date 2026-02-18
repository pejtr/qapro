import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

interface MindMapConnection {
  from: string;
  to: string;
}

export function MindMapDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [nodes, setNodes] = useState<MindMapNode[]>([
    { id: '1', text: 'QA Pro', x: 400, y: 300, color: '#f59e0b' },
  ]);
  const [connections] = useState<MindMapConnection[]>([]);

  const addNode = () => {
    const newNode: MindMapNode = {
      id: Date.now().toString(),
      text: 'New Idea',
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
    };
    setNodes([...nodes, newNode]);
    toast.success('Node added! Drag to reposition.');
  };

  const exportMindMap = () => {
    toast.success('Mind map export coming soon!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Mind Map</DialogTitle>
          <DialogDescription>
            Visualize your ideas and connections. Click nodes to edit, drag to move.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button onClick={addNode} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Node
          </Button>
          <Button onClick={exportMindMap} size="sm" variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="relative flex-1 border rounded-lg bg-muted/20 overflow-hidden">
          <svg className="w-full h-full">
            {/* Draw connections */}
            {connections.map((conn, i) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;
              
              return (
                <line
                  key={i}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity="0.3"
                />
              );
            })}

            {/* Draw nodes */}
            {nodes.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="40"
                  fill={node.color}
                  opacity="0.8"
                  className="cursor-move hover:opacity-100 transition-opacity"
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-medium fill-white pointer-events-none"
                >
                  {node.text}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="text-xs text-muted-foreground">
          💡 Tip: Mind maps help organize complex automation workflows and project planning
        </div>
      </DialogContent>
    </Dialog>
  );
}
