import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';
import { VideoShareButton } from './VideoShareButton';
import { VideoDeleteConfirmation } from './VideoDeleteConfirmation';

interface VideoActionButtonsProps {
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  clientName: string;
  deletingVideoId: string | null;
  onEditVideo: (videoId: string) => void;
  onDeleteVideo: (videoId: string, videoTitle: string) => void;
}

export const VideoActionButtons = ({
  videoId,
  videoTitle,
  videoUrl,
  clientName,
  deletingVideoId,
  onEditVideo,
  onDeleteVideo
}: VideoActionButtonsProps) => {
  return (
    <div className="flex gap-1">
      <VideoShareButton videoId={videoId} />
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onEditVideo(videoId)}
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
      >
        <Edit className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => window.open(videoUrl, '_blank')}
        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      <VideoDeleteConfirmation
        videoId={videoId}
        videoTitle={videoTitle}
        clientName={clientName}
        deletingVideoId={deletingVideoId}
        onDeleteVideo={onDeleteVideo}
      />
    </div>
  );
};