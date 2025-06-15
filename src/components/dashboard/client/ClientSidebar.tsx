
import React from 'react';
import { Home, Video, Star, User, LogOut, ChevronRight } from 'lucide-react';
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
  const menuItems = [{
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
  }];

  return (
    <div className="w-80 min-w-80 max-w-80 bg-white flex flex-col h-screen shadow-xl flex-shrink-0 relative">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 bg-gradient-to-r from-gray-50 to-gray-100 p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          {profile.logo_url ? <div className="relative">
              <img src={profile.logo_url} alt={`Logo ${profile.full_name}`} className="h-12 w-12 object-contain rounded-xl bg-white p-1 shadow-lg" />
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 shadow-sm border-2 border-white"></div>
            </div> : <div className="relative h-12 w-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
              <User className="h-6 w-6 text-white" />
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 shadow-sm border-2 border-white"></div>
            </div>}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 truncate">
              {profile.full_name}
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              Portal do Cliente
            </p>
          </div>
        </div>
      </div>

      {/* Content - Scrollable with space for footer */}
      <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0 pb-32">
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6 px-2">
            Navegação
          </div>
          <div className="space-y-3">
            {menuItems.map(item => (
              <button
                key={item.view}
                onClick={() => onViewChange(item.view)}
                className={`group relative p-4 rounded-2xl transition-all duration-300 w-full text-left shadow-sm hover:shadow-md ${
                  currentView === item.view 
                    ? 'bg-gray-700 text-white shadow-lg shadow-gray-700/25 scale-[1.02]' 
                    : 'hover:bg-gray-50 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl transition-colors ${currentView === item.view ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                      <item.icon className={`h-5 w-5 ${currentView === item.view ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`font-semibold ${currentView === item.view ? 'text-white' : 'text-gray-900'}`}>
                        {item.title}
                      </div>
                      <div className={`text-sm ${currentView === item.view ? 'text-gray-200' : 'text-gray-500 group-hover:text-gray-600'}`}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.badge !== null && <Badge variant={currentView === item.view ? "secondary" : "outline"} className={`text-xs shadow-sm ${currentView === item.view ? 'bg-white/20 text-white border-white/30' : 'bg-white text-gray-700 border-gray-200'}`}>
                        {item.badge}
                      </Badge>}
                    <ChevronRight className={`h-4 w-4 transition-transform ${currentView === item.view ? 'text-white rotate-90' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-50 p-6 shadow-lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Status</span>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 shadow-sm">
              Online
            </Badge>
          </div>
          
          <Button variant="outline" onClick={onSignOut} className="w-full justify-start text-gray-700 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors shadow-sm hover:shadow-md">
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
};
