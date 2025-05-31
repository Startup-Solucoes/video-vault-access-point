
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
    <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-sm border">
      {profile.logo_url ? (
        <img 
          src={profile.logo_url} 
          alt={`Logo ${profile.full_name}`}
          className="h-16 w-16 object-contain rounded-lg border"
        />
      ) : (
        <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
          <User className="h-8 w-8 text-blue-600" />
        </div>
      )}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
        <p className="text-gray-600">{profile.email}</p>
        <div className="flex items-center mt-2 space-x-4">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Video className="h-3 w-3" />
            <span>{videoCount} vídeo{videoCount !== 1 ? 's' : ''} disponível{videoCount !== 1 ? 'eis' : ''}</span>
          </Badge>
        </div>
      </div>
    </div>
  );
};
