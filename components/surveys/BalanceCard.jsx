import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { useRouter } from "next/router";

export function BalanceCard({ balance = 0, bonusBalance = 0, targetBalance = 35000 }) {
  const router = useRouter();
  
  const formatCurrency = (value) => {
    const reais = (value / 100).toFixed(2);
    return `US$ ${reais.replace(".", ",")}`;
  };

  const handleCardClick = () => {
    router.push("/wallet");
  };

  return (
    <Card 
      className="hover:shadow-md transition-all cursor-pointer rounded-2xl"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Mi Saldo</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground">
                {formatCurrency(balance)}
              </span>
              <span className="text-sm text-muted-foreground">
                / {formatCurrency(targetBalance)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-1">Meta</div>
            <div className="text-sm font-medium text-foreground">
              {((balance / targetBalance) * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

