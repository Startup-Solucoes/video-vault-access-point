
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video, User, Calendar, LogOut } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ClientDashboardHeaderProps {
  profile: Profile;
  videoCount: number;
  onSignOut: () => Promise<void>;
}

export const ClientDashboardHeader = ({ profile, videoCount, onSignOut }: ClientDashboardHeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
          {/* Informações principais do cliente */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Logo/Avatar */}
            {profile.logo_url ? (
              <img 
                src={profile.logo_url} 
                alt={`Logo ${profile.full_name}`}
                className="h-16 w-16 sm:h-20 sm:w-20 object-contain rounded-xl border-2 border-gray-600 bg-white p-2 shadow-lg flex-shrink-0"
              />
            ) : (
              <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <User className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
            )}

            {/* Informações do cliente */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  Portal do Cliente
                </h1>
                <div className="h-px bg-gradient-to-r from-gray-400 to-transparent flex-1 ml-4 hidden lg:block"></div>
              </div>
              
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-200">
                  {profile.full_name}
                </h2>
                <p className="text-gray-300 text-sm sm:text-base">{profile.email}</p>
              </div>
              
              {/* Badges informativos */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center space-x-1 bg-gray-700 text-gray-200 border-gray-600">
                  <Video className="h-3 w-3" />
                  <span>{videoCount} vídeo{videoCount !== 1 ? 's' : ''}</span>
                </Badge>
                
                <Badge variant="outline" className="flex items-center space-x-1 border-gray-600 text-gray-200">
                  <Calendar className="h-3 w-3" />
                  <span>Cliente ativo</span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Informações adicionais e botão de sair */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden lg:block">
              <p className="text-sm text-gray-400">Último acesso</p>
              <p className="text-sm font-medium text-gray-200">Hoje</p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={onSignOut} 
              className="bg-transparent border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-gray-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
