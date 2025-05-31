
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Folder, Calendar, User, Trash2, Video } from 'lucide-react';
import { useVideoPermissions } from '@/hooks/useVideoPermissions';
import { useClientData } from '@/hooks/useClientData';

interface VideoListProps {
  onClientSelect: (clientId: string, clientName: string) => void;
}

export const VideoList = ({ onClientSelect }: VideoListProps) => {
  const { videoPermissions, isLoadingPermissions } = useVideoPermissions();
  const { clients, deleteClient } = useClientData();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const getClientVideoCount = (clientId: string) => {
    return videoPermissions.filter(permission => permission.client_id === clientId).length;
  };

  // Filtrar apenas clientes que têm vídeos
  const clientsWithVideos = clients.filter(client => 
    !client.is_deleted && getClientVideoCount(client.id) > 0
  );

  const handleDeleteClient = async (clientId: string, clientName: string) => {
    if (confirm(`Tem certeza que deseja deletar todo o diretório de "${clientName}"? Esta ação removerá o cliente e todas as suas permissões de vídeos.`)) {
      await deleteClient(clientId, clientName);
    }
  };

  if (isLoadingPermissions) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (clientsWithVideos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Folder className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Nenhum cliente com vídeos encontrado</p>
        <p className="text-sm">Adicione permissões de vídeos para os clientes</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Clientes com Vídeos ({clientsWithVideos.length})</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientsWithVideos.map((client) => {
          const videoCount = getClientVideoCount(client.id);
          return (
            <Card key={client.id} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div 
                    className="flex items-center space-x-3 flex-1 cursor-pointer"
                    onClick={() => onClientSelect(client.id, client.full_name)}
                  >
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Folder className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {client.full_name}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {client.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClient(client.id, client.full_name);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Video className="h-3 w-3" />
                      <span>{videoCount} vídeo{videoCount !== 1 ? 's' : ''}</span>
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {client.role === 'admin' ? 'Admin' : 'Cliente'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    Criado em {formatDate(client.created_at)}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onClientSelect(client.id, client.full_name)}
                >
                  <User className="h-4 w-4 mr-1" />
                  Ver Vídeos
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
