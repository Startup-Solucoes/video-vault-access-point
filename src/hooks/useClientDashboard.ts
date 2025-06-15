
import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useClientVideos } from '@/hooks/useClientVideos';
import { useClientAdvertisements } from '@/hooks/useClientAdvertisements';
import { ClientVideo } from '@/types/clientVideo';

export const useClientDashboard = () => {
  const { profile } = useAuth();
  const { videos: rawVideos, isLoading } = useClientVideos(profile?.id || '');
  const { advertisements } = useClientAdvertisements(profile?.id || '');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
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

  // Filter videos based on search, category and platform
  const filteredVideos = useMemo(() => {
    let filtered = videos;

    if (searchTerm) {
      filtered = filtered.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    if (selectedPlatform) {
      filtered = filtered.filter(video => video.platform === selectedPlatform);
    }

    return filtered;
  }, [videos, searchTerm, selectedCategory, selectedPlatform]);

  // Get available categories from client videos
  const availableCategories = useMemo(() => {
    const videoCategories = videos.map(video => video.category).filter(category => category !== null && category !== undefined) as string[];
    return [...new Set(videoCategories)].sort();
  }, [videos]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedPlatform('');
  };

  // Check if there are active filters - ensure this returns a boolean
  const hasActiveFilters = Boolean(searchTerm || selectedCategory || selectedPlatform);

  return {
    profile,
    videos,
    filteredVideos,
    advertisements,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedPlatform,
    setSelectedPlatform,
    showFilters,
    setShowFilters,
    availableCategories,
    clearAllFilters,
    hasActiveFilters
  };
};
