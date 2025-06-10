
import { useState } from 'react';
import { VideoData } from './types';

export const useVideoSelection = () => {
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);

  const handleVideoSelect = (videoId: string, checked: boolean) => {
    if (checked) {
      setSelectedVideos(prev => [...prev, videoId]);
    } else {
      setSelectedVideos(prev => prev.filter(id => id !== videoId));
    }
  };

  const handleSelectAllVisible = (currentPageVideos: VideoData[]) => {
    const currentPageVideoIds = currentPageVideos.map(video => video.id);
    const allCurrentSelected = currentPageVideoIds.every(id => selectedVideos.includes(id));
    
    if (allCurrentSelected) {
      setSelectedVideos(prev => prev.filter(id => !currentPageVideoIds.includes(id)));
    } else {
      setSelectedVideos(prev => [...new Set([...prev, ...currentPageVideoIds])]);
    }
  };

  const clearSelectedVideos = () => {
    setSelectedVideos([]);
  };

  return {
    selectedVideos,
    handleVideoSelect,
    handleSelectAllVisible,
    clearSelectedVideos
  };
};
