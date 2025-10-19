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
              <p className="text-sm text-slate-600 leading-relaxed">
                Has completado todas las reseñas disponibles por hoy. ¡Excelente trabajo!
              </p>
            </DialogDescription>

            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg w-full">
              <span className="text-sm font-bold text-slate-400 mb-2">
                Tu saldo:
              </span>
              <span className="text-4xl font-extrabold text-primary">
                {formatCurrency(balance)}
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg w-full">
              <div className="p-2 bg-blue-200 rounded-full flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-blue-700" />
              </div>
              <div className="text-left min-w-0">
                <p className="font-semibold text-slate-700 text-sm">
                  ¡Vuelve mañana!
                </p>
                <p className="text-xs text-slate-600">
                  Nuevas reseñas estarán disponibles
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3 pt-4 border-t">
          <Button 
            className="w-full bg-primary hover:bg-primary-700 text-white font-semibold py-3 text-sm"
            onClick={() => router.push("/wallet")}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Hacer Retiro
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full text-slate-600 hover:bg-slate-50"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

