
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

interface ClientDashboardProps {
  sharedVideoId?: string | null;
  onVideoOpened?: () => void;
}

export const ClientDashboard = ({ sharedVideoId: propSharedVideoId, onVideoOpened }: ClientDashboardProps = {}) => {
  const { signOut } = useAuth();
  const [currentView, setCurrentView] = useState<'welcome' | 'videos' | 'services'>('welcome');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const {
    profile,
    videos,
    filteredVideos,
    advertisements,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedCategories,
    toggleCategory,
    selectAllCategories,
    clearCategories,
    selectedPlatform,
    setSelectedPlatform,
    showFilters,
    setShowFilters,
    availableCategories,
    videoCategoryCounts,
    clearAllFilters,
    hasActiveFilters
  } = useClientDashboard();

  // Detectar vídeo compartilhado das props
  useEffect(() => {
    if (propSharedVideoId && videos.length > 0) {
      const video = videos.find(v => v.id === propSharedVideoId);
      if (video) {
        console.log('🎬 Abrindo vídeo compartilhado:', video.title);
        setCurrentView('videos');
        setIsVideoModalOpen(true);
        
        // Notificar o Dashboard que o vídeo foi aberto
        onVideoOpened?.();
      }
    }
  }, [propSharedVideoId, videos, onVideoOpened]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  const sharedVideo = propSharedVideoId ? videos.find(v => v.id === propSharedVideoId) : null;

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
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              selectAllCategories={selectAllCategories}
              clearCategories={clearCategories}
              selectedPlatform={selectedPlatform} 
              setSelectedPlatform={setSelectedPlatform} 
              showFilters={showFilters} 
              setShowFilters={setShowFilters} 
              availableCategories={availableCategories}
              videoCategoryCounts={videoCategoryCounts}
              videos={videos} 
              filteredVideos={filteredVideos} 
              hasActiveFilters={hasActiveFilters} 
              clearAllFilters={clearAllFilters} 
            />
            <VideoGrid 
              videos={filteredVideos} 
              isLoading={isLoading} 
              searchTerm={searchTerm} 
              selectedCategories={selectedCategories} 
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
        <main className="p-6 w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm min-h-screen overflow-x-hidden rounded-md">
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
