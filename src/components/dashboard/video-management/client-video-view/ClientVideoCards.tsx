import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { ClientVideoData } from '@/hooks/useClientVideos';
import { getCategoryColor } from '@/utils/categoryColors';

interface ClientVideoCardsProps {
  videos: ClientVideoData[];
  selectedVideos: string[];
  deletingVideoId: string | null;
  clientName: string;
  onVideoSelect: (videoId: string, checked: boolean) => void;
  onEditVideo: (videoId: string) => void;
  onDeleteVideo: (videoId: string, videoTitle: string) => void;
}

export const ClientVideoCards = ({
  videos,
  selectedVideos,
  deletingVideoId,
  clientName,
  onVideoSelect,
  onEditVideo,
  onDeleteVideo
}: ClientVideoCardsProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="lg:hidden space-y-4">
      {videos.map((video, index) => (
        <Card key={video.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Header with checkbox, order and actions */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedVideos.includes(video.id)}
                    onCheckedChange={(checked) => onVideoSelect(video.id, checked as boolean)}
                  />
                  <Badge variant="outline" className="text-xs">
                    #{video.display_order || index + 1}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEditVideo(video.id)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={deletingVideoId === video.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover vídeo do cliente?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover o vídeo <strong>"{video.title}"</strong> do cliente <strong>{clientName}</strong>?
                          <br /><br />
                          Esta ação irá apenas remover o acesso do cliente a este vídeo. O vídeo não será deletado permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteVideo(video.id, video.title)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Sim, remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Title and description */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                {video.description && (
                  <p className="text-sm text-gray-500 line-clamp-3 mb-3">
                    {video.description}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Categoria:</span>
                {video.category ? (
                  <Badge className={`text-xs font-semibold border-0 ${getCategoryColor(video.category)}`}>
                    {video.category}
                  </Badge>
                ) : (
                  <span className="text-gray-400 text-sm">Sem categoria</span>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <div>
                    <div className="font-medium">Criado em:</div>
                    <div>{formatDate(video.created_at)}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <div>
                    <div className="font-medium">Acesso em:</div>
                    <div>{formatDate(video.permission_created_at)}</div>
                  </div>
                </div>
              </div>

              {/* Visualizations and View button */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center text-sm text-gray-600">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>0 visualizações</span>
                  <span className="text-xs text-gray-400 ml-1">(em breve)</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => window.open(video.video_url, '_blank')}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Visualizar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
