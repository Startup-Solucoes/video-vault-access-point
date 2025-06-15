
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Video, User, Calendar } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ClientHeaderProps {
  profile: Profile;
  videoCount: number;
}

export const ClientHeader = ({ profile, videoCount }: ClientHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
      {/* Informações principais */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Logo/Avatar */}
        {profile.logo_url ? (
          <img 
            src={profile.logo_url} 
            alt={`Logo ${profile.full_name}`}
            className="h-16 w-16 sm:h-20 sm:w-20 object-contain rounded-xl border-2 border-gray-200 bg-white p-2 shadow-sm flex-shrink-0"
          />
        ) : (
          <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <User className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
        )}

        {/* Informações do cliente */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            {profile.full_name}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">{profile.email}</p>
          
          {/* Badges informativos */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Video className="h-3 w-3" />
              <span>{videoCount} vídeo{videoCount !== 1 ? 's' : ''}</span>
            </Badge>
            
            <Badge variant="outline" className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Cliente ativo</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Informações adicionais ou ações futuras */}
      <div className="flex items-center space-x-4">
        <div className="text-right hidden lg:block">
          <p className="text-sm text-gray-500">Último acesso</p>
          <p className="text-sm font-medium text-gray-900">Hoje</p>
        </div>
      </div>
    </div>
  );
};
