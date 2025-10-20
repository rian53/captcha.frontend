import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";
import { AlertBlock } from "@/components/shared/alert-block";

const WithdrawSuccessModal = ({ isOpen, onClose, method }) => {
  const getMethodName = (method) => {
    switch (method) {
      case "banco":
        return "transferencia bancaria";
      case "paypal":
        return "PayPal";
      default:
        return "transferencia";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">¡Solicitud Enviada!</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Ícone de sucesso */}
          <div className="flex justify-center">
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Mensagem principal */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
              ¡Solicitud de Retiro Enviada con Éxito!
            </h3>
            <p className="text-sm text-muted-foreground">
              Tu solicitud de retiro por <strong>{getMethodName(method)}</strong> ha sido procesada correctamente.
            </p>
          </div>

          {/* Información de tiempo de procesamiento */}
          <AlertBlock type="info">
            <div className="flex items-start gap-3">
             
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Tiempo de procesamiento: 7 días hábiles
                </p>
                <p className="text-xs text-muted-foreground">
                  No te preocupes, te avisaremos tan pronto como esté liberado en tu cuenta.
                </p>
              </div>
            </div>
          </AlertBlock>

          {/* Información adicional */}
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-200 text-center">
              Puedes revisar el estado de tu solicitud en el historial de retiros en cualquier momento.
            </p>
          </div>

          {/* Botón de confirmación */}
          <Button
            onClick={onClose}
            className="w-full"
          >
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawSuccessModal;
