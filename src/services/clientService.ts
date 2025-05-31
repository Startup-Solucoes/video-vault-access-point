
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Client, EditClientForm } from '@/types/client';

export const fetchClientsFromDB = async (): Promise<Client[]> => {
  console.log('Buscando todos os clientes...');
  
  // Buscar dados dos perfis
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'client')
    .order('created_at', { ascending: false });

  if (profilesError) {
    console.error('Erro ao buscar perfis:', profilesError);
    throw profilesError;
  }

  console.log('Dados brutos dos perfis:', profilesData);

  // Mapear os dados para determinar se estão aprovados
  // Um cliente é considerado aprovado se updated_at for diferente de created_at
  const combinedData = profilesData?.map(profile => {
    const isApproved = profile.updated_at !== profile.created_at;
    console.log(`Cliente ${profile.full_name}: created_at=${profile.created_at}, updated_at=${profile.updated_at}, isApproved=${isApproved}`);
    
    return {
      ...profile,
      email_confirmed_at: isApproved ? profile.updated_at : null,
      last_sign_in_at: profile.updated_at || profile.created_at
    };
  }) || [];

  console.log('Clientes processados:', combinedData);
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
  
  // Aprovar cliente atualizando o timestamp para ser diferente do created_at
  const { error } = await supabase
    .from('profiles')
    .update({
      updated_at: new Date().toISOString()
    })
    .eq('id', clientId);

  if (error) {
    console.error('Erro ao aprovar cliente:', error);
    throw error;
  }

  toast({
    title: "Sucesso!",
    description: `Cliente ${clientEmail} aprovado com sucesso`
  });
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
