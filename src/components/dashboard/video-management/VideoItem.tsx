import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag } from 'lucide-react';
import { getCategoryColor } from '@/utils/categoryColors';

interface VideoData {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  platform?: string;
  category?: string;
  tags?: string[];
  created_at: string;
  created_by: string;
}

interface VideoItemProps {
  video: VideoData;
  isSelected: boolean;
  onSelect: (videoId: string, checked: boolean) => void;
}

export const VideoItem: React.FC<VideoItemProps> = ({
  video,
  isSelected,
  onSelect
}) => {
  return (
    <div className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
      <Checkbox
        checked={isSelected}
        onCheckedChange={(checked) => onSelect(video.id, checked as boolean)}
      />
      
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {video.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>{new Date(video.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        
        {video.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {video.description}
          </p>
        )}
        
        <div className="flex items-center space-x-4">
          {video.platform && (
            <Badge variant="secondary">
              {video.platform}
            </Badge>
          )}
          {video.category && (
            <Badge className={`font-semibold border-0 ${getCategoryColor(video.category)}`}>
              {video.category}
            </Badge>
          )}
          {video.tags && video.tags.length > 0 && (
            <div className="flex items-center space-x-1">
              <Tag className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {video.tags.slice(0, 3).join(', ')}
                {video.tags.length > 3 && ` +${video.tags.length - 3}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
