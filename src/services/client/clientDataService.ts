
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client';
import { getUserAuthInfo } from '@/services/emailNotificationService';

export const fetchClientsFromDB = async (): Promise<Client[]> => {
  console.log('clientDataService: Buscando clientes (OTIMIZADO)...');
  
  try {
    // Query otimizada - incluindo logo_url que estava faltando
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        logo_url,
        role,
        created_at,
        updated_at,
        is_deleted
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (profilesError) {
      throw profilesError;
    }

    if (!profiles || profiles.length === 0) {
      console.log('clientDataService: Nenhum perfil encontrado');
      return [];
    }

    // Buscar informações de auth em lote quando necessário
    const clientsWithAuthInfo = await Promise.allSettled(
      profiles.map(async (profile) => {
        try {
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
            is_deleted: profile.is_deleted || false
          };

          return client;
        } catch (error) {
          console.warn('Erro ao buscar auth para usuário:', profile.id);
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
            is_deleted: profile.is_deleted || false
          } as Client;
        }
      })
    );

    const successfulClients = clientsWithAuthInfo
      .filter((result): result is PromiseFulfilledResult<Client> => result.status === 'fulfilled')
      .map(result => result.value);

    console.log('clientDataService: Clientes otimizados encontrados:', successfulClients.length);
    return successfulClients;

  } catch (error) {
    console.error('clientDataService: Erro ao buscar clientes:', error);
    throw error;
  }
};
