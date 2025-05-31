
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client';

export const fetchClientsFromDB = async (): Promise<Client[]> => {
  console.log('clientDataService: Iniciando busca de clientes...');
  
  try {
    // Buscar dados de todos os perfis
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('clientDataService: Erro ao buscar perfis:', profilesError);
      throw profilesError;
    }

    console.log('clientDataService: Perfis encontrados:', profilesData?.length || 0);
    console.log('clientDataService: Dados dos perfis:', profilesData);

    if (!profilesData || profilesData.length === 0) {
      console.log('clientDataService: Nenhum perfil encontrado');
      return [];
    }

    // Mapear os dados sem tentar acessar auth.users (que requer service role)
    const processedData = profilesData.map(profile => {
      console.log('clientDataService: Processando perfil:', profile.id, profile.email);
      
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

      console.log('clientDataService: Perfil processado final:', {
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

    console.log('clientDataService: Dados processados:', processedData.length);
    console.log('clientDataService: Resumo de verificação:', processedData.map(p => ({
      email: p.email,
      verified: !!p.email_confirmed_at,
      email_confirmed_at: p.email_confirmed_at
    })));
    
    return processedData;
  } catch (error) {
    console.error('clientDataService: Erro na busca de clientes:', error);
    throw error;
  }
};
