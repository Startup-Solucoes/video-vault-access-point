
import React, { Suspense, useState } from 'react';
import { useAdminStats } from '@/hooks/useAdminStats';
import { VideoHistory } from './VideoHistory';
import VideoManagement from './VideoManagement';
import { ClientManagement } from './ClientManagement';
import { VideoForm } from '@/components/forms/VideoForm';
import { ClientForm } from '@/components/forms/ClientForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { AdminSidebar } from './admin/AdminSidebar';
import { AdminOverview } from './admin/AdminOverview';
import { AdminToolsView } from './admin/AdminToolsView';
import { VideoViewsManager } from './admin/VideoViewsManager';

// Componente de Loading para Suspense
const ComponentLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="text-gray-600 text-sm">Carregando componente...</span>
    </div>
  </div>
);

export const AdminDashboard = () => {
  const { data: stats, isLoading } = useAdminStats();
  const [activeTab, setActiveTab] = useState('overview');
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const isMobile = useIsMobile();

  const refreshCurrentTab = () => {
    console.log('AdminDashboard: Refresh solicitado para tab:', activeTab);
    setActiveTab(prev => prev);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Carregando dashboard...</span>
        </div>
      </div>
    );
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <AdminOverview 
            stats={stats} 
            onVideoFormOpen={() => setShowVideoForm(true)} 
            onClientFormOpen={() => setShowClientForm(true)} 
            onTabChange={setActiveTab} 
          />
        );
      case 'videos':
        return (
          <Suspense fallback={<ComponentLoader />}>
            <VideoManagement />
          </Suspense>
        );
      case 'clients':
        return (
          <Suspense fallback={<ComponentLoader />}>
            <ClientManagement />
          </Suspense>
        );
      case 'views':
        return (
          <Suspense fallback={<ComponentLoader />}>
            <VideoViewsManager />
          </Suspense>
        );
      case 'history':
        return <VideoHistory />;
      case 'tools':
        return <AdminToolsView />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 ${isMobile ? 'pt-16' : ''}`}>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <AdminSidebar currentView={activeTab} onViewChange={setActiveTab} stats={stats} />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto bg-gray-100">
            <div className="p-4 md:p-6">
              {renderMainContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Formulários modais */}
      {showVideoForm && (
        <VideoForm 
          open={showVideoForm} 
          onOpenChange={setShowVideoForm} 
          onVideoCreated={refreshCurrentTab} 
        />
      )}

      {showClientForm && (
        <ClientForm 
          open={showClientForm} 
          onOpenChange={setShowClientForm} 
          onClientCreated={refreshCurrentTab} 
        />
      )}
    </div>
  );
};
