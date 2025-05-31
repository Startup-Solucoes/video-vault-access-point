
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface ClientLogoUploadProps {
  logoFile: File | null;
  logoPreview: string | null;
  onLogoChange: (file: File | null, preview: string | null) => void;
}

export const ClientLogoUpload = ({ logoFile, logoPreview, onLogoChange }: ClientLogoUploadProps) => {
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) { // 500KB
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 500KB",
          variant: "destructive"
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem",
          variant: "destructive"
        });
        return;
      }

      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        onLogoChange(file, preview);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="client-logo">Logomarca (JPG/PNG, máx. 500KB)</Label>
      <Input
        id="client-logo"
        type="file"
        accept="image/*"
        onChange={handleLogoChange}
        className="cursor-pointer"
      />
      {logoPreview && (
        <div className="mt-2">
          <img
            src={logoPreview}
            alt="Preview da logo"
            className="w-24 h-24 object-contain border rounded-md"
          />
        </div>
      )}
    </div>
  );
};
