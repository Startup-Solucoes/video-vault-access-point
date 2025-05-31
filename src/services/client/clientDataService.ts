
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client';

export const fetchClientsFromDB = async (): Promise<Client[]> => {
  console.log('=== DIAGNÓSTICO COMPLETO DE CLIENTES ===');
  
  try {
    // Primeiro, verificar usuário atual
    const { data: currentUser } = await supabase.auth.getUser();
    console.log('Usuário atual logado:', {
      id: currentUser.user?.id,
      email: currentUser.user?.email,
      role: currentUser.user?.user_metadata?.role
    });

    // Tentar buscar TODOS os perfis sem filtros
    console.log('1. Testando busca SEM filtros...');
    const { data: allProfilesRaw, error: allError, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    console.log('Resultado busca sem filtros:', {
      data: allProfilesRaw,
      error: allError,
      count: count,
      length: allProfilesRaw?.length || 0
    });

    if (allError) {
      console.error('Erro na busca sem filtros:', allError);
      
      // Tentar busca com campos específicos
      console.log('2. Testando busca com campos específicos...');
      const { data: specificFields, error: specificError } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at, updated_at');

      console.log('Resultado busca com campos específicos:', {
        data: specificFields,
        error: specificError,
        length: specificFields?.length || 0
      });

      if (specificError) {
        console.error('Erro na busca com campos específicos:', specificError);
        throw specificError;
      }

      if (specificFields && specificFields.length > 0) {
        console.log('Usando dados da busca com campos específicos');
        return specificFields.map(profile => ({
          ...profile,
          email_confirmed_at: profile.updated_at,
          last_sign_in_at: profile.updated_at,
          is_deleted: false
        }));
      }
    } else {
      console.log('Busca sem filtros funcionou!');
      console.log('Perfis encontrados:', allProfilesRaw);
      
      if (allProfilesRaw && allProfilesRaw.length > 0) {
        const processedProfiles = allProfilesRaw.map(profile => {
          console.log('Processando perfil:', {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            role: profile.role
          });
          
          return {
            ...profile,
            email_confirmed_at: profile.updated_at,
            last_sign_in_at: profile.updated_at,
            is_deleted: false
          };
        });
        
        console.log('Perfis processados final:', processedProfiles);
        return processedProfiles;
      }
    }

    // Se chegou até aqui, tentar verificar se há dados na tabela usando count
    console.log('3. Verificando se existem dados na tabela...');
    const { count: totalCount, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    console.log('Total de registros na tabela profiles:', {
      count: totalCount,
      error: countError
    });

    // Tentar buscar da tabela auth.users para comparar (se permitido)
    console.log('4. Tentando verificar usuários na tabela auth...');
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      console.log('Usuários na tabela auth:', {
        data: authUsers,
        error: authError,
        count: authUsers?.users?.length || 0
      });
    } catch (authErr) {
      console.log('Não foi possível acessar auth.users (esperado):', authErr);
    }

    console.log('=== FIM DO DIAGNÓSTICO ===');
    console.log('Retornando lista vazia - nenhum perfil encontrado');
    return [];
    
  } catch (error) {
    console.error('Erro geral no diagnóstico:', error);
    throw error;
  }
};
