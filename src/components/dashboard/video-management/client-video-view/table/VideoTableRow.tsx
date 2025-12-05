import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from 'lucide-react';
import { ClientVideoData } from '@/hooks/useClientVideos';
import { getCategoryColor } from '@/utils/categoryColors';
import { VideoActionButtons } from './VideoActionButtons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

// Parse categories from string (comma or newline separated)
const parseCategories = (category: string | null): string[] => {
  if (!category) return [];
  return category
    .split(/[,\n]/)
    .map(cat => cat.trim())
    .filter(cat => cat.length > 0);
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
  const categories = parseCategories(video.category);
  const hasMultipleCategories = categories.length > 1;

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
            <div className="text-sm text-muted-foreground line-clamp-2">
              {video.description}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        {categories.length > 0 ? (
          <div className="flex items-center gap-1">
            <Badge className={`font-semibold border-0 text-xs ${getCategoryColor(categories[0])}`}>
              {categories[0]}
            </Badge>
            {hasMultipleCategories && (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span 
                      className="inline-flex items-center justify-center cursor-pointer text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground hover:bg-accent transition-colors"
                    >
                      +{categories.length - 1}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right" align="start" className="p-2 z-50">
                    <div className="flex flex-col gap-1.5">
                      {categories.slice(1).map((cat, idx) => (
                        <Badge 
                          key={idx} 
                          className={`font-semibold border-0 text-xs whitespace-nowrap ${getCategoryColor(cat)}`}
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">Sem categoria</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDate(video.created_at)}
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