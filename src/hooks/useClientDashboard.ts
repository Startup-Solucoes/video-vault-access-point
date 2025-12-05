
import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useClientVideos } from '@/hooks/useClientVideos';
import { useClientAdvertisements } from '@/hooks/useClientAdvertisements';
import { ClientVideo } from '@/types/clientVideo';

export const useClientDashboard = () => {
  const { profile } = useAuth();
  const { videos: rawVideos, isLoading } = useClientVideos(profile?.id || '');
  const { advertisements } = useClientAdvertisements(profile?.id || '');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Convert ClientVideoData to ClientVideo format
  const videos: ClientVideo[] = useMemo(() => {
    return rawVideos.map(video => ({
      ...video,
      description: video.description || '',
      category: video.category || 'Outros'
    }));
  }, [rawVideos]);

  // Filter videos based on search, categories and platform
  const filteredVideos = useMemo(() => {
    let filtered = videos;

    if (searchTerm) {
      filtered = filtered.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de múltiplas categorias
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(video => selectedCategories.includes(video.category));
    }

    if (selectedPlatform) {
      filtered = filtered.filter(video => video.platform === selectedPlatform);
    }

    return filtered;
  }, [videos, searchTerm, selectedCategories, selectedPlatform]);

  // Get available categories from client videos
  const availableCategories = useMemo(() => {
    const videoCategories = videos.map(video => video.category).filter(category => category !== null && category !== undefined) as string[];
    return [...new Set(videoCategories)].sort();
  }, [videos]);

  // Contagem de vídeos por categoria
  const videoCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    videos.forEach(video => {
      if (video.category) {
        counts[video.category] = (counts[video.category] || 0) + 1;
      }
    });
    return counts;
  }, [videos]);

  // Toggle de categoria individual
  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
  }, []);

  // Selecionar todas as categorias
  const selectAllCategories = useCallback(() => {
    setSelectedCategories(availableCategories);
  }, [availableCategories]);

  // Limpar categorias
  const clearCategories = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedPlatform('');
  };

  // Check if there are active filters
  const hasActiveFilters = Boolean(searchTerm || selectedCategories.length > 0 || selectedPlatform);

  return {
    profile,
    videos,
    filteredVideos,
    advertisements,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedCategories,
    toggleCategory,
    selectAllCategories,
    clearCategories,
    selectedPlatform,
    setSelectedPlatform,
    showFilters,
    setShowFilters,
    availableCategories,
    videoCategoryCounts,
    clearAllFilters,
    hasActiveFilters
  };
};
