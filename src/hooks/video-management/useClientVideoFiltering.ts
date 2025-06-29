
import { useState, useMemo } from 'react';
import { ClientVideoData } from '@/hooks/useClientVideos';

export const useClientVideoFiltering = (allVideos: ClientVideoData[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Extrair categorias únicas dos vídeos
  const availableCategories = useMemo(() => {
    const categories = allVideos
      .map(video => video.category)
      .filter((category): category is string => Boolean(category))
      .filter((category, index, arr) => arr.indexOf(category) === index)
      .sort();
    return categories;
  }, [allVideos]);

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
