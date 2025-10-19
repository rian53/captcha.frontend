import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const PromotionalModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasShownToday, setHasShownToday] = useState(false);

  // Configuración de las 3 etapas
  const steps = [
    {
      id: 1,
      url: "https://global.mundpay.com/66vz4zjpmq",
      image: "/img/100av.jpg",
      title: "+100 Evaluaciones"
    },
    {
      id: 2,
      url: "https://global.mundpay.com/bfvxjg3pd5",
      image: "/img/200av.jpg",
      title: "+200 Evaluaciones"
    },
    {
      id: 3,
      url: "https://growdelux.salduu.com/p/formacion-millonario-digital?pay=true",
      image: "/img/ebook.jpg",
      title: "Formación Millonario Digital"
    }
  ];

  // Verificar si ya se mostró hoy
  useEffect(() => {
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('promotionalModalLastShown');
    
    if (lastShown === today) {
      setHasShownToday(true);
    } else {
      setHasShownToday(false);
    }
  }, []);

  // Marcar como mostrado hoy
  const markAsShownToday = () => {
    const today = new Date().toDateString();
    localStorage.setItem('promotionalModalLastShown', today);
    setHasShownToday(true);
  };

  // Abrir URL en nueva pestaña
  const handleOpenUrl = () => {
    window.open(steps[currentStep].url, '_blank');
  };

  // Volver a etapa anterior
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Avanzar a siguiente etapa o cerrar
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      markAsShownToday();
      onClose();
    }
  };

  // Si ya se mostró hoy, no mostrar
  if (hasShownToday || !isOpen) {
    return null;
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[95vh] overflow-hidden">
        {/* Image - clicable */}
        <div 
          className="relative w-full p-0 cursor-pointer"
          onClick={handleOpenUrl}
        >
          <Image
            src={currentStepData.image}
            alt={currentStepData.title}
            width={500}
            height={400}
            className="w-full h-auto object-contain rounded-t-lg"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
            {currentStepData.title}
          </h3>

          {/* Progress dots */}
          <div className="flex justify-center space-x-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Botones */}
          <div className="flex justify-center space-x-3">
            {currentStep > 0 && (
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="px-6 py-2"
              >
                Volver
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700"
            >
              {currentStep === steps.length - 1 ? 'Cerrar' : 'Continuar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalModal;
