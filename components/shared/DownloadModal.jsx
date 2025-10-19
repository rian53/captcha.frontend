import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Download,
  Eye,
  FileText,
  Video,
  Image as ImageIcon,
  MoreVertical,
  File,
  FolderOpen,
  CheckSquare,
  Square
} from "lucide-react";
import { useImageUrl } from "@/hooks/useImageUrl";
import { useZipDownload } from "@/hooks/useZipDownload";
import { mediaService } from "@/services";
import { toast } from "sonner";

const DownloadModal = ({ 
  offer, 
  isOpen, 
  onOpenChange, 
  triggerButton 
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  // Hook para download em ZIP
  const { isDownloading, downloadProgress, currentFile, downloadAsZip } = useZipDownload();

  // Função para extrair objectKey de uma URL do DigitalOcean Spaces
  const extractObjectKey = (url) => {
    if (!url || typeof url !== 'string') return null;
    
    try {
      const cleanUrl = url.trim();
      
      // Verificar se a URL começa com protocolo
      let validUrl = cleanUrl;
      if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
        validUrl = 'https://' + validUrl;
      }
      
      const urlObj = new URL(validUrl);
      let objectKey = urlObj.pathname.substring(1); // Remove o "/" inicial

      // Decodificar para garantir chave correta
      try {
        objectKey = decodeURIComponent(objectKey);
      } catch (_) {}
      
      // Se a URL contém o nome do bucket, remover ele
      if (objectKey.includes('/')) {
        const parts = objectKey.split('/');
        if (parts[0] && !parts[0].includes('.')) {
          // Se a primeira parte não contém ponto, provavelmente é o bucket name
          objectKey = parts.slice(1).join('/');
        }
      }
      
      return objectKey;
    } catch (error) {
      console.error('Erro ao extrair objectKey:', error);
      return null;
    }
  };

  // Função para obter extensão do arquivo
  const getFileExtension = (url, contentType) => {
    try {
      const urlPath = new URL(url).pathname;
      const match = urlPath.match(/\.([^./?]+)(?:\?|$)/);
      if (match) return `.${match[1]}`;
    } catch (e) {}

    const mimeMap = {
      'video/mp4': '.mp4',
      'video/avi': '.avi',
      'video/mov': '.mov',
      'text/plain': '.txt',
      'application/pdf': '.pdf',
      'application/zip': '.zip',
      'application/x-rar-compressed': '.rar',
      'text/html': '.html',
      'application/octet-stream': ''
    };

    return mimeMap[contentType] || '';
  };

  // Função para detectar tipo de arquivo pela URL
  const detectFileType = (url) => {
    if (!url || typeof url !== 'string') return 'document';
    
    try {
      // Limpar URL e extrair extensão
      const cleanUrl = url.trim();
      let validUrl = cleanUrl;
      if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
        validUrl = 'https://' + validUrl;
      }
      
      const urlObj = new URL(validUrl);
      const pathname = urlObj.pathname.toLowerCase();
      
      // Extensões de vídeo
      const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v', '.3gp', '.ogv'];
      // Extensões de imagem
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.ico'];
      // Extensões de documento
      const documentExtensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt'];
      
      // Verificar se termina com alguma extensão de vídeo
      if (videoExtensions.some(ext => pathname.endsWith(ext))) {
        return 'video';
      }
      
      // Verificar se termina com alguma extensão de imagem
      if (imageExtensions.some(ext => pathname.endsWith(ext))) {
        return 'image';
      }
      
      // Verificar se termina com alguma extensão de documento
      if (documentExtensions.some(ext => pathname.endsWith(ext))) {
        return 'document';
      }
      
      // Se não conseguir detectar, retorna documento como padrão
      return 'document';
    } catch (error) {
      console.warn('Erro ao detectar tipo de arquivo:', error);
      return 'document';
    }
  };

  // Função para obter URL assinada se necessário
  const getSignedUrl = async (url) => {
    // Se a URL já está assinada ou não é do DigitalOcean Spaces, retornar como está
    if (!url || !url.includes('digitaloceanspaces.com') || url.includes('X-Amz-Signature')) {
      return url;
    }

    try {
      const objectKey = extractObjectKey(url);
      if (!objectKey) {
        console.warn('Não foi possível extrair objectKey da URL:', url);
        return url;
      }

      const result = await mediaService.getPresignedDownloadUrl(objectKey, 7 * 24 * 60 * 60); // 7 dias
      return result?.getUrl || url;
    } catch (error) {
      console.error('Erro ao obter URL assinada:', error);
      return url; // Fallback para URL original
    }
  };



  // Função para download individual
  const handleDownload = async (url, baseFilename) => {
    try {
      // Obter URL assinada se necessário
      const signedUrl = await getSignedUrl(url);
      
      const response = await fetch(signedUrl);
      const blob = await response.blob();
      const contentType = response.headers.get('content-type') || blob.type;
      const extension = getFileExtension(url, contentType);
      const filename = baseFilename + extension;
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      try {
        // Tentar com URL assinada diretamente
        const signedUrl = await getSignedUrl(url);
        const extension = getFileExtension(url, '');
        const link = document.createElement('a');
        link.href = signedUrl;
        link.download = baseFilename + extension;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackError) {
        console.error('Erro no fallback de download:', fallbackError);
        // Último recurso: URL original
        const extension = getFileExtension(url, '');
        const link = document.createElement('a');
        link.href = url;
        link.download = baseFilename + extension;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  // Função para processar múltiplas URLs com suporte a nomes
  const processMultipleUrls = (urls) => {
    if (!urls) return [];
    
    // Se já é um array (dados já parseados pelo backend)
    if (Array.isArray(urls)) {
      return urls.filter(item => item && (item.url || item.name));
    }
    
    // Se é uma string, tentar fazer parse
    if (typeof urls === 'string') {
      try {
        const parsed = JSON.parse(urls);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name !== undefined) {
          return parsed.filter(item => item && (item.url || item.name));
        }
      } catch {
        // Fallback para string com vírgulas (estrutura antiga)
        return urls.split(',').map(url => url.trim()).filter(url => url).map((url, index) => ({ 
          name: '', 
          url 
        }));
      }
    }
    
    return [];
  };

  // Função para baixar múltiplos arquivos
  const handleDownloadMultiple = async (files) => {
    for (const file of files) {
      await handleDownload(file.url, file.filename);
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay entre downloads
    }
  };

  // Função para baixar todos os arquivos em ZIP
  const handleDownloadAll = async () => {
    try {
      if (availableFiles.length === 0) {
        toast.error('Nenhum arquivo disponível para download');
        return;
      }

      // Usar URLs originais para download - o downloadAsZip vai lidar com as assinaturas
      const zipName = `${offer?.name || 'oferta'}_arquivos.zip`;
      await downloadAsZip(availableFiles, zipName);
    } catch (error) {
      console.error('Erro ao baixar arquivos:', error);
    }
  };

  // Função para baixar arquivos selecionados em ZIP
  const handleDownloadSelected = async () => {
    try {
      const selectedFileObjects = availableFiles.filter(file => selectedFiles.includes(file.id));
      
      if (selectedFileObjects.length === 0) {
        toast.error('Nenhum arquivo selecionado para download');
        return;
      }

      const zipName = `${offer?.name || 'oferta'}_selecionados.zip`;
      await downloadAsZip(selectedFileObjects, zipName);
    } catch (error) {
      console.error('Erro ao baixar arquivos selecionados:', error);
    }
  };

  // Função para visualizar arquivo
  const handleViewFile = async (url) => {
    try {
      const signedUrl = await getSignedUrl(url);
      window.open(signedUrl, '_blank');
    } catch (error) {
      console.error('Erro ao visualizar arquivo:', error);
      // Fallback para URL original
      window.open(url, '_blank');
    }
  };

  // Função para alternar seleção de arquivo
  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  // Função para selecionar/desselecionar todos
  const toggleSelectAll = () => {
    if (selectedFiles.length === availableFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(availableFiles.map(file => file.id));
    }
  };

  // Memoizar arquivos disponíveis para evitar recálculos desnecessários
  const availableFiles = useMemo(() => {
    const files = [];
    
    // VSL (suporte a múltiplos arquivos)
    if (offer?.urlVSL) {
      const vslFiles = processMultipleUrls(offer.urlVSL);
      vslFiles.forEach((file, index) => {
        if (file.url) {
          const detectedType = detectFileType(file.url);
          const icon = detectedType === 'video' ? Video : detectedType === 'image' ? ImageIcon : FileText;
          
          files.push({
            id: `vsl-${index}`,
            name: file.name && file.name.trim() ? file.name : `VSL ${index + 1}`,
            description: detectedType === 'video' ? 'Vídeo de Vendas (VSL)' : detectedType === 'image' ? 'Imagem VSL' : 'Arquivo VSL',
            url: file.url,
            filename: file.name || `VSL-${index + 1}-${offer.name}`,
            icon: icon,
            type: detectedType,
            preview: (detectedType === 'video' || detectedType === 'image') ? file.url : null
          });
        }
      });
    }
    
    // Criativos (suporte a múltiplos arquivos)
    if (offer?.creative) {
      const creativeFiles = processMultipleUrls(offer.creative);
      creativeFiles.forEach((file, index) => {
        if (file.url) {
          const detectedType = detectFileType(file.url);
          const icon = detectedType === 'video' ? Video : detectedType === 'image' ? ImageIcon : FileText;
          
          files.push({
            id: `creative-${index}`,
            name: file.name && file.name.trim() ? file.name : `Creative ${index + 1}`,
            description: detectedType === 'video' ? 'Vídeo criativo da campanha' : detectedType === 'image' ? 'Imagem criativa da campanha' : 'Material criativo da campanha',
            url: file.url,
            filename: file.name || `Creative-${index + 1}-${offer.name}`,
            icon: icon,
            type: detectedType,
            preview: (detectedType === 'video' || detectedType === 'image') ? file.url : null
          });
        }
      });
    }
    
    // Transcrições (suporte a múltiplos arquivos)
    if (offer?.transcription) {
      const transcriptionFiles = processMultipleUrls(offer.transcription);
      transcriptionFiles.forEach((file, index) => {
        if (file.url) {
          const detectedType = detectFileType(file.url);
          const icon = detectedType === 'video' ? Video : detectedType === 'image' ? ImageIcon : FileText;
          
          files.push({
            id: `transcription-${index}`,
            name: file.name && file.name.trim() ? file.name : `Transcrição ${index + 1}`,
            description: detectedType === 'video' ? 'Vídeo de transcrição' : detectedType === 'image' ? 'Imagem de transcrição' : 'Transcrição do VSL',
            url: file.url,
            filename: file.name || `Transcricao-${index + 1}-${offer.name}`,
            icon: icon,
            type: detectedType,
            preview: (detectedType === 'video' || detectedType === 'image') ? file.url : null
          });
        }
      });
    }
    
    // Páginas HTML (suporte a múltiplos arquivos)
    if (offer?.htmlPage) {
      const htmlFiles = processMultipleUrls(offer.htmlPage);
      htmlFiles.forEach((file, index) => {
        if (file.url) {
          const detectedType = detectFileType(file.url);
          const icon = detectedType === 'video' ? Video : detectedType === 'image' ? ImageIcon : File;
          
          files.push({
            id: `html-${index}`,
            name: file.name && file.name.trim() ? file.name : `Página HTML ${index + 1}`,
            description: detectedType === 'video' ? 'Vídeo da página' : detectedType === 'image' ? 'Imagem da página' : 'Arquivo HTML da página',
            url: file.url,
            filename: file.name || `HTML-${index + 1}-${offer.name}`,
            icon: icon,
            type: detectedType === 'document' ? 'html' : detectedType,
            preview: (detectedType === 'video' || detectedType === 'image') ? file.url : null
          });
        }
      });
    }

    // Imagem da oferta
    // if (offer?.image && displayImageUrl) {
    //   files.push({
    //     id: 'image',
    //     name: 'Imagem da Oferta',
    //     description: 'Imagem principal da oferta',
    //     url: displayImageUrl,
    //     filename: `Imagem-${offer.name}`,
    //     icon: ImageIcon,
    //     type: 'image',
    //     preview: displayImageUrl
    //   });
    // }
    
    return files;
  }, [offer]);

  // Componente para preview lazy de imagens e vídeos
  const LazyPreview = React.memo(({ file, className }) => {
    const [shouldLoad, setShouldLoad] = useState(false);
    const [hasIntersected, setHasIntersected] = useState(false);
    const elementRef = useRef(null);
    
    // Usar useImageUrl apenas para URLs que precisam de assinatura e quando devem ser carregadas
    const displayUrl = useImageUrl(
      shouldLoad && (file.type === 'image' || file.type === 'video') ? file.url : null
    );
    
    // Intersection Observer para carregamento lazy
    useEffect(() => {
      if (!elementRef.current || hasIntersected) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setHasIntersected(true);
            setShouldLoad(true);
            observer.disconnect();
          }
        },
        { rootMargin: '50px' }
      );
      
      observer.observe(elementRef.current);
      
      return () => observer.disconnect();
    }, [hasIntersected]);
    
    const IconComponent = file.icon;
    
    return (
      <div ref={elementRef} className={cn("relative", className)}>
        {!shouldLoad || !displayUrl ? (
          // Mostrar ícone enquanto não carrega
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            {shouldLoad && (file.type === 'image' || file.type === 'video') ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            ) : (
              <IconComponent className="size-12 text-muted-foreground" />
            )}
          </div>
        ) : file.type === 'image' ? (
          <Image
            src={displayUrl}
            alt={file.name}
            fill
            className="object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling && e.target.nextSibling.style) {
                e.target.nextSibling.style.display = 'flex';
              }
            }}
          />
        ) : file.type === 'video' ? (
          <video
            src={displayUrl}
            className="w-full h-full object-cover"
            controls={false}
            muted
            playsInline
            preload="metadata"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling && e.target.nextSibling.style) {
                e.target.nextSibling.style.display = 'flex';
              }
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <IconComponent className="size-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Fallback para caso de erro */}
        <div className="hidden absolute inset-0 bg-muted items-center justify-center">
          <IconComponent className="size-12 text-muted-foreground" />
        </div>
      </div>
    );
  });

  // Componente do card de arquivo
  const FileCard = React.memo(({ file }) => {
    const IconComponent = file.icon;
    const isSelected = selectedFiles.includes(file.id);
    
    return (
      <Card className={cn(
        "group hover:shadow-lg transition-all duration-200",
        isSelected && "ring-2 ring-primary"
      )}>
        <CardContent className="p-4">
          <div className="aspect-video relative bg-muted rounded-lg overflow-hidden mb-3">
            <LazyPreview 
              file={file} 
              className="absolute inset-0"
            />
            
            {/* Checkbox de seleção */}
            <div className="absolute top-2 left-2 z-10">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => toggleFileSelection(file.id)}
                className="bg-white/90 border-2"
              />
            </div>
            
            {/* Menu de 3 pontos */}
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleViewFile(file.url)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver arquivo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload(file.url, file.filename)}>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar arquivo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">{file.name}</h4>
              {isSelected && <CheckSquare className="size-4 text-primary" />}
            </div>
            <p className="text-xs text-muted-foreground">{file.description}</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={() => handleViewFile(file.url)}
              >
                <Eye className="mr-1 h-3 w-3" />
                Ver
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={() => handleDownload(file.url, file.filename)}
              >
                <Download className="mr-1 h-3 w-3" />
                Baixar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  });

  // Limpar seleções ao fechar modal
  const handleModalChange = (open) => {
    onOpenChange(open);
    if (!open) {
      setSelectedFiles([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalChange}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FolderOpen className="size-6" />
            Central de Downloads - {offer?.name}
          </DialogTitle>
        </DialogHeader>
        
        {availableFiles.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSelectAll}
                className="gap-2"
              >
                {selectedFiles.length === availableFiles.length ? (
                  <CheckSquare className="size-4" />
                ) : (
                  <Square className="size-4" />
                )}
                {selectedFiles.length === availableFiles.length ? 'Desselecionar Todos' : 'Selecionar Todos'}
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedFiles.length} de {availableFiles.length} selecionado(s)
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadAll}
                disabled={isDownloading || availableFiles.length === 0}
                className="gap-2"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Baixando... ({downloadProgress}%)
                  </>
                ) : (
                  <>
                    <Download className="size-4" />
                    Baixar Tudo ({availableFiles.length})
                  </>
                )}
              </Button>
              {selectedFiles.length > 0 && (
                <Button
                  size="sm"
                  onClick={handleDownloadSelected}
                  disabled={isDownloading}
                  className="gap-2"
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Baixando... ({downloadProgress}%)
                    </>
                  ) : (
                    <>
                      <Download className="size-4" />
                      Baixar Selecionados ({selectedFiles.length})
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Barra de progresso do download */}
        {isDownloading && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Baixando arquivos...</span>
              <span className="text-sm text-muted-foreground">{downloadProgress}%</span>
            </div>
            <div className="w-full bg-background rounded-full h-2 mb-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
            {currentFile && (
              <p className="text-xs text-muted-foreground truncate">
                {currentFile}
              </p>
            )}
          </div>
        )}
        
        <div className="mt-6">
          {availableFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableFiles.map((file) => (
                <FileCard key={file.id} file={file} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <File className="size-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum arquivo disponível</h3>
              <p className="text-muted-foreground">
                Esta oferta não possui arquivos para download no momento.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadModal;
