
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated?: () => void;
}

export const ClientForm = ({ open, onOpenChange, onClientCreated }: ClientFormProps) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

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

      setLogoFile(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (file: File, userId: string): Promise<string | null> => {
    try {
      console.log('Iniciando upload da logo para usuário:', userId);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('client-logos')
        .upload(fileName, file);

      if (error) {
        console.error('Erro no upload da logo:', error);
        throw error;
      }

      console.log('Logo enviada com sucesso:', data.path);

      const { data: { publicUrl } } = supabase.storage
        .from('client-logos')
        .getPublicUrl(fileName);

      console.log('URL pública da logo:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da logo:', error);
      return null;
    }
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do cliente é obrigatório",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Erro",
        description: "E-mail é obrigatório",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.password.trim()) {
      toast({
        title: "Erro",
        description: "Senha é obrigatória",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.confirmPassword.trim()) {
      toast({
        title: "Erro",
        description: "Confirmação de senha é obrigatória",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem. Verifique e tente novamente.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('=== INICIANDO CADASTRO DE CLIENTE ===');
      console.log('Dados do formulário:', {
        full_name: formData.full_name,
        email: formData.email,
        hasLogo: !!logoFile
      });
      
      // Criar usuário no Supabase Auth
      console.log('Criando usuário no Auth...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            role: 'client'
          }
        }
      });

      if (authError) {
        console.error('Erro na criação do usuário no Auth:', authError);
        throw authError;
      }

      if (!authData.user) {
        console.error('Usuário não foi criado - authData.user é null');
        throw new Error('Falha na criação do usuário');
      }

      console.log('Usuário criado no Auth com sucesso:', {
        id: authData.user.id,
        email: authData.user.email,
        emailConfirmed: authData.user.email_confirmed_at
      });

      // Aguardar um pouco para o trigger criar o perfil
      console.log('Aguardando criação do perfil...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificar se o perfil foi criado
      console.log('Verificando se o perfil foi criado...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Erro ao verificar perfil:', profileError);
        // Se o perfil não foi criado pelo trigger, criar manualmente
        console.log('Criando perfil manualmente...');
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            full_name: formData.full_name,
            role: 'client'
          });

        if (insertError) {
          console.error('Erro ao criar perfil manualmente:', insertError);
          throw insertError;
        }
        console.log('Perfil criado manualmente com sucesso');
      } else {
        console.log('Perfil encontrado:', profileData);
      }

      // Fazer upload da logo se foi selecionada
      let logoUrl = null;
      if (logoFile) {
        console.log('Fazendo upload da logo...');
        logoUrl = await uploadLogo(logoFile, authData.user.id);
        
        if (logoUrl) {
          console.log('Atualizando perfil com URL da logo...');
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ logo_url: logoUrl })
            .eq('id', authData.user.id);

          if (updateError) {
            console.error('Erro ao atualizar logo do perfil:', updateError);
          } else {
            console.log('Logo atualizada no perfil com sucesso');
          }
        }
      }

      console.log('=== CLIENTE CADASTRADO COM SUCESSO ===');
      
      // Mostrar mensagem de sucesso
      toast({
        title: "Sucesso!",
        description: `Cliente ${formData.full_name} cadastrado com sucesso`,
      });
      
      // Resetar formulário
      setFormData({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setLogoFile(null);
      setLogoPreview(null);
      
      // Chamar callback para atualizar lista de clientes
      if (onClientCreated) {
        console.log('Chamando callback para atualizar lista...');
        // Aguardar um pouco antes de atualizar a lista
        setTimeout(() => {
          onClientCreated();
        }, 500);
      }
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('=== ERRO NO CADASTRO ===');
      console.error('Erro completo:', error);
      console.error('Message:', error.message);
      console.error('Code:', error.code);
      
      let errorMessage = "Erro ao cadastrar cliente. Tente novamente.";
      
      if (error.message?.includes('User already registered')) {
        errorMessage = "Este e-mail já está cadastrado no sistema.";
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = "E-mail inválido. Verifique o formato do e-mail.";
      } else if (error.message?.includes('Password')) {
        errorMessage = "Senha deve ter pelo menos 6 caracteres.";
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client-name">Nome do Cliente *</Label>
            <Input
              id="client-name"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Digite o nome completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-email">E-mail *</Label>
            <Input
              id="client-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="cliente@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-password">Senha * (mínimo 6 caracteres)</Label>
            <Input
              id="client-password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-confirm-password">Confirmar Senha *</Label>
            <Input
              id="client-confirm-password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="••••••••"
              minLength={6}
              required
            />
            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-sm text-red-500">As senhas não coincidem</p>
            )}
          </div>

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

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar Cliente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
