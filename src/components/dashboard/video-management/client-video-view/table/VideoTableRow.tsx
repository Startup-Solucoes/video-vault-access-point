import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Eye } from 'lucide-react';
import { ClientVideoData } from '@/hooks/useClientVideos';
import { getCategoryColor } from '@/utils/categoryColors';
import { VideoActionButtons } from './VideoActionButtons';

interface VideoTableRowProps {
  video: ClientVideoData;
  index: number;
  isSelected: boolean;
  clientName: string;
  deletingVideoId: string | null;
  onVideoSelect: (videoId: string, checked: boolean) => void;
  onEditVideo: (videoId: string) => void;
  onDeleteVideo: (videoId: string, videoTitle: string) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const VideoTableRow = ({
  video,
  index,
  isSelected,
  clientName,
  deletingVideoId,
  onVideoSelect,
  onEditVideo,
  onDeleteVideo
}: VideoTableRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
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
        <VideoActionButtons
          videoId={video.id}
          videoTitle={video.title}
          videoUrl={video.video_url}
          clientName={clientName}
          deletingVideoId={deletingVideoId}
          onEditVideo={onEditVideo}
          onDeleteVideo={onDeleteVideo}
        />
      </TableCell>
    </TableRow>
  );
};