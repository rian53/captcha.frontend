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
import { Sparkles, TrendingUp, Zap, Star, Crown } from "lucide-react";

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
      <DialogContent className="w-[95vw] sm:max-w-[520px] max-h-[90vh] overflow-hidden flex flex-col bg-background border-gray-200 dark:border-gray-700">
        <DialogHeader className="space-y-4 sm:space-y-6 pb-4 sm:pb-6 flex-shrink-0">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 dark:from-amber-500 dark:via-yellow-500 dark:to-orange-500 rounded-full shadow-lg">
                <Crown className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Star className="w-2 h-2 sm:w-3 sm:h-3 text-white fill-current" />
                </div>
              </div>
            </div>
          </div>
          <div className="text-center space-y-2 sm:space-y-3">
            <DialogTitle className="text-lg sm:text-2xl font-bold leading-tight bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 dark:from-amber-400 dark:via-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
              ¡Desbloquea Super Reseñas!
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto px-2">
              <p>
                Accede a reseñas de alto valor y{" "}
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  multiplica tus ganancias
                </span>{" "}
                con nuestro paquete premium.
              </p>
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="grid gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg sm:rounded-xl border border-amber-200 dark:border-amber-800/50">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-400 to-yellow-500 dark:from-amber-500 dark:to-yellow-600 rounded-full flex-shrink-0 shadow-md">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <p className="font-bold text-gray-800 dark:text-gray-100 text-sm sm:text-base">
                  Ganancias Multiplicadas
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Gana hasta 3x más por cada reseña premium
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
                  3x
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg sm:rounded-xl border border-purple-200 dark:border-purple-800/50">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-full flex-shrink-0 shadow-md">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <p className="font-bold text-gray-800 dark:text-gray-100 text-sm sm:text-base">
                  Acceso Exclusivo
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Reseñas de alta calidad y mayor valor
                </p>
              </div>
              <div className="text-right">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 dark:text-purple-400" />
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg sm:rounded-xl border border-emerald-200 dark:border-emerald-800/50">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 rounded-full flex-shrink-0 shadow-md">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <p className="font-bold text-gray-800 dark:text-gray-100 text-sm sm:text-base">
                  Prioridad Premium
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Acceso prioritario a nuevas reseñas
                </p>
              </div>
              <div className="text-right">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 dark:text-emerald-400 fill-current" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3 sm:gap-4 pt-2 flex-shrink-0">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">
              ¡No pierdas esta oportunidad!
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Oferta limitada por tiempo
            </p>
          </div>
          <Button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 dark:from-amber-400 dark:via-yellow-400 dark:to-orange-400 dark:hover:from-amber-500 dark:hover:via-yellow-500 dark:hover:to-orange-500 text-white dark:text-gray-900 font-bold py-3 sm:py-4 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <Crown className="w-4 h-4 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            <span className="hidden sm:inline">¡Desbloquear Super Reseñas Ahora!</span>
            <span className="sm:hidden">¡Desbloquear Ahora!</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

