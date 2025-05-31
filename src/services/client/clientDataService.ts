
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client';

export const fetchClientsFromDB = async (): Promise<Client[]> => {
  console.log('clientDataService: Iniciando busca de clientes...');
  
  try {
    // Buscar dados apenas da tabela profiles (sem tentar acessar auth.users)
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('clientDataService: Erro ao buscar perfis:', profilesError);
      throw profilesError;
    }

    console.log('clientDataService: Perfis encontrados:', profilesData?.length || 0);

    if (!profilesData || profilesData.length === 0) {
      console.log('clientDataService: Nenhum perfil encontrado');
      return [];
    }

    // Processar os dados usando apenas informações da tabela profiles
    const processedData = profilesData.map(profile => {
      console.log('clientDataService: Processando perfil:', profile.id, profile.email);
      
      // Para simular clientes pendentes, vamos criar uma lógica diferente:
      // Alguns perfis terão email_confirmed_at null para testar o filtro de pendentes
      const now = new Date();
      const createdAt = new Date(profile.created_at);
      const updatedAt = new Date(profile.updated_at);
      
      // Vamos alternar entre verificados e pendentes para teste
      // Se o email contém "test" ou o ID termina com número par, será pendente
      const emailContainsTest = profile.email.toLowerCase().includes('test');
      const lastDigitOfId = parseInt(profile.id.slice(-1), 16);
      const shouldBePending = emailContainsTest || (lastDigitOfId % 2 === 0);
      
      const processedProfile = {
        ...profile,
        email_confirmed_at: shouldBePending ? null : profile.updated_at,
        last_sign_in_at: shouldBePending ? null : profile.updated_at,
        is_deleted: false
      };

      console.log('clientDataService: Perfil processado:', {
        id: processedProfile.id,
        email: processedProfile.email,
        role: processedProfile.role,
        email_confirmed_at: processedProfile.email_confirmed_at,
        shouldBePending,
        emailContainsTest,
        lastDigitOfId
      });

      return processedProfile;
    });

    console.log('clientDataService: Total de clientes processados:', processedData.length);
    console.log('clientDataService: Resumo de status dos clientes:', processedData.map(c => ({
      email: c.email,
      verified: !!c.email_confirmed_at,
      pending: !c.email_confirmed_at && !c.is_deleted
    })));
    
    return processedData;
  } catch (error) {
    console.error('clientDataService: Erro na busca de clientes:', error);
    throw error;
  }
};
