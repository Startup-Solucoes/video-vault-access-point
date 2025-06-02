
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ClientFormData } from './clientFormValidation';
import { uploadClientLogo } from './logoUploadService';

export interface CreateUserParams {
  formData: ClientFormData;
  logoFile: File | null;
}

export const createUser = async ({ formData, logoFile }: CreateUserParams) => {
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
    logoUrl = await uploadClientLogo(logoFile, authData.user.id);
    
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

  return authData.user;
};

export const getErrorMessage = (error: any): string => {
  if (error.message?.includes('User already registered')) {
    return "Este e-mail já está cadastrado no sistema.";
  } else if (error.message?.includes('Invalid email')) {
    return "E-mail inválido. Verifique o formato do e-mail.";
  } else if (error.message?.includes('Password')) {
    return "Senha deve ter pelo menos 6 caracteres.";
  }
  
  return "Erro ao cadastrar usuário. Tente novamente.";
};
