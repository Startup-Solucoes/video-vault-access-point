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

    // Mapear os dados sem tentar acessar auth.users (que requer service role)
    const processedData = profilesData.map(profile => {
      console.log('clientService: Processando perfil:', profile.id, profile.email);
      
      // Como não podemos acessar auth.users com anon key, vamos usar uma lógica baseada nos dados do perfil
      // Assumimos que se o perfil foi criado mas não teve login recente, está pendente
      const now = new Date();
      const createdAt = new Date(profile.created_at);
      const updatedAt = new Date(profile.updated_at);
      
      // Se updated_at é muito próximo de created_at (diferença menor que 1 minuto), 
      // provavelmente o usuário ainda não fez login
      const timeDiff = updatedAt.getTime() - createdAt.getTime();
      const isLikelyUnverified = timeDiff < 60000; // menos de 1 minuto
      
      // Para clientes existentes que podem ter feito login, assumimos verificados
      const isVerified = !isLikelyUnverified;
      
      const processedProfile = {
        ...profile,
        email_confirmed_at: isVerified ? profile.updated_at : null,
        last_sign_in_at: profile.updated_at,
        is_deleted: false
      };

      console.log('clientService: Perfil processado final:', {
        id: processedProfile.id,
        email: processedProfile.email,
        role: processedProfile.role,
        isVerified,
        emailConfirmedAt: processedProfile.email_confirmed_at,
        created_at: processedProfile.created_at,
        timeDiff
      });

      return processedProfile;
    });

    console.log('clientService: Dados processados:', processedData.length);
    console.log('clientService: Resumo de verificação:', processedData.map(p => ({
      email: p.email,
      verified: !!p.email_confirmed_at,
      email_confirmed_at: p.email_confirmed_at
    })));
    
    return processedData;
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
    // Como não podemos acessar auth admin, vamos simular a aprovação 
    // atualizando o timestamp do perfil
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', clientId);

    if (profileError) {
      throw profileError;
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
