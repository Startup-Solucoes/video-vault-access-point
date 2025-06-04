
import React, { Suspense, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';
import { VideoHistory } from './VideoHistory';
import { ThumbnailGenerator } from './ThumbnailGenerator';
import VideoManagement from './VideoManagement';
import { ClientManagement } from './ClientManagement';
import { AdvertisementManagement } from './advertisement-management/AdvertisementManagement';
import { VideoForm } from '@/components/forms/VideoForm';
import { ClientForm } from '@/components/forms/ClientForm';

// Componente de Loading para Suspense
const ComponentLoader = () => (
  <div className="flex items-center justify-center py-8">
    <div className="flex items-center space-x-2">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      <span className="text-gray-600">Carregando componente...</span>
    </div>
  </div>
);

export const AdminDashboard = () => {
  const { stats, isLoading } = useAdminStats();
  const [activeTab, setActiveTab] = useState('overview');
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);

  const refreshCurrentTab = () => {
    console.log('AdminDashboard: Refresh solicitado para tab:', activeTab);
    // Força re-render do componente ativo
    setActiveTab(prev => prev);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeClients || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vídeos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalVideos || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vídeos Este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.videosThisMonth || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Botões de ação rápida */}
      <div className="flex gap-4">
        <Button onClick={() => setShowVideoForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Vídeo
        </Button>
        <Button variant="outline" onClick={() => setShowClientForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Tabs principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="videos">Vídeos</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="advertisements">Anúncios</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="tools">Ferramentas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Administrativo</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Bem-vindo ao painel administrativo. Use as abas acima para gerenciar vídeos, clientes, anúncios e visualizar relatórios.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Suspense fallback={<ComponentLoader />}>
            <VideoManagement />
          </Suspense>
        </TabsContent>

        <TabsContent value="clients">
          <Suspense fallback={<ComponentLoader />}>
            <ClientManagement />
          </Suspense>
        </TabsContent>

        <TabsContent value="advertisements">
          <Suspense fallback={<ComponentLoader />}>
            <AdvertisementManagement />
          </Suspense>
        </TabsContent>

        <TabsContent value="history">
          <VideoHistory />
        </TabsContent>

        <TabsContent value="tools">
          <ThumbnailGenerator />
        </TabsContent>
      </Tabs>

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
