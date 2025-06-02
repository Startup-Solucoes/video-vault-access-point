
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Video, User } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ClientHeaderProps {
  profile: Profile;
  videoCount: number;
}

export const ClientHeader = ({ profile, videoCount }: ClientHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 bg-white rounded-lg shadow-sm border">
      {profile.logo_url ? (
        <img 
          src={profile.logo_url} 
          alt={`Logo ${profile.full_name}`}
          className="h-12 w-12 sm:h-16 sm:w-16 object-contain rounded-lg border flex-shrink-0"
        />
      ) : (
        <div className="h-12 w-12 sm:h-16 sm:w-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <User className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
        </div>
      )}
      <div className="flex-1 min-w-0 w-full space-y-2">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900">{profile.full_name}</h1>
        <p className="text-sm sm:text-base text-gray-600">{profile.email}</p>
        <div className="flex items-center">
          <Badge variant="secondary" className="flex items-center space-x-1 text-xs sm:text-sm">
            <Video className="h-3 w-3" />
            <span>{videoCount} vídeo{videoCount !== 1 ? 's' : ''} disponível{videoCount !== 1 ? 'eis' : ''}</span>
          </Badge>
        </div>
      </div>
    </div>
  );
};
