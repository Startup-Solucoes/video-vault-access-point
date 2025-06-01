
import React, { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useClientVideos } from '@/hooks/useClientVideos';
import { ClientHeader } from './client/ClientHeader';
import { CategoryFilter } from './client/CategoryFilter';
import { VideoFilters } from './client/VideoFilters';
import { VideoGrid } from './client/VideoGrid';
import { PlatformFilter } from './client/PlatformFilter';
import { format } from 'date-fns';

export const ClientDashboard = () => {
  const { profile } = useAuth();
  const { videos, isLoading } = useClientVideos(profile?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Filtrar vídeos baseado na busca, categoria, plataforma e data
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

    // Filtrar por plataforma
    if (selectedPlatform) {
      filtered = filtered.filter(video => video.platform === selectedPlatform);
    }

    // Filtrar por data de publicação
    if (selectedDate) {
      const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
      filtered = filtered.filter(video => {
        const videoDate = format(new Date(video.created_at), 'yyyy-MM-dd');
        return videoDate === selectedDateStr;
      });
    }

    return filtered;
  }, [videos, searchTerm, selectedCategory, selectedPlatform, selectedDate]);

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
      {/* Header expandido com informações do cliente */}
      <ClientHeader profile={profile} videoCount={videos.length} />

      {/* Filtro de Categorias horizontal */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        availableCategories={availableCategories}
        videos={videos}
      />

      {/* Layout em duas colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coluna esquerda - Filtros */}
        <div className="lg:col-span-1 space-y-4">
          {/* Filtro de Plataformas como sidebar */}
          <PlatformFilter
            selectedPlatform={selectedPlatform}
            onPlatformChange={setSelectedPlatform}
            videos={videos}
          />
          
          {/* Filtros de busca e data */}
          <VideoFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            availableCategories={availableCategories}
            videos={videos}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>

        {/* Coluna direita - Grid de Vídeos */}
        <div className="lg:col-span-3">
          <VideoGrid
            videos={filteredVideos}
            isLoading={isLoading}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
};
