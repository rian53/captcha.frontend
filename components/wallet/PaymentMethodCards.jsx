import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Building2 } from "lucide-react";

const PaymentMethodCards = ({ selectedMethod, onMethodSelect }) => {
  return (
    <div className="flex gap-3">
      {/* PayPal Card */}
      <Card 
        className={`cursor-pointer rounded-xl transition-all duration-200 flex-1 ${
          selectedMethod === "paypal" 
            ? "ring-1 ring-primary" 
            : "hover:shadow-sm"
        }`}
        onClick={() => onMethodSelect("paypal")}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-800">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">PayPal</h4>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banco Card */}
      <Card 
        className={`cursor-pointer rounded-xl transition-all duration-200 flex-1 ${
          selectedMethod === "banco" 
            ? "ring-1 ring-primary" 
            : "hover:shadow-sm"
        }`}
        onClick={() => onMethodSelect("banco")}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-800">
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">Banco</h4>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethodCards;
