
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
          {/* Logo/Avatar - Aumentado e melhorado */}
          <div className="w-20 h-20 flex items-center justify-center">
            {client.logo_url ? (
              <img 
                src={client.logo_url} 
                alt={`Logo ${client.full_name}`}
                className="w-full h-full object-contain rounded-xl border-2 border-gray-200 shadow-sm bg-white p-1"
                onError={(e) => {
                  // Fallback para ícone padrão se a imagem falhar
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center border-2 border-blue-200"><svg class="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
                  }
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center border-2 border-blue-200">
                <User className="h-10 w-10 text-blue-600" />
              </div>
            )}
          </div>

          {/* Nome do Cliente */}
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 mb-1">
              {client.full_name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-1">
              {client.email}
            </p>
          </div>

          {/* Badge de Vídeos - Melhorado */}
          <Badge 
            variant="secondary" 
            className="flex items-center space-x-1 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <Video className="h-3 w-3" />
            <span>{videoCount} vídeo{videoCount !== 1 ? 's' : ''}</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
