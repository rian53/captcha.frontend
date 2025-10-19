import React from 'react';
import { Upload } from 'lucide-react';

/**
 * Modal reutilizável para mostrar progresso de upload
 */
const UploadProgressModal = ({ 
  isVisible = false,
  progress = 0,
  title = "Enviando arquivo...",
  description = "Aguarde enquanto fazemos o upload\npara evitar erros na transferência",
  className = ""
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`bg-background backdrop-blur-sm p-6 rounded-lg shadow-xl space-y-4 min-w-[260px] border ${className}`}>
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Upload className="h-5 w-5 animate-pulse text-primary" />
            <span className="text-sm font-semibold text-foreground">{title}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
        
        {/* Barra de progresso customizada */}
        <div className="space-y-2">
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs font-medium text-center text-foreground">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export { UploadProgressModal }; 