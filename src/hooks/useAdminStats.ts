
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      console.log('📊 Buscando estatísticas do admin...');

      // Buscar total de clientes
      const { count: totalClients } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'client')
        .eq('is_deleted', false);

      // Buscar clientes ativos (que têm permissões de vídeo)
      const { data: activeClientsData } = await supabase
        .from('video_permissions')
        .select('client_id')
        .not('client_id', 'is', null);

      const activeClients = new Set(activeClientsData?.map(p => p.client_id)).size;

      // Buscar total de vídeos
      const { count: totalVideos } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true });

      // Buscar vídeos criados este mês
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const { count: videosThisMonth } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', currentMonth.toISOString());

      // Buscar estatísticas de visualizações
      const { count: totalViews } = await supabase
        .from('video_views')
        .select('*', { count: 'exact', head: true })
        .eq('is_valid_view', true);

      // Buscar visualizações deste mês
      const { count: viewsThisMonth } = await supabase
        .from('video_views')
        .select('*', { count: 'exact', head: true })
        .eq('is_valid_view', true)
        .gte('viewed_at', currentMonth.toISOString());

      console.log('✅ Estatísticas carregadas:', {
        totalClients,
        activeClients,
        totalVideos,
        videosThisMonth,
        totalViews,
        viewsThisMonth
      });

      return {
        totalClients: totalClients || 0,
        activeClients,
        totalVideos: totalVideos || 0,
        videosThisMonth: videosThisMonth || 0,
        totalViews: totalViews || 0,
        viewsThisMonth: viewsThisMonth || 0
      };
    },
  });
};
