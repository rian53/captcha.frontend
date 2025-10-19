import React from 'react';
import { Upload, FileText, Music, Play } from 'lucide-react';

/**
 * Card de progresso para tipos de arquivo sem preview visual
 */
const UploadProgressCard = ({ 
  type = 'file',
  progress = 0,
  className = ""
}) => {
  const getIconForType = () => {
    switch (type) {
      case 'audio': return <Music className="h-12 w-12 text-primary/70" />;
      case 'document': return <FileText className="h-12 w-12 text-primary/70" />;
      case 'video': return <Play className="h-12 w-12 text-primary/70" />;
      default: return <Upload className="h-12 w-12 text-primary/70" />;
    }
  };
  
  const getTypeLabel = () => {
    switch (type) {
      case 'audio': return 'áudio';
      case 'document': return 'documento';
      case 'video': return 'vídeo';
      case 'image': return 'imagem';
      default: return 'arquivo';
    }
  };

  return (
    <div className={`relative rounded-md border bg-muted/20 min-h-[200px] flex items-center justify-center ${className}`}>
      <div className="bg-background backdrop-blur-sm p-6 rounded-lg shadow-xl space-y-4 min-w-[260px] text-center border">
        <div className="space-y-2">
          <div className="flex items-center gap-2 justify-center">
            <Upload className="h-5 w-5 animate-pulse text-primary" />
            <span className="text-sm font-semibold">Enviando {getTypeLabel()}...</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Aguarde enquanto fazemos o upload<br/>
            para evitar erros na transferência
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

export { UploadProgressCard }; 