import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Client, EditClientForm } from '@/types/client';

export const fetchClientsFromDB = async (): Promise<Client[]> => {
  console.log('Buscando todos os usuários...');
  
  // Buscar dados de todos os perfis (admin e client)
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (profilesError) {
    console.error('Erro ao buscar perfis:', profilesError);
    throw profilesError;
  }

  console.log('Dados brutos dos perfis:', profilesData);

  // Tentar buscar dados de auth.users para verificar confirmação de email
  let authUsersData: any[] = [];
  try {
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    if (!authError && authData?.users) {
      authUsersData = authData.users;
      console.log('Dados de auth.users obtidos:', authUsersData.length, 'usuários');
    } else {
      console.log('Não foi possível acessar auth.users, usando fallback');
    }
  } catch (error) {
    console.log('Erro ao acessar auth.users, usando fallback:', error);
  }

  // Mapear os dados para determinar se estão aprovados
  const combinedData = profilesData?.map(profile => {
    // Buscar dados correspondentes em auth.users
    const authUser = authUsersData.find(user => user.id === profile.id);
    
    // Se temos dados de auth, usar email_confirmed_at, senão usar fallback melhorado
    let isVerified = false;
    let emailConfirmedAt = null;
    let lastSignIn = null;
    let isDeleted = false;

    if (authUser) {
      isVerified = !!authUser.email_confirmed_at;
      emailConfirmedAt = authUser.email_confirmed_at;
      lastSignIn = authUser.last_sign_in_at;
      // Verificar se o usuário foi deletado (banned ou disabled)
      isDeleted = !!authUser.banned_until || !!authUser.deleted_at;
    } else {
      // Fallback melhorado: verificar se houve algum login (last_sign_in_at existe)
      // ou se o perfil foi atualizado significativamente após criação
      const createdAt = new Date(profile.created_at);
      const updatedAt = new Date(profile.updated_at);
      const timeDiff = updatedAt.getTime() - createdAt.getTime();
      
      // Considera verificado se:
      // 1. Teve algum update significativo (mais de 5 minutos após criação)
      // 2. Tem last_sign_in_at no perfil (se estivermos guardando essa info)
      isVerified = timeDiff > 5 * 60 * 1000; // 5 minutos
      emailConfirmedAt = isVerified ? profile.updated_at : null;
      lastSignIn = profile.updated_at || profile.created_at;
      isDeleted = false; // No fallback, assumimos que não está deletado
    }

    console.log(`Usuário ${profile.full_name}: role=${profile.role}, verified=${isVerified}, deleted=${isDeleted}, authUser=${!!authUser}`);
    
    return {
      ...profile,
      email_confirmed_at: emailConfirmedAt,
      last_sign_in_at: lastSignIn,
      is_deleted: isDeleted
    };
  }) || [];

  console.log('Usuários processados:', combinedData);
  return combinedData;
};

export const updateClientInDB = async (clientId: string, editForm: EditClientForm): Promise<void> => {
  console.log('Atualizando cliente:', clientId, editForm);
  
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: editForm.full_name,
      email: editForm.email,
      logo_url: editForm.logo_url || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', clientId);

  if (error) {
    console.error('Erro ao atualizar cliente:', error);
    throw error;
  }

  toast({
    title: "Sucesso!",
    description: "Cliente atualizado com sucesso"
  });
};

export const approveClientInDB = async (clientId: string, clientEmail: string): Promise<void> => {
  console.log('Aprovando cliente:', clientId);
  
  try {
    // Tentar confirmar email via auth admin
    const { error: authError } = await supabase.auth.admin.updateUserById(clientId, {
      email_confirm: true
    });

    if (authError) {
      console.log('Erro ao confirmar via auth admin, usando fallback:', authError);
      // Fallback: atualizar timestamp no perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId);

      if (profileError) {
        throw profileError;
      }
    }

    toast({
      title: "Sucesso!",
      description: `Cliente ${clientEmail} aprovado com sucesso`
    });
  } catch (error) {
    console.error('Erro ao aprovar cliente:', error);
    throw error;
  }
};

export const deleteClientFromDB = async (clientId: string, clientName: string): Promise<void> => {
  if (!confirm(`Tem certeza que deseja remover o cliente "${clientName}"? Esta ação não pode ser desfeita.`)) {
    return;
  }

  console.log('Removendo cliente:', clientId);
  
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', clientId);

  if (error) {
    console.error('Erro ao remover cliente:', error);
    throw error;
  }

  toast({
    title: "Sucesso!",
    description: "Cliente removido com sucesso"
  });
};
