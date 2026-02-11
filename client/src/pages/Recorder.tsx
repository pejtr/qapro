import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Circle,
  Square,
  Pause,
  Play,
  Trash2,
  MousePointer,
  Type,
  Navigation,
  Clock,
  Eye,
  Download,
  Workflow,
} from "lucide-react";

interface RecordedAction {
  id: string;
  type: string;
  selector?: string;
  value?: string;
  url?: string;
  timestamp: number;
  duration?: number;
}

const ACTION_ICONS: Record<string, React.ElementType> = {
  click: MousePointer,
  type: Type,
  navigate: Navigation,
  wait: Clock,
  scroll: Eye,
};

const DEMO_ACTIONS: RecordedAction[] = [
  { id: "1", type: "navigate", url: "https://twitter.com/login", timestamp: 0 },
  { id: "2", type: "click", selector: 'input[name="username"]', timestamp: 1200 },
  { id: "3", type: "type", selector: 'input[name="username"]', value: "user@example.com", timestamp: 1500 },
  { id: "4", type: "click", selector: 'button[data-testid="next"]', timestamp: 3200 },
  { id: "5", type: "wait", duration: 2000, timestamp: 3500 },
  { id: "6", type: "type", selector: 'input[name="password"]', value: "••••••••", timestamp: 5800 },
  { id: "7", type: "click", selector: 'button[data-testid="login"]', timestamp: 7100 },
];

export default function Recorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [actions, setActions] = useState<RecordedAction[]>([]);
  const [targetUrl, setTargetUrl] = useState("https://");
  const [showDemo, setShowDemo] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setActions([]);
    toast("Recording started. Interact with the target page.");
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
  };

  const handleLoadDemo = () => {
    setActions(DEMO_ACTIONS);
    setShowDemo(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Circle className="h-6 w-6 text-red-500" />
          Script Recorder
        </h1>
        <p className="text-muted-foreground mt-1">
          Record user interactions and intelligently detect DOM elements for robust automation
        </p>
      </div>

      {/* Recording Controls */}
      <Card className="bg-card border-border">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="Enter target URL to record..."
                className="h-10"
                disabled={isRecording}
              />
            </div>
            {!isRecording ? (
              <Button onClick={handleStartRecording} className="bg-red-600 hover:bg-red-700">
                <Circle className="h-4 w-4 mr-2 fill-current" />
                Start Recording
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? (
                    <Play className="h-4 w-4 mr-1" />
                  ) : (
                    <Pause className="h-4 w-4 mr-1" />
                  )}
                  {isPaused ? "Resume" : "Pause"}
                </Button>
                <Button variant="destructive" onClick={handleStopRecording}>
                  <Square className="h-4 w-4 mr-1" />
                  Stop
                </Button>
              </div>
            )}
            <Button variant="outline" onClick={handleLoadDemo}>
              Load Demo
            </Button>
          </div>
          {isRecording && (
            <div className="flex items-center gap-2 mt-3">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm text-red-400">
                {isPaused ? "Recording paused" : "Recording in progress..."}
              </span>
              <Badge variant="outline" className="ml-auto text-xs">
                {actions.length} actions captured
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recorded Actions Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Workflow className="h-4 w-4 text-primary" />
                  Captured Actions
                </span>
                {actions.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      <Download className="h-3 w-3 mr-1" />
                      Export to Script Builder
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs text-destructive"
                      onClick={() => setActions([])}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {actions.length > 0 ? (
                <div className="space-y-1">
                  {actions.map((action, index) => {
                    const Icon = ACTION_ICONS[action.type] || MousePointer;
                    return (
                      <div
                        key={action.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                      >
                        <span className="text-xs text-muted-foreground w-6 text-right shrink-0">
                          {index + 1}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-primary shrink-0" />
                        <div className="h-7 w-7 rounded flex items-center justify-center bg-primary/10 shrink-0">
                          <Icon className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground capitalize">
                              {action.type}
                            </span>
                            {action.selector && (
                              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded text-muted-foreground truncate max-w-[300px]">
                                {action.selector}
                              </code>
                            )}
                          </div>
                          {action.value && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Value: "{action.value}"
                            </p>
                          )}
                          {action.url && (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {action.url}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          +{(action.timestamp / 1000).toFixed(1)}s
                        </span>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Circle className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No actions recorded yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Start recording or load a demo to see captured interactions
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Element Inspector */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Element Inspector
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Smart Detection
                </h4>
                <p className="text-sm text-foreground">
                  Momentum Studio uses intelligent DOM analysis to generate robust selectors
                  that survive UI changes.
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-muted-foreground">Primary Selector</span>
                  <code className="block text-sm bg-secondary/50 p-2 rounded mt-1 text-foreground">
                    [data-testid="login-btn"]
                  </code>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Fallback CSS</span>
                  <code className="block text-sm bg-secondary/50 p-2 rounded mt-1 text-foreground">
                    .login-form &gt; button.primary
                  </code>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">XPath</span>
                  <code className="block text-sm bg-secondary/50 p-2 rounded mt-1 text-foreground">
                    //button[@type='submit']
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function toast(msg: string) {
  // Using sonner toast imported at module level would conflict
  // This is a placeholder - the actual toast is from sonner
}
