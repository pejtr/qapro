import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Workflow,
  Users,
  Play,
  CheckCircle,
  Cpu,
  HardDrive,
  Activity,
  TrendingUp,
  Clock,
  FileDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useMemo } from "react";

// Simulated performance data for M4 Max resource visualization
const performanceData = [
  { time: "00:00", cpu: 12, gpu: 8, neural: 5, memory: 34 },
  { time: "04:00", cpu: 18, gpu: 15, neural: 22, memory: 38 },
  { time: "08:00", cpu: 45, gpu: 35, neural: 48, memory: 52 },
  { time: "12:00", cpu: 62, gpu: 55, neural: 72, memory: 61 },
  { time: "16:00", cpu: 78, gpu: 68, neural: 85, memory: 72 },
  { time: "20:00", cpu: 35, gpu: 28, neural: 32, memory: 45 },
  { time: "Now", cpu: 42, gpu: 38, neural: 41, memory: 48 },
];

const executionHistory = [
  { day: "Mon", completed: 24, failed: 2 },
  { day: "Tue", completed: 31, failed: 1 },
  { day: "Wed", completed: 28, failed: 3 },
  { day: "Thu", completed: 42, failed: 0 },
  { day: "Fri", completed: 38, failed: 2 },
  { day: "Sat", completed: 15, failed: 1 },
  { day: "Sun", completed: 8, failed: 0 },
];

const platformDistribution = [
  { name: "Twitter/X", value: 35, color: "#6366f1" },
  { name: "Instagram", value: 25, color: "#8b5cf6" },
  { name: "Facebook", value: 15, color: "#a78bfa" },
  { name: "TikTok", value: 15, color: "#c4b5fd" },
  { name: "YouTube", value: 10, color: "#ddd6fe" },
];

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
}) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trendLabel && (
              <div className="flex items-center gap-1">
                <TrendingUp
                  className={`h-3 w-3 ${trend === "up" ? "text-chart-1" : "text-muted-foreground"}`}
                />
                <span className="text-xs text-muted-foreground">
                  {trendLabel}
                </span>
              </div>
            )}
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResourceGauge({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const { data: stats } = trpc.dashboard.stats.useQuery(undefined, {
    enabled: !!user,
  });
  const { data: recentExecutions } = trpc.executions.list.useQuery(
    { limit: 10 },
    { enabled: !!user }
  );

  const currentMetrics = useMemo(
    () => performanceData[performanceData.length - 1],
    []
  );

  const exportPDF = trpc.reports.exportPDF.useMutation();

  const handleExportPDF = async (executionId: number) => {
    try {
      toast.info('Generating PDF report...');
      const result = await exportPDF.mutateAsync({ executionId });
      
      // Convert base64 to blob and download
      const byteCharacters = atob(result.pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('PDF report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF report');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name || "User"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Your automation cockpit is ready. Here is your system overview.
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-chart-1/30 text-chart-1 bg-chart-1/10"
        >
          <Activity className="h-3 w-3 mr-1" />
          System Online
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Scripts"
          value={stats?.totalScripts ?? 0}
          icon={Workflow}
          trend="up"
          trendLabel="+3 this week"
        />
        <StatCard
          title="Active Profiles"
          value={stats?.totalProfiles ?? 0}
          icon={Users}
          trend="up"
          trendLabel="+2 new"
        />
        <StatCard
          title="Total Executions"
          value={stats?.totalExecutions ?? 0}
          icon={Play}
          trend="up"
          trendLabel="186 this week"
        />
        <StatCard
          title="Running Now"
          value={stats?.runningInstances ?? 0}
          icon={Zap}
        />
        <StatCard
          title="Success Rate"
          value={`${stats?.successRate ?? 0}%`}
          icon={CheckCircle}
          trend="up"
          trendLabel="Stable"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* M4 Max Resource Monitor */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              M4 Max Resource Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cpu"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.15}
                    name="CPU"
                  />
                  <Area
                    type="monotone"
                    dataKey="gpu"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.1}
                    name="GPU"
                  />
                  <Area
                    type="monotone"
                    dataKey="neural"
                    stroke="#a78bfa"
                    fill="#a78bfa"
                    fillOpacity={0.08}
                    name="Neural Engine"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4">
              <ResourceGauge
                label="CPU Cores"
                value={currentMetrics?.cpu ?? 0}
                color="#6366f1"
              />
              <ResourceGauge
                label="GPU"
                value={currentMetrics?.gpu ?? 0}
                color="#8b5cf6"
              />
              <ResourceGauge
                label="Neural Engine"
                value={currentMetrics?.neural ?? 0}
                color="#a78bfa"
              />
              <ResourceGauge
                label="Memory"
                value={currentMetrics?.memory ?? 0}
                color="#c4b5fd"
              />
            </div>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-primary" />
              Platform Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {platformDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {platformDistribution.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Execution History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Weekly Execution History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={executionHistory}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Bar
                    dataKey="completed"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    name="Completed"
                  />
                  <Bar
                    dataKey="failed"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                    name="Failed"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Recent Executions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentExecutions && recentExecutions.length > 0 ? (
                recentExecutions.slice(0, 6).map((exec) => (
                  <div
                    key={exec.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          exec.status === "completed"
                            ? "bg-green-500"
                            : exec.status === "running"
                              ? "bg-blue-500"
                              : exec.status === "failed"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                        }`}
                      />
                      <span className="text-sm text-foreground">
                        Script #{exec.scriptId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {exec.status}
                      </Badge>
                      {(exec.status === 'completed' || exec.status === 'failed') && (
                        <button
                          onClick={() => handleExportPDF(exec.id)}
                          className="text-primary hover:text-primary/80 transition-colors"
                          title="Export PDF Report"
                        >
                          <FileDown className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No executions yet</p>
                  <p className="text-xs mt-1">
                    Create a script and run it to see activity here
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
