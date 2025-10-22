import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail, CheckCircle, DollarSign, Calendar, CreditCard, Globe, Phone, Package } from "lucide-react";
import { walletService } from "@/services";
import { AlertBlock } from "@/components/shared/alert-block";

const RefundModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState("email"); // "email" | "details" | "otp" | "success"
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadPaymentInfo();
    }
  }, [isOpen]);

  const loadPaymentInfo = async () => {
    setLoadingInfo(true);
    try {
      const info = await walletService.getPaymentInfo();
      setPaymentInfo(info);
      setEmail(info.email || "");
    } catch (err) {
      setError("Error al cargar información de pago");
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleContinueToDetails = () => {
    if (!email) {
      setError("Por favor ingresa tu email");
      return;
    }
    
    // Verifica se o email corresponde ao email do usuário
    if (paymentInfo && paymentInfo.email && email !== paymentInfo.email) {
      setError("El email ingresado no corresponde al email registrado en tu cuenta");
      return;
    }
    
    setError("");
    setStep("details");
  };

  const handleConfirmDetails = async () => {
    setLoading(true);
    setError("");
    
    try {
      await walletService.sendRefundOtp(email);
      setStep("otp");
    } catch (err) {
      setError(err.message || "Error al enviar el código");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
    
    try {
      await walletService.sendRefundOtp(email);
      setError("");
    } catch (err) {
      setError(err.message || "Error al enviar el código");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Por favor ingresa el código completo");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await walletService.verifyRefundOtp(otp, email);
      setStep("success");
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.message || "Código inválido o expirado");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setError("");
    setPaymentInfo(null);
    onClose();
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

  // ETAPA 1: Confirmación de Email
  const renderEmailStep = () => (
    <div className="space-y-2">
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              ¡Devolución de Tasa de Pago!
            </h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
        El valor será reembolsado en el mismo método de pago utilizado en la compra. Para proceder, 
          necesitamos verificar que eres tú.
        </p>
      </div>

      <AlertBlock type="info" className="p-4" icon={false}>
        <div className="space-y-1">
          <p className="font-medium">Tiempo de Procesamiento</p>
          <p className="text-sm">
            El reembolso puede tardar hasta 7 días hábiles dependiendo de tu banco. 
            No te preocupes, te informaremos tan pronto como tu banco reciba el reembolso.
          </p>
        </div>
      </AlertBlock>

      <div className="space-y-2">
        <Label htmlFor="email">Confirma tu Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground pb-2">
          Usaremos este email para verificar tu identidad
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={handleClose}
          className="flex-1"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleContinueToDetails}
          disabled={!email || loading}
          className="flex-1"
        >
          Continuar
        </Button>
      </div>
    </div>
  );

  // ETAPA 2: Detalles de Pago
  const renderDetailsStep = () => (
    <div className="space-y-6">
      {loadingInfo ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 animate-spin border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              Por favor, verifica que los siguientes datos sean correctos antes de continuar:
            </p>
          </div>

          {paymentInfo && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Detalles de la Compra:</h4>
              
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    <Package className="w-3 h-3 inline mr-1 -mt-0.5" />
                    Producto:
                  </span>
                  <span className="text-sm font-medium">
                    {paymentInfo.productName || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    <CheckCircle className="w-3 h-3 inline mr-1 -mt-0.5" />
                    Estado:
                  </span>
                  <span className="text-sm font-medium capitalize">
                    {paymentInfo.paymentStatus || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    <Mail className="w-3 h-3 inline mr-1 -mt-0.5" />
                    Email:
                  </span>
                  <span className="text-sm font-medium">
                    {paymentInfo.email || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    <Phone className="w-3 h-3 inline mr-1 -mt-0.5" />
                    Telefono:
                  </span>
                  <span className="text-sm font-medium">
                    {paymentInfo.phoneNumber || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    <Globe className="w-3 h-3 inline mr-1 -mt-0.5" />
                    País:
                  </span>
                  <span className="text-sm font-medium">
                    {paymentInfo.country || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    <CreditCard className="w-3 h-3 inline mr-1 -mt-0.5" />
                    Método:
                  </span>
                  <span className="text-sm font-medium">
                    {paymentInfo.paymentMethodName || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3 inline mr-1 -mt-0.5" />
                    Fecha:
                  </span>
                  <span className="text-xs">
                    {formatDate(paymentInfo.paymentTimestamp)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-semibold">
                    <DollarSign className="w-3 h-3 inline mr-1 -mt-0.5" />
                    Monto a Reembolsar:
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(paymentInfo.priceInLocalCurrency)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setStep("email")}
              className="flex-1"
              disabled={loading}
            >
              Volver
            </Button>
            <Button
              onClick={handleConfirmDetails}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Enviando código..." : "Confirmar y Continuar"}
            </Button>
          </div>
        </>
      )}
    </div>
  );

  // ETAPA 3: Verificación OTP
  const renderOtpStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-semibold">Verifica tu Email</h3>
        <p className="text-sm text-muted-foreground">
          Hemos enviado un código de 6 dígitos a<br />
          <strong>{email}</strong>
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Si no recibes el email, verifica tu carpeta de spam o correo no deseado
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-center block">Ingresa el Código</Label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              disabled={loading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            El código expira en 10 minutos
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200 text-center">{error}</p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setStep("details")}
          className="flex-1"
          disabled={loading}
        >
          Volver
        </Button>
        <Button
          onClick={handleVerifyOtp}
          disabled={otp.length !== 6 || loading}
          className="flex-1"
        >
          {loading ? "Verificando..." : "Verificar"}
        </Button>
      </div>

      <div className="text-center">
        <button
          onClick={handleResendOtp}
          disabled={loading}
          className="text-sm text-primary hover:underline disabled:opacity-50"
        >
          ¿No recibiste el código? Reenviar
        </button>
      </div>
    </div>
  );

  // ETAPA 4: Éxito
  const renderSuccessStep = () => (
    <div className="space-y-6 py-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">
            ¡Solicitud Exitosa!
          </h3>
          <p className="text-sm text-muted-foreground">
            Tu solicitud de reembolso ha sido registrada correctamente.<br />
            Procesaremos la devolución en los próximos días.
          </p>
        </div>
      </div>
    </div>
  );

  const getTitle = () => {
    switch (step) {
      case "email":
        return "Solicitud de Reembolso";
      case "details":
        return "Confirma los Detalles";
      case "otp":
        return "Verificación de Seguridad";
      case "success":
        return "¡Completado!";
      default:
        return "Solicitud de Reembolso";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        
        {step === "email" && renderEmailStep()}
        {step === "details" && renderDetailsStep()}
        {step === "otp" && renderOtpStep()}
        {step === "success" && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  );
};

export default RefundModal;
