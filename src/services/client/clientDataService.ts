
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
      
      // Lógica simples para determinar se está verificado:
      // Se o perfil foi atualizado muito tempo depois de criado, assumimos que fez login
      const now = new Date();
      const createdAt = new Date(profile.created_at);
      const updatedAt = new Date(profile.updated_at);
      
      // Se a diferença entre updated_at e created_at for maior que 1 minuto,
      // assumimos que o usuário fez login (está verificado)
      const timeDiff = updatedAt.getTime() - createdAt.getTime();
      const isVerified = timeDiff > 60000; // mais de 1 minuto
      
      const processedProfile = {
        ...profile,
        email_confirmed_at: isVerified ? profile.updated_at : null,
        last_sign_in_at: profile.updated_at,
        is_deleted: false
      };

      console.log('clientDataService: Perfil processado:', {
        id: processedProfile.id,
        email: processedProfile.email,
        role: processedProfile.role,
        isVerified,
        timeDiff: `${timeDiff}ms`
      });

      return processedProfile;
    });

    console.log('clientDataService: Total de clientes processados:', processedData.length);
    
    return processedData;
  } catch (error) {
    console.error('clientDataService: Erro na busca de clientes:', error);
    throw error;
  }
};
