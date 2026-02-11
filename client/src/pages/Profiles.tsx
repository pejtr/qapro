import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Plus,
  Shield,
  Globe,
  Wifi,
  Trash2,
  Edit,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

const PLATFORM_ICONS: Record<string, string> = {
  twitter: "𝕏",
  instagram: "📷",
  facebook: "📘",
  tiktok: "🎵",
  youtube: "▶️",
  custom: "🔧",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500",
  inactive: "bg-gray-500",
  banned: "bg-red-500",
  warming: "bg-yellow-500",
};

export default function Profiles() {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<string>("custom");
  const [proxyHost, setProxyHost] = useState("");
  const [proxyPort, setProxyPort] = useState("");
  const [proxyUser, setProxyUser] = useState("");
  const [proxyPass, setProxyPass] = useState("");

  const { data: profiles } = trpc.profiles.list.useQuery();
  const createProfile = trpc.profiles.create.useMutation({
    onSuccess: () => {
      toast.success("Profile created");
      setShowCreate(false);
      resetForm();
      utils.profiles.list.invalidate();
    },
  });
  const deleteProfile = trpc.profiles.delete.useMutation({
    onSuccess: () => {
      toast.success("Profile deleted");
      utils.profiles.list.invalidate();
    },
  });
  const utils = trpc.useUtils();

  const resetForm = () => {
    setName("");
    setPlatform("custom");
    setProxyHost("");
    setProxyPort("");
    setProxyUser("");
    setProxyPass("");
  };

  const handleCreate = () => {
    createProfile.mutate({
      name,
      platform: platform as any,
      proxyHost: proxyHost || undefined,
      proxyPort: proxyPort ? parseInt(proxyPort) : undefined,
      proxyUsername: proxyUser || undefined,
      proxyPassword: proxyPass || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Profile Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage multi-account profiles with proxy and credential configuration
          </p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              New Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>Profile Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Marketing Account #1" className="mt-1" />
              </div>
              <div>
                <Label>Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twitter">Twitter / X</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-primary" />
                  Proxy Configuration
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Host</Label>
                    <Input value={proxyHost} onChange={(e) => setProxyHost(e.target.value)} placeholder="proxy.example.com" className="mt-1 h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs">Port</Label>
                    <Input value={proxyPort} onChange={(e) => setProxyPort(e.target.value)} placeholder="8080" className="mt-1 h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs">Username</Label>
                    <Input value={proxyUser} onChange={(e) => setProxyUser(e.target.value)} placeholder="Optional" className="mt-1 h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs">Password</Label>
                    <Input type="password" value={proxyPass} onChange={(e) => setProxyPass(e.target.value)} placeholder="Optional" className="mt-1 h-8 text-sm" />
                  </div>
                </div>
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={!name}>
                Create Profile
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles && profiles.length > 0 ? (
          profiles.map((profile) => (
            <Card key={profile.id} className="bg-card border-border group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{PLATFORM_ICONS[profile.platform] || "🔧"}</span>
                    <div>
                      <h3 className="font-semibold text-foreground">{profile.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{profile.platform}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`h-2 w-2 rounded-full ${STATUS_COLORS[profile.status]}`} />
                    <span className="text-xs text-muted-foreground capitalize">{profile.status}</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {profile.proxyHost && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-3.5 w-3.5" />
                      <span className="truncate">{profile.proxyHost}:{profile.proxyPort}</span>
                    </div>
                  )}
                  {!profile.proxyHost && (
                    <div className="flex items-center gap-2 text-muted-foreground/50">
                      <Wifi className="h-3.5 w-3.5" />
                      <span>No proxy configured</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs text-destructive hover:text-destructive"
                    onClick={() => deleteProfile.mutate({ id: profile.id })}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full bg-card border-border">
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No profiles yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Create a profile to manage multi-account automation with proxy support
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
