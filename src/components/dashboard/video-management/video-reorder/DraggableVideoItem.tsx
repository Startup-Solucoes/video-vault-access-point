
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Eye } from 'lucide-react';

interface VideoWithOrder {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  category?: string;
  created_at: string;
  permission_id: string;
  display_order: number;
}

interface DraggableVideoItemProps {
  video: VideoWithOrder;
  index: number;
}

export const DraggableVideoItem: React.FC<DraggableVideoItemProps> = ({
  video,
  index
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Draggable key={video.id} draggableId={video.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`transition-shadow ${
            snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div
                {...provided.dragHandleProps}
                className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="h-5 w-5" />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 min-w-[40px]">
                #{index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {video.title}
                    </h4>
                    {video.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      {video.category && (
                        <Badge variant="secondary" className="text-xs">
                          {video.category}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        Criado em {formatDate(video.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(video.video_url, '_blank')}
                    className="flex items-center gap-1 shrink-0"
                  >
                    <Eye className="h-3 w-3" />
                    Ver
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};
