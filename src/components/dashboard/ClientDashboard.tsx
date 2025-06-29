
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useClientDashboard } from '@/hooks/useClientDashboard';
import { ClientSidebar } from './client/ClientSidebar';
import { WelcomeView } from './client/WelcomeView';
import { ServicesView } from './client/ServicesView';
import { VideoSearchAndFilters } from './client/VideoSearchAndFilters';
import { VideoGrid } from './client/VideoGrid';
import { VideoModal } from '@/components/ui/video-modal';
import { getCategoryColor } from '@/utils/categoryColors';

export const ClientDashboard = () => {
  const { signOut } = useAuth();
  const [currentView, setCurrentView] = useState<'welcome' | 'videos' | 'services'>('welcome');
  const [sharedVideoId, setSharedVideoId] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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

  // Detectar vídeo compartilhado na URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('video');
    
    if (videoId && videos.length > 0) {
      const video = videos.find(v => v.id === videoId);
      if (video) {
        setSharedVideoId(videoId);
        setCurrentView('videos');
        setIsVideoModalOpen(true);
        
        // Limpar o parâmetro da URL sem recarregar a página
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, [videos]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  const sharedVideo = sharedVideoId ? videos.find(v => v.id === sharedVideoId) : null;

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
            <VideoGrid 
              videos={filteredVideos} 
              isLoading={isLoading} 
              searchTerm={searchTerm} 
              selectedCategory={selectedCategory} 
            />
          </div>
        );
      case 'services':
        return <ServicesView advertisements={advertisements} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-transparent overflow-x-hidden">
      <ClientSidebar 
        profile={profile} 
        videoCount={videos.length} 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onSignOut={signOut} 
      />
      
      <div className="flex-1 min-h-screen overflow-x-hidden">
        <main className="p-6 w-full bg-white/70 backdrop-blur-sm min-h-screen overflow-x-hidden rounded-md">
          {renderMainContent()}
        </main>
      </div>

      {/* Modal para vídeo compartilhado */}
      {sharedVideo && (
        <VideoModal
          open={isVideoModalOpen}
          onOpenChange={setIsVideoModalOpen}
          video={sharedVideo}
          getCategoryColor={getCategoryColor}
        />
      )}
    </div>
  );
};
