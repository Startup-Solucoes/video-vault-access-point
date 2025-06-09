
import React, { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ThumbnailUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export const ThumbnailUpload: React.FC<ThumbnailUploadProps> = ({
  value,
  onChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem",
        variant: "destructive"
      });
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Criar URL temporária para preview
      const tempUrl = URL.createObjectURL(file);
      setUploadedFile(file);
      onChange(tempUrl);
      
      toast({
        title: "Sucesso",
        description: "Imagem carregada com sucesso",
      });
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar a imagem",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label>Thumbnail</Label>
      
      {/* Observações sobre a imagem */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Observações importantes:</p>
            <ul className="space-y-1 text-xs">
              <li>• Tamanho recomendado: 1280x720 pixels (16:9)</li>
              <li>• Formatos aceitos: JPG, PNG, GIF</li>
              <li>• Tamanho máximo: 5MB</li>
              <li>• Use imagens de alta qualidade para melhor visualização</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upload de arquivo */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isUploading ? 'Carregando...' : 'Selecionar Imagem'}
          </Button>
          
          {uploadedFile && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              Remover
            </Button>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {uploadedFile && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Arquivo selecionado: {uploadedFile.name}
            </p>
            <p className="text-xs text-gray-600">
              Tamanho: {formatFileSize(uploadedFile.size)}
            </p>
          </div>
        )}
      </div>

      {/* Preview da thumbnail */}
      {value && (
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="relative w-40 h-24 border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={value}
              alt="Preview da thumbnail"
              className="w-full h-full object-cover"
              onError={() => {
                toast({
                  title: "Erro",
                  description: "Não foi possível carregar a imagem",
                  variant: "destructive"
                });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
