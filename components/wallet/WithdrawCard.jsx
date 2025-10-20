import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertBlock } from "@/components/shared/alert-block";
import BankRefundModal from "./BankRefundModal";
import { walletService } from "@/services";
import { 
  CreditCard, 
  Package, 
  CheckCircle, 
  Mail, 
  Calendar,
  DollarSign,
  Clock,
  XCircle,
  ArrowRight,
  Building2,
  Phone
} from "lucide-react";

export function WithdrawCard({ withdraw, onUpdate }) {
  const [showBankModal, setShowBankModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatCurrency = (value) => {
    const reais = (value / 100).toFixed(2);
    return `US$ ${reais.replace(".", ",")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status, isOverdue) => {
    // Se passou de 7 dias, mostra como "Falhou"
    if (isOverdue) {
      return (
        <Badge variant="red" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Falló
        </Badge>
      );
    }

    const statusConfig = {
      pending: {
        label: "Pendiente",
        icon: <Clock className="w-3 h-3" />,
        variant: "yellow",
      },
      processing: {
        label: "Procesando",
        icon: <ArrowRight className="w-3 h-3" />,
        variant: "blue",
      },
      completed: {
        label: "Completado",
        icon: <CheckCircle className="w-3 h-3" />,
        variant: "green",
      },
      rejected: {
        label: "Rechazado",
        icon: <XCircle className="w-3 h-3" />,
        variant: "red",
      },
      failed: {
        label: "Falló",
        icon: <XCircle className="w-3 h-3" />,
        variant: "red",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getMethodLabel = (method) => {
    return method === "banco" ? "Transferencia Bancaria" : "PayPal";
  };

  const getStatusMessage = (status, isOverdue) => {
    // Se passou de 7 dias, não mostra mensagem de status
    if (isOverdue) {
      return "";
    }

    const messages = {
      pending: "Tu solicitud está siendo revisada. Te notificaremos cuando sea procesada.",
      processing: "Tu retiro está siendo procesado. Recibirás el dinero pronto.",
      completed: "¡Retiro completado exitosamente!",
      rejected: "Tu solicitud fue rechazada. El saldo fue devuelto a tu cuenta.",
      failed: "",
    };
    return messages[status] || "";
  };

  const getStatusVariantClass = (status) => {
    const variantClasses = {
      pending: "info",
      processing: "info",
      completed: "success",
      rejected: "error",
    };
    return variantClasses[status] || variantClasses.pending;
  };

  // Verificar se passou de 7 dias para retiro via banco
  const isBankWithdrawOverdue = () => {
    if (withdraw.method !== "banco" || withdraw.status !== "pending" || !withdraw.createdAt) return false;
    const createdAt = new Date(withdraw.createdAt);
    const now = new Date();
    const daysDiff = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    return daysDiff > 7;
  };

  const getDaysSinceCreation = () => {
    if (!withdraw.createdAt) return 0;
    const createdAt = new Date(withdraw.createdAt);
    const now = new Date();
    return Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
  };

  const handleUpdateBankData = () => {
    setShowBankModal(true);
  };

  const handleBankConfirm = async (data) => {
    setShowBankModal(false);
    setLoading(true);
    setError("");
    
    try {
      await walletService.updateWithdrawBankDetails(withdraw.id);
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message || "Error al actualizar datos bancarios");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header with Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="font-semibold text-lg">
                {formatCurrency(withdraw.amount)}
              </span>
            </div>
            {getStatusBadge(withdraw.status, isBankWithdrawOverdue())}
          </div>

          {/* Divider */}
          <div className="border-t border-muted" />

          {/* Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                <CreditCard className="w-3 h-3 inline mr-1" />
                Método:
              </span>
              <span className="text-sm font-medium">
                {getMethodLabel(withdraw.method)}
              </span>
            </div>

            {withdraw.method === "paypal" && withdraw.paypalEmail && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  <Mail className="w-3 h-3 inline mr-1" />
                  Email PayPal:
                </span>
                <span className="text-sm font-medium">
                  {withdraw.paypalEmail}
                </span>
              </div>
            )}

            {withdraw.method === "banco" && withdraw.bankDetails && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    <Package className="w-3 h-3 inline mr-1" />
                    Banco:
                  </span>
                  <span className="text-sm font-medium">
                    {withdraw.bankDetails.bankName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    Titular:
                  </span>
                  <span className="text-sm font-medium">
                    {withdraw.bankDetails.fullName}
                  </span>
                </div>
                {withdraw.bankDetails.email && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      <Mail className="w-3 h-3 inline mr-1" />
                      Email:
                    </span>
                    <span className="text-sm font-medium">
                      {withdraw.bankDetails.email}
                    </span>
                  </div>
                )}
                {withdraw.bankDetails.phone && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      <Phone className="w-3 h-3 inline mr-1" />
                      Teléfono:
                    </span>
                    <span className="text-sm font-medium">
                      {withdraw.bankDetails.phone}
                    </span>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                <Calendar className="w-3 h-3 inline mr-1" />
                Fecha de Solicitud:
              </span>
              <span className="text-xs">
                {formatDate(withdraw.createdAt)}
              </span>
            </div>

            {withdraw.processedAt && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  Fecha de Procesamiento:
                </span>
                <span className="text-xs">
                  {formatDate(withdraw.processedAt)}
                </span>
              </div>
            )}
          </div>

          {/* Status Info */}
          {getStatusMessage(withdraw.status, isBankWithdrawOverdue()) && (
            <AlertBlock type={getStatusVariantClass(withdraw.status)}>
              <div>
                <p className="text-xs">
                  {getStatusMessage(withdraw.status, isBankWithdrawOverdue())}
                </p>
                {withdraw.status === "pending" && getDaysSinceCreation() > 0 && !isBankWithdrawOverdue() && (
                  <p className="text-xs mt-2">
                    Hace {getDaysSinceCreation()} día{getDaysSinceCreation() !== 1 ? 's' : ''} desde la solicitud
                  </p>
                )}
              </div>
            </AlertBlock>
          )}

          {/* Alerta de dados incorretos após 7 dias */}
          {isBankWithdrawOverdue() && (
            <AlertBlock type="warning">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold mb-1">
                    Datos Bancarios Incorrectos
                  </p>
                  <p className="text-xs">
                    Han pasado más de 7 días y no hemos podido procesar tu retiro. 
                    Los datos bancarios están incorrectos. Por favor, actualiza tus datos.
                  </p>
                </div>

                <Button
                  onClick={handleUpdateBankData}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Actualizar Datos Bancarios
                </Button>
              </div>
            </AlertBlock>
          )}

          {/* Error message */}
          {error && (
            <AlertBlock type="error">
              {error}
            </AlertBlock>
          )}
        </div>
      </CardContent>

      {/* Bank Update Modal */}
      <BankRefundModal
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
        onConfirm={handleBankConfirm}
        initialData={withdraw.bankDetails}
      />
    </Card>
  );
}

