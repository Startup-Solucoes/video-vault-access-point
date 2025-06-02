
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, User } from 'lucide-react';

interface ClientCardProps {
  client: {
    id: string;
    full_name: string;
    email: string;
    logo_url?: string;
  };
  videoCount: number;
  onClientSelect: (clientId: string, clientName: string, clientLogoUrl?: string) => void;
}

export const ClientCard = ({ client, videoCount, onClientSelect }: ClientCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
      onClick={() => onClientSelect(client.id, client.full_name, client.logo_url)}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo/Avatar */}
          <div className="w-16 h-16 flex items-center justify-center">
            {client.logo_url ? (
              <img 
                src={client.logo_url} 
                alt={`Logo ${client.full_name}`}
                className="w-full h-full object-contain rounded-lg border"
              />
            ) : (
              <div className="w-full h-full bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
            )}
          </div>

          {/* Nome do Cliente */}
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
              {client.full_name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
              {client.email}
            </p>
          </div>

          {/* Badge de Vídeos */}
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Video className="h-3 w-3" />
            <span>{videoCount} vídeo{videoCount !== 1 ? 's' : ''}</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
