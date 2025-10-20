import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Badge } from "@/components/ui/badge";
import { HoverBorderGradient } from "@/components/ui/button-animate";
import { ChevronRight, Star } from "lucide-react";
import { useRouter } from "next/router";

export function SurveyCard({ survey, isSuperSurvey = false, disabled = false }) {
  const router = useRouter();
  
  const formatCurrency = (value) => {
    const reais = (value / 100).toFixed(2);
    return `US$ ${reais.replace(".", ",")}`;
  };

  const handleCardClick = () => {
    if (!disabled) {
      router.push(`/survey/${survey.id}`);
    }
  };

  const cardContent = (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
      {/* Imagem do produto */}
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-lg bg-center bg-contain bg-no-repeat flex-shrink-0 mx-auto sm:mx-0"
        style={{ backgroundImage: `url(/img/logo.png)` }}
      />

      {/* Conteúdo principal */}
      <div className="flex-1 min-w-0 w-full">
        {/* Título */}
        <div className="mb-3 text-center sm:text-left">
          <h3 className="text-sm sm:text-base font-semibold text-foreground line-clamp-2 leading-tight">
            {survey.title}
          </h3>
        </div>

        {/* Preços e Badge Responder */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            {isSuperSurvey ? (
              // Para Super Surveys: mostrar valor original (dividido por 3) cortado e valor atual em dourado
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground line-through">
                  {formatCurrency(survey.value / 3)}
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-400 dark:to-amber-400 bg-clip-text text-transparent">
                    {formatCurrency(survey.value)}
                  </span>
                  <Badge variant="gold" className="text-xs px-2 py-1 text-yellow-900 !opacity-100">
                    3x
                  </Badge>
                </div>
              </div>
            ) : (
              // Para Surveys normais: mostrar valor normal
              <div>
                {survey.oldValue && (
                  <div className="text-xs text-muted-foreground line-through mb-1">
                    {formatCurrency(survey.oldValue)}
                  </div>
                )}
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-lg sm:text-xl font-bold text-foreground">
                    {formatCurrency(survey.value)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Badge Responder */}
          {isSuperSurvey ? (
            <HoverBorderGradient
              as="div"
              containerClassName="w-full sm:w-auto cursor-pointer"
              className="flex items-center gap-1 text-xs px-4 py-2 justify-center"
              onClick={handleCardClick}
            >
              Responder
              <ChevronRight className="w-3 h-3" />
            </HoverBorderGradient>
          ) : (
            <Badge 
              variant="google"
              className="flex items-center gap-1 text-xs px-4 py-2 w-full sm:w-auto justify-center"
              disabled={disabled}
            >
              Responder
              <ChevronRight className="w-3 h-3" />
            </Badge>
          )}
        </div>
      </div>
    </div>
  );

  if (isSuperSurvey) {
    return (
      <AnimatedCard
        className={`transition-all relative ${
          !disabled ? "hover:bg-muted/50" : ""
        }`}
        containerClassName="w-full"
      >
        {/* Badge SUPER como selo na parte superior */}
        <div className="absolute -top-3 sm:-top-3 left-1/2 transform -translate-x-1/2 z-20 !opacity-100">
          <Badge variant="gold" className="flex items-center gap-1 text-xs sm:text-sm px-3 py-1 shadow-lg text-yellow-900 !opacity-100">
            <Star className="w-3 h-3 sm:w-4 sm:h-4" />
            SÚPER CALIFICACIÓN
          </Badge>
        </div>
        <div className="pt-3">
          {cardContent}
        </div>
      </AnimatedCard>
    );
  }

  return (
    <Card
      onClick={handleCardClick}
      className={`transition-all cursor-pointer ${
        !disabled ? "hover:bg-muted/50" : ""
      }`}
    >
      <CardContent className="p-4">
        {cardContent}
      </CardContent>
    </Card>
  );
}

