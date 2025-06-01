
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AdminStats {
  totalClients: number;
  activeClients: number;
  totalVideos: number;
  videosThisMonth: number;
  totalPermissions: number;
}

export const useAdminStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalClients: 0,
    activeClients: 0,
    totalVideos: 0,
    videosThisMonth: 0,
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
        .select('*', { count: 'exact', head: true })
        .eq('role', 'client');

      if (clientsError) {
        console.error('❌ Erro ao buscar clientes:', clientsError);
        throw clientsError;
      }

      // Buscar clientes ativos (que têm permissões de vídeo)
      const { data: activeClientsData, error: activeClientsError } = await supabase
        .from('video_permissions')
        .select('client_id', { count: 'exact' });

      if (activeClientsError) {
        console.error('❌ Erro ao buscar clientes ativos:', activeClientsError);
        throw activeClientsError;
      }

      // Contar clientes únicos com permissões
      const uniqueActiveClients = new Set(activeClientsData?.map(p => p.client_id) || []).size;

      // Buscar total de vídeos
      const { count: videosCount, error: videosError } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true });

      if (videosError) {
        console.error('❌ Erro ao buscar vídeos:', videosError);
        throw videosError;
      }

      // Buscar vídeos criados este mês
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: videosThisMonthCount, error: videosThisMonthError } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      if (videosThisMonthError) {
        console.error('❌ Erro ao buscar vídeos deste mês:', videosThisMonthError);
        throw videosThisMonthError;
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
        activeClients: uniqueActiveClients,
        totalVideos: videosCount || 0,
        videosThisMonth: videosThisMonthCount || 0,
        totalPermissions: permissionsCount || 0
      };

      console.log('✅ Estatísticas obtidas:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('💥 Erro ao buscar estatísticas:', error);
      setStats({
        totalClients: 0,
        activeClients: 0,
        totalVideos: 0,
        videosThisMonth: 0,
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
