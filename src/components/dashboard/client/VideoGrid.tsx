import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Video, Clock } from 'lucide-react';
import { VideoCard } from './VideoCard';
import { ClientVideo } from '@/types/clientVideo';

interface VideoGridProps {
  videos: ClientVideo[];
  isLoading: boolean;
  searchTerm: string;
  selectedCategory: string;
}

export const VideoGrid = ({ videos, isLoading, searchTerm, selectedCategory }: VideoGridProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-lg flex items-center justify-center">
            <Video className="h-12 w-12 text-gray-400" />
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2">
              {searchTerm || selectedCategory ? 'Nenhum vídeo encontrado' : 'Ainda não existem vídeos para visualizar'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {searchTerm || selectedCategory 
                ? 'Tente ajustar os filtros de busca para encontrar outros vídeos.'
                : 'Seus vídeos aparecerão aqui quando o administrador conceder acesso.'
              }
            </p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {searchTerm || selectedCategory ? 'Nenhum resultado' : 'Aguardando conteúdo'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};
