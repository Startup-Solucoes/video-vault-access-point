
export class FileConverter {
  private removeBackground: any;

  constructor() {
    // Lazy load do módulo de remoção de fundo
    this.initializeBackgroundRemoval();
  }

  private async initializeBackgroundRemoval() {
    try {
      const module = await import('./backgroundRemoval');
      this.removeBackground = module.removeBackground;
    } catch (error) {
      console.warn('Background removal not available:', error);
    }
  }

  async convert(file: File, outputFormat: string, progressCallback?: (progress: number) => void): Promise<Blob> {
    progressCallback?.(10);

    switch (outputFormat) {
      case 'jpg':
        return this.convertToJPG(file, progressCallback);
      case 'png':
        return this.convertToPNG(file, progressCallback);
      case 'webp':
        return this.convertToWebP(file, progressCallback);
      case 'pdf':
        return this.convertToPDF(file, progressCallback);
      case 'png-no-bg':
        return this.removeBackgroundAndConvert(file, progressCallback);
      default:
        throw new Error(`Formato não suportado: ${outputFormat}`);
    }
  }

  private async convertToJPG(file: File, progressCallback?: (progress: number) => void): Promise<Blob> {
    progressCallback?.(30);
    
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      progressCallback?.(100);
      return file;
    }

    return this.convertImageFormat(file, 'image/jpeg', progressCallback);
  }

  private async convertToPNG(file: File, progressCallback?: (progress: number) => void): Promise<Blob> {
    progressCallback?.(30);
    
    if (file.type === 'image/png') {
      progressCallback?.(100);
      return file;
    }

    return this.convertImageFormat(file, 'image/png', progressCallback);
  }

  private async convertToWebP(file: File, progressCallback?: (progress: number) => void): Promise<Blob> {
    progressCallback?.(30);
    
    if (file.type === 'image/webp') {
      progressCallback?.(100);
      return file;
    }

    return this.convertImageFormat(file, 'image/webp', progressCallback);
  }

  private async convertImageFormat(file: File, targetMimeType: string, progressCallback?: (progress: number) => void): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Não foi possível criar contexto do canvas'));
        return;
      }

      img.onload = () => {
        progressCallback?.(60);
        
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        // Para JPG, usar fundo branco
        if (targetMimeType === 'image/jpeg') {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        
        progressCallback?.(80);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              progressCallback?.(100);
              resolve(blob);
            } else {
              reject(new Error('Falha na conversão'));
            }
          },
          targetMimeType,
          0.9
        );
      };

      img.onerror = () => reject(new Error('Falha ao carregar imagem'));
      img.src = URL.createObjectURL(file);
    });
  }

  private async convertToPDF(file: File, progressCallback?: (progress: number) => void): Promise<Blob> {
    // Para conversão para PDF, vamos usar uma abordagem simples
    // Em um caso real, você poderia usar bibliotecas como jsPDF
    progressCallback?.(50);
    
    if (file.type === 'application/pdf') {
      progressCallback?.(100);
      return file;
    }

    // Para imagens, criar um PDF simples com a imagem
    return this.createPDFFromImage(file, progressCallback);
  }

  private async createPDFFromImage(file: File, progressCallback?: (progress: number) => void): Promise<Blob> {
    // Implementação simplificada - em produção, usar jsPDF ou similar
    progressCallback?.(80);
    
    // Por enquanto, retorna a imagem convertida para PNG
    const pngBlob = await this.convertImageFormat(file, 'image/png', progressCallback);
    
    progressCallback?.(100);
    return pngBlob;
  }

  private async removeBackgroundAndConvert(file: File, progressCallback?: (progress: number) => void): Promise<Blob> {
    if (!this.removeBackground) {
      await this.initializeBackgroundRemoval();
    }

    if (!this.removeBackground) {
      throw new Error('Remoção de fundo não disponível');
    }

    progressCallback?.(20);

    try {
      const img = await this.loadImage(file);
      progressCallback?.(40);
      
      const result = await this.removeBackground(img);
      progressCallback?.(100);
      
      return result;
    } catch (error) {
      throw new Error('Falha na remoção do fundo: ' + (error as Error).message);
    }
  }

  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
}
