
export class FileConverter {
  private removeBackground: any;
  private pdfjs: any;

  constructor() {
    // Lazy load do módulo de remoção de fundo
    this.initializeBackgroundRemoval();
    // Lazy load do PDF.js
    this.initializePDFJS();
  }

  private async initializeBackgroundRemoval() {
    try {
      const module = await import('./backgroundRemoval');
      this.removeBackground = module.removeBackground;
    } catch (error) {
      console.warn('Background removal not available:', error);
    }
  }

  private async initializePDFJS() {
    try {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;
      this.pdfjs = pdfjs;
    } catch (error) {
      console.warn('PDF.js not available:', error);
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

    // Se for PDF, converter usando PDF.js
    if (file.type === 'application/pdf') {
      return this.convertPDFToImage(file, 'image/jpeg', progressCallback);
    }

    return this.convertImageFormat(file, 'image/jpeg', progressCallback);
  }

  private async convertToPNG(file: File, progressCallback?: (progress: number) => void): Promise<Blob> {
    progressCallback?.(30);
    
    if (file.type === 'image/png') {
      progressCallback?.(100);
      return file;
    }

    // Se for PDF, converter usando PDF.js
    if (file.type === 'application/pdf') {
      return this.convertPDFToImage(file, 'image/png', progressCallback);
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

  private async convertPDFToImage(file: File, targetMimeType: string, progressCallback?: (progress: number) => void): Promise<Blob> {
    if (!this.pdfjs) {
      await this.initializePDFJS();
    }

    if (!this.pdfjs) {
      throw new Error('PDF.js não disponível');
    }

    progressCallback?.(40);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await this.pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      progressCallback?.(60);
      
      // Renderizar a primeira página
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2.0 }); // Scale 2.0 para melhor qualidade
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Não foi possível criar contexto do canvas');
      }
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      progressCallback?.(80);
      
      await page.render({
        canvasContext: ctx,
        viewport: viewport
      }).promise;
      
      progressCallback?.(90);
      
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              progressCallback?.(100);
              resolve(blob);
            } else {
              reject(new Error('Falha na conversão do PDF'));
            }
          },
          targetMimeType,
          0.9
        );
      });
    } catch (error) {
      throw new Error('Falha na conversão do PDF: ' + (error as Error).message);
    }
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
