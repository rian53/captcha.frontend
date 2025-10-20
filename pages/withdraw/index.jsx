import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2,
  AlertCircle
} from "lucide-react";
import { walletService } from "@/services";
import { toast } from "sonner";
import { WithdrawCard } from "@/components/wallet/WithdrawCard";

function WithdrawPage() {
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWithdraws();
  }, []);

  const loadWithdraws = async () => {
    try {
      setLoading(true);
      const data = await walletService.getUserWithdraws();
      setWithdraws(data);
    } catch (error) {
      console.error("Error al cargar retiros:", error);
      toast.error("Error al cargar historial de retiros");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (withdraws.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No hay retiros</h3>
        <p className="text-muted-foreground">
          Aún no has realizado ninguna solicitud de retiro.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Historial de Retiros</h2>
        <Badge variant="outline" className="text-sm">
          {withdraws.length} {withdraws.length === 1 ? "retiro" : "retiros"}
        </Badge>
      </div>

      <div className="space-y-3">
        {withdraws.map((withdraw) => (
          <WithdrawCard 
            key={withdraw.id} 
            withdraw={withdraw}
            onUpdate={loadWithdraws}
          />
        ))}
      </div>
    </div>
  );
}

WithdrawPage.layoutName = "Mis Retiros";
export default WithdrawPage;

