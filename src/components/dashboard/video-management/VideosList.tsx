
import React from 'react';
import { Video } from 'lucide-react';
import { VideoItem } from './VideoItem';

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

interface VideosListProps {
  videos: VideoData[];
  selectedVideos: string[];
  onVideoSelect: (videoId: string, checked: boolean) => void;
}

export const VideosList: React.FC<VideosListProps> = ({
  videos,
  selectedVideos,
  onVideoSelect
}) => {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <Video className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum vídeo cadastrado
        </h3>
        <p className="text-gray-500">
          Cadastre vídeos para começar a gerenciar as permissões
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <VideoItem
          key={video.id}
          video={video}
          isSelected={selectedVideos.includes(video.id)}
          onSelect={onVideoSelect}
        />
      ))}
    </div>
  );
};
