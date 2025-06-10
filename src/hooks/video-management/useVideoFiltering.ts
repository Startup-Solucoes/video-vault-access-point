
import { useState, useMemo } from 'react';
import { VideoData } from './types';

export const useVideoFiltering = (allVideos: VideoData[]) => {
  const [videoSearchValue, setVideoSearchValue] = useState('');

  // Filtrar vídeos baseado no termo de busca
  const filteredVideos = useMemo(() => {
    if (!videoSearchValue.trim()) {
      return allVideos;
    }

    const searchLower = videoSearchValue.toLowerCase().trim();
    return allVideos.filter(video =>
      video.title.toLowerCase().includes(searchLower) ||
      video.description?.toLowerCase().includes(searchLower) ||
      video.category?.toLowerCase().includes(searchLower)
    );
  }, [allVideos, videoSearchValue]);

  return {
    videoSearchValue,
    setVideoSearchValue,
    filteredVideos
  };
};
