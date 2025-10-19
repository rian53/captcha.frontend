import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/ui/dropzone';
import { Upload, X, AlertCircle, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { mediaService } from '@/services';
import { useImageUrl } from '@/hooks/useImageUrl';

const MediaUpload = ({ 
  onUploadComplete, 
  onRemove, 
  currentImageUrl = null,
  folder = 'notifications',
  className = '',
  disabled = false,
  maxSizeInMB = 10,
  accept = 'image/*',
  placeholder = 'Arraste uma imagem ou clique para selecionar'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const imageToShow = uploadedImageUrl || currentImageUrl;
  const displayUrl = useImageUrl(imageToShow);

  const handleFileUpload = useCallback(async (files) => {
    if (!files?.length) return;

    const file = files[0];
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      setError('Tipo de arquivo não suportado');
      setIsUploading(false);
      return;
    }

    try {
      const localPreview = URL.createObjectURL(file);
      setUploadedImageUrl(localPreview); // Preview temporário durante upload

      const result = await mediaService.uploadFileWithProgress(
        file,
        folder,
        (progress) => setUploadProgress(progress)
      );

      URL.revokeObjectURL(localPreview);
      setUploadedImageUrl(result.mediaUrl); // URL permanente
      
      toast.success('Upload realizado com sucesso!');
      
      if (onUploadComplete) {
        onUploadComplete({
          url: result.mediaUrl, // URL permanente para salvar no backend
          objectKey: result.objectKey,
          filename: file.name,
          size: file.size,
          type: file.type
        });
      }
    } catch (err) {
      setError(err.message || 'Erro no upload');
      toast.error('Falha no upload da imagem');
      setUploadedImageUrl(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [folder, maxSizeInMB, accept, onUploadComplete]);

  const handleRemove = useCallback(() => {
    if (uploadedImageUrl && uploadedImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedImageUrl);
    }
    setUploadedImageUrl(null);
    setError(null);
    if (onRemove) {
      onRemove();
    }
  }, [uploadedImageUrl, onRemove]);

  return (
    <div className={cn('space-y-2', className)}>
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {displayUrl ? (
        <div className="relative rounded-md border overflow-hidden bg-muted/20 p-2">
          <img 
            src={displayUrl} 
            alt="Preview" 
            className="max-h-[250px] w-full object-contain"
          />
          <Button 
            type="button" 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemove}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-background backdrop-blur-sm p-6 rounded-lg shadow-xl space-y-4 min-w-[260px] text-center border">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 justify-center">
                    <Upload className="h-5 w-5 animate-pulse text-primary" />
                    <span className="text-sm font-semibold">Enviando imagem...</span>
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
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="text-xs font-medium text-center text-foreground">
                    {Math.round(uploadProgress)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Dropzone
          onChange={handleFileUpload}
          accept={accept}
          disabled={disabled || isUploading}
          className="w-full"
          dropMessage={
            <div className="flex flex-col items-center justify-center gap-2 text-center p-6">
              {isUploading ? (
                <>
                  <Upload className="h-8 w-8 text-primary animate-pulse" />
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">Enviando imagem...</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Aguarde enquanto fazemos o upload<br/>
                      para evitar erros na transferência
                    </p>
                    {/* Barra de progresso customizada */}
                    <div className="space-y-2">
                      <div className="w-full max-w-xs bg-muted rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <div className="text-xs font-medium text-foreground">
                        {Math.round(uploadProgress)}%
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">{placeholder}</p>
                  <p className="text-xs text-muted-foreground">
                    {accept.replace('*', '').toUpperCase()} até {maxSizeInMB}MB
                  </p>
                </>
              )}
            </div>
          }
        />
      )}
    </div>
  );
};

export { MediaUpload }; 