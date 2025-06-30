
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit2, Upload, X } from 'lucide-react';

interface EditClientInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
  clientLogoUrl?: string;
  onClientUpdated: (newName: string, newLogoUrl?: string) => void;
}

export const EditClientInfoDialog = ({
  open,
  onOpenChange,
  clientId,
  clientName,
  clientLogoUrl,
  onClientUpdated
}: EditClientInfoDialogProps) => {
  const [formData, setFormData] = useState({
    full_name: clientName,
    logo_url: clientLogoUrl || ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        full_name: clientName,
        logo_url: clientLogoUrl || ''
      });
      setLogoFile(null);
      setLogoPreview(null);
    }
  }, [open, clientName, clientLogoUrl]);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setLogoFile(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${clientId}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('client-logos')
        .upload(fileName, file);

      if (error) {
        console.error('Erro no upload da logo:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('client-logos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da logo:', error);
      return null;
    }
  };

  const handleSave = async () => {
    if (!formData.full_name.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      let logoUrl = formData.logo_url;

      // Se há um novo arquivo de logo, fazer upload
      if (logoFile) {
        const uploadedUrl = await uploadLogo(logoFile);
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        } else {
          throw new Error('Falha no upload da logo');
        }
      }

      // Atualizar dados do cliente no banco
      const updateData = {
        full_name: formData.full_name.trim(),
        logo_url: logoUrl || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', clientId);

      if (error) {
        console.error('Erro ao atualizar cliente:', error);
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Informações do cliente atualizadas com sucesso"
      });

      // Notificar componente pai sobre a atualização
      onClientUpdated(formData.full_name.trim(), logoUrl || undefined);
      onOpenChange(false);

    } catch (error: any) {
      console.error('Erro ao salvar informações:', error);
      toast({
        title: "Erro",
        description: `Erro ao salvar informações: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setFormData(prev => ({ ...prev, logo_url: '' }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Informações do Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="client-name">Nome do Cliente *</Label>
            <Input
              id="client-name"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Nome do cliente"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-logo">Logo do Cliente</Label>
            <div className="space-y-3">
              <Input
                id="client-logo"
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                className="cursor-pointer"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">
                JPG/PNG, máximo 500KB
              </p>

              {/* Preview da logo atual ou nova */}
              {(logoPreview || formData.logo_url) && (
                <div className="relative inline-block">
                  <img
                    src={logoPreview || formData.logo_url}
                    alt="Preview da logo"
                    className="w-24 h-24 object-contain border rounded-md bg-gray-50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearLogo}
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-white border-gray-300"
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
