
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client';

export const fetchClientsFromDB = async (): Promise<Client[]> => {
  console.log('clientDataService: Buscando TODOS os clientes (incluindo deletados para debug)...');
  
  try {
    // Query otimizada - REMOVENDO o filtro de is_deleted para pegar todos
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
      .order('created_at', { ascending: false });

    if (profilesError) {
      throw profilesError;
    }

    if (!profiles || profiles.length === 0) {
      console.log('clientDataService: Nenhum perfil encontrado');
      return [];
    }

    console.log('clientDataService: Perfis encontrados:', {
      total: profiles.length,
      deletados: profiles.filter(p => p.is_deleted).length,
      ativos: profiles.filter(p => !p.is_deleted).length
    });

    // Processar perfis diretamente sem buscar dados de auth
    const clients: Client[] = profiles.map((profile) => ({
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      logo_url: profile.logo_url,
      role: profile.role,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      last_sign_in_at: null, // Removido - não precisamos mais desta informação
      is_deleted: profile.is_deleted || false
    }));

    console.log('clientDataService: Clientes processados:', {
      total: clients.length,
      deletados: clients.filter(c => c.is_deleted).length,
      ativos: clients.filter(c => !c.is_deleted).length
    });

    return clients;

  } catch (error) {
    console.error('clientDataService: Erro ao buscar clientes:', error);
    throw error;
  }
};
