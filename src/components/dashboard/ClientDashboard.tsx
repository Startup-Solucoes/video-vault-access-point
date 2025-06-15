
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
import { Sparkles, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const ClientDashboard = () => {
  const { profile } = useAuth();
  const { videos: rawVideos, isLoading } = useClientVideos(profile?.id || '');
  const { advertisements } = useClientAdvertisements(profile?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  // Convert ClientVideoData to ClientVideo format
  const videos: ClientVideo[] = useMemo(() => {
    return rawVideos.map(video => ({
      ...video,
      description: video.description || '',
      category: video.category || 'Outros'
    }));
  }, [rawVideos]);

  // Filtrar vídeos baseado na busca, categoria, plataforma e data
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
    const videoCategories = videos.map(video => video.category).filter(category => category !== null && category !== undefined) as string[];
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
    <div className="min-h-screen bg-gray-50">
      {/* Full-width Header moderno */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <ClientHeader profile={profile} videoCount={videos.length} />
        </div>
      </div>

      {/* Anúncios em destaque - full width */}
      {advertisements.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-yellow-600" />
              <h2 className="text-xl font-semibold text-gray-900">Serviços em destaque</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {advertisements.map(ad => (
                <AdvertisementBanner key={ad.id} advertisement={ad} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Área principal - full width */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Barra de filtros moderna */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Lado esquerdo - busca e filtros */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
                {/* Campo de busca */}
                <div className="relative flex-1 min-w-0 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar vídeos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Toggle filtros mobile */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>

              {/* Lado direito - contador */}
              <div className="text-sm text-gray-600 whitespace-nowrap">
                {filteredVideos.length} de {videos.length} vídeos
              </div>
            </div>

            {/* Filtros - sempre visível no desktop, toggle no mobile */}
            <div className={`mt-4 ${showFilters || 'hidden lg:block'}`}>
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Filtro de categorias horizontal */}
                <div className="flex-1">
                  <CategoryFilter
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    availableCategories={availableCategories}
                    videos={videos}
                  />
                </div>

                {/* Filtros adicionais */}
                <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
                  <div className="min-w-48">
                    <PlatformFilter
                      selectedPlatform={selectedPlatform}
                      onPlatformChange={setSelectedPlatform}
                      videos={videos}
                    />
                  </div>
                  
                  <div className="min-w-48">
                    <VideoFilters
                      searchTerm=""
                      setSearchTerm={() => {}}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                      availableCategories={availableCategories}
                      videos={videos}
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de vídeos - full width com mais colunas */}
        <div className="w-full">
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
