import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";
import { walletService } from "@/services";
import RefundSummary from "@/components/wallet/RefundSummary";

function RefundPage() {
  const [refundData, setRefundData] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRefundData();
  }, []);

  const loadRefundData = async () => {
    setLoading(true);
    try {
      // Carrega dados do refund
      const refund = await walletService.getRefundData();
      
      if (refund) {
        setRefundData(refund);
        
        // Carrega informações de pagamento
        const payment = await walletService.getPaymentInfo();
        setPaymentInfo(payment);

        // Carrega dados bancários se existirem
        try {
          const bank = await walletService.getBankDetails();
          if (bank && bank.verified) {
            setBankDetails(bank);
          }
        } catch (err) {
          // Sem dados bancários, não é erro
        }
      }
    } catch (err) {
      setError("Error al cargar información de reembolso");
      console.error("Error loading refund data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    loadRefundData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 animate-spin border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Error</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!refundData) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-muted-foreground">
              <AlertCircle className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Sin Solicitudes</h3>
                <p className="text-sm">No tienes ninguna solicitud de reembolso activa.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <h1 className="text-xl font-bold">Estado del Reembolso</h1>
      </div>

      <RefundSummary 
        refundData={refundData} 
        paymentInfo={paymentInfo}
        bankDetails={bankDetails}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

RefundPage.layoutName = "Reembolso";
export default RefundPage;
