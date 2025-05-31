
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface VideoPermission {
  id: string;
  video_id: string;
  client_id: string;
  created_at: string;
  granted_by: string;
  client?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export const useVideoPermissions = () => {
  const { user } = useAuth();
  const [videoPermissions, setVideoPermissions] = useState<VideoPermission[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  useEffect(() => {
    const fetchVideoPermissions = async () => {
      if (!user) {
        setIsLoadingPermissions(false);
        return;
      }

      console.log('🔐 Buscando permissões de vídeos...');

      try {
        const { data, error } = await supabase
          .from('video_permissions')
          .select(`
            *,
            client:profiles!video_permissions_client_id_fkey(
              id,
              full_name,
              email
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Erro ao buscar permissões:', error);
          throw error;
        }

        console.log('✅ Permissões encontradas:', data?.length || 0);
        console.log('Dados das permissões:', data);
        
        setVideoPermissions(data || []);
      } catch (error) {
        console.error('💥 Erro no useVideoPermissions:', error);
        setVideoPermissions([]);
      } finally {
        setIsLoadingPermissions(false);
      }
    };

    fetchVideoPermissions();
  }, [user]);

  return {
    videoPermissions,
    isLoadingPermissions
  };
};
