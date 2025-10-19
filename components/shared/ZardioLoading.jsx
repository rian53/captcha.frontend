import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTheme } from "next-themes";

const ZardioLoading = ({ 
  className = "", 
  fullScreen = false, 
  text = "Carregando",
  showText = true,
  darkBackground = true,
  textClassName = "",
  size = 500 
}) => {
  const { resolvedTheme } = useTheme();
  
  // Calcular o margin negativo baseado no tamanho da imagem
  const marginNegative = Math.min(size * 0.16, 100); // 20% do tamanho, máximo 100px
  
  // Determinar qual GIF usar baseado no tema
  const getLoadingGif = () => {
    if (resolvedTheme === 'dark') {
      return "/video/zardioLoadingLight.gif";
    } else {
      return "/video/zardioLoadingDark.gif";
    }
  };
  
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center",
        darkBackground ? "bg-black/50 fixed inset-0 z-50 data-[state=open]:animate-in data-[state=open]:fade-in-0" : "",
        !darkBackground && (fullScreen ? "fixed inset-0 z-50" : "min-h-[40vh] rounded-lg"),
        className
      )}
    >
        <Image src={getLoadingGif()} alt="Zardio Logo" width={size} height={size} className="mt-[-100px]"/>
      
      {showText && (
        <span 
          className={cn("text-sm", darkBackground ? "text-white" : "text-muted-foreground", textClassName)}
          style={{ marginTop: `-${marginNegative}px` }}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export { ZardioLoading };
export default ZardioLoading; 