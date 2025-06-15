
import React, { Suspense, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { WordPressLayout } from '@/components/layout/WordPressLayout';
import { AdminDashboard } from './AdminDashboard';
import { ClientDashboard } from './ClientDashboard';

// Importações diretas dos componentes
import VideoManagement from './VideoManagement';
import { ClientManagement } from './ClientManagement';
import { VideoHistory } from './VideoHistory';
import { VideoForm } from '@/components/forms/VideoForm';
import { ClientForm } from '@/components/forms/ClientForm';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Users } from 'lucide-react';

// Loading component
const ComponentLoader = () => (
  <div className="flex items-center justify-center py-8">
    <div className="flex items-center space-x-2">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      <span className="text-gray-600">Carregando...</span>
    </div>
  </div>
);

export const WordPressDashboard = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isVideoFormOpen, setIsVideoFormOpen] = useState(false);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const isAdmin = profile?.role === 'admin';
  
  const handleTabChange = (tab: string) => {
    console.log('🏷️ WordPress Dashboard - Mudando aba para:', tab);
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
    console.log('🎨 WordPress Dashboard - Renderizando conteúdo para aba:', activeTab);
    
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Botões de ação rápida para admins */}
            {isAdmin && (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
                <div className="flex gap-4">
                  <Button onClick={() => setIsVideoFormOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Novo Vídeo
                  </Button>
                  <Button onClick={() => setIsClientFormOpen(true)} variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Novo Cliente
                  </Button>
                </div>
              </div>
            )}
            
            {/* Dashboard principal */}
            {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
          </div>
        );
      case 'videos':
        return <VideoManagement />;
      case 'clients':
        return <ClientManagement />;
      case 'history':
        return <VideoHistory />;
      case 'tools':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ferramentas Administrativas</h3>
            <p className="text-gray-600">Ferramentas e utilitários em desenvolvimento...</p>
          </div>
        );
      default:
        return isAdmin ? <AdminDashboard /> : <ClientDashboard />;
    }
  };
  
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ComponentLoader />
      </div>
    );
  }
  
  return (
    <>
      <WordPressLayout 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
      >
        {renderContent()}
      </WordPressLayout>

      {/* Modals */}
      {isAdmin && (
        <>
          <VideoForm 
            open={isVideoFormOpen} 
            onOpenChange={setIsVideoFormOpen} 
            onVideoCreated={handleVideoCreated} 
          />
          
          <ClientForm 
            open={isClientFormOpen} 
            onOpenChange={setIsClientFormOpen} 
            onClientCreated={handleClientCreated} 
          />
        </>
      )}
    </>
  );
};
