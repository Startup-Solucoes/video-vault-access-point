import React, { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useClientVideos } from '@/hooks/useClientVideos';
import { useClientAdvertisements } from '@/hooks/useClientAdvertisements';
import { ClientHeader } from './client/ClientHeader';
import { CategoryFilter } from './client/CategoryFilter';
import { VideoFilters } from './client/VideoFilters';
import { VideoGrid } from './client/VideoGrid';
import { PlatformFilter } from './client/PlatformFilter';
import { AdvertisementBanner } from './client/AdvertisementBanner';
import { format } from 'date-fns';
import { ClientVideo } from '@/types/clientVideo';
import { Sparkles } from 'lucide-react';
export const ClientDashboard = () => {
  const {
    profile
  } = useAuth();
  const {
    videos: rawVideos,
    isLoading
  } = useClientVideos(profile?.id || '');
  const {
    advertisements
  } = useClientAdvertisements(profile?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Convert ClientVideoData to ClientVideo format
  const videos: ClientVideo[] = useMemo(() => {
    return rawVideos.map(video => ({
      ...video,
      description: video.description || '',
      // ensure description is not undefined
      category: video.category || 'Outros' // ensure category is always a string
    }));
  }, [rawVideos]);

  // Filtrar vídeos baseado na busca, categoria, plataforma e data
  // Os vídeos já vêm ordenados por display_order do hook
  const filteredVideos = useMemo(() => {
    let filtered = videos;

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(video => video.title.toLowerCase().includes(searchTerm.toLowerCase()) || video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase()));
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

    // Manter a ordenação por display_order (que já vem do banco)
    return filtered;
  }, [videos, searchTerm, selectedCategory, selectedPlatform, selectedDate]);

  // Obter categorias disponíveis dos vídeos do cliente
  const availableCategories = useMemo(() => {
    const videoCategories = videos.map(video => video.category).filter(category => category !== null && category !== undefined) as string[];
    return [...new Set(videoCategories)].sort();
  }, [videos]);
  if (!profile) {
    return <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>;
  }
  return <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden px-2 sm:px-0">
      {/* Header expandido com informações do cliente */}
      <div className="w-full overflow-hidden">
        <ClientHeader profile={profile} videoCount={videos.length} />
      </div>

      {/* Anúncios em destaque */}
      {advertisements.length > 0 && <div className="w-full overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-medium">Serviços em destaque:</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {advertisements.map(ad => <AdvertisementBanner key={ad.id} advertisement={ad} />)}
          </div>
        </div>}

      {/* Filtro de Categorias horizontal */}
      <div className="w-full overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
        <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} availableCategories={availableCategories} videos={videos} />
      </div>

      {/* Layout responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-full">
        {/* Coluna esquerda - Filtros */}
        <div className="lg:col-span-1 space-y-4 w-full overflow-hidden min-w-0">
          {/* Filtro de Plataformas como sidebar */}
          <div className="w-full overflow-hidden">
            <PlatformFilter selectedPlatform={selectedPlatform} onPlatformChange={setSelectedPlatform} videos={videos} />
          </div>
          
          {/* Filtros de busca e data */}
          <div className="w-full overflow-hidden">
            <VideoFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} availableCategories={availableCategories} videos={videos} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          </div>
        </div>

        {/* Coluna direita - Grid de Vídeos */}
        <div className="lg:col-span-3 w-full overflow-hidden min-w-0">
          <VideoGrid videos={filteredVideos} isLoading={isLoading} searchTerm={searchTerm} selectedCategory={selectedCategory} />
        </div>
      </div>
    </div>;
};