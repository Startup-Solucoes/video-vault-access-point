
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AdminStats {
  totalClients: number;
  totalVideos: number;
  totalPermissions: number;
}

export const useAdminStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalClients: 0,
    totalVideos: 0,
    totalPermissions: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    console.log('📊 Buscando estatísticas administrativas...');

    try {
      // Buscar total de clientes
      const { count: clientsCount, error: clientsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (clientsError) {
        console.error('❌ Erro ao buscar clientes:', clientsError);
        throw clientsError;
      }

      // Buscar total de vídeos
      const { count: videosCount, error: videosError } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true });

      if (videosError) {
        console.error('❌ Erro ao buscar vídeos:', videosError);
        throw videosError;
      }

      // Buscar total de permissões ativas
      const { count: permissionsCount, error: permissionsError } = await supabase
        .from('video_permissions')
        .select('*', { count: 'exact', head: true });

      if (permissionsError) {
        console.error('❌ Erro ao buscar permissões:', permissionsError);
        throw permissionsError;
      }

      const newStats = {
        totalClients: clientsCount || 0,
        totalVideos: videosCount || 0,
        totalPermissions: permissionsCount || 0
      };

      console.log('✅ Estatísticas obtidas:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('💥 Erro ao buscar estatísticas:', error);
      setStats({
        totalClients: 0,
        totalVideos: 0,
        totalPermissions: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  // Função para forçar atualização manual
  const refreshStats = () => {
    fetchStats();
  };

  return {
    stats,
    isLoading,
    refreshStats
  };
};
