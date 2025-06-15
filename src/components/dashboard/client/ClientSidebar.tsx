
import React from 'react';
import { Home, Video, Star, User, LogOut } from 'lucide-react';
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
      description: "Painel de boas-vindas"
    },
    {
      title: "Meus Vídeos",
      icon: Video,
      view: 'videos' as const,
      description: `${videoCount} vídeo${videoCount !== 1 ? 's' : ''} disponível${videoCount !== 1 ? 'is' : ''}`
    },
    {
      title: "Serviços",
      icon: Star,
      view: 'services' as const,
      description: "Serviços em destaque"
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center space-x-3 p-4">
          {profile.logo_url ? (
            <img 
              src={profile.logo_url} 
              alt={`Logo ${profile.full_name}`}
              className="h-10 w-10 object-contain rounded-lg border border-gray-300 bg-white p-1"
            />
          ) : (
            <div className="h-10 w-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-gray-900 truncate">
              {profile.full_name}
            </h2>
            <p className="text-xs text-gray-600 truncate">
              Portal do Cliente
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.view}>
                  <SidebarMenuButton 
                    asChild
                    isActive={currentView === item.view}
                    className="group"
                  >
                    <button 
                      onClick={() => onViewChange(item.view)}
                      className="w-full"
                    >
                      <item.icon className="h-4 w-4" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500 group-hover:text-gray-600">
                          {item.description}
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

      <SidebarFooter className="border-t border-gray-200 bg-gray-50">
        <div className="p-4">
          <Button 
            variant="outline" 
            onClick={onSignOut}
            className="w-full justify-start text-gray-700 border-gray-300 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
          <div className="mt-3 text-xs text-gray-500 text-center">
            {profile.email}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
