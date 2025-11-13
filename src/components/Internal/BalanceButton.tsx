"use client";
import { useEffect, useState } from "react";
import { Coins, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/Internal/Button";
import { useAuthStore } from "@/store/auth";
import { getTokenBalance, getRechargeURL } from "@/utils/newapi";
import { cn } from "@/utils/style";

export function BalanceButton() {
  const { balance, token, isBalanceLow, isFeatureEnabled } = useAuthStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh balance every 5 minutes
  useEffect(() => {
    if (!token || !isFeatureEnabled()) return;

    const interval = setInterval(async () => {
      const newBalance = await getTokenBalance(token);
      if (newBalance !== null) {
        useAuthStore.getState().setBalance(newBalance * 1000, 0); // Convert back to 1/1000 dollar
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [token, isFeatureEnabled]);

  const handleRefresh = async () => {
    if (!token) return;

    setIsRefreshing(true);
    try {
      const newBalance = await getTokenBalance(token);
      if (newBalance !== null) {
        useAuthStore.getState().setBalance(newBalance * 1000, 0);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRecharge = () => {
    window.open(getRechargeURL(), '_blank');
  };

  // If not validated, show a placeholder button
  if (!isFeatureEnabled()) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-3 gap-2 text-gray-400 dark:text-gray-600 cursor-not-allowed"
        disabled
        title="Please set NewAPI token in Settings to see balance"
      >
        <Coins className="h-4 w-4" />
        <span className="text-sm">--</span>
      </Button>
    );
  }

  const isLow = isBalanceLow();

  return (
    <div className="flex items-center gap-1">
      {/* Balance Display */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-3 gap-2",
          isLow
            ? "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            : "text-yellow-600 dark:text-yellow-500 cursor-default hover:bg-transparent"
        )}
        onClick={isLow ? handleRecharge : undefined}
        disabled={!isLow}
        title={isLow ? "Click to recharge" : `Balance: $${balance.toFixed(2)}`}
      >
        {isLow ? (
          <Coins className="h-4 w-4" />
        ) : (
          <span className="text-lg">💰</span>
        )}
        <span className="text-sm font-medium">
          ${balance.toFixed(2)}
        </span>
        {isLow && <AlertCircle className="h-3 w-3" />}
      </Button>

      {/* Refresh Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleRefresh}
        disabled={isRefreshing}
        title="Refresh balance"
      >
        <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
      </Button>
    </div>
  );
}
