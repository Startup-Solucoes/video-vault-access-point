
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client';

export const fetchClientsFromDB = async (): Promise<Client[]> => {
  console.log('clientDataService: Iniciando busca de clientes...');
  
  try {
    // Buscar dados da tabela profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('clientDataService: Erro ao buscar perfis:', profilesError);
      throw profilesError;
    }

    console.log('clientDataService: Perfis encontrados:', profilesData?.length || 0);
    console.log('clientDataService: Dados completos dos perfis:', profilesData);

    if (!profilesData || profilesData.length === 0) {
      console.log('clientDataService: Nenhum perfil encontrado');
      return [];
    }

    // Processar os dados dos perfis
    const processedData = profilesData.map(profile => {
      console.log('clientDataService: Processando perfil:', profile.id, profile.email, profile.role);
      
      const processedProfile = {
        ...profile,
        // Simular dados de verificação usando dados reais disponíveis
        email_confirmed_at: profile.updated_at, // Usar updated_at como indicador de verificação
        last_sign_in_at: profile.updated_at,
        is_deleted: false
      };

      console.log('clientDataService: Perfil processado:', {
        id: processedProfile.id,
        email: processedProfile.email,
        full_name: processedProfile.full_name,
        role: processedProfile.role,
        email_confirmed_at: processedProfile.email_confirmed_at
      });

      return processedProfile;
    });

    console.log('clientDataService: Total de clientes processados:', processedData.length);
    console.log('clientDataService: Resumo de clientes:', processedData.map(c => ({
      email: c.email,
      role: c.role,
      verified: !!c.email_confirmed_at
    })));
    
    return processedData;
  } catch (error) {
    console.error('clientDataService: Erro na busca de clientes:', error);
    throw error;
  }
};
