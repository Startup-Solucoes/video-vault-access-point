
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Calendar, Eye, User } from 'lucide-react';
import { useClientVideos } from '@/hooks/useClientVideos';

interface ClientVideoViewProps {
  clientId: string;
  clientName: string;
}

export const ClientVideoView = ({ clientId, clientName }: ClientVideoViewProps) => {
  const { videos, isLoading } = useClientVideos(clientId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Vídeos de {clientName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Vídeos de {clientName}
        </CardTitle>
        <p className="text-gray-600 mt-2">
          {videos.length} vídeo{videos.length !== 1 ? 's' : ''} disponível{videos.length !== 1 ? 'eis' : ''}
        </p>
      </CardHeader>
      <CardContent>
        {videos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum vídeo disponível para este cliente</p>
            <p className="text-sm">Adicione permissões de vídeos para este cliente</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Data de Acesso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => (
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
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(video.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(video.permission_created_at)}
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
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
