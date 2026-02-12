import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Plus,
  UserPlus,
  Activity,
  Eye,
  Edit,
  Crown,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

const ROLE_ICONS = {
  owner: Crown,
  editor: Edit,
  viewer: Eye,
};

const ROLE_COLORS = {
  owner: "text-yellow-500",
  editor: "text-blue-500",
  viewer: "text-gray-500",
};

export default function Collaboration() {
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: workspaces, refetch } = trpc.collaboration.workspaces.useQuery();
  const createWorkspace = trpc.collaboration.createWorkspace.useMutation({
    onSuccess: () => {
      toast.success("Workspace created successfully");
      setNewWorkspaceName("");
      setNewWorkspaceDesc("");
      setIsCreateOpen(false);
      refetch();
    },
  });

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) {
      toast.error("Workspace name is required");
      return;
    }
    createWorkspace.mutate({
      name: newWorkspaceName,
      description: newWorkspaceDesc || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Team Collaboration
          </h1>
          <p className="text-muted-foreground mt-1">
            Collaborate in real-time with your team on automation workflows
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Workspace
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Workspace</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="e.g., Marketing Team"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={newWorkspaceDesc}
                  onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                  placeholder="Brief description of this workspace"
                />
              </div>
              <Button
                onClick={handleCreateWorkspace}
                disabled={createWorkspace.isPending}
                className="w-full"
              >
                {createWorkspace.isPending ? "Creating..." : "Create Workspace"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workspaces Grid */}
      {workspaces && workspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((workspace) => (
            <Card key={workspace.id} className="bg-card border-border hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center justify-between">
                  <span className="truncate">{workspace.name}</span>
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    3
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workspace.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {workspace.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(workspace.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    <UserPlus className="h-3 w-3 mr-1" />
                    Invite
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <h3 className="font-semibold text-foreground mb-1">No Workspaces Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first workspace to start collaborating with your team
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Workspace
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Collaboration Sessions */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Active Collaboration Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Demo active sessions */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarFallback className="text-xs bg-primary/20 text-primary">JD</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarFallback className="text-xs bg-chart-2/20 text-chart-2">SM</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Twitter Auto Engagement</p>
                  <p className="text-xs text-muted-foreground">2 editors active now</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                Join Session
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarFallback className="text-xs bg-chart-3/20 text-chart-3">AL</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Instagram Story Poster</p>
                  <p className="text-xs text-muted-foreground">1 editor active now</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                Join Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collaboration Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Real-Time Editing</h3>
                <p className="text-sm text-muted-foreground">
                  See cursor positions and edits from team members in real-time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Role-Based Access</h3>
                <p className="text-sm text-muted-foreground">
                  Control permissions with owner, editor, and viewer roles
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-3/10 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Change History</h3>
                <p className="text-sm text-muted-foreground">
                  Track all changes with automatic version history
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
