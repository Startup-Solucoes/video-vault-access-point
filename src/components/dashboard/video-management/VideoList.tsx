
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Video, User } from 'lucide-react';
import { useClientManagement } from '@/hooks/useClientManagement';
import { useClientVideos } from '@/hooks/useClientVideos';

interface VideoListProps {
  onClientSelect: (clientId: string, clientName: string, clientLogoUrl?: string) => void;
}

export const VideoList = ({ onClientSelect }: VideoListProps) => {
  const { filteredClients, searchTerm, setSearchTerm, isLoading } = useClientManagement();
  const [searchFilter, setSearchFilter] = useState('');

  // Filtrar clientes baseado no termo de busca local
  const displayedClients = filteredClients.filter(client =>
    client.full_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    client.email.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const ClientVideoSummary = ({ clientId }: { clientId: string }) => {
    const { videos, isLoading: videosLoading } = useClientVideos(clientId);
    
    if (videosLoading) {
      return <span className="text-gray-500">Carregando...</span>;
    }
    
    return (
      <div className="flex items-center space-x-2">
        <Video className="h-4 w-4 text-blue-600" />
        <span className="text-sm text-gray-600">
          {videos.length} vídeo{videos.length !== 1 ? 's' : ''}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filtro de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar cliente por nome ou email..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de clientes */}
      {isLoading && displayedClients.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Carregando clientes...</span>
          </div>
        </div>
      ) : displayedClients.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Nenhum cliente encontrado</p>
          <p className="text-sm">Tente ajustar o filtro de busca</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {displayedClients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onClientSelect(client.id, client.full_name, client.logo_url || undefined)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {/* Logo do cliente */}
                    {client.logo_url ? (
                      <img 
                        src={client.logo_url} 
                        alt={`Logo ${client.full_name}`}
                        className="h-10 w-10 object-contain rounded border flex-shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{client.full_name}</h3>
                      <p className="text-sm text-gray-600 truncate">{client.email}</p>
                      <ClientVideoSummary clientId={client.id} />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Badge variant={client.role === 'admin' ? 'default' : 'secondary'}>
                      {client.role === 'admin' ? 'Admin' : 'Cliente'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Ver Vídeos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
