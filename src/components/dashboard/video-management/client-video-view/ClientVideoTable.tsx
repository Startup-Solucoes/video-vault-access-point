
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { useState } from 'react';

interface ClientVideoTableProps {
  videos: ClientVideoData[];
  selectedVideos: string[];
  deletingVideoId: string | null;
  clientName: string;
  onVideoSelect: (videoId: string, checked: boolean) => void;
  onSelectAllVisible: () => void;
  onEditVideo: (videoId: string) => void;
  onDeleteVideo: (videoId: string, videoTitle: string) => void;
}

export const ClientVideoTable = ({
  videos,
  selectedVideos,
  deletingVideoId,
  clientName,
  onVideoSelect,
  onSelectAllVisible,
  onEditVideo,
  onDeleteVideo
}: ClientVideoTableProps) => {
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
    const shareUrl = `${window.location.origin}/?video=${videoId}`;
    
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

  const allSelected = videos.length > 0 && videos.every(video => selectedVideos.includes(video.id));

  return (
    <div className="hidden lg:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAllVisible}
              />
            </TableHead>
            <TableHead className="w-16">#</TableHead>
            <TableHead className="min-w-[250px]">Título</TableHead>
            <TableHead className="w-32">Categoria</TableHead>
            <TableHead className="w-44">Data de Criação</TableHead>
            <TableHead className="w-28">Visualizações</TableHead>
            <TableHead className="w-40">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video, index) => (
            <TableRow key={video.id}>
              <TableCell>
                <Checkbox
                  checked={selectedVideos.includes(video.id)}
                  onCheckedChange={(checked) => onVideoSelect(video.id, checked as boolean)}
                />
              </TableCell>
              <TableCell>
                <Badge variant="outline">#{video.display_order || index + 1}</Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium line-clamp-2">{video.title}</div>
                  {video.description && (
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {video.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {video.category ? (
                  <Badge className={`font-semibold border-0 ${getCategoryColor(video.category)}`}>
                    {video.category}
                  </Badge>
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
                  <Eye className="h-4 w-4 mr-1" />
                  0 views
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShareVideo(video.id)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    title="Copiar link de compartilhamento"
                  >
                    {copiedVideoId === video.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Share2 className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEditVideo(video.id)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(video.video_url, '_blank')}
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={deletingVideoId === video.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
