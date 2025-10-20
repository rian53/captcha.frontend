import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { SurveyCard } from "@/components/surveys/SurveyCard";
import { BalanceCard } from "@/components/surveys/BalanceCard";
import { SuperUpgradeModal } from "@/components/surveys/modals/SuperUpgradeModal";
import { LimitReachedModal } from "@/components/surveys/modals/LimitReachedModal";
import PromotionalModal from "@/components/shared/PromotionalModal";
import { surveysService, userService } from "@/services";
import { toast } from "sonner";

function Home() {
  const [surveys, setSurveys] = useState({ normalSurveys: [], superSurveys: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [showSuperModal, setShowSuperModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showPromotionalModal, setShowPromotionalModal] = useState(false);
  const [reachedLimit, setReachedLimit] = useState(false);

  const loadSurveys = async (showSuccessToast = false) => {
    try {
      setRefreshing(true);
      const data = await surveysService.getAvailable();
      
      if (data.status === 200) {
        setSurveys(data.response);
        setReachedLimit(data.response.reachedLimit || false);
        
        if (showSuccessToast) {
          toast.success("¡Búsquedas actualizadas!");
        }
      }
    } catch (error) {
      toast.error(error.message || "Não foi possível carregar as búsquedas");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const profile = await userService.getProfile();
      setUserProfile(profile);
      setBalance(profile.balance || 0);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  };

  const handleSuperSurveyClick = (e) => {
    // Verificar se o usuário tem acesso a super surveys
    if (!userProfile || userProfile.superPosts === 0) {
      e.preventDefault();
      setShowSuperModal(true);
      return false;
    }
    return true;
  };

  const handleNormalSurveyClick = (e) => {
    // Verificar se atingiu o limite diário
    if (reachedLimit) {
      e.preventDefault();
      setShowLimitModal(true);
      return false;
    }
    return true;
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadSurveys(),
        loadUserProfile(),
      ]);
    };
    
    loadData();
    
    // Mostrar modal promocional sempre que entrar na home
    setShowPromotionalModal(true);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasSuperAccess = userProfile && userProfile.superPosts > 0;
  const targetBalance = userProfile?.superPosts > 0 ? 115218 : 35000;

  return (
    <div className="space-y-6">
      {/* Modais */}
      <PromotionalModal 
        isOpen={showPromotionalModal} 
        onClose={() => setShowPromotionalModal(false)} 
      />
      <SuperUpgradeModal 
        isOpen={showSuperModal} 
        onClose={() => setShowSuperModal(false)} 
      />
      <LimitReachedModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        balance={balance}
      />

      {/* Card de Saldo */}
      <BalanceCard balance={balance} targetBalance={targetBalance} />

      {/* Seção de Búsquedas */}
      <div className="space-y-4">
        {/* Cabeçalho da seção */}
        <div className="pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <h2 className="text-md font-semibold text-foreground">Mis Búsquedas</h2>
          </div>
          <Button
            onClick={() => loadSurveys(true)}
            disabled={refreshing}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>

        {/* Lista de Surveys */}
        <div className="space-y-3">
          {/* Super Surveys */}
          {surveys.superSurveys && surveys.superSurveys.length > 0 && (
            <div className="space-y-3">
              {surveys.superSurveys.map((survey) => (
                <div 
                  key={survey.id} 
                  onClick={(e) => !hasSuperAccess && handleSuperSurveyClick(e)}
                  className={!hasSuperAccess ? "cursor-pointer" : ""}
                >
                  <SurveyCard 
                    survey={survey} 
                    isSuperSurvey 
                    disabled={!hasSuperAccess}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Normal Surveys */}
          {surveys.normalSurveys && surveys.normalSurveys.length > 0 ? (
            <div className="space-y-3">
              {surveys.normalSurveys.map((survey) => (
                <div 
                  key={survey.id} 
                  onClick={(e) => reachedLimit && handleNormalSurveyClick(e)}
                  className={reachedLimit ? "cursor-pointer" : ""}
                >
                  <SurveyCard 
                    survey={survey} 
                    disabled={reachedLimit}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  {reachedLimit 
                    ? "¡Has completado todas tus reseñas por hoy!" 
                    : "Nenhuma búsqueda disponível no momento"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {reachedLimit
                    ? "Vuelve mañana para nuevas oportunidades"
                    : "Volte mais tarde para novas oportunidades!"}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

Home.layoutName = "Início";
export default Home;
