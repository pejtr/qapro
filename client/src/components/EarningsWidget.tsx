import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, TrendingDown, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const CZK_TO_USD = 0.043; // Approximate exchange rate

// Mock data - will be replaced with real data from backend
const mockDailyData = [
  { date: "Mon", earnings: 1200 },
  { date: "Tue", earnings: 1800 },
  { date: "Wed", earnings: 2100 },
  { date: "Thu", earnings: 1650 },
  { date: "Fri", earnings: 2400 },
  { date: "Sat", earnings: 1100 },
  { date: "Sun", earnings: 2250 },
];

const mockWeeklyData = [
  { date: "Week 1", earnings: 8500 },
  { date: "Week 2", earnings: 9200 },
  { date: "Week 3", earnings: 10100 },
  { date: "Week 4", earnings: 12500 },
];

export function EarningsWidget({ totalEarningsCZK = 12500 }: { totalEarningsCZK?: number }) {
  const [currency, setCurrency] = useState<'CZK' | 'USD'>('CZK');
  const [period, setPeriod] = useState<'daily' | 'weekly'>('daily');

  const todayEarnings = 2250;
  const yesterdayEarnings = 1100;
  const weekEarnings = 12500;
  const lastWeekEarnings = 10100;
  const avgDailyEarnings = 1786;
  const totalHours = 42;
  const bestDay = "Friday";
  const bestDayEarnings = 2400;

  const weekTrend = ((weekEarnings - lastWeekEarnings) / lastWeekEarnings) * 100;
  const dayTrend = ((todayEarnings - yesterdayEarnings) / yesterdayEarnings) * 100;

  const displayAmount = (amount: number) => currency === 'CZK' ? amount : amount * CZK_TO_USD;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(displayAmount(amount));
  };

  const toggleCurrency = () => {
    setCurrency(curr => curr === 'CZK' ? 'USD' : 'CZK');
  };

  const chartData = period === 'daily' ? mockDailyData : mockWeeklyData;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 font-mono"
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs text-muted-foreground">Earnings</span>
              <span className="text-sm font-bold">{formatCurrency(totalEarningsCZK)}</span>
            </div>
            {weekTrend > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="font-bold text-base">Earnings Overview</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCurrency}
            className="h-6 text-xs"
          >
            {currency === 'CZK' ? 'Switch to USD' : 'Switch to CZK'}
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="p-4 space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Today
              </div>
              <div className="text-lg font-bold">{formatCurrency(todayEarnings)}</div>
              <div className={`text-xs flex items-center gap-1 ${dayTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {dayTrend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {dayTrend > 0 ? '+' : ''}{dayTrend.toFixed(1)}% vs yesterday
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                This Week
              </div>
              <div className="text-lg font-bold">{formatCurrency(weekEarnings)}</div>
              <div className={`text-xs flex items-center gap-1 ${weekTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {weekTrend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {weekTrend > 0 ? '+' : ''}{weekTrend.toFixed(1)}% vs last week
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-accent/50">
              <div className="text-xs text-muted-foreground">Avg/Day</div>
              <div className="text-sm font-semibold">{formatCurrency(avgDailyEarnings)}</div>
            </div>
            <div className="p-2 rounded-lg bg-accent/50">
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Clock className="h-3 w-3" />
                Hours
              </div>
              <div className="text-sm font-semibold">{totalHours}h</div>
            </div>
            <div className="p-2 rounded-lg bg-accent/50">
              <div className="text-xs text-muted-foreground">Best Day</div>
              <div className="text-sm font-semibold">{bestDay}</div>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Chart */}
          <Tabs value={period} onValueChange={(v) => setPeriod(v as 'daily' | 'weekly')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="mt-4">
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `${Math.round(displayAmount(value))}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Earnings']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="weekly" className="mt-4">
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `${Math.round(displayAmount(value) / 1000)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Earnings']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
