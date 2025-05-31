
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Calendar, User, Eye, Users } from 'lucide-react';
import { useVideoHistory } from '@/hooks/useVideoHistory';
import { useVideoPermissions } from '@/hooks/useVideoPermissions';

interface VideoListProps {
  onClientSelect: (clientId: string, clientName: string) => void;
}

export const VideoList = ({ onClientSelect }: VideoListProps) => {
  const { videos, isLoading } = useVideoHistory(100); // Buscar mais vídeos
  const { videoPermissions, isLoadingPermissions } = useVideoPermissions();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVideoClients = (videoId: string) => {
    return videoPermissions.filter(permission => permission.video_id === videoId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Nenhum vídeo encontrado</p>
        <p className="text-sm">Comece criando seu primeiro vídeo!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Todos os Vídeos ({videos.length})</h3>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Clientes com Acesso</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video) => {
            const clients = getVideoClients(video.id);
            return (
              <TableRow key={video.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{video.title}</div>
                    {video.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {video.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {video.category ? (
                    <Badge variant="secondary">{video.category}</Badge>
                  ) : (
                    <span className="text-gray-400">Sem categoria</span>
                  )}
                </TableCell>
                <TableCell>
                  {isLoadingPermissions ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  ) : clients.length > 0 ? (
                    <div className="space-y-1">
                      {clients.slice(0, 2).map((client) => (
                        <button
                          key={client.id}
                          onClick={() => onClientSelect(client.client_id, client.client?.full_name || 'Cliente')}
                          className="flex items-center text-sm hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          <User className="h-3 w-3 mr-1" />
                          {client.client?.full_name || 'Cliente'}
                        </button>
                      ))}
                      {clients.length > 2 && (
                        <div className="text-xs text-gray-500 flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          +{clients.length - 2} outros
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Nenhum cliente</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(video.created_at)}
                  </div>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(video.video_url, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
