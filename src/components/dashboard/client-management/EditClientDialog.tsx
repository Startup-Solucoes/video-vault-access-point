import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';
import { Client, EditClientForm } from '@/types/client';

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onSave: (clientId: string, editForm: EditClientForm) => void;
}

export const EditClientDialog = ({
  open,
  onOpenChange,
  client,
  onSave
}: EditClientDialogProps) => {
  const [editForm, setEditForm] = useState<EditClientForm>({
    full_name: '',
    email: '',
    logo_url: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (client && open) {
      console.log('🔍 EditClientDialog - Cliente selecionado:', {
        id: client.id,
        full_name: client.full_name,
        email: client.email,
        logo_url: client.logo_url
      });
      
      setEditForm({
        full_name: client.full_name || '',
        email: client.email || '',
        logo_url: client.logo_url || ''
      });
      setLogoFile(null);
      setLogoPreview(null);
    }
  }, [client, open]);

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

  const uploadLogo = async (file: File, clientId: string): Promise<string | null> => {
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
    if (!client) return;

    if (!editForm.full_name.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (!editForm.email.trim()) {
      toast({
        title: "Erro",
        description: "Email é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      let logoUrl = editForm.logo_url;

      // Se há um novo arquivo de logo, fazer upload
      if (logoFile) {
        const uploadedUrl = await uploadLogo(logoFile, client.id);
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        } else {
          throw new Error('Falha no upload da logo');
        }
      }

      const finalEditForm: EditClientForm = {
        full_name: editForm.full_name.trim(),
        email: editForm.email.trim(),
        logo_url: logoUrl || ''
      };

      console.log('💾 Salvando cliente:', client.id, finalEditForm);
      onSave(client.id, finalEditForm);
      onOpenChange(false);

      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso"
      });

    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error);
      toast({
        title: "Erro",
        description: `Erro ao salvar: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setEditForm(prev => ({ ...prev, logo_url: '' }));
  };

  if (!client) {
    console.log('⚠️ EditClientDialog - Cliente não disponível');
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome Completo *</Label>
            <Input
              id="edit-name"
              value={editForm.full_name}
              onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Nome completo do cliente"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email Principal *</Label>
            <Input
              id="edit-email"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@exemplo.com"
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
              {(logoPreview || editForm.logo_url) && (
                <div className="relative inline-block">
                  <img
                    src={logoPreview || editForm.logo_url}
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