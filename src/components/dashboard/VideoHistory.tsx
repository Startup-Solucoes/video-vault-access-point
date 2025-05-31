
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Video, Calendar, User, Eye } from 'lucide-react';
import { useVideoHistory } from '@/hooks/useVideoHistory';

interface VideoHistoryProps {
  limit?: number;
}

export const VideoHistory = ({ limit = 10 }: VideoHistoryProps) => {
  const { videos, isLoading } = useVideoHistory(limit);

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
            <Video className="h-5 w-5 mr-2" />
            Histórico de Vídeos
          </CardTitle>
          <CardDescription>
            Últimos {limit} vídeos criados
          </CardDescription>
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
          <Video className="h-5 w-5 mr-2" />
          Histórico de Vídeos
        </CardTitle>
        <CardDescription>
          Últimos {limit} vídeos criados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {videos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum vídeo encontrado</p>
            <p className="text-sm">Comece criando seu primeiro vídeo!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data de Criação</TableHead>
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
            
            {videos.length >= limit && (
              <div className="text-center pt-4">
                <Button variant="outline">
                  Ver Todos os Vídeos
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
