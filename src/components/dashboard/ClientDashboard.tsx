
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useClientDashboard } from '@/hooks/useClientDashboard';
import { ClientSidebar } from './client/ClientSidebar';
import { WelcomeView } from './client/WelcomeView';
import { ServicesView } from './client/ServicesView';
import { AdvertisementCarousel } from './client/AdvertisementCarousel';
import { VideoSearchAndFilters } from './client/VideoSearchAndFilters';
import { VideoGrid } from './client/VideoGrid';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

export const ClientDashboard = () => {
  const { signOut } = useAuth();
  const [currentView, setCurrentView] = useState<'welcome' | 'videos' | 'services'>('welcome');
  
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

  const renderMainContent = () => {
    switch (currentView) {
      case 'welcome':
        return (
          <WelcomeView
            profile={profile}
            videos={videos}
            onNavigateToVideos={() => setCurrentView('videos')}
            onNavigateToServices={() => setCurrentView('services')}
          />
        );
      
      case 'videos':
        return (
          <div className="space-y-6">
            {/* Anúncios em destaque - carrossel */}
            <AdvertisementCarousel advertisements={advertisements} />

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

            {/* Grid de vídeos */}
            <VideoGrid 
              videos={filteredVideos} 
              isLoading={isLoading} 
              searchTerm={searchTerm} 
              selectedCategory={selectedCategory} 
            />
          </div>
        );
      
      case 'services':
        return <ServicesView />;
      
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <ClientSidebar
          profile={profile}
          videoCount={videos.length}
          currentView={currentView}
          onViewChange={setCurrentView}
          onSignOut={signOut}
        />
        
        <SidebarInset className="flex-1">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-white px-6 shadow-sm">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Portal do Cliente</span>
              <span className="text-gray-400">•</span>
              <span className="capitalize text-gray-500">
                {currentView === 'welcome' && 'Início'}
                {currentView === 'videos' && 'Meus Vídeos'}
                {currentView === 'services' && 'Serviços'}
              </span>
            </div>
          </header>
          
          <main className="flex-1 p-6 w-full">
            {renderMainContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
