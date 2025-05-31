
import React, { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useClientVideos } from '@/hooks/useClientVideos';
import { ClientHeader } from './client/ClientHeader';
import { CategoryFilter } from './client/CategoryFilter';
import { VideoFilters } from './client/VideoFilters';
import { VideoGrid } from './client/VideoGrid';

export const ClientDashboard = () => {
  const { profile } = useAuth();
  const { videos, isLoading } = useClientVideos(profile?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Filtrar vídeos baseado na busca e categoria
  const filteredVideos = useMemo(() => {
    let filtered = videos;

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    return filtered;
  }, [videos, searchTerm, selectedCategory]);

  // Obter categorias disponíveis dos vídeos do cliente
  const availableCategories = useMemo(() => {
    const videoCategories = videos
      .map(video => video.category)
      .filter(category => category !== null && category !== undefined) as string[];
    
    return [...new Set(videoCategories)].sort();
  }, [videos]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com informações do cliente */}
      <ClientHeader profile={profile} videoCount={videos.length} />

      {/* Filtro de Categorias */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        availableCategories={availableCategories}
        videos={videos}
      />

      {/* Filtros e Busca */}
      <VideoFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        availableCategories={availableCategories}
        videos={videos}
      />

      {/* Lista de Vídeos */}
      <VideoGrid
        videos={filteredVideos}
        isLoading={isLoading}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};
