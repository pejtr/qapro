import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Apple,
  Workflow,
  Zap,
  Download,
  Copy,
  CheckCircle,
  Terminal,
  Calendar,
  Bell,
  Folder,
} from "lucide-react";
import { toast } from "sonner";

const INTEGRATION_FEATURES = [
  {
    icon: Workflow,
    title: "Automator Actions",
    description: "Trigger QA Automation - AI ToolKit scripts from native macOS Automator workflows",
    color: "#6366f1",
  },
  {
    icon: Zap,
    title: "Shortcuts App",
    description: "Run automations directly from Shortcuts with custom parameters",
    color: "#8b5cf6",
  },
  {
    icon: Calendar,
    title: "Calendar Events",
    description: "Launch scripts automatically when calendar events start or end",
    color: "#a78bfa",
  },
  {
    icon: Bell,
    title: "Notification Triggers",
    description: "React to system notifications and execute corresponding workflows",
    color: "#c084fc",
  },
  {
    icon: Folder,
    title: "Folder Actions",
    description: "Monitor folders and trigger scripts when files are added or modified",
    color: "#e879f9",
  },
  {
    icon: Terminal,
    title: "CLI Integration",
    description: "Control QA Automation - AI ToolKit from Terminal with command-line interface",
    color: "#f472b6",
  },
];

export default function MacOSIntegration() {
  const [copied, setCopied] = useState(false);

  const automatorScript = `-- QA Automation - AI ToolKit Automator Action
on run {input, parameters}
    tell application "System Events"
        do shell script "open momentum-studio://run-script?id=1"
    end tell
    return input
end run`;

  const shortcutScript = `momentum-studio://run-script?id=1&profile=Marketing_Account_1`;

  const cliCommand = `momentum-studio run --script "Twitter Auto Engagement" --profile "Marketing_Account_1"`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Apple className="h-6 w-6 text-primary" />
          macOS Integration
        </h1>
        <p className="text-muted-foreground mt-1">
          Deep integration with macOS Automator, Shortcuts, and system workflows
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INTEGRATION_FEATURES.map((feature) => (
          <Card key={feature.title} className="bg-card border-border group hover:border-primary/30 transition-colors">
            <CardContent className="p-5">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${feature.color}20` }}
              >
                <feature.icon className="h-5 w-5" style={{ color: feature.color }} />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automator */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Workflow className="h-4 w-4 text-primary" />
              Automator Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Add this AppleScript action to your Automator workflow to trigger QA Automation - AI ToolKit scripts
            </p>
            <div className="relative">
              <pre className="bg-secondary/50 rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto">
                <code>{automatorScript}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 h-6 text-xs"
                onClick={() => handleCopy(automatorScript)}
              >
                {copied ? <CheckCircle className="h-3 w-3 mr-1 text-green-500" /> : <Copy className="h-3 w-3 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <Button size="sm" className="w-full mt-3">
              <Download className="h-3.5 w-3.5 mr-1" />
              Download Automator Action
            </Button>
          </CardContent>
        </Card>

        {/* Shortcuts */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Shortcuts URL Scheme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Use this URL scheme in Shortcuts app to run scripts with custom parameters
            </p>
            <div className="relative">
              <pre className="bg-secondary/50 rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto">
                <code>{shortcutScript}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 h-6 text-xs"
                onClick={() => handleCopy(shortcutScript)}
              >
                {copied ? <CheckCircle className="h-3 w-3 mr-1 text-green-500" /> : <Copy className="h-3 w-3 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <Button size="sm" className="w-full mt-3">
              <Download className="h-3.5 w-3.5 mr-1" />
              Download Shortcut Template
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* CLI Integration */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            Command Line Interface
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Control QA Automation - AI ToolKit from Terminal for advanced automation and scripting
          </p>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Run a script</Label>
              <div className="relative mt-1">
                <pre className="bg-secondary/50 rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto">
                  <code>{cliCommand}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 h-6 text-xs"
                  onClick={() => handleCopy(cliCommand)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">List all scripts</Label>
              <div className="relative mt-1">
                <pre className="bg-secondary/50 rounded-lg p-3 text-xs font-mono text-foreground">
                  <code>momentum-studio list --scripts</code>
                </pre>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Check running instances</Label>
              <div className="relative mt-1">
                <pre className="bg-secondary/50 rounded-lg p-3 text-xs font-mono text-foreground">
                  <code>momentum-studio status</code>
                </pre>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button size="sm" className="flex-1">
              <Download className="h-3.5 w-3.5 mr-1" />
              Install CLI Tool
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Requirements */}
      <Card className="bg-card border-border">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Apple className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">System Requirements</h3>
              <p className="text-sm text-muted-foreground mb-2">
                macOS integration features require macOS 13.0 (Ventura) or later for full compatibility.
                M-series chips (M1, M2, M3, M4) are recommended for optimal Neural Engine performance.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="text-xs">macOS 13+</Badge>
                <Badge variant="outline" className="text-xs">Apple Silicon Optimized</Badge>
                <Badge variant="outline" className="text-xs">Intel Compatible</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
