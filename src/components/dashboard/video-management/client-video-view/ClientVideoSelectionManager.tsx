
import { useState, useMemo } from 'react';
import { ClientVideoData } from '@/hooks/useClientVideos';

interface ClientVideoSelectionManagerProps {
  videos: ClientVideoData[];
  currentPage: number;
  itemsPerPage: number;
}

export const useClientVideoSelection = ({ 
  videos, 
  currentPage, 
  itemsPerPage 
}: ClientVideoSelectionManagerProps) => {
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);

  // Cálculo da paginação
  const totalPages = Math.ceil(videos.length / itemsPerPage);
  const paginatedVideos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return videos.slice(startIndex, startIndex + itemsPerPage);
  }, [videos, currentPage, itemsPerPage]);

  const handleVideoSelect = (videoId: string, checked: boolean) => {
    if (checked) {
      setSelectedVideos(prev => [...prev, videoId]);
    } else {
      setSelectedVideos(prev => prev.filter(id => id !== videoId));
    }
  };

  const handleSelectAllVisible = () => {
    const visibleVideoIds = paginatedVideos.map(video => video.id);
    const allVisibleSelected = visibleVideoIds.every(id => selectedVideos.includes(id));
    
    if (allVisibleSelected) {
      // Remove apenas os vídeos visíveis da seleção
      setSelectedVideos(prev => prev.filter(id => !visibleVideoIds.includes(id)));
    } else {
      // Adiciona os vídeos visíveis que não estão selecionados
      setSelectedVideos(prev => {
        const newSelections = visibleVideoIds.filter(id => !prev.includes(id));
        return [...prev, ...newSelections];
      });
    }
  };

  const clearSelection = () => {
    setSelectedVideos([]);
  };

  const clearSelectionOnPageChange = () => {
    setSelectedVideos([]);
  };

  const allVisibleVideosSelected = paginatedVideos.length > 0 && 
    paginatedVideos.every(video => selectedVideos.includes(video.id));

  return {
    selectedVideos,
    paginatedVideos,
    totalPages,
    handleVideoSelect,
    handleSelectAllVisible,
    clearSelection,
    clearSelectionOnPageChange,
    allVisibleVideosSelected
  };
};
