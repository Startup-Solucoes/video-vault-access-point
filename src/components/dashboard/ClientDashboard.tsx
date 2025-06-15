
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useClientDashboard } from '@/hooks/useClientDashboard';
import { ClientDashboardHeader } from './client/ClientDashboardHeader';
import { AdvertisementCarousel } from './client/AdvertisementCarousel';
import { VideoSearchAndFilters } from './client/VideoSearchAndFilters';
import { VideoGrid } from './client/VideoGrid';

export const ClientDashboard = () => {
  const { signOut } = useAuth();
  const {
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
  } = useClientDashboard();

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header principal com largura total - fora do container */}
      <ClientDashboardHeader 
        profile={profile}
        videoCount={videos.length}
        onSignOut={signOut}
      />

      {/* Anúncios em destaque - carrossel */}
      <AdvertisementCarousel advertisements={advertisements} />

      {/* Área principal - full width */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Barra de filtros modernizada */}
        <VideoSearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          availableCategories={availableCategories}
          videos={videos}
          filteredVideos={filteredVideos}
          hasActiveFilters={hasActiveFilters}
          clearAllFilters={clearAllFilters}
        />

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
