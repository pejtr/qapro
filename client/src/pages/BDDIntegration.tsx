import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TestTube, Copy, Download, FileText, CheckCircle, BookOpen } from "lucide-react";
import { toast } from "sonner";

function generateGherkin(nodes: any[], scriptName: string): string {
  const lines = [
    `Feature: ${scriptName}`,
    `  As a user`,
    `  I want to automate browser interactions`,
    `  So that repetitive tasks are handled automatically`,
    ``,
    `  Scenario: Execute ${scriptName} workflow`,
  ];
  for (const node of nodes) {
    switch (node.type) {
      case "navigate":
        lines.push(`    Given I navigate to "${node.data.url || "https://example.com"}"`);
        break;
      case "click":
        lines.push(`    When I click on "${node.data.selector || "element"}"`);
        break;
      case "type":
        lines.push(`    And I type "${node.data.text || ""}" into "${node.data.selector || "input"}"`);
        break;
      case "wait":
        lines.push(`    And I wait for ${node.data.duration || 1000} milliseconds`);
        break;
      case "condition":
        lines.push(`    Then I should see "${node.data.selector || "element"}" is visible`);
        break;
      case "screenshot":
        lines.push(`    And I take a screenshot`);
        break;
      case "loop":
        lines.push(`    And I repeat the following ${node.data.iterations || 5} times`);
        break;
    }
  }
  return lines.join("\n");
}

function generateStepDefs(nodes: any[]): string {
  const uniqueTypes = Array.from(new Set(nodes.map((n: any) => n.type)));
  const lines = [
    `import { Given, When, Then, And } from '@cucumber/cucumber';`,
    `import { expect } from '@playwright/test';`,
    ``,
  ];

  if (uniqueTypes.includes("navigate")) {
    lines.push(`Given('I navigate to {string}', async function(url: string) {`);
    lines.push(`  await this.page.goto(url);`);
    lines.push(`});`);
    lines.push(``);
  }
  if (uniqueTypes.includes("click")) {
    lines.push(`When('I click on {string}', async function(selector: string) {`);
    lines.push(`  await this.page.click(selector);`);
    lines.push(`});`);
    lines.push(``);
  }
  if (uniqueTypes.includes("type")) {
    lines.push(`And('I type {string} into {string}', async function(text: string, selector: string) {`);
    lines.push(`  await this.page.fill(selector, text);`);
    lines.push(`});`);
    lines.push(``);
  }
  if (uniqueTypes.includes("wait")) {
    lines.push(`And('I wait for {int} milliseconds', async function(ms: number) {`);
    lines.push(`  await this.page.waitForTimeout(ms);`);
    lines.push(`});`);
    lines.push(``);
  }
  if (uniqueTypes.includes("condition")) {
    lines.push(`Then('I should see {string} is visible', async function(selector: string) {`);
    lines.push(`  const isVisible = await this.page.isVisible(selector);`);
    lines.push(`  expect(isVisible).toBeTruthy();`);
    lines.push(`});`);
    lines.push(``);
  }
  if (uniqueTypes.includes("screenshot")) {
    lines.push(`And('I take a screenshot', async function() {`);
    lines.push(`  await this.page.screenshot({ path: 'screenshots/step.png' });`);
    lines.push(`});`);
    lines.push(``);
  }

  return lines.join("\n");
}

export default function BDDIntegration() {
  const [selectedScript, setSelectedScript] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"gherkin" | "steps">("gherkin");
  const [copied, setCopied] = useState(false);

  const { data: scriptsList } = trpc.scripts.list.useQuery();

  const selectedScriptData = useMemo(() => {
    if (!selectedScript || !scriptsList) return null;
    return scriptsList.find((s) => s.id.toString() === selectedScript);
  }, [selectedScript, scriptsList]);

  const gherkinCode = useMemo(() => {
    if (!selectedScriptData) return "# Select a script to generate BDD feature file";
    return generateGherkin((selectedScriptData.nodes as any[]) || [], selectedScriptData.name);
  }, [selectedScriptData]);

  const stepDefsCode = useMemo(() => {
    if (!selectedScriptData) return "// Select a script to generate step definitions";
    return generateStepDefs((selectedScriptData.nodes as any[]) || []);
  }, [selectedScriptData]);

  const displayCode = activeTab === "gherkin" ? gherkinCode : stepDefsCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeTab === "gherkin" ? ".feature" : ".ts";
    const name = activeTab === "gherkin" ? "test" : "steps";
    const blob = new Blob([displayCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <TestTube className="h-6 w-6 text-primary" />
          BDD Integration
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate Gherkin feature files and step definitions from your visual workflows
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-xs">
          <Select value={selectedScript} onValueChange={setSelectedScript}>
            <SelectTrigger>
              <SelectValue placeholder="Select a script..." />
            </SelectTrigger>
            <SelectContent>
              {scriptsList?.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          <button
            onClick={() => setActiveTab("gherkin")}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${activeTab === "gherkin" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <BookOpen className="h-3.5 w-3.5 inline mr-1.5" />
            Feature File
          </button>
          <button
            onClick={() => setActiveTab("steps")}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${activeTab === "steps" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <FileText className="h-3.5 w-3.5 inline mr-1.5" />
            Step Definitions
          </button>
        </div>
      </div>

      {/* Code Output */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            {activeTab === "gherkin" ? "Gherkin Feature File" : "Step Definitions"}
            <Badge variant="outline" className="text-xs ml-2">
              {activeTab === "gherkin" ? ".feature" : "TypeScript"}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleCopy}>
              {copied ? <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <Download className="h-3.5 w-3.5 mr-1" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="bg-secondary/50 rounded-lg p-4 overflow-x-auto text-sm font-mono text-foreground leading-relaxed max-h-[500px] overflow-y-auto">
            <code>{displayCode}</code>
          </pre>
        </CardContent>
      </Card>

      {!selectedScript && (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <TestTube className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Select a script to generate BDD files</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Build a workflow in the Script Builder first, then generate Gherkin feature files and step definitions here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
