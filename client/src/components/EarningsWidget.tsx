import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp } from "lucide-react";
import { useState } from "react";

const CZK_TO_USD = 0.043; // Approximate exchange rate

export function EarningsWidget({ totalEarningsCZK = 0 }: { totalEarningsCZK?: number }) {
  const [currency, setCurrency] = useState<'CZK' | 'USD'>('CZK');

  const displayAmount = currency === 'CZK' 
    ? totalEarningsCZK 
    : totalEarningsCZK * CZK_TO_USD;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const toggleCurrency = () => {
    setCurrency(curr => curr === 'CZK' ? 'USD' : 'CZK');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleCurrency}
      className="gap-2 font-mono"
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
          <DollarSign className="h-4 w-4 text-primary" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs text-muted-foreground">Earnings</span>
          <span className="text-sm font-bold">{formatCurrency(displayAmount)}</span>
        </div>
        <TrendingUp className="h-3 w-3 text-green-500" />
      </div>
    </Button>
  );
}
