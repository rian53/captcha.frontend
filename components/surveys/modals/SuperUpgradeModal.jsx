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
import { Sparkles, TrendingUp, Zap } from "lucide-react";

export function SuperUpgradeModal({ isOpen, onClose }) {
  const handleUpgrade = () => {
    // Redirecionar para o modo avançado
    const advancedUrl = process.env.NEXT_PUBLIC_ADVANCED_URL;
    if (advancedUrl) {
      window.location.href = advancedUrl;
    } else {
      console.error("URL do modo avançado não configurada");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-4 pb-4 flex-shrink-0">
          <div className="flex items-center justify-center">
            <div className="p-3 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full">
              <Sparkles className="w-10 h-10 text-yellow-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-bold leading-tight">
            ¡Aún no tienes acceso a Super Reseñas!
          </DialogTitle>
          <DialogDescription className="text-center">
            <p className="text-sm text-slate-600 leading-relaxed">
              Para tener acceso a ellos y duplicar tus ganancias, compra el
              paquete de expansión haciendo clic en el botón a continuación.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="grid gap-3 mb-4">
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
              <div className="p-2 bg-yellow-200 rounded-full flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-yellow-700" />
              </div>
              <div className="text-left min-w-0">
                <p className="font-semibold text-slate-700 text-sm">
                  Ganancias Duplicadas
                </p>
                <p className="text-xs text-slate-600">
                  Gana el doble por cada reseña
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
              <div className="p-2 bg-yellow-200 rounded-full flex-shrink-0">
                <Zap className="w-4 h-4 text-yellow-700" />
              </div>
              <div className="text-left min-w-0">
                <p className="font-semibold text-slate-700 text-sm">
                  Acceso Exclusivo
                </p>
                <p className="text-xs text-slate-600">
                  Reseñas de alto valor
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3 pt-4 border-t flex-shrink-0">
          <Button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-3 text-sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            ¡Quiero obtener el doble de ganancias!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

