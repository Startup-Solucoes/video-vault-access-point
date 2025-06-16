
import React, { Suspense, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Image, Megaphone, Users, Video, BarChart3, History, Settings } from 'lucide-react';
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
  <div className="flex items-center justify-center py-12">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="text-gray-600 text-sm">Carregando componente...</span>
    </div>
  </div>
);

export const AdminDashboard = () => {
  const { stats, isLoading } = useAdminStats();
  const [activeTab, setActiveTab] = useState('overview');
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header moderno */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Painel Administrativo
              </h1>
              <p className="text-gray-600">
                Gerencie vídeos, clientes e visualize estatísticas do sistema
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => setShowVideoForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Vídeo
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowClientForm(true)}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            </div>
          </div>
        </div>

        {/* Cards de estatísticas modernos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total de Clientes</CardTitle>
              <Users className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalClients || 0}</div>
              <p className="text-xs opacity-80 mt-1">Registrados no sistema</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Clientes Ativos</CardTitle>
              <Users className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.activeClients || 0}</div>
              <p className="text-xs opacity-80 mt-1">Com acesso a vídeos</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total de Vídeos</CardTitle>
              <Video className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalVideos || 0}</div>
              <p className="text-xs opacity-80 mt-1">Disponíveis na plataforma</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Vídeos Este Mês</CardTitle>
              <BarChart3 className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.videosThisMonth || 0}</div>
              <p className="text-xs opacity-80 mt-1">Criados recentemente</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principais com design moderno */}
        <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-gray-50 border-b border-gray-100">
              <TabsList className="w-full bg-transparent grid grid-cols-5 h-auto p-1">
                <TabsTrigger 
                  value="overview" 
                  className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg m-1"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Visão Geral</span>
                  <span className="sm:hidden">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="videos" 
                  className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg m-1"
                >
                  <Video className="h-4 w-4" />
                  <span className="hidden sm:inline">Vídeos</span>
                  <span className="sm:hidden">Vídeos</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="clients" 
                  className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg m-1"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Admins</span>
                  <span className="sm:hidden">Admins</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg m-1"
                >
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">Histórico</span>
                  <span className="sm:hidden">Histórico</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="tools" 
                  className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg m-1"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Ferramentas</span>
                  <span className="sm:hidden">Tools</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="overview" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border border-gray-100 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Resumo do Sistema
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Clientes Totais</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {stats?.totalClients || 0}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Vídeos Publicados</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {stats?.totalVideos || 0}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Permissões Ativas</span>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          {stats?.totalPermissions || 0}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-100 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Ações Rápidas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-blue-200 hover:bg-blue-50"
                        onClick={() => setActiveTab('videos')}
                      >
                        <Video className="mr-3 h-4 w-4 text-blue-600" />
                        Gerenciar Vídeos
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-green-200 hover:bg-green-50"
                        onClick={() => setActiveTab('clients')}
                      >
                        <Users className="mr-3 h-4 w-4 text-green-600" />
                        Gerenciar Administradores
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-purple-200 hover:bg-purple-50"
                        onClick={() => setActiveTab('tools')}
                      >
                        <Settings className="mr-3 h-4 w-4 text-purple-600" />
                        Ferramentas do Sistema
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="videos" className="mt-0">
                <Suspense fallback={<ComponentLoader />}>
                  <VideoManagement />
                </Suspense>
              </TabsContent>

              <TabsContent value="clients" className="mt-0">
                <Suspense fallback={<ComponentLoader />}>
                  <ClientManagement />
                </Suspense>
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <VideoHistory />
              </TabsContent>

              <TabsContent value="tools" className="mt-0">
                {!selectedTool ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200 group"
                      onClick={() => setSelectedTool('thumbnails')}
                    >
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 group-hover:text-blue-600 transition-colors">
                          <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <Image className="h-5 w-5 text-blue-600" />
                          </div>
                          Gerador de Thumbnails
                          <Badge variant="outline" className="ml-auto border-orange-200 text-orange-700">
                            Em Breve
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                          Gere thumbnails automaticamente para vídeos que não possuem imagem de capa
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Suporta: ScreenPal, YouTube e Vimeo</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-green-200 group"
                      onClick={() => setSelectedTool('advertisements')}
                    >
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 group-hover:text-green-600 transition-colors">
                          <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                            <Megaphone className="h-5 w-5 text-green-600" />
                          </div>
                          Gerenciar Anúncios
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                          Crie, edite e gerencie anúncios que serão exibidos para os clientes
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Controle total de permissões</span>
                          <Button variant="outline" size="sm" className="border-green-200 text-green-600 hover:bg-green-50">
                            Acessar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedTool(null)}
                        className="border-gray-200 hover:bg-gray-50"
                      >
                        ← Voltar às Ferramentas
                      </Button>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedTool === 'thumbnails' ? 'Gerador de Thumbnails' : 'Gerenciar Anúncios'}
                      </h2>
                    </div>
                    
                    {selectedTool === 'thumbnails' && <ThumbnailGenerator />}
                    {selectedTool === 'advertisements' && (
                      <Suspense fallback={<ComponentLoader />}>
                        <AdvertisementManagement />
                      </Suspense>
                    )}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </Card>
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
