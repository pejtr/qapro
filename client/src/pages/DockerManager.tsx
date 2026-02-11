import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Container,
  Plus,
  Play,
  Square,
  Trash2,
  Server,
  Cpu,
  HardDrive,
  Activity,
  RefreshCw,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  running: { color: "text-green-400", bg: "bg-green-500" },
  stopped: { color: "text-gray-400", bg: "bg-gray-500" },
  error: { color: "text-red-400", bg: "bg-red-500" },
  deploying: { color: "text-yellow-400", bg: "bg-yellow-500" },
};

export default function DockerManager() {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("5900");

  const { data: containersList } = trpc.containers.list.useQuery();
  const createContainer = trpc.containers.create.useMutation({
    onSuccess: () => {
      toast.success("Container added");
      setShowCreate(false);
      setName("");
      setHost("");
      setPort("5900");
      utils.containers.list.invalidate();
    },
  });
  const deleteContainer = trpc.containers.delete.useMutation({
    onSuccess: () => {
      toast.success("Container removed");
      utils.containers.list.invalidate();
    },
  });
  const utils = trpc.useUtils();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Container className="h-6 w-6 text-primary" />
            Docker Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Deploy and monitor automation containers on your self-hosted infrastructure
          </p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              Add Container
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Docker Container</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>Container Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. worker-01" className="mt-1" />
              </div>
              <div>
                <Label>Host Address</Label>
                <Input value={host} onChange={(e) => setHost(e.target.value)} placeholder="e.g. 192.168.1.100" className="mt-1" />
              </div>
              <div>
                <Label>VNC Port</Label>
                <Input value={port} onChange={(e) => setPort(e.target.value)} placeholder="5900" className="mt-1" />
              </div>
              <Button
                onClick={() => createContainer.mutate({ name, host, port: parseInt(port) || 5900 })}
                className="w-full"
                disabled={!name || !host}
              >
                Add Container
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Server className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Total Containers</p>
                <p className="text-xl font-bold text-foreground">{containersList?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Running</p>
                <p className="text-xl font-bold text-foreground">
                  {containersList?.filter((c) => c.status === "running").length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Cpu className="h-5 w-5 text-chart-2" />
              <div>
                <p className="text-xs text-muted-foreground">Avg CPU</p>
                <p className="text-xl font-bold text-foreground">
                  {containersList && containersList.length > 0
                    ? Math.round(containersList.reduce((a, c) => a + (c.cpuUsage || 0), 0) / containersList.length)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <HardDrive className="h-5 w-5 text-chart-3" />
              <div>
                <p className="text-xs text-muted-foreground">Avg Memory</p>
                <p className="text-xl font-bold text-foreground">
                  {containersList && containersList.length > 0
                    ? Math.round(containersList.reduce((a, c) => a + (c.memoryUsage || 0), 0) / containersList.length)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Container List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {containersList && containersList.length > 0 ? (
          containersList.map((container) => {
            const statusConf = STATUS_CONFIG[container.status] || STATUS_CONFIG.stopped;
            return (
              <Card key={container.id} className="bg-card border-border">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Terminal className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{container.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {container.host}:{container.port}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-xs ${statusConf.color}`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${statusConf.bg} mr-1.5`} />
                      {container.status}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">CPU Usage</span>
                        <span className="text-foreground">{container.cpuUsage || 0}%</span>
                      </div>
                      <Progress value={container.cpuUsage || 0} className="h-1.5" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Memory</span>
                        <span className="text-foreground">{container.memoryUsage || 0}%</span>
                      </div>
                      <Progress value={container.memoryUsage || 0} className="h-1.5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                    <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                      {container.status === "running" ? (
                        <>
                          <Square className="h-3 w-3 mr-1" /> Stop
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" /> Start
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 text-xs">
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs text-destructive hover:text-destructive"
                      onClick={() => deleteContainer.mutate({ id: container.id })}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="col-span-full bg-card border-border">
            <CardContent className="py-12 text-center">
              <Container className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No containers configured</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Add Docker containers to scale your automations across multiple servers
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
