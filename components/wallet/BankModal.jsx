import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { X, Mail, CheckCircle } from "lucide-react";
import { walletService } from "@/services";

const BankModal = ({ isOpen, onClose, onConfirm, initialData = null }) => {
  const [step, setStep] = useState("form"); // "form" | "otp" | "success"
  const [bankData, setBankData] = useState({
    bankName: "",
    fullName: "",
    bankData: "",
    phone: "",
    email: ""
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Preencher dados iniciais quando o modal abrir
  useEffect(() => {
    if (isOpen && initialData) {
      setBankData({
        bankName: initialData.bankName || "",
        fullName: initialData.fullName || "",
        bankData: initialData.bankData || "",
        phone: initialData.phone || "",
        email: initialData.email || ""
      });
    }
  }, [isOpen, initialData]);

  const handleInputChange = (field, value) => {
    setBankData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    
    try {
      await walletService.sendBankOtp({
        bankName: bankData.bankName,
        fullName: bankData.fullName,
        bankData: bankData.bankData,
        phone: bankData.phone,
        email: bankData.email,
      });
      
      setStep("otp");
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
      const result = await walletService.verifyBankOtp(otp, bankData.email, {
        bankName: bankData.bankName,
        fullName: bankData.fullName,
        bankData: bankData.bankData,
        phone: bankData.phone,
        email: bankData.email,
      });
      
      setStep("success");
      
      // Depois de 2 segundos, fecha o modal e confirma
      setTimeout(() => {
        onConfirm(result.bankDetails);
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Código inválido o expirado");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("form");
    setBankData({
      bankName: "",
      fullName: "",
      bankData: "",
      phone: "",
      email: ""
    });
    setOtp("");
    setError("");
    onClose();
  };

  const isFormValid = () => {
    return bankData.bankName && bankData.fullName && bankData.bankData && bankData.phone && bankData.email;
  };

  const renderFormStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bank-name">Nombre del Banco</Label>
        <Input
          id="bank-name"
          placeholder="Ej: Banco Santander"
          value={bankData.bankName}
          onChange={(e) => handleInputChange("bankName", e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="full-name">Nombre Completo</Label>
        <Input
          id="full-name"
          placeholder="Tu nombre completo"
          value={bankData.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bank-data">Datos Bancarios (Cuenta/CLABE/CBU)</Label>
        <Input
          id="bank-data"
          placeholder="Ej: 1234567890123456789"
          value={bankData.bankData}
          onChange={(e) => handleInputChange("bankData", e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          placeholder="+1 234 567 8900"
          value={bankData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={bankData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Al llenar los datos anteriores, encontraremos su cuenta bancaria para el envío del saldo. 
          No se preocupe, tras la solicitud de retiro, entraremos en contacto para confirmar la cuenta.
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
          onClick={handleSendOtp}
          disabled={!isFormValid() || loading}
          className="flex-1"
        >
          {loading ? "Enviando..." : "Continuar"}
        </Button>
      </div>
    </div>
  );

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
          <strong>{bankData.email}</strong>
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
          onClick={() => setStep("form")}
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
          onClick={handleSendOtp}
          disabled={loading}
          className="text-sm text-primary hover:underline disabled:opacity-50"
        >
          ¿No recibiste el código? Reenviar
        </button>
      </div>
    </div>
  );

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
            ¡Verificación Exitosa!
          </h3>
          <p className="text-sm text-muted-foreground">
            Tus datos bancarios han sido verificados y guardados correctamente
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} className="max-h-[90vh]">
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "form" && "Datos Bancarios"}
            {step === "otp" && "Verificación de Seguridad"}
            {step === "success" && "¡Completado!"}
          </DialogTitle>
        </DialogHeader>
        
        {step === "form" && renderFormStep()}
        {step === "otp" && renderOtpStep()}
        {step === "success" && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  );
};

export default BankModal;
