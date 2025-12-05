
import { useState, useMemo, useCallback } from 'react';
import { ClientVideoData } from '@/hooks/useClientVideos';
import { categories } from '@/components/forms/video-form/VideoFormTypes';

export const useClientVideoFiltering = (allVideos: ClientVideoData[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Usar todas as categorias disponíveis no sistema
  const availableCategories = useMemo(() => {
    return categories.sort();
  }, []);

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
    setSelectedCategories([...availableCategories]);
  }, [availableCategories]);

  // Limpar todas as categorias
  const clearCategories = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  // Filtrar vídeos baseado nos critérios
  const filteredVideos = useMemo(() => {
    return allVideos.filter(video => {
      // Filtro de busca
      const matchesSearch = !searchTerm.trim() || 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de categoria - se nenhuma selecionada, mostra todas
      const matchesCategory = selectedCategories.length === 0 || 
        (video.category && selectedCategories.includes(video.category));

      return matchesSearch && matchesCategory;
    });
  }, [allVideos, searchTerm, selectedCategories]);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategories,
    setSelectedCategories,
    toggleCategory,
    selectAllCategories,
    clearCategories,
    showFilters,
    setShowFilters,
    availableCategories,
    filteredVideos
  };
};
