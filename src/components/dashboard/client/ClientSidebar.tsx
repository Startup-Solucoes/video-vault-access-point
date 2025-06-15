
import React from 'react';
import { Home, Video, Star, User, LogOut, ChevronRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/integrations/supabase/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ClientSidebarProps {
  profile: Profile;
  videoCount: number;
  currentView: 'welcome' | 'videos' | 'services';
  onViewChange: (view: 'welcome' | 'videos' | 'services') => void;
  onSignOut: () => Promise<void>;
}

export const ClientSidebar = ({
  profile,
  videoCount,
  currentView,
  onViewChange,
  onSignOut
}: ClientSidebarProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    {
      title: "Início",
      icon: Home,
      view: 'welcome' as const,
      description: "Painel de boas-vindas",
      badge: null
    }, {
      title: "Meus Vídeos",
      icon: Video,
      view: 'videos' as const,
      description: "Biblioteca completa",
      badge: videoCount
    }, {
      title: "Serviços",
      icon: Star,
      view: 'services' as const,
      description: "Recursos premium",
      badge: null
    }
  ];

  const handleViewChange = (view: 'welcome' | 'videos' | 'services') => {
    onViewChange(view);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const SidebarContent = () => (
    <div className={`bg-white flex flex-col h-full ${isMobile ? 'w-full' : 'w-80 min-w-80 max-w-80'} flex-shrink-0 relative`}>
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-gray-50 to-gray-100 p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
            {profile.logo_url ? (
              <div className="relative flex-shrink-0">
                <img 
                  src={profile.logo_url} 
                  alt={`Logo ${profile.full_name}`} 
                  className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-xl bg-white p-1 shadow-lg" 
                />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 md:h-4 md:w-4 rounded-full bg-green-500 shadow-sm border-2 border-white"></div>
              </div>
            ) : (
              <div className="relative h-10 w-10 md:h-12 md:w-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <User className="h-5 w-5 md:h-6 md:w-6 text-white" />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 md:h-4 md:w-4 rounded-full bg-green-500 shadow-sm border-2 border-white"></div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-lg font-bold text-gray-900 truncate">
                {profile.full_name}
              </h2>
              <p className="text-xs md:text-sm text-gray-600 font-medium">
                Portal do Cliente
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
                    ? 'bg-gray-700 text-white shadow-lg shadow-gray-700/25 scale-[1.02]' 
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
                      <div className={`text-xs md:text-sm truncate ${currentView === item.view ? 'text-gray-200' : 'text-gray-500 group-hover:text-gray-600'}`}>
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
            onClick={onSignOut} 
            className="w-full justify-start text-gray-700 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors shadow-sm hover:shadow-md text-sm md:text-base py-2 md:py-2.5"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
          
          <div className="text-xs text-gray-500 text-center truncate">
            {profile.email}
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
