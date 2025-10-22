import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const PromotionalModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

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

  // Abrir URL en nueva pestaña
  const handleOpenUrl = () => {
    window.open(steps[currentStep].url, '_blank');
  };

  // Avanzar automáticamente al siguiente anuncio
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  // Se não estiver aberto, não mostrar
  if (!isOpen) {
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
          {/* Botón de cerrar */}
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              ✕ CERRAR
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalModal;
