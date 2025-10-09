import React, { useState } from 'react';
import { ArrowLeft, Upload, Play, Download, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import JSZip from 'jszip';
import { toast } from '@/hooks/use-toast';

interface ImageFile {
  file: File;
  preview: string;
  originalSize: number;
  compressedSize?: number;
  status: 'pending' | 'compressing' | 'completed' | 'error';
  compressedBlob?: Blob;
}

interface ImageCompressorViewProps {
  onBack: () => void;
}

export const ImageCompressorView: React.FC<ImageCompressorViewProps> = ({ onBack }) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const imageFiles: ImageFile[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        imageFiles.push({
          file,
          preview: URL.createObjectURL(file),
          originalSize: file.size,
          status: 'pending'
        });
      }
    });

    setImages(prev => [...prev, ...imageFiles]);
    toast({
      title: "Imagens carregadas",
      description: `${imageFiles.length} imagem(ns) adicionada(s)`,
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const compressImage = async (imageFile: ImageFile): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível obter contexto do canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0);

        // Determinar o tipo de saída baseado no tipo original
        const outputType = imageFile.file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        
        // Tentar diferentes níveis de qualidade até atingir boa compressão
        let quality = 0.85;
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Se a compressão não reduziu o suficiente, tentar com qualidade menor
              if (blob.size >= imageFile.originalSize * 0.9 && quality > 0.6) {
                quality = 0.75;
                canvas.toBlob(
                  (blob2) => {
                    if (blob2) {
                      resolve(blob2);
                    } else {
                      reject(new Error('Falha na compressão'));
                    }
                  },
                  outputType,
                  quality
                );
              } else {
                resolve(blob);
              }
            } else {
              reject(new Error('Falha na compressão'));
            }
          },
          outputType,
          quality
        );
      };
      img.onerror = () => reject(new Error('Falha ao carregar imagem'));
      img.src = imageFile.preview;
    });
  };

  const handleCompress = async () => {
    if (images.length === 0) {
      toast({
        title: "Nenhuma imagem",
        description: "Adicione imagens antes de comprimir",
        variant: "destructive"
      });
      return;
    }

    setIsCompressing(true);
    setOverallProgress(0);

    const totalImages = images.length;
    let completed = 0;

    for (let i = 0; i < images.length; i++) {
      const imageFile = images[i];
      
      setImages(prev => {
        const newImages = [...prev];
        newImages[i].status = 'compressing';
        return newImages;
      });

      try {
        const compressedBlob = await compressImage(imageFile);
        
        setImages(prev => {
          const newImages = [...prev];
          newImages[i].status = 'completed';
          newImages[i].compressedSize = compressedBlob.size;
          newImages[i].compressedBlob = compressedBlob;
          return newImages;
        });

        completed++;
        setOverallProgress((completed / totalImages) * 100);
      } catch (error) {
        console.error('Erro ao comprimir imagem:', error);
        setImages(prev => {
          const newImages = [...prev];
          newImages[i].status = 'error';
          return newImages;
        });
        completed++;
        setOverallProgress((completed / totalImages) * 100);
      }
    }

    setIsCompressing(false);
    toast({
      title: "Compressão concluída!",
      description: `${completed} imagem(ns) processada(s)`,
    });
  };

  const handleDownloadZip = async () => {
    const completedImages = images.filter(img => img.status === 'completed' && img.compressedBlob);
    
    if (completedImages.length === 0) {
      toast({
        title: "Nenhuma imagem comprimida",
        description: "Comprima as imagens antes de baixar",
        variant: "destructive"
      });
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder('imagens_comprimidas');

    completedImages.forEach((imageFile, index) => {
      if (imageFile.compressedBlob) {
        const extension = imageFile.file.name.split('.').pop();
        const baseName = imageFile.file.name.replace(`.${extension}`, '');
        folder?.file(`${baseName}_compressed.${extension}`, imageFile.compressedBlob);
      }
    });

    toast({
      title: "Gerando arquivo ZIP...",
      description: "Por favor, aguarde",
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'imagens_comprimidas.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download iniciado!",
      description: "Arquivo ZIP gerado com sucesso",
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateSavings = (): { totalOriginal: number; totalCompressed: number; savings: number } => {
    const totalOriginal = images.reduce((sum, img) => sum + img.originalSize, 0);
    const totalCompressed = images.reduce((sum, img) => sum + (img.compressedSize || 0), 0);
    const savings = totalOriginal > 0 ? ((totalOriginal - totalCompressed) / totalOriginal) * 100 : 0;
    return { totalOriginal, totalCompressed, savings };
  };

  const stats = calculateSavings();
  const completedCount = images.filter(img => img.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Compressor de Imagens</h2>
            <p className="text-muted-foreground">Reduza o peso das suas imagens sem perder qualidade</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => document.getElementById('image-upload')?.click()}
            variant="outline"
            disabled={isCompressing}
          >
            <Upload className="h-4 w-4 mr-2" />
            Adicionar Imagens
          </Button>
          <Button
            onClick={handleCompress}
            disabled={images.length === 0 || isCompressing}
          >
            <Play className="h-4 w-4 mr-2" />
            {isCompressing ? 'Comprimindo...' : 'Comprimir'}
          </Button>
          <Button
            onClick={handleDownloadZip}
            disabled={completedCount === 0}
            variant="secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar ZIP
          </Button>
        </div>
      </div>

      <input
        type="file"
        id="image-upload"
        className="hidden"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
      />

      {images.length > 0 && (
        <Card className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Tamanho Original</p>
              <p className="text-2xl font-bold">{formatFileSize(stats.totalOriginal)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Tamanho Comprimido</p>
              <p className="text-2xl font-bold text-green-600">{formatFileSize(stats.totalCompressed)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Economia</p>
              <p className="text-2xl font-bold text-blue-600">{stats.savings.toFixed(1)}%</p>
            </div>
          </div>
          
          {isCompressing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso geral</span>
                <span>{completedCount} / {images.length}</span>
              </div>
              <Progress value={overallProgress} />
            </div>
          )}
        </Card>
      )}

      {images.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma imagem adicionada</h3>
            <p className="text-muted-foreground mb-4">
              Clique em "Adicionar Imagens" para começar
            </p>
            <Button onClick={() => document.getElementById('image-upload')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Adicionar Imagens
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageFile, index) => (
            <Card key={index} className="p-4 relative">
              <Button
                onClick={() => removeImage(index)}
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
                disabled={isCompressing}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-muted">
                <img
                  src={imageFile.preview}
                  alt={imageFile.file.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-xs font-medium truncate" title={imageFile.file.name}>
                  {imageFile.file.name}
                </p>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Original:</span>
                  <span>{formatFileSize(imageFile.originalSize)}</span>
                </div>
                
                {imageFile.compressedSize && (
                  <div className="flex justify-between text-xs text-green-600 font-medium">
                    <span>Comprimido:</span>
                    <span>{formatFileSize(imageFile.compressedSize)}</span>
                  </div>
                )}
                
                <div className="pt-2">
                  {imageFile.status === 'pending' && (
                    <div className="text-xs text-muted-foreground">Aguardando...</div>
                  )}
                  {imageFile.status === 'compressing' && (
                    <div className="text-xs text-blue-600">Comprimindo...</div>
                  )}
                  {imageFile.status === 'completed' && (
                    <div className="text-xs text-green-600 font-medium">
                      ✓ Concluído ({((1 - (imageFile.compressedSize! / imageFile.originalSize)) * 100).toFixed(1)}% menor)
                    </div>
                  )}
                  {imageFile.status === 'error' && (
                    <div className="text-xs text-destructive">✗ Erro ao comprimir</div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
