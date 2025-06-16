
import React, { Suspense, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Video, Users, BarChart3, History, Settings, Home, User, LogOut, ChevronRight, Menu, X } from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';
import { VideoHistory } from './VideoHistory';
import { ThumbnailGenerator } from './ThumbnailGenerator';
import VideoManagement from './VideoManagement';
import { ClientManagement } from './ClientManagement';
import { AdvertisementManagement } from './advertisement-management/AdvertisementManagement';
import { VideoForm } from '@/components/forms/VideoForm';
import { ClientForm } from '@/components/forms/ClientForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';

// Componente de Loading para Suspense
const ComponentLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="text-gray-600 text-sm">Carregando componente...</span>
    </div>
  </div>
);

// Sidebar Component similar ao ClientSidebar
const AdminSidebar = ({ 
  currentView, 
  onViewChange, 
  stats 
}: { 
  currentView: string; 
  onViewChange: (view: string) => void; 
  stats: any;
}) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { profile, signOut } = useAuth();

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      view: 'overview',
      description: "Visão geral do sistema",
      badge: null
    },
    {
      title: "Vídeos",
      icon: Video,
      view: 'videos',
      description: "Gerenciar vídeos",
      badge: stats?.totalVideos || 0
    },
    {
      title: "Administradores",
      icon: Users,
      view: 'clients',
      description: "Gerenciar admins",
      badge: stats?.totalClients || 0
    },
    {
      title: "Histórico",
      icon: History,
      view: 'history',
      description: "Logs do sistema",
      badge: null
    },
    {
      title: "Ferramentas",
      icon: Settings,
      view: 'tools',
      description: "Utilitários",
      badge: null
    }
  ];

  const handleViewChange = (view: string) => {
    onViewChange(view);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const SidebarContent = () => (
    <div className={`bg-white flex flex-col h-full ${isMobile ? 'w-full' : 'w-80 min-w-80 max-w-80'} flex-shrink-0 relative`}>
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-blue-50 to-purple-50 p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
            <div className="relative h-10 w-10 md:h-12 md:w-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <User className="h-5 w-5 md:h-6 md:w-6 text-white" />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 md:h-4 md:w-4 rounded-full bg-green-500 shadow-sm border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-lg font-bold text-gray-900 truncate">
                {profile?.full_name || 'Administrador'}
              </h2>
              <p className="text-xs md:text-sm text-gray-600 font-medium">
                Painel Administrativo
              </p>
            </div>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="p-1 h-8 w-8 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 min-h-0">
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 md:mb-6 px-2">
            Navegação
          </div>
          <div className="space-y-2 md:space-y-3">
            {menuItems.map(item => (
              <button
                key={item.view}
                onClick={() => handleViewChange(item.view)}
                className={`group relative p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 w-full text-left shadow-sm hover:shadow-md ${
                  currentView === item.view 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-[1.02]' 
                    : 'hover:bg-gray-50 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                    <div className={`p-2 md:p-3 rounded-lg md:rounded-xl transition-colors flex-shrink-0 ${currentView === item.view ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                      <item.icon className={`h-4 w-4 md:h-5 md:w-5 ${currentView === item.view ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'}`} />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className={`font-semibold text-sm md:text-base truncate ${currentView === item.view ? 'text-white' : 'text-gray-900'}`}>
                        {item.title}
                      </div>
                      <div className={`text-xs md:text-sm truncate ${currentView === item.view ? 'text-blue-100' : 'text-gray-500 group-hover:text-gray-600'}`}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {item.badge !== null && (
                      <Badge 
                        variant={currentView === item.view ? "secondary" : "outline"} 
                        className={`text-xs shadow-sm ${currentView === item.view ? 'bg-white/20 text-white border-white/30' : 'bg-white text-gray-700 border-gray-200'}`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className={`h-3 w-3 md:h-4 md:w-4 transition-transform ${currentView === item.view ? 'text-white rotate-90' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 bg-gray-50 p-4 md:p-6">
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="text-gray-600">Status</span>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 shadow-sm text-xs">
              Online
            </Badge>
          </div>
          
          <Button 
            variant="outline" 
            onClick={signOut} 
            className="w-full justify-start text-gray-700 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors shadow-sm hover:shadow-md text-sm md:text-base py-2 md:py-2.5"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
          
          <div className="text-xs text-gray-500 text-center truncate">
            {profile?.email}
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Trigger Button */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white shadow-lg">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-full max-w-sm">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </>
    );
  }

  return <SidebarContent />;
};

export const AdminDashboard = () => {
  const { stats, isLoading } = useAdminStats();
  const [activeTab, setActiveTab] = useState('overview');
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
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
          <div className="space-y-6">
            {/* Header com ações rápidas */}
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

            {/* Cards de estatísticas */}
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

            {/* Resumo e ações rápidas */}
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
          </div>
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

      case 'history':
        return <VideoHistory />;

      case 'tools':
        return (
          <div className="space-y-6">
            {!selectedTool ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200 group"
                  onClick={() => setSelectedTool('thumbnails')}
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 group-hover:text-blue-600 transition-colors">
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <Video className="h-5 w-5 text-blue-600" />
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
                        <Settings className="h-5 w-5 text-green-600" />
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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 ${isMobile ? 'pt-16' : ''}`}>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <AdminSidebar 
          currentView={activeTab}
          onViewChange={setActiveTab}
          stats={stats}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
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
