
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Client, EditClientForm } from '@/types/client';

export const fetchClientsFromDB = async (): Promise<Client[]> => {
  // Buscar dados de todos os perfis (admin e client)
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (profilesError) {
    console.error('Erro ao buscar perfis:', profilesError);
    throw profilesError;
  }

  // Tentar buscar dados de auth.users para verificar confirmação de email
  let authUsersData: any[] = [];
  try {
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    if (!authError && authData?.users) {
      authUsersData = authData.users;
    }
  } catch (error) {
    // Fallback silencioso se não conseguir acessar auth.users
  }

  // Mapear os dados para determinar se estão aprovados
  const combinedData = profilesData?.map(profile => {
    // Buscar dados correspondentes em auth.users
    const authUser = authUsersData.find(user => user.id === profile.id);
    
    // Se temos dados de auth, usar email_confirmed_at, senão usar fallback
    let isVerified = false;
    let emailConfirmedAt = null;
    let lastSignIn = null;
    let isDeleted = false;

    if (authUser) {
      isVerified = !!authUser.email_confirmed_at;
      emailConfirmedAt = authUser.email_confirmed_at;
      lastSignIn = authUser.last_sign_in_at;
      isDeleted = !!authUser.banned_until || !!authUser.deleted_at;
    } else {
      // Fallback: verificar se houve algum update significativo após criação
      const createdAt = new Date(profile.created_at);
      const updatedAt = new Date(profile.updated_at);
      const timeDiff = updatedAt.getTime() - createdAt.getTime();
      
      // Considera verificado se teve update significativo (mais de 1 minuto após criação)
      isVerified = timeDiff > 60 * 1000; // 1 minuto
      emailConfirmedAt = isVerified ? profile.updated_at : null;
      lastSignIn = isVerified ? profile.updated_at : null;
      isDeleted = false;
    }
    
    return {
      ...profile,
      email_confirmed_at: emailConfirmedAt,
      last_sign_in_at: lastSignIn,
      is_deleted: isDeleted
    };
  }) || [];

  return combinedData;
};

export const updateClientInDB = async (clientId: string, editForm: EditClientForm): Promise<void> => {
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
  try {
    // Tentar confirmar email via auth admin
    const { error: authError } = await supabase.auth.admin.updateUserById(clientId, {
      email_confirm: true
    });

    if (authError) {
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
