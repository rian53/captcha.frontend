import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const WithdrawForm = ({ 
  selectedMethod, 
  paypalEmail, 
  setPaypalEmail, 
  withdrawAmount, 
  setWithdrawAmount, 
  formatInputValue,
  parseInputValue,
  balance,
  formatCurrency,
  isWithdrawDisabled,
  isWithdrawing,
  onWithdraw,
  targetBalance
}) => {
  const handleWithdrawClick = () => {
    // Verificar se o objetivo foi completado (100%)
    const progressPercentage = (balance / targetBalance) * 100;
    
    if (progressPercentage < 100) {
      // Rolar para o topo da página para mostrar o alerta
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Chamar a função original de withdraw
    onWithdraw();
  };

  return (
    <Card className="bg-background rounded-2xl">
      <CardContent className="p-4 space-y-4">
        <h4 className="font-semibold text-foreground">
          Solicitar Retiro - {selectedMethod === "paypal" ? "PayPal" : "Banco"}
        </h4>
        
        {/* Campo de Email para PayPal */}
        {selectedMethod === "paypal" && (
          <div className="space-y-2">
            <Label htmlFor="paypal-email">Email de PayPal</Label>
            <Input
              id="paypal-email"
              type="email"
              placeholder="tu@email.com"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              className="w-full"
            />
          </div>
        )}

        {/* Campo de Valor */}
        <div className="space-y-2">
          <Label htmlFor="withdraw-amount">Valor (US$)</Label>
          <Input
            id="withdraw-amount"
            type="text"
            placeholder="0,00"
            value={withdrawAmount}
            onChange={(e) => {
              const formatted = formatInputValue(e.target.value);
              setWithdrawAmount(formatted);
            }}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Saldo disponible: {formatCurrency(balance)}
          </p>
        </div>

        {/* Botón de Retiro */}
        <Button
          onClick={handleWithdrawClick}
          disabled={isWithdrawDisabled() || isWithdrawing}
          className="w-full"
          size="lg"
        >
          {isWithdrawing ? (
            <>
              <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full mr-2" />
              Procesando...
            </>
          ) : (
            "Retirar Dinero"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WithdrawForm;
