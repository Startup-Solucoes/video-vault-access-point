
import { useState, useMemo } from 'react';
import { ClientVideoData } from '@/hooks/useClientVideos';
import { categories } from '@/components/forms/video-form/VideoFormTypes';

export const useClientVideoFiltering = (allVideos: ClientVideoData[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Usar todas as categorias disponíveis no sistema
  const availableCategories = useMemo(() => {
    return categories.sort();
  }, []);

  // Filtrar vídeos baseado nos critérios
  const filteredVideos = useMemo(() => {
    return allVideos.filter(video => {
      // Filtro de busca
      const matchesSearch = !searchTerm.trim() || 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de categoria
      const matchesCategory = !selectedCategory || video.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allVideos, searchTerm, selectedCategory]);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    showFilters,
    setShowFilters,
    availableCategories,
    filteredVideos
  };
};
