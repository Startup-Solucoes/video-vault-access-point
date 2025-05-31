
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Video, Calendar, User, Play } from 'lucide-react';
import { useVideoHistory } from '@/hooks/useVideoHistory';
import { useVideoPermissions } from '@/hooks/useVideoPermissions';
import { VideoModal } from '@/components/ui/video-modal';

interface VideoHistoryProps {
  limit?: number;
  getCategoryColor?: (category: string) => string;
}

export const VideoHistory = ({ limit = 10, getCategoryColor }: VideoHistoryProps) => {
  const { videos, isLoading } = useVideoHistory(limit);
  const { videoPermissions, isLoadingPermissions } = useVideoPermissions();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleWatchVideo = (video: any) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
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
            Últimos {limit} vídeos criados e clientes especificados
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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Video className="h-5 w-5 mr-2" />
            Histórico de Vídeos
          </CardTitle>
          <CardDescription>
            Últimos {limit} vídeos criados e clientes especificados
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
                    <TableHead>Cliente Especificado</TableHead>
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
                            <Badge 
                              className={getCategoryColor ? getCategoryColor(video.category) : 'bg-gray-600 text-white'}
                            >
                              {video.category}
                            </Badge>
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
                                <div key={client.id} className="flex items-center text-sm">
                                  <User className="h-3 w-3 mr-1" />
                                  {client.client?.full_name || 'Cliente'}
                                </div>
                              ))}
                              {clients.length > 2 && (
                                <div className="text-xs text-gray-500">
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
                            onClick={() => handleWatchVideo(video)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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

      {selectedVideo && (
        <VideoModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          video={selectedVideo}
          getCategoryColor={getCategoryColor}
        />
      )}
    </>
  );
};
