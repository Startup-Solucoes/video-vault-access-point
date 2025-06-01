
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
    defaultTTL: 3 * 60 * 1000,
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
    
    if (!forceRefresh) {
      const cachedData = get(cacheKey);
      if (cachedData) {
        console.log('🎯 Cache hit: permissões de vídeos');
        setVideoPermissions(cachedData);
        setIsLoadingPermissions(false);
        return;
      }
    }

    console.log('🔐 Buscando permissões de vídeos (OTIMIZADO)...');
    setIsLoadingPermissions(true);

    try {
      // Query otimizada com join para reduzir chamadas
      const { data: permissions, error: permissionsError } = await supabase
        .from('video_permissions')
        .select(`
          id,
          video_id,
          client_id,
          created_at,
          granted_by,
          profiles!video_permissions_client_id_fkey (
            id,
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100); // Limite para performance

      if (permissionsError) {
        console.error('❌ Erro ao buscar permissões:', permissionsError);
        throw permissionsError;
      }

      // Processar dados com join otimizado
      const permissionsWithClients: VideoPermission[] = permissions?.map(permission => ({
        id: permission.id,
        video_id: permission.video_id,
        client_id: permission.client_id,
        created_at: permission.created_at,
        granted_by: permission.granted_by,
        client: permission.profiles ? {
          id: permission.profiles.id,
          full_name: permission.profiles.full_name,
          email: permission.profiles.email
        } : null
      })) || [];

      console.log('✅ Permissões otimizadas encontradas:', permissionsWithClients.length);
      
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
