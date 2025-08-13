
import React, { Suspense, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Video, Users, BarChart3, Upload } from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { ClientDashboard } from './ClientDashboard';
import { useIsMobile } from '@/hooks/use-mobile';

// Importações diretas dos componentes
import VideoManagement from './VideoManagement';
import { ClientManagement } from './ClientManagement';
import { VideoForm } from '@/components/forms/VideoForm';
import { ClientForm } from '@/components/forms/ClientForm';

// Loading component
const ComponentLoader = () => <div className="flex items-center justify-center py-8">
    <div className="flex items-center space-x-2">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      <span className="text-gray-600">Carregando...</span>
    </div>
  </div>;

export const Dashboard = () => {
  const {
    profile,
    signOut
  } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isVideoFormOpen, setIsVideoFormOpen] = useState(false);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [sharedVideoId, setSharedVideoId] = useState<string | null>(null);
  const isAdmin = profile?.role === 'admin';
  const isMobile = useIsMobile();

  // Verificar se há um vídeo compartilhado na URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('video');
    
    if (videoId) {
      console.log('🔗 Vídeo compartilhado detectado:', videoId);
      setSharedVideoId(videoId);
      
      // Se for cliente, ir direto para a aba de dashboard onde estão os vídeos
      if (!isAdmin) {
        setActiveTab('dashboard');
      }
      
      // Limpar URL sem recarregar a página
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [isAdmin]);

  const handleTabChange = (tab: string) => {
    console.log('🏷️ Mudando aba para:', tab);
    setActiveTab(tab);
  };

  const handleVideoCreated = () => {
    console.log('✅ Vídeo criado com sucesso');
    setIsVideoFormOpen(false);
  };

  const handleClientCreated = () => {
    console.log('✅ Cliente criado com sucesso');
    setIsClientFormOpen(false);
  };

  const renderContent = () => {
    console.log('🎨 Renderizando conteúdo para aba:', activeTab);
    switch (activeTab) {
      case 'dashboard':
        return isAdmin ? <AdminDashboard /> : (
          <ClientDashboard 
            sharedVideoId={sharedVideoId} 
            onVideoOpened={() => setSharedVideoId(null)} 
          />
        );
      case 'videos':
        return <VideoManagement />;
      case 'clients':
        return <ClientManagement />;
      default:
        return isAdmin ? <AdminDashboard /> : (
          <ClientDashboard 
            sharedVideoId={sharedVideoId} 
            onVideoOpened={() => setSharedVideoId(null)} 
          />
        );
    }
  };

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen bg-transparent">
        <ComponentLoader />
      </div>;
  }

  return (
    <div className={`min-h-screen w-full bg-transparent ${isMobile ? 'pt-16' : ''}`}>
      {/* Main Content */}
      <main className={`w-full ${isMobile ? 'px-4' : ''}`}>
        {renderContent()}
      </main>

      {/* Modals */}
      {isAdmin && (
        <>
          <VideoForm open={isVideoFormOpen} onOpenChange={setIsVideoFormOpen} onVideoCreated={handleVideoCreated} />
          
          <ClientForm open={isClientFormOpen} onOpenChange={setIsClientFormOpen} onClientCreated={handleClientCreated} />
        </>
      )}
    </div>
  );
};
