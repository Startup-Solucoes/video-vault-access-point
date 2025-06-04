import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Video, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
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
    <div className="hidden lg:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={videos.length > 0 && videos.every(video => selectedVideos.includes(video.id))}
                onCheckedChange={onSelectAllVisible}
              />
            </TableHead>
            <TableHead className="w-20">Ordem</TableHead>
            <TableHead className="min-w-[300px]">Título e Descrição</TableHead>
            <TableHead className="w-32">Categoria</TableHead>
            <TableHead className="w-40">Data de Criação</TableHead>
            <TableHead className="w-40">Data de Acesso</TableHead>
            <TableHead className="w-32">Visualizações</TableHead>
            <TableHead className="w-32 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video, index) => (
            <TableRow key={video.id} className="hover:bg-gray-50">
              <TableCell>
                <Checkbox
                  checked={selectedVideos.includes(video.id)}
                  onCheckedChange={(checked) => onVideoSelect(video.id, checked as boolean)}
                />
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  #{video.display_order || index + 1}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <div className="font-medium text-gray-900 line-clamp-2">{video.title}</div>
                  {video.description && (
                    <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                      {video.description}
                    </div>
                  )}
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
              </TableCell>
              <TableCell>
                {video.category ? (
                  <Badge className={`font-semibold border-0 ${getCategoryColor(video.category)}`}>
                    {video.category}
                  </Badge>
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
                  <div className="flex flex-col">
                    <span>0 visualizações</span>
                    <span className="text-xs text-gray-400">(em breve)</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEditVideo(video.id)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4" />
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
