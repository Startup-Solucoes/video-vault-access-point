
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UseVideoViewingProps {
  videoId: string;
  isPlaying: boolean;
}

export const useVideoViewing = ({ videoId, isPlaying }: UseVideoViewingProps) => {
  const { profile } = useAuth();
  const [watchDuration, setWatchDuration] = useState(0);
  const [viewRecorded, setViewRecorded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Iniciar contagem quando o vídeo começar a reproduzir
  useEffect(() => {
    if (isPlaying && profile) {
      startTimeRef.current = Date.now();
      
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const currentDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setWatchDuration(currentDuration);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      startTimeRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, profile]);

  // Registrar visualização quando atingir 60 segundos
  useEffect(() => {
    const recordView = async () => {
      if (!profile || !videoId || viewRecorded) return;

      console.log('🎬 Registrando visualização:', { videoId, watchDuration });

      try {
        const { error } = await supabase
          .from('video_views')
          .insert({
            video_id: videoId,
            user_id: profile.id,
            watch_duration: watchDuration,
            is_valid_view: watchDuration >= 60,
            viewed_at: new Date().toISOString()
          });

        if (error) {
          console.error('Erro ao registrar visualização:', error);
        } else {
          console.log('✅ Visualização registrada com sucesso');
          setViewRecorded(true);
        }
      } catch (error) {
        console.error('Erro ao registrar visualização:', error);
      }
    };

    if (watchDuration >= 60 && !viewRecorded) {
      recordView();
    }
  }, [watchDuration, videoId, profile, viewRecorded]);

  // Limpar estado quando o vídeo mudar
  useEffect(() => {
    setWatchDuration(0);
    setViewRecorded(false);
    startTimeRef.current = null;
  }, [videoId]);

  return {
    watchDuration,
    viewRecorded,
    isValidView: watchDuration >= 60
  };
};
