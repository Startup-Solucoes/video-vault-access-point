
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Eye, Edit, Trash2, Share2, Check } from 'lucide-react';
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
import { generateShareUrl } from '@/utils/urlUtils';
import { useState } from 'react';

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
  const [copiedVideoId, setCopiedVideoId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShareVideo = async (videoId: string) => {
    const shareUrl = generateShareUrl(`?video=${videoId}`);
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedVideoId(videoId);
      
      setTimeout(() => {
        setCopiedVideoId(null);
      }, 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  return (
    <div className="lg:hidden space-y-3 md:space-y-4">
      {videos.map((video, index) => (
        <Card key={video.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 md:p-4">
            <div className="space-y-3 md:space-y-4">
              {/* Header with checkbox, order and actions */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                  <Checkbox
                    checked={selectedVideos.includes(video.id)}
                    onCheckedChange={(checked) => onVideoSelect(video.id, checked as boolean)}
                    className="flex-shrink-0"
                  />
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    #{video.display_order || index + 1}
                  </Badge>
                </div>
                <div className="flex gap-1 md:gap-2 flex-shrink-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShareVideo(video.id)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 p-1.5 md:p-2 h-auto"
                    title="Copiar link de compartilhamento"
                  >
                    {copiedVideoId === video.id ? (
                      <Check className="h-3 w-3 md:h-4 md:w-4" />
                    ) : (
                      <Share2 className="h-3 w-3 md:h-4 md:w-4" />
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEditVideo(video.id)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1.5 md:p-2 h-auto"
                  >
                    <Edit className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={deletingVideoId === video.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 md:p-2 h-auto"
                      >
                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-sm md:max-w-md mx-4">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-sm md:text-base">Remover vídeo do cliente?</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs md:text-sm">
                          Tem certeza que deseja remover o vídeo <strong>"{video.title}"</strong> do cliente <strong>{clientName}</strong>?
                          <br /><br />
                          Esta ação irá apenas remover o acesso do cliente a este vídeo. O vídeo não será deletado permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
                        <AlertDialogCancel className="text-sm">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteVideo(video.id, video.title)}
                          className="bg-red-600 hover:bg-red-700 text-sm"
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
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm md:text-base">{video.title}</h3>
                {video.description && (
                  <p className="text-xs md:text-sm text-gray-500 line-clamp-3 mb-3">
                    {video.description}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs md:text-sm font-medium text-gray-700 flex-shrink-0">Categoria:</span>
                {video.category ? (
                  <Badge className={`text-xs font-semibold border-0 ${getCategoryColor(video.category)}`}>
                    {video.category}
                  </Badge>
                ) : (
                  <span className="text-gray-400 text-xs md:text-sm">Sem categoria</span>
                )}
              </div>

              {/* Creation date only */}
              <div className="flex items-start text-gray-600 gap-2 text-xs md:text-sm">
                <Calendar className="h-3 w-3 md:h-4 md:w-4 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium">Criado em:</div>
                  <div className="break-words">{formatDate(video.created_at)}</div>
                </div>
              </div>

              {/* Visualizations and View button */}
              <div className="flex items-center justify-between pt-3 border-t gap-3">
                <div className="flex items-center text-xs md:text-sm text-gray-600 min-w-0 flex-1">
                  <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">0 visualizações</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2 h-auto flex-shrink-0"
                  onClick={() => window.open(video.video_url, '_blank')}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
