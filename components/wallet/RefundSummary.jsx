import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertBlock } from "@/components/shared/alert-block";
import { DollarSign, Calendar, CheckCircle, CreditCard, Mail, Phone, Clock, Package, AlertTriangle, RefreshCw, Building2 } from "lucide-react";
import { walletService } from "@/services";
import BankRefundModal from "./BankRefundModal";

const RefundSummary = ({ refundData, paymentInfo, bankDetails, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [error, setError] = useState("");

  // Verificar se passou de 7 dias para reembolso via banco
  const isBankRefundOverdue = () => {
    if (!refundData?.processViaBank || !refundData?.createdAt) return false;
    const createdAt = new Date(refundData.createdAt);
    const now = new Date();
    const daysDiff = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    return daysDiff > 7;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value) => {
    if (!value) return "N/A";
    return `$${Number(value).toFixed(2)}`;
  };

  const getStatusColor = () => {
    if (refundData?.refundProcessed) {
      return "text-green-600";
    }
    if (refundData?.failed) {
      return "text-red-600";
    }
    return "text-amber-600";
  };

  const getStatusText = () => {
    if (refundData?.refundProcessed) {
      return "Procesado";
    }
    if (refundData?.failed) {
      return "Falló";
    }
    if (refundData?.processViaBank) {
      return "Procesando vía Banco";
    }
    if (refundData?.verified) {
      return "En Proceso";
    }
    return "Pendiente";
  };

  const getStatusIcon = () => {
    if (refundData?.refundProcessed) {
      return <CheckCircle className="w-3 h-3 text-green-600" />;
    }
    if (refundData?.failed) {
      return <AlertTriangle className="w-3 h-3 text-red-600" />;
    }
    return <Clock className="w-3 h-3 text-amber-600" />;
  };

  const handleRetry = async () => {
    setLoading(true);
    setError("");
    
    try {
      await walletService.retryRefund();
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message || "Error al reintentar");
    } finally {
      setLoading(false);
    }
  };

  const handleProcessViaBank = async () => {
    // Verifica se tem dados bancários
    if (!bankDetails) {
      setShowBankModal(true);
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await walletService.processRefundViaBank();
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message || "Error al procesar vía banco");
    } finally {
      setLoading(false);
    }
  };

  const handleBankConfirm = async (data) => {
    setShowBankModal(false);
    
    // Aguarda um pouco e tenta processar via banco
    setTimeout(async () => {
      await handleProcessViaBank();
    }, 500);
  };

  const handleUpdateBankData = () => {
    setShowBankModal(true);
  };

  const maskBankData = (data) => {
    if (!data || data.length < 8) return "****";
    const lastFour = data.slice(-4);
    const masked = "*".repeat(Math.min(data.length - 4, 12));
    return `${masked}${lastFour}`;
  };

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${
                  refundData?.refundProcessed 
                    ? "bg-green-100 dark:bg-green-900" 
                    : refundData?.failed 
                    ? "bg-red-100 dark:bg-red-900" 
                    : "bg-primary/10"
                }`}>
                  <DollarSign className={`w-5 h-5 ${
                    refundData?.refundProcessed 
                      ? "text-green-600" 
                      : refundData?.failed 
                      ? "text-red-600" 
                      : "text-primary"
                  }`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Solicitud de Reembolso
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    {getStatusIcon()}
                    <span className={`text-xs font-medium ${getStatusColor()}`}>
                      {getStatusText()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Fecha de Solicitud</p>
                    <p className="text-sm font-medium">
                      {formatDate(refundData?.createdAt)}
                    </p>
                    {refundData?.daysSinceCreation !== undefined && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Hace {refundData.daysSinceCreation} día{refundData.daysSinceCreation !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Failed Alert */}
            {refundData?.failed && !refundData?.processViaBank && (
              <div className="space-y-3">
                <AlertBlock type="error" icon={false}>
                  <div>
                    <p className="font-semibold mb-1">
                      No pudimos depositar el valor
                    </p>
                    <p>
                      No conseguimos depositar el valor en tu método de pago {paymentInfo?.paymentMethodName}. 
                      Por favor verifica que tu método de pago esté activo y no bloqueado.
                    </p>
                  </div>
                </AlertBlock>

                <Button
                  onClick={handleRetry}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 animate-spin border-2 border-red-600 border-t-transparent rounded-full mr-2" />
                      Reintentando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Intentar Nuevamente por {paymentInfo?.paymentMethodName}
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Bank Transfer Option */}
            {refundData?.failed && !refundData?.processViaBank && (
              <div className="space-y-3">
                <AlertBlock type="info" icon={false}>
                  <div>
                    <p className="font-semibold mb-1">
                      Recibe por Transferencia Bancaria
                    </p>
                    <p>
                      También puedes recibir el reembolso mediante transferencia bancaria. 
                      {!bankDetails && " Necesitarás agregar tus datos bancarios primero."}
                    </p>
                  </div>
                </AlertBlock>

                <Button
                  onClick={handleProcessViaBank}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 animate-spin border-2 border-blue-600 border-t-transparent rounded-full mr-2" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4 mr-2" />
                      {bankDetails ? "Recibir vía Transferencia Bancaria" : "Agregar Datos Bancarios"}
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Processing via Bank Info */}
            {refundData?.processViaBank && bankDetails && (
              <AlertBlock type="success" icon={false}>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">
                      Procesando vía Transferencia Bancaria
                    </h4>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Banco:</span>
                      <span className="font-medium">
                        {bankDetails.bankName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Titular:</span>
                      <span className="font-medium">
                        {bankDetails.fullName}
                      </span>
                    </div>
                    {bankDetails.bankData && (
                      <div className="flex justify-between">
                        <span>Cuenta:</span>
                        <span className="font-mono font-medium">
                          {maskBankData(bankDetails.bankData)}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs pt-2 border-t border-current/20">
                    El reembolso será transferido a esta cuenta bancaria en los próximos días.
                  </p>
                </div>
              </AlertBlock>
            )}

            {/* Alerta de dados incorretos após 7 dias */}
            {refundData?.processViaBank && isBankRefundOverdue() && (
              <AlertBlock type="warning" icon={false}>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold mb-1">
                      Datos Bancarios Incorrectos
                    </p>
                    <p>
                      Han pasado más de 7 días y no hemos podido procesar tu reembolso. 
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

            {/* Info Badge */}
            {!refundData?.failed && !refundData?.processViaBank && (
              <AlertBlock type="info" icon={false}>
                <p className="text-xs">
                  <strong>Estado:</strong> Tu solicitud ha sido verificada. El reembolso será procesado 
                  en el mismo método de pago que usaste para la compra. Esto puede tardar hasta 7 días hábiles.
                </p>
              </AlertBlock>
            )}

            {error && (
              <AlertBlock type="error" icon={false}>
                <p className="text-sm">{error}</p>
              </AlertBlock>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Card */}
      {paymentInfo && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Detalles del Pago Original:</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    <Package className="w-3 h-3 inline mr-1" />
                    Producto:
                  </span>
                  <span className="text-sm font-medium">
                    {paymentInfo.productName || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    Estado del Pago:
                  </span>
                  <span className="text-sm font-medium capitalize">
                    {paymentInfo.paymentStatus || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    <Mail className="w-3 h-3 inline mr-1" />
                    Email:
                  </span>
                  <span className="text-sm font-medium">
                    {refundData?.email || paymentInfo.email || "N/A"}
                  </span>
                </div>

                {paymentInfo.phoneNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      <Phone className="w-3 h-3 inline mr-1" />
                      Teléfono:
                    </span>
                    <span className="text-sm font-medium">
                      {paymentInfo.phoneNumber}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    <CreditCard className="w-3 h-3 inline mr-1" />
                    Método de Pago:
                  </span>
                  <span className="text-sm font-medium">
                    {paymentInfo.paymentMethodName || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Fecha de Compra:</span>
                  <span className="text-xs">
                    {formatDate(paymentInfo.paymentTimestamp)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-sm font-semibold">Monto a Reembolsar:</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(paymentInfo.priceInLocalCurrency)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Card */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">¿Necesitas Ayuda?</h4>
            <p className="text-xs text-muted-foreground">
              Si tienes alguna pregunta sobre tu reembolso o si no recibes el dinero en el 
              tiempo estimado, por favor contáctanos. Estamos aquí para ayudarte.
            </p>
            <p className="text-xs text-muted-foreground">
              Email: <a href="mailto:contacto@gcaptchas.site" className="text-primary hover:underline">contacto@gcaptchas.site</a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bank Refund Modal */}
      <BankRefundModal
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
        onConfirm={handleBankConfirm}
        initialData={bankDetails}
      />
    </div>
  );
};

export default RefundSummary;
