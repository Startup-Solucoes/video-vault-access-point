
import React from 'react';
import { Home, Video, Star, User, LogOut, ChevronRight } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/integrations/supabase/types';

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
  const menuItems = [
    {
      title: "Início",
      icon: Home,
      view: 'welcome' as const,
      description: "Painel de boas-vindas",
      badge: null
    },
    {
      title: "Meus Vídeos",
      icon: Video,
      view: 'videos' as const,
      description: "Biblioteca completa",
      badge: videoCount
    },
    {
      title: "Serviços",
      icon: Star,
      view: 'services' as const,
      description: "Recursos premium",
      badge: null
    }
  ];

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex items-center space-x-4">
          {profile.logo_url ? (
            <div className="relative">
              <img 
                src={profile.logo_url} 
                alt={`Logo ${profile.full_name}`}
                className="h-12 w-12 object-contain rounded-xl border-2 border-white bg-white p-1 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
            </div>
          ) : (
            <div className="relative h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <User className="h-6 w-6 text-white" />
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 truncate">
              {profile.full_name}
            </h2>
            <p className="text-sm text-blue-600 font-medium">
              Portal do Cliente
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.view}>
                  <SidebarMenuButton 
                    asChild
                    isActive={currentView === item.view}
                    className={`group relative p-3 rounded-xl transition-all duration-200 ${
                      currentView === item.view 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                        : 'hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <button 
                      onClick={() => onViewChange(item.view)}
                      className="w-full"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            currentView === item.view 
                              ? 'bg-white/20' 
                              : 'bg-gray-100 group-hover:bg-blue-100'
                          }`}>
                            <item.icon className={`h-5 w-5 ${
                              currentView === item.view 
                                ? 'text-white' 
                                : 'text-gray-600 group-hover:text-blue-600'
                            }`} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className={`font-semibold ${
                              currentView === item.view ? 'text-white' : 'text-gray-900'
                            }`}>
                              {item.title}
                            </div>
                            <div className={`text-sm ${
                              currentView === item.view 
                                ? 'text-blue-100' 
                                : 'text-gray-500 group-hover:text-gray-600'
                            }`}>
                              {item.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.badge !== null && (
                            <Badge 
                              variant={currentView === item.view ? "secondary" : "outline"}
                              className={`text-xs ${
                                currentView === item.view 
                                  ? 'bg-white/20 text-white border-white/30' 
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                          <ChevronRight className={`h-4 w-4 transition-transform ${
                            currentView === item.view 
                              ? 'text-white rotate-90' 
                              : 'text-gray-400 group-hover:text-gray-600'
                          }`} />
                        </div>
                      </div>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 bg-gray-50 p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Status</span>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Online
            </Badge>
          </div>
          
          <Button 
            variant="outline" 
            onClick={onSignOut}
            className="w-full justify-start text-gray-700 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
          
          <div className="text-xs text-gray-500 text-center truncate">
            {profile.email}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
