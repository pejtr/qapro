import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Copy, FileCode, FileJson, FileType, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function DataConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [conversionType, setConversionType] = useState<string>("json-to-xml");

  const convertData = () => {
    try {
      if (!input.trim()) {
        toast.error("Please enter data to convert");
        return;
      }

      let result = "";

      switch (conversionType) {
        case "json-to-xml":
          const jsonObj = JSON.parse(input);
          result = jsonToXml(jsonObj, "root");
          break;
        
        case "xml-to-json":
          result = JSON.stringify(xmlToJson(input), null, 2);
          break;
        
        case "json-format":
          result = JSON.stringify(JSON.parse(input), null, 2);
          break;
        
        case "xml-format":
          result = formatXml(input);
          break;
        
        case "csv-to-json":
          result = csvToJson(input);
          break;
        
        case "json-to-csv":
          result = jsonToCsv(JSON.parse(input));
          break;
        
        default:
          toast.error("Invalid conversion type");
          return;
      }

      setOutput(result);
      toast.success("Conversion successful!");
    } catch (error) {
      toast.error(`Conversion failed: ${(error as Error).message}`);
      console.error(error);
    }
  };

  const jsonToXml = (obj: any, rootName: string): string => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n`;
    
    const buildXml = (data: any, indent: string = "  "): string => {
      let result = "";
      
      if (Array.isArray(data)) {
        data.forEach(item => {
          result += `${indent}<item>\n`;
          result += buildXml(item, indent + "  ");
          result += `${indent}</item>\n`;
        });
      } else if (typeof data === "object" && data !== null) {
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            result += `${indent}<${key}>\n`;
            result += buildXml(value, indent + "  ");
            result += `${indent}</${key}>\n`;
          } else {
            result += `${indent}<${key}>${value}</${key}>\n`;
          }
        });
      } else {
        result += `${indent}${data}\n`;
      }
      
      return result;
    };
    
    xml += buildXml(obj);
    xml += `</${rootName}>`;
    return xml;
  };

  const xmlToJson = (xml: string): any => {
    // Simple XML to JSON parser (basic implementation)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    
    const parseNode = (node: any): any => {
      if (node.nodeType === 3) return node.nodeValue;
      
      const obj: any = {};
      
      if (node.attributes && node.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let i = 0; i < node.attributes.length; i++) {
          obj["@attributes"][node.attributes[i].nodeName] = node.attributes[i].nodeValue;
        }
      }
      
      if (node.hasChildNodes()) {
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i];
          const nodeName = child.nodeName;
          
          if (typeof obj[nodeName] === "undefined") {
            obj[nodeName] = parseNode(child);
          } else {
            if (!Array.isArray(obj[nodeName])) {
              obj[nodeName] = [obj[nodeName]];
            }
            obj[nodeName].push(parseNode(child));
          }
        }
      }
      
      return obj;
    };
    
    return parseNode(xmlDoc.documentElement);
  };

  const formatXml = (xml: string): string => {
    const PADDING = "  ";
    const reg = /(>)(<)(\/*)/g;
    let formatted = "";
    let pad = 0;

    xml = xml.replace(reg, "$1\n$2$3");
    xml.split("\n").forEach((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) {
          pad -= 1;
        }
      } else if (node.match(/^<\w([^>]*[^\/])?>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }

      formatted += PADDING.repeat(pad) + node + "\n";
      pad += indent;
    });

    return formatted.trim();
  };

  const csvToJson = (csv: string): string => {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim());
    const result: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentLine = lines[i].split(",");
      
      headers.forEach((header, index) => {
        obj[header] = currentLine[index]?.trim() || "";
      });
      
      result.push(obj);
    }

    return JSON.stringify(result, null, 2);
  };

  const jsonToCsv = (json: any[]): string => {
    if (!Array.isArray(json) || json.length === 0) {
      throw new Error("Input must be a non-empty array of objects");
    }

    const headers = Object.keys(json[0]);
    let csv = headers.join(",") + "\n";

    json.forEach(obj => {
      const row = headers.map(header => obj[header] || "").join(",");
      csv += row + "\n";
    });

    return csv;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const downloadFile = () => {
    const extension = conversionType.split("-to-")[1] || "txt";
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Data Converter</h1>
        <p className="text-muted-foreground">
          Convert between JSON, XML, CSV, and YAML formats with validation and formatting
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Input Data
            </CardTitle>
            <CardDescription>Paste your data to convert</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={conversionType} onValueChange={setConversionType}>
              <SelectTrigger>
                <SelectValue placeholder="Select conversion type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json-to-xml">JSON → XML</SelectItem>
                <SelectItem value="xml-to-json">XML → JSON</SelectItem>
                <SelectItem value="json-format">Format JSON</SelectItem>
                <SelectItem value="xml-format">Format XML</SelectItem>
                <SelectItem value="csv-to-json">CSV → JSON</SelectItem>
                <SelectItem value="json-to-csv">JSON → CSV</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your data here..."
              className="min-h-[400px] font-mono text-sm"
            />

            <Button onClick={convertData} className="w-full" size="lg">
              <RefreshCw className="h-4 w-4 mr-2" />
              Convert
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              Output Result
            </CardTitle>
            <CardDescription>Converted data with formatting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline" disabled={!output}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button onClick={downloadFile} variant="outline" disabled={!output}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <Textarea
              value={output}
              readOnly
              placeholder="Converted data will appear here..."
              className="min-h-[400px] font-mono text-sm bg-muted"
            />
          </CardContent>
        </Card>
      </div>

      {/* Examples Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileType className="h-5 w-5" />
            Examples & Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="json">
            <TabsList>
              <TabsTrigger value="json">JSON Example</TabsTrigger>
              <TabsTrigger value="xml">XML Example</TabsTrigger>
              <TabsTrigger value="csv">CSV Example</TabsTrigger>
            </TabsList>
            <TabsContent value="json" className="space-y-2">
              <p className="text-sm text-muted-foreground">Example JSON input:</p>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }
}`}
              </pre>
            </TabsContent>
            <TabsContent value="xml" className="space-y-2">
              <p className="text-sm text-muted-foreground">Example XML input:</p>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`<?xml version="1.0" encoding="UTF-8"?>
<root>
  <user>
    <name>John Doe</name>
    <email>john@example.com</email>
    <age>30</age>
  </user>
</root>`}
              </pre>
            </TabsContent>
            <TabsContent value="csv" className="space-y-2">
              <p className="text-sm text-muted-foreground">Example CSV input:</p>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`name, email, age
John Doe, john@example.com, 30
Jane Smith, jane@example.com, 25`}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
