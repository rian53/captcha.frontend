import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartArea, Gift, History } from "lucide-react";
import { userService, walletService } from "@/services";
import { BalanceCard } from "@/components/surveys/BalanceCard";
import BankModal from "@/components/wallet/BankModal";
import PaymentMethodCards from "@/components/wallet/PaymentMethodCards";
import WithdrawForm from "@/components/wallet/WithdrawForm";
import BankDetailsSummary from "@/components/wallet/BankDetailsSummary";
import WithdrawSuccessModal from "@/components/wallet/WithdrawSuccessModal";
import { AlertBlock } from "@/components/shared/alert-block";
import { useRouter } from "next/router";

function WalletPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [hasBankDetails, setHasBankDetails] = useState(false);
  const [showObjectiveAlert, setShowObjectiveAlert] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState(null);

  // Meta de saldo dinâmica baseada em superPosts
  const targetBalance = userProfile?.superPosts > 0 ? 115218 : 35000;

  useEffect(() => {
    loadUserProfile();
    loadBankDetails();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await userService.getProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBankDetails = async () => {
    try {
      const details = await walletService.getBankDetails();
      if (details && details.verified) {
        setBankDetails(details);
        setHasBankDetails(true);
        setSelectedMethod("banco");
      }
    } catch (error) {
      console.error("Error al cargar datos bancarios:", error);
    }
  };

  const handleMethodSelect = (method) => {
    if (method === "banco") {
      setIsBankModalOpen(true);
    } else {
      setSelectedMethod(method);
    }
  };

  const handleBankConfirm = (data) => {
    setBankDetails(data);
    setHasBankDetails(true);
    setSelectedMethod("banco");
    loadBankDetails(); // Recarrega os dados
  };

  const handleBankModalClose = () => {
    setIsBankModalOpen(false);
  };

  const handleEditBankDetails = () => {
    setIsBankModalOpen(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setWithdrawMethod(null);
    // Redireciona para a página de histórico de withdraws
    router.push("/withdraw");
  };

  const formatCurrency = (value) => {
    const reais = (value / 100).toFixed(2);
    return `US$ ${reais.replace(".", ",")}`;
  };

  const formatInputValue = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    if (!numbers) return '';
    
    // Converte para centavos e formata
    const cents = parseInt(numbers);
    const formatted = (cents / 100).toFixed(2);
    
    return formatted.replace('.', ',');
  };

  const parseInputValue = (formattedValue) => {
    // Converte de formato brasileiro (150,10) para número
    const normalized = formattedValue.replace(',', '.');
    return parseFloat(normalized) || 0;
  };

  const handleWithdraw = async () => {
    if (!selectedMethod || !withdrawAmount) return;
    
    if (selectedMethod === "paypal" && !paypalEmail) return;
    
    // Verificar se o objetivo foi completado (100%)
    const balance = userProfile?.balance || 0;
    const progressPercentage = (balance / targetBalance) * 100;
    
    if (progressPercentage < 100) {
      setShowObjectiveAlert(true);
      // Ocultar o alerta após 5 segundos
      setTimeout(() => setShowObjectiveAlert(false), 10000);
      return;
    }
    
    setIsWithdrawing(true);
    try {
      const numericAmount = parseInputValue(withdrawAmount);
      const amountInCents = Math.round(numericAmount * 100);
      
      const withdrawData = {
        method: selectedMethod,
        amount: amountInCents,
        paypalEmail: selectedMethod === "paypal" ? paypalEmail : undefined,
        bankDetailsId: selectedMethod === "banco" && bankDetails ? bankDetails.id : undefined,
      };
      
      // Simular carregamento de 2 segundos
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await walletService.createWithdraw(withdrawData);
      
      // Atualiza o perfil do usuário
      await loadUserProfile();
      
      // Reset form
      setWithdrawAmount("");
      setPaypalEmail("");
      
      // Mostra modal de sucesso
      setWithdrawMethod(selectedMethod);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al procesar retiro:", error);
      alert(error.message || "Error al procesar retiro. Inténtalo de nuevo.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const isWithdrawDisabled = () => {
    if (!selectedMethod || !withdrawAmount) return true;
    if (selectedMethod === "paypal" && !paypalEmail) return true;
    const numericAmount = parseInputValue(withdrawAmount);
    if (numericAmount <= 0) return true;
    if (numericAmount > balance / 100) return true;
    return false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 animate-spin border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const balance = userProfile?.balance || 0;
  const bonusBalance = userProfile?.bonusBalance || 0;
  const progressPercentage = ((balance / targetBalance) * 100).toFixed(1);

  return (
    <div className="space-y-2">
      {/* Card de Progreso */}
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ChartArea className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Objetivo de reseñas</h2>
            </div>
            <span className="text-sm font-bold text-primary">{progressPercentage}%</span>
          </div>
          
          <div className="space-y-3">
            <div className="w-full bg-primary/20 rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerta de Objetivo Incompleto */}
      {showObjectiveAlert && (
        <AlertBlock type="error">
          <div>
            
            <p>
            Debe alcanzar el objetivo de calificaciones para realizar su retiro.. 
            </p>
          </div>
        </AlertBlock>
      )}

      <BalanceCard balance={balance} targetBalance={targetBalance} />

      {/* Botão Ver Histórico de Retiros */}
      <Button
        onClick={() => router.push("/withdraw")}
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
      >
        <History className="w-4 h-4" />
        Ver Historial de Retiros
      </Button>

      {/* Card de Saldo de Bonificación */}
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-medium text-muted-foreground">Saldo de Bonificación</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-amber-600">
                  {formatCurrency(bonusBalance)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">Bonus</div>
              <div className="text-sm font-medium text-amber-600">
                Extra
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Transferência */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground pt-4 pb-2">
          Selecciona tu método de transferencia de saldo
        </p>
        
        {/* Se tem dados bancários, mostra resumo, senão mostra cards de seleção */}
        {hasBankDetails && bankDetails ? (
          <BankDetailsSummary 
            bankDetails={bankDetails}
            onEdit={handleEditBankDetails}
          />
        ) : (
          <PaymentMethodCards 
            selectedMethod={selectedMethod}
            onMethodSelect={handleMethodSelect}
          />
        )}

        {/* Formulario de Retiro */}
        {selectedMethod && (
          <WithdrawForm
            selectedMethod={selectedMethod}
            paypalEmail={paypalEmail}
            setPaypalEmail={setPaypalEmail}
            withdrawAmount={withdrawAmount}
            setWithdrawAmount={setWithdrawAmount}
            formatInputValue={formatInputValue}
            parseInputValue={parseInputValue}
            balance={balance}
            formatCurrency={formatCurrency}
            isWithdrawDisabled={isWithdrawDisabled}
            isWithdrawing={isWithdrawing}
            onWithdraw={handleWithdraw}
            targetBalance={targetBalance}
          />
        )}
      </div>

      {/* Modal de Datos Bancarios */}
      <BankModal
        isOpen={isBankModalOpen}
        onClose={handleBankModalClose}
        onConfirm={handleBankConfirm}
      />

      {/* Modal de Éxito de Retiro */}
      <WithdrawSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        method={withdrawMethod}
      />
    </div>
  );
}

WalletPage.layoutName = "Mi Billetera";
export default WalletPage;