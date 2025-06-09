
import React, { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, X, Image } from 'lucide-react';
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
      
      {/* Upload de arquivo */}
      <div className="space-y-2">
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
          <p className="text-sm text-gray-600">
            Arquivo selecionado: {uploadedFile.name}
          </p>
        )}
      </div>

      {/* OU separador */}
      <div className="flex items-center gap-2">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-sm text-gray-500 px-2">OU</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* URL da thumbnail */}
      <div className="space-y-2">
        <Label htmlFor="thumbnail_url">URL da Thumbnail</Label>
        <Input
          id="thumbnail_url"
          value={uploadedFile ? '' : value}
          onChange={(e) => {
            if (!uploadedFile) {
              onChange(e.target.value);
            }
          }}
          placeholder="https://..."
          disabled={!!uploadedFile}
        />
        <p className="text-xs text-gray-500">
          Insira uma URL de imagem ou faça upload de um arquivo
        </p>
      </div>

      {/* Preview da thumbnail */}
      {value && (
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="relative w-32 h-20 border border-gray-300 rounded overflow-hidden bg-gray-100">
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
