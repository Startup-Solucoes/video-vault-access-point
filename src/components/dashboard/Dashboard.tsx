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
    switch (activeTab) {
      case 'dashboard':
        return isAdmin ? <AdminDashboard /> : <ClientDashboard />;
      case 'videos':
        return <Suspense fallback={<ComponentLoader />}>
            <VideoManagement />
          </Suspense>;
      case 'clients':
        return <Suspense fallback={<ComponentLoader />}>
            <ClientManagement />
          </Suspense>;
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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl text-gray-900 font-bold">
                {isAdmin ? 'Painel Administrativo' : 'Portal do Cliente'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAdmin && <div className="flex space-x-2">
                  <Button onClick={() => setIsVideoFormOpen(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Novo Vídeo
                  </Button>
                  <Button onClick={() => setIsClientFormOpen(true)} variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Novo Cliente
                  </Button>
                </div>}
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">{profile.email}</span>
                <Button onClick={signOut} variant="outline" size="sm">
                  Sair
                </Button>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-8 -mb-px">
            <button onClick={() => handleTabChange('dashboard')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'dashboard' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Dashboard
            </button>
            
            {isAdmin && <>
                <button onClick={() => handleTabChange('videos')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'videos' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  <Video className="h-4 w-4 inline mr-2" />
                  Vídeos
                </button>
                
                <button onClick={() => handleTabChange('clients')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'clients' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  <Users className="h-4 w-4 inline mr-2" />
                  Clientes
                </button>
              </>}
          </div>
        </div>
      </header>

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