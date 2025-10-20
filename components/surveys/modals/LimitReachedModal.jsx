import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp } from "lucide-react";
import { useRouter } from "next/router";

export function LimitReachedModal({ isOpen, onClose, balance }) {
  const router = useRouter();
  const formatCurrency = (value) => {
    const reais = (value / 100).toFixed(2);
    return `US$ ${reais.replace(".", ",")}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] max-h-[90vh] overflow-hidden">
        <DialogHeader className="space-y-4 pb-4">
          <div className="flex items-center justify-center">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-bold leading-tight text-primary">
            ¡Ups! Has alcanzado el límite de reseñas para hoy..
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="flex flex-col items-center text-center gap-4 mb-4">
            <DialogDescription className="text-center">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Has completado todas las reseñas disponibles por hoy. ¡Excelente trabajo!
              </p>
            </DialogDescription>

            <div className="flex flex-col items-center p-4 bg-muted rounded-lg w-full">
              <span className="text-sm font-bold text-muted-foreground mb-2">
                Tu saldo:
              </span>
              <span className="text-4xl font-extrabold text-primary">
                {formatCurrency(balance)}
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg w-full">
              <div className="p-2 bg-blue-200 rounded-full flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-blue-700" />
              </div>
              <div className="text-left min-w-0">
                <p className="font-semibold text-muted-foreground text-sm">
                  ¡Vuelve mañana!
                </p>
                <p className="text-xs text-muted-foreground">
                  Nuevas reseñas estarán disponibles
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3 pt-4 border-t">
          <Button 
            variant="default"
            className="w-full"
            onClick={() => router.push("/wallet")}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Hacer Retiro
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            className="w-full text-muted-foreground hover:bg-muted"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

