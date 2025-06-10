
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { VideoData } from './types';

export const useVideosData = () => {
  const { data: allVideos = [], isLoading } = useQuery({
    queryKey: ['all-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;
      return data as VideoData[];
    }
  });

  return { allVideos, isLoading };
};
