
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client';
import { getUserAuthInfo } from '@/services/emailNotificationService';

export const fetchClientsFromDB = async (): Promise<Client[]> => {
  console.log('clientDataService: Buscando clientes...');
  
  try {
    // Buscar profiles com informações de auth via join
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        logo_url,
        role,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });

    if (profilesError) {
      throw profilesError;
    }

    if (!profiles) {
      console.log('clientDataService: Nenhum perfil encontrado');
      return [];
    }

    // Para cada perfil, buscar informações de autenticação via função personalizada
    const clientsWithAuthInfo = await Promise.allSettled(
      profiles.map(async (profile) => {
        try {
          // Buscar informações de auth do usuário via função personalizada
          const authData = await getUserAuthInfo(profile.id);

          const client: Client = {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            logo_url: profile.logo_url,
            role: profile.role,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
            email_confirmed_at: authData?.email_confirmed_at || null,
            last_sign_in_at: authData?.last_sign_in_at || null,
            is_deleted: false
          };

          return client;
        } catch (error) {
          console.warn('Erro ao buscar informações de auth para usuário:', profile.id, error);
          // Retorna o cliente sem informações de auth se houver erro
          return {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            logo_url: profile.logo_url,
            role: profile.role,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
            email_confirmed_at: null,
            last_sign_in_at: null,
            is_deleted: false
          } as Client;
        }
      })
    );

    // Filtra apenas os resultados bem-sucedidos
    const successfulClients = clientsWithAuthInfo
      .filter((result): result is PromiseFulfilledResult<Client> => result.status === 'fulfilled')
      .map(result => result.value);

    console.log('clientDataService: Clientes encontrados:', successfulClients.length);
    return successfulClients;

  } catch (error) {
    console.error('clientDataService: Erro ao buscar clientes:', error);
    throw error;
  }
};
