import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Monitor,
  Play,
  Pause,
  Square,
  Maximize2,
  Activity,
  Terminal,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: Date;
  level: "info" | "success" | "warning" | "error";
  message: string;
}

const DEMO_LOGS: LogEntry[] = [
  { id: "1", timestamp: new Date(Date.now() - 5000), level: "info", message: "Execution started for script: Twitter Auto Engagement" },
  { id: "2", timestamp: new Date(Date.now() - 4500), level: "info", message: "Navigating to https://twitter.com" },
  { id: "3", timestamp: new Date(Date.now() - 4000), level: "success", message: "Page loaded successfully" },
  { id: "4", timestamp: new Date(Date.now() - 3500), level: "info", message: "Waiting for login form..." },
  { id: "5", timestamp: new Date(Date.now() - 3000), level: "success", message: "Login form detected" },
  { id: "6", timestamp: new Date(Date.now() - 2500), level: "info", message: "Filling credentials from profile: Marketing_Account_1" },
  { id: "7", timestamp: new Date(Date.now() - 2000), level: "success", message: "Credentials entered" },
  { id: "8", timestamp: new Date(Date.now() - 1500), level: "info", message: "Clicking login button" },
  { id: "9", timestamp: new Date(Date.now() - 1000), level: "success", message: "Login successful" },
  { id: "10", timestamp: new Date(Date.now() - 500), level: "info", message: "Starting engagement loop..." },
];

const LOG_ICONS: Record<string, React.ElementType> = {
  info: Activity,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
};

const LOG_COLORS: Record<string, string> = {
  info: "text-blue-400",
  success: "text-green-400",
  warning: "text-yellow-400",
  error: "text-red-400",
};

export default function LiveMonitor() {
  const [selectedExecution, setSelectedExecution] = useState<string>("");
  const [logs, setLogs] = useState<LogEntry[]>(DEMO_LOGS);

  const { data: allExecutions } = trpc.executions.list.useQuery({ limit: 20 });
  const runningExecutions = allExecutions?.filter(e => e.status === 'running');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Monitor className="h-6 w-6 text-primary" />
          Live Instance Monitor
        </h1>
        <p className="text-muted-foreground mt-1">
          Watch running automations in real-time with VNC-style preview and detailed execution logs
        </p>
      </div>

      {/* Running Instances */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {runningExecutions && runningExecutions.length > 0 ? (
          runningExecutions.slice(0, 4).map((exec) => (
            <Card
              key={exec.id}
              className={`bg-card border-border cursor-pointer transition-colors ${selectedExecution === exec.id.toString() ? "border-primary" : "hover:border-primary/30"}`}
              onClick={() => setSelectedExecution(exec.id.toString())}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs text-green-400 border-green-500/20 bg-green-500/10">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                    Running
                  </Badge>
                  <span className="text-xs text-muted-foreground">#{exec.id}</span>
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">Script #{exec.scriptId}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{exec.startedAt ? new Date(exec.startedAt).toLocaleTimeString() : 'N/A'}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full bg-card border-border">
            <CardContent className="py-8 text-center">
              <Activity className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No running instances</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Start a script to see live monitoring</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Monitor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* VNC Preview */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary" />
              Browser Preview
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <Pause className="h-3 w-3 mr-1" />
                Pause
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <Square className="h-3 w-3 mr-1" />
                Stop
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative bg-secondary/30 rounded-lg overflow-hidden" style={{ aspectRatio: "16/10" }}>
              {/* Simulated browser preview */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Monitor className="h-16 w-16 mx-auto text-muted-foreground/20 mb-3" />
                  <p className="text-muted-foreground text-sm">Browser preview will appear here</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Select a running instance to view live feed</p>
                </div>
              </div>
              {/* Overlay controls */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-card/80 backdrop-blur-sm">
                  <Zap className="h-3 w-3 mr-1 text-green-400" />
                  Live
                </Badge>
                <Badge variant="outline" className="text-xs bg-card/80 backdrop-blur-sm">
                  1920x1080
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Execution Logs */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              Execution Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-3">
              <div className="space-y-1">
                {logs.map((log) => {
                  const Icon = LOG_ICONS[log.level];
                  const color = LOG_COLORS[log.level];
                  return (
                    <div key={log.id} className="flex items-start gap-2 p-2 rounded hover:bg-accent/30 transition-colors">
                      <Icon className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground leading-relaxed">{log.message}</p>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Steps Completed</p>
                <p className="text-xl font-bold text-foreground">8 / 12</p>
              </div>
              <Activity className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Runtime</p>
                <p className="text-xl font-bold text-foreground">00:05:23</p>
              </div>
              <Clock className="h-5 w-5 text-chart-2" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <p className="text-xl font-bold text-foreground">100%</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Errors</p>
                <p className="text-xl font-bold text-foreground">0</p>
              </div>
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
