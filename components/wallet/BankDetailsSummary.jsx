import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Edit, Landmark } from "lucide-react";

const BankDetailsSummary = ({ bankDetails, onEdit }) => {
  const maskBankData = (data) => {
    if (!data || data.length < 8) return "****";
    const lastFour = data.slice(-4);
    const masked = "*".repeat(Math.min(data.length - 4, 12));
    return `${masked}${lastFour}`;
  };

  const maskEmail = (email) => {
    if (!email) return "";
    const [username, domain] = email.split("@");
    if (username.length <= 3) {
      return `${username[0]}***@${domain}`;
    }
    return `${username.slice(0, 3)}***@${domain}`;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <Landmark className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Método Registrado
                </h3>
                {bankDetails.verified && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">Verificado</span>
                  </div>
                )}
              </div>
            </div>
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="gap-2 p-0"
              >
                <Edit className="w-3 h-3" />
              
              </Button>
            )}
          </div>

          {/* Bank Info */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Banco:</span>
              <span className="text-sm font-medium text-foreground">
                {bankDetails.bankName}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Titular:</span>
              <span className="text-sm font-medium text-foreground">
                {bankDetails.fullName}
              </span>
            </div>

            {bankDetails.bankData && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Cuenta:</span>
                <span className="text-sm font-mono font-medium text-foreground">
                  {maskBankData(bankDetails.bankData)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Email:</span>
              <span className="text-sm font-medium text-foreground">
                {maskEmail(bankDetails.email)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Teléfono:</span>
              <span className="text-sm font-medium text-foreground">
                {bankDetails.phone}
              </span>
            </div>
          </div>

          {/* Info Badge */}
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg mt-4">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              Este método será usado para transferencias de saldo. 
              Puedes editarlo cuando necesites.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankDetailsSummary;

