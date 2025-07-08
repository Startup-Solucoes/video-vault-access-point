import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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

interface VideoDeleteConfirmationProps {
  videoId: string;
  videoTitle: string;
  clientName: string;
  deletingVideoId: string | null;
  onDeleteVideo: (videoId: string, videoTitle: string) => void;
}

export const VideoDeleteConfirmation = ({
  videoId,
  videoTitle,
  clientName,
  deletingVideoId,
  onDeleteVideo
}: VideoDeleteConfirmationProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={deletingVideoId === videoId}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover vídeo do cliente?</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover o vídeo <strong>"{videoTitle}"</strong> do cliente <strong>{clientName}</strong>?
            <br /><br />
            Esta ação irá apenas remover o acesso do cliente a este vídeo. O vídeo não será deletado permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDeleteVideo(videoId, videoTitle)}
            className="bg-red-600 hover:bg-red-700"
          >
            Sim, remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};