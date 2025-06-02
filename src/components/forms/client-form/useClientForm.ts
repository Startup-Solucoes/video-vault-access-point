
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ClientFormData, validateClientForm } from './clientFormValidation';

export const useClientForm = (onClientCreated?: () => void, onOpenChange?: (open: boolean) => void) => {
  const [formData, setFormData] = useState<ClientFormData>({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'client'
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: 'client'
    });
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleLogoChange = (file: File | null, preview: string | null) => {
    setLogoFile(file);
    setLogoPreview(preview);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateClientForm(formData)) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('=== INICIANDO CADASTRO DE USUÁRIO ===');
      console.log('Dados do formulário:', {
        full_name: formData.full_name,
        email: formData.email,
        userType: formData.userType,
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
            role: formData.userType
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
        userType: formData.userType,
        emailConfirmed: authData.user.email_confirmed_at
      });

      // Aguardar um pouco para o trigger criar o perfil
      console.log('Aguardando criação do perfil pelo trigger...');
      await new Promise(resolve => setTimeout(resolve, 2000));

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
            // Não vamos falhar o cadastro por causa da logo
            console.log('Continuando sem a logo...');
          } else {
            console.log('Logo atualizada no perfil com sucesso');
          }
        }
      }

      console.log('=== USUÁRIO CADASTRADO COM SUCESSO ===');
      
      // Mostrar mensagem de sucesso
      const userTypeLabel = formData.userType === 'admin' ? 'Administrador' : 'Cliente';
      toast({
        title: "Sucesso!",
        description: `${userTypeLabel} ${formData.full_name} cadastrado com sucesso`,
      });
      
      // Resetar formulário
      resetForm();
      
      // Chamar callback para atualizar lista de usuários
      if (onClientCreated) {
        console.log('Chamando callback para atualizar lista...');
        // Aguardar um pouco antes de atualizar a lista
        setTimeout(() => {
          onClientCreated();
        }, 1000);
      }
      
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error('=== ERRO NO CADASTRO ===');
      console.error('Erro completo:', error);
      console.error('Message:', error.message);
      console.error('Code:', error.code);
      
      let errorMessage = "Erro ao cadastrar usuário. Tente novamente.";
      
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

  return {
    formData,
    setFormData,
    logoFile,
    logoPreview,
    isLoading,
    handleSubmit,
    handleLogoChange
  };
};
