import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Plus,
  Download,
  Eye,
  Sparkles,
  Code,
  FileCode,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

const FORMAT_ICONS: Record<string, React.ElementType> = {
  markdown: FileText,
  html: Code,
  pdf: FileCode,
};

export default function Documentation() {
  const [selectedScript, setSelectedScript] = useState<number | null>(null);
  const [docTitle, setDocTitle] = useState("");
  const [docFormat, setDocFormat] = useState<"markdown" | "html" | "pdf">("markdown");
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<number | null>(null);

  const { data: scripts } = trpc.scripts.list.useQuery();
  const { data: docs, refetch: refetchDocs } = trpc.documentation.list.useQuery(
    { scriptId: selectedScript! },
    { enabled: selectedScript !== null }
  );

  const generateDoc = trpc.documentation.generate.useMutation({
    onSuccess: () => {
      toast.success("Documentation generated successfully!");
      setDocTitle("");
      setIsGenerateOpen(false);
      refetchDocs();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate documentation");
    },
  });

  const handleGenerate = () => {
    if (!selectedScript) {
      toast.error("Please select a script first");
      return;
    }
    if (!docTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }
    generateDoc.mutate({
      scriptId: selectedScript,
      title: docTitle,
      format: docFormat,
    });
  };

  const previewDocData = docs?.find((d) => d.id === previewDoc);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Auto Documentation
          </h1>
          <p className="text-muted-foreground mt-1">
            Automatically generate comprehensive documentation for your automation workflows
          </p>
        </div>
        <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Docs
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Documentation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="script">Select Script</Label>
                <Select
                  value={selectedScript?.toString() || ""}
                  onValueChange={(v) => setSelectedScript(Number(v))}
                >
                  <SelectTrigger id="script">
                    <SelectValue placeholder="Choose a script" />
                  </SelectTrigger>
                  <SelectContent>
                    {scripts?.map((script) => (
                      <SelectItem key={script.id} value={script.id.toString()}>
                        {script.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g., Twitter Automation Guide"
                />
              </div>
              <div>
                <Label htmlFor="format">Export Format</Label>
                <Select value={docFormat} onValueChange={(v: any) => setDocFormat(v)}>
                  <SelectTrigger id="format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="markdown">Markdown (.md)</SelectItem>
                    <SelectItem value="html">HTML (.html)</SelectItem>
                    <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={generateDoc.isPending}
                className="w-full"
              >
                {generateDoc.isPending ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Documentation
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Script Selector */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Label className="text-sm font-medium text-foreground whitespace-nowrap">
              View docs for:
            </Label>
            <Select
              value={selectedScript?.toString() || ""}
              onValueChange={(v) => setSelectedScript(v ? Number(v) : null)}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Select a script" />
              </SelectTrigger>
              <SelectContent>
                {scripts?.map((script) => (
                  <SelectItem key={script.id} value={script.id.toString()}>
                    {script.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documentation List */}
      {selectedScript && docs ? (
        docs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map((doc) => {
              const FormatIcon = FORMAT_ICONS[doc.format] || FileText;
              return (
                <Card
                  key={doc.id}
                  className="bg-card border-border hover:border-primary/30 transition-colors"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center justify-between">
                      <span className="truncate">{doc.title}</span>
                      <FormatIcon className="h-4 w-4 text-primary shrink-0" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                        <Badge variant="outline" className="text-xs ml-auto">
                          v{doc.version}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-7 text-xs"
                          onClick={() => setPreviewDoc(doc.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" className="flex-1 h-7 text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <h3 className="font-semibold text-foreground mb-1">No Documentation Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate your first documentation for this script
              </p>
              <Button onClick={() => setIsGenerateOpen(true)}>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Documentation
              </Button>
            </CardContent>
          </Card>
        )
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <h3 className="font-semibold text-foreground mb-1">Select a Script</h3>
            <p className="text-sm text-muted-foreground">
              Choose a script from the dropdown above to view its documentation
            </p>
          </CardContent>
        </Card>
      )}

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">AI-Powered</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically analyze workflows and generate comprehensive docs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center shrink-0">
                <FileCode className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Multiple Formats</h3>
                <p className="text-sm text-muted-foreground">
                  Export as Markdown, HTML, or PDF for easy sharing
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
                <h3 className="font-semibold text-foreground mb-1">Version Control</h3>
                <p className="text-sm text-muted-foreground">
                  Track documentation versions alongside workflow changes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewDoc !== null} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewDocData?.title}</DialogTitle>
          </DialogHeader>
          {previewDocData && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <Streamdown>{previewDocData.content || ""}</Streamdown>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
