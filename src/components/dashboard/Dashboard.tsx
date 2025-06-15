import React, { Suspense, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Video, Users, BarChart3, Upload } from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { ClientDashboard } from './ClientDashboard';

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
  const isAdmin = profile?.role === 'admin';
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
        return isAdmin ? <AdminDashboard /> : <ClientDashboard />;
      case 'videos':
        return <VideoManagement />;
      case 'clients':
        return <ClientManagement />;
      default:
        return isAdmin ? <AdminDashboard /> : <ClientDashboard />;
    }
  };
  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">
        <ComponentLoader />
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>

      {/* Modals */}
      {isAdmin && <>
          <VideoForm open={isVideoFormOpen} onOpenChange={setIsVideoFormOpen} onVideoCreated={handleVideoCreated} />
          
          <ClientForm open={isClientFormOpen} onOpenChange={setIsClientFormOpen} onClientCreated={handleClientCreated} />
        </>}
    </div>;
};