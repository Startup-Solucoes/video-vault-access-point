
import React from 'react';
import { Home, Video, Star, User, LogOut, ChevronRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/integrations/supabase/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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
    <div className={`bg-card flex flex-col h-full ${isMobile ? 'w-full' : 'w-80 min-w-80 max-w-80'} flex-shrink-0 relative border-r border-border`}>
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
            {profile.logo_url ? (
              <div className="relative flex-shrink-0">
                <img 
                  src={profile.logo_url} 
                  alt={`Logo ${profile.full_name}`} 
                  className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-xl bg-card p-1 shadow-lg" 
                />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 md:h-4 md:w-4 rounded-full bg-green-500 shadow-sm border-2 border-card"></div>
              </div>
            ) : (
              <div className="relative h-10 w-10 md:h-12 md:w-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <User className="h-5 w-5 md:h-6 md:w-6 text-white" />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 md:h-4 md:w-4 rounded-full bg-green-500 shadow-sm border-2 border-card"></div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-lg font-bold text-foreground truncate">
                {profile.full_name}
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground font-medium">
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
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 md:mb-6 px-2">
            Navegação
          </div>
          <div className="space-y-2 md:space-y-3">
            {menuItems.map(item => (
              <button
                key={item.view}
                onClick={() => handleViewChange(item.view)}
                className={`group relative p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 w-full text-left shadow-sm hover:shadow-md ${
                  currentView === item.view 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]' 
                    : 'hover:bg-accent bg-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                    <div className={`p-2 md:p-3 rounded-lg md:rounded-xl transition-colors flex-shrink-0 ${currentView === item.view ? 'bg-primary-foreground/20' : 'bg-muted'}`}>
                      <item.icon className={`h-4 w-4 md:h-5 md:w-5 ${currentView === item.view ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className={`font-semibold text-sm md:text-base truncate ${currentView === item.view ? 'text-primary-foreground' : 'text-foreground'}`}>
                        {item.title}
                      </div>
                      <div className={`text-xs md:text-sm truncate ${currentView === item.view ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {item.badge !== null && (
                      <Badge 
                        variant={currentView === item.view ? "secondary" : "outline"} 
                        className={`text-xs shadow-sm ${currentView === item.view ? 'bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30' : 'bg-card text-foreground border-border'}`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className={`h-3 w-3 md:h-4 md:w-4 transition-transform ${currentView === item.view ? 'text-primary-foreground rotate-90' : 'text-muted-foreground'}`} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 bg-muted/50 p-4 md:p-6 border-t border-border">
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 shadow-sm text-xs">
              Online
            </Badge>
          </div>
          
          <ThemeToggle />
          
          <Button 
            variant="outline" 
            onClick={onSignOut} 
            className="w-full justify-start text-foreground border-border hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-200 dark:hover:border-red-800 hover:text-red-700 dark:hover:text-red-400 transition-colors shadow-sm hover:shadow-md text-sm md:text-base py-2 md:py-2.5"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
          
          <div className="text-xs text-muted-foreground text-center truncate">
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
              <Button variant="outline" size="sm" className="bg-card shadow-lg">
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
