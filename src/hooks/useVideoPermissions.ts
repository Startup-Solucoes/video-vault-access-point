
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCache } from '@/hooks/useCache';

interface VideoPermission {
  id: string;
  video_id: string;
  client_id: string;
  created_at: string;
  granted_by: string;
  client: {
    id: string;
    full_name: string;
    email: string;
  } | null;
}

export const useVideoPermissions = () => {
  const { user } = useAuth();
  const { get, set, invalidatePattern } = useCache<VideoPermission[]>({
    defaultTTL: 3 * 60 * 1000, // 3 minutos para permissões
    maxSize: 50
  });
  
  const [videoPermissions, setVideoPermissions] = useState<VideoPermission[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  const fetchVideoPermissions = async (forceRefresh = false) => {
    if (!user) {
      setIsLoadingPermissions(false);
      return;
    }

    const cacheKey = `video_permissions_${user.id}`;
    
    // Tentar buscar do cache primeiro, a menos que seja refresh forçado
    if (!forceRefresh) {
      const cachedData = get(cacheKey);
      if (cachedData) {
        console.log('🎯 Usando permissões de vídeos do cache');
        setVideoPermissions(cachedData);
        setIsLoadingPermissions(false);
        return;
      }
    }

    console.log('🔐 Buscando permissões de vídeos do banco...');
    setIsLoadingPermissions(true);

    try {
      // Buscar permissões primeiro
      const { data: permissions, error: permissionsError } = await supabase
        .from('video_permissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (permissionsError) {
        console.error('❌ Erro ao buscar permissões:', permissionsError);
        throw permissionsError;
      }

      // Buscar dados dos clientes separadamente
      const clientIds = permissions?.map(p => p.client_id) || [];
      
      if (clientIds.length === 0) {
        console.log('✅ Nenhuma permissão encontrada');
        const emptyResult: VideoPermission[] = [];
        set(cacheKey, emptyResult);
        setVideoPermissions(emptyResult);
        return;
      }

      const { data: clients, error: clientsError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', clientIds);

      if (clientsError) {
        console.error('❌ Erro ao buscar clientes:', clientsError);
        throw clientsError;
      }

      // Combinar os dados
      const permissionsWithClients: VideoPermission[] = permissions?.map(permission => {
        const client = clients?.find(c => c.id === permission.client_id) || null;
        return {
          ...permission,
          client
        };
      }) || [];

      console.log('✅ Permissões encontradas:', permissionsWithClients.length);
      
      // Armazenar no cache
      set(cacheKey, permissionsWithClients);
      setVideoPermissions(permissionsWithClients);
    } catch (error) {
      console.error('💥 Erro no useVideoPermissions:', error);
      setVideoPermissions([]);
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  useEffect(() => {
    fetchVideoPermissions();
  }, [user]);

  // Função para forçar atualização manual
  const refreshVideoPermissions = () => {
    if (user) {
      invalidatePattern(`video_permissions_${user.id}`);
    }
    fetchVideoPermissions(true);
  };

  return {
    videoPermissions,
    isLoadingPermissions,
    refreshVideoPermissions
  };
};
