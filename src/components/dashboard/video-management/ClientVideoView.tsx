
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Calendar, Eye, User, Edit, Trash2 } from 'lucide-react';
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

  const handleDeleteVideo = (videoId: string, videoTitle: string) => {
    if (confirm(`Tem certeza que deseja deletar o vídeo "${videoTitle}"?`)) {
      // TODO: Implementar função de deletar vídeo
      console.log('Deletando vídeo:', videoId);
    }
  };

  const handleEditVideo = (videoId: string) => {
    // TODO: Implementar função de editar vídeo
    console.log('Editando vídeo:', videoId);
  };

  const handleRemoveVideoFromClient = (videoId: string, videoTitle: string) => {
    if (confirm(`Tem certeza que deseja remover o acesso do cliente "${clientName}" ao vídeo "${videoTitle}"?`)) {
      // TODO: Implementar função de remover permissão
      console.log('Removendo permissão do vídeo:', videoId, 'para cliente:', clientId);
    }
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Título e Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead>Data de Acesso</TableHead>
                  <TableHead>Visualizações</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="font-medium text-gray-900">{video.title}</div>
                        {video.description && (
                          <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                            {video.description}
                          </div>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => window.open(video.video_url, '_blank')}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Visualizar
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {video.category ? (
                        <Badge variant="secondary">{video.category}</Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">Sem categoria</span>
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
                      <div className="flex items-center text-sm text-gray-600">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>0 visualizações</span>
                        <span className="text-xs text-gray-400 ml-1">(em breve)</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditVideo(video.id)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemoveVideoFromClient(video.id, video.title)}
                          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        >
                          <User className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteVideo(video.id, video.title)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
