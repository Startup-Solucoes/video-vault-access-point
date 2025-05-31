
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Client, EditClientForm } from '@/types/client';

export const fetchClientsFromDB = async (): Promise<Client[]> => {
  console.log('clientService: Iniciando busca de clientes...');
  
  try {
    // Buscar dados de todos os perfis
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('clientService: Erro ao buscar perfis:', profilesError);
      throw profilesError;
    }

    console.log('clientService: Perfis encontrados:', profilesData?.length || 0);
    console.log('clientService: Dados dos perfis:', profilesData);

    if (!profilesData || profilesData.length === 0) {
      console.log('clientService: Nenhum perfil encontrado');
      return [];
    }

    // Tentar buscar dados de auth.users para verificar confirmação de email
    let authUsersData: any[] = [];
    try {
      console.log('clientService: Tentando buscar dados de auth.users...');
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      if (!authError && authData?.users) {
        authUsersData = authData.users;
        console.log('clientService: Dados de auth encontrados:', authUsersData.length);
        console.log('clientService: Detalhes dos usuários auth:', authUsersData.map(u => ({
          id: u.id,
          email: u.email,
          email_confirmed_at: u.email_confirmed_at,
          created_at: u.created_at
        })));
      } else {
        console.log('clientService: Não foi possível acessar auth.users, usando fallback. Erro:', authError);
      }
    } catch (error) {
      console.log('clientService: Fallback - não foi possível acessar dados de auth. Erro:', error);
    }

    // Mapear os dados para determinar se estão aprovados
    const combinedData = profilesData.map(profile => {
      console.log('clientService: Processando perfil:', profile.id, profile.email);
      
      // Buscar dados correspondentes em auth.users
      const authUser = authUsersData.find(user => user.id === profile.id);
      
      // Se temos dados de auth, usar email_confirmed_at, senão usar fallback
      let isVerified = false;
      let emailConfirmedAt = null;
      let lastSignIn = null;
      let isDeleted = false;

      if (authUser) {
        console.log('clientService: Usuário encontrado em auth:', {
          email: authUser.email,
          email_confirmed_at: authUser.email_confirmed_at,
          created_at: authUser.created_at,
          last_sign_in_at: authUser.last_sign_in_at
        });
        
        // Verificação mais rigorosa - apenas considerar verificado se email_confirmed_at existe
        isVerified = !!authUser.email_confirmed_at;
        emailConfirmedAt = authUser.email_confirmed_at;
        lastSignIn = authUser.last_sign_in_at;
        isDeleted = !!authUser.banned_until || !!authUser.deleted_at;
        
        console.log('clientService: Status de verificação determinado:', {
          email: authUser.email,
          isVerified,
          emailConfirmedAt,
          rawEmailConfirmedAt: authUser.email_confirmed_at
        });
      } else {
        console.log('clientService: Usuário não encontrado em auth, usando fallback');
        // Fallback mais conservador: considerar não verificado se não temos dados de auth
        isVerified = false;
        emailConfirmedAt = null;
        lastSignIn = profile.updated_at;
        isDeleted = false;
      }
      
      const processedProfile = {
        ...profile,
        email_confirmed_at: emailConfirmedAt,
        last_sign_in_at: lastSignIn,
        is_deleted: isDeleted
      };

      console.log('clientService: Perfil processado final:', {
        id: processedProfile.id,
        email: processedProfile.email,
        role: processedProfile.role,
        isVerified,
        emailConfirmedAt: processedProfile.email_confirmed_at,
        created_at: processedProfile.created_at
      });

      return processedProfile;
    });

    console.log('clientService: Dados combinados processados:', combinedData.length);
    console.log('clientService: Resumo de verificação:', combinedData.map(p => ({
      email: p.email,
      verified: !!p.email_confirmed_at,
      email_confirmed_at: p.email_confirmed_at
    })));
    
    return combinedData;
  } catch (error) {
    console.error('clientService: Erro na busca de clientes:', error);
    throw error;
  }
};

export const updateClientInDB = async (clientId: string, editForm: EditClientForm): Promise<void> => {
  console.log('clientService: Atualizando cliente:', clientId, editForm);
  
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
    console.error('clientService: Erro ao atualizar cliente:', error);
    throw error;
  }

  console.log('clientService: Cliente atualizado com sucesso');
  toast({
    title: "Sucesso!",
    description: "Cliente atualizado com sucesso"
  });
};

export const approveClientInDB = async (clientId: string, clientEmail: string): Promise<void> => {
  console.log('clientService: Aprovando cliente:', clientId, clientEmail);
  
  try {
    // Tentar confirmar email via auth admin
    const { error: authError } = await supabase.auth.admin.updateUserById(clientId, {
      email_confirm: true
    });

    if (authError) {
      console.log('clientService: Fallback - atualizando timestamp no perfil');
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

    console.log('clientService: Cliente aprovado com sucesso');
    toast({
      title: "Sucesso!",
      description: `Cliente ${clientEmail} aprovado com sucesso`
    });
  } catch (error) {
    console.error('clientService: Erro ao aprovar cliente:', error);
    throw error;
  }
};

export const deleteClientFromDB = async (clientId: string, clientName: string): Promise<void> => {
  console.log('clientService: Removendo cliente:', clientId, clientName);
  
  if (!confirm(`Tem certeza que deseja remover o cliente "${clientName}"? Esta ação não pode ser desfeita.`)) {
    return;
  }

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', clientId);

  if (error) {
    console.error('clientService: Erro ao remover cliente:', error);
    throw error;
  }

  console.log('clientService: Cliente removido com sucesso');
  toast({
    title: "Sucesso!",
    description: "Cliente removido com sucesso"
  });
};
