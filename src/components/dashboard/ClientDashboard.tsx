
import React, { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useClientVideos } from '@/hooks/useClientVideos';
import { useClientAdvertisements } from '@/hooks/useClientAdvertisements';
import { CategoryFilter } from './client/CategoryFilter';
import { VideoGrid } from './client/VideoGrid';
import { PlatformFilter } from './client/PlatformFilter';
import { AdvertisementBanner } from './client/AdvertisementBanner';
import { format } from 'date-fns';
import { ClientVideo } from '@/types/clientVideo';
import { Sparkles, Search, Filter, X, LogOut, User, Video, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export const ClientDashboard = () => {
  const { profile, signOut } = useAuth();
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

  // Filtrar vídeos baseado na busca, categoria e plataforma
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

  // Obter categorias disponíveis dos vídeos do cliente
  const availableCategories = useMemo(() => {
    const videoCategories = videos.map(video => video.category).filter(category => category !== null && category !== undefined) as string[];
    return [...new Set(videoCategories)].sort();
  }, [videos]);

  // Limpar todos os filtros
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedPlatform('');
  };

  // Verificar se há filtros ativos
  const hasActiveFilters = searchTerm || selectedCategory || selectedPlatform;

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Moderno Unificado */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
            {/* Informações principais do cliente */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Logo/Avatar */}
              {profile.logo_url ? (
                <img 
                  src={profile.logo_url} 
                  alt={`Logo ${profile.full_name}`}
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain rounded-xl border-2 border-gray-600 bg-white p-2 shadow-lg flex-shrink-0"
                />
              ) : (
                <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
              )}

              {/* Informações do cliente */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                    Portal do Cliente
                  </h1>
                  <div className="h-px bg-gradient-to-r from-gray-400 to-transparent flex-1 ml-4 hidden lg:block"></div>
                </div>
                
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-200">
                    {profile.full_name}
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base">{profile.email}</p>
                </div>
                
                {/* Badges informativos */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center space-x-1 bg-gray-700 text-gray-200 border-gray-600">
                    <Video className="h-3 w-3" />
                    <span>{videos.length} vídeo{videos.length !== 1 ? 's' : ''}</span>
                  </Badge>
                  
                  <Badge variant="outline" className="flex items-center space-x-1 border-gray-600 text-gray-200">
                    <Calendar className="h-3 w-3" />
                    <span>Cliente ativo</span>
                  </Badge>
                </div>
              </div>
            </div>

            {/* Informações adicionais e botão de sair */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden lg:block">
                <p className="text-sm text-gray-400">Último acesso</p>
                <p className="text-sm font-medium text-gray-200">Hoje</p>
              </div>
              
              <Button 
                variant="outline" 
                onClick={signOut} 
                className="bg-transparent border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-gray-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Anúncios em destaque - carrossel */}
      {advertisements.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-6 w-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Serviços em destaque</h2>
              <div className="h-px bg-gradient-to-r from-yellow-400 to-transparent flex-1 ml-4"></div>
            </div>
            
            <div className="relative">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {advertisements.map((ad) => (
                    <CarouselItem key={ad.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <AdvertisementBanner advertisement={ad} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {advertisements.length > 4 && (
                  <>
                    <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2" />
                  </>
                )}
              </Carousel>
            </div>
          </div>
        </div>
      )}

      {/* Área principal - full width */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Barra de filtros modernizada */}
        <Card className="mb-6 shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            {/* Header da busca */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Search className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Buscar Vídeos</h3>
                  <p className="text-sm text-gray-600">Encontre seus vídeos por título, categoria ou plataforma</p>
                </div>
              </div>
              
              <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {filteredVideos.length} de {videos.length} vídeos
              </div>
            </div>

            {/* Campo de busca principal */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Digite para buscar vídeos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-gray-50 focus:bg-white transition-all duration-200 text-gray-900 placeholder:text-gray-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Filtros - sempre visível no desktop, toggle no mobile */}
            <div className="flex flex-col lg:flex-row gap-4 items-start">
              {/* Toggle filtros mobile */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full justify-center border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </Button>

              {/* Filtros */}
              <div className={`${showFilters || 'hidden lg:flex'} flex flex-col sm:flex-row lg:flex-row gap-4 flex-1 w-full`}>
                {/* Filtro de categorias */}
                <div className="flex-1 min-w-0">
                  <CategoryFilter
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    availableCategories={availableCategories}
                    videos={videos}
                  />
                </div>

                {/* Filtro de plataforma */}
                <div className="flex-1 min-w-0 max-w-xs">
                  <PlatformFilter
                    selectedPlatform={selectedPlatform}
                    onPlatformChange={setSelectedPlatform}
                    videos={videos}
                  />
                </div>

                {/* Botão limpar filtros */}
                {hasActiveFilters && (
                  <Button 
                    variant="outline"
                    onClick={clearAllFilters}
                    className="whitespace-nowrap bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpar filtros
                  </Button>
                )}
              </div>
            </div>

            {/* Tags de filtros ativos */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-600">Filtros ativos:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                    Busca: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="hover:bg-gray-200 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                    Categoria: {selectedCategory}
                    <button onClick={() => setSelectedCategory('')} className="hover:bg-green-200 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedPlatform && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md">
                    Plataforma: {selectedPlatform}
                    <button onClick={() => setSelectedPlatform('')} className="hover:bg-purple-200 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grid de vídeos - full width com grid otimizado */}
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
