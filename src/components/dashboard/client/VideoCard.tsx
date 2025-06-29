import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Calendar, Clock, Play } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VideoModal } from '@/components/ui/video-modal';
import { ClientVideo } from '@/types/clientVideo';
import { getCategoryColor } from '@/utils/categoryColors';
import { getPlatformColor, getPlatformIcon } from '@/utils/platformImages';

interface VideoCardProps {
  video: ClientVideo;
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const categoryColors = video.category ? getCategoryColor(video.category) : '';

  const platformColor = getPlatformColor(video.platform || 'outros');
  const PlatformIcon = getPlatformIcon(video.platform || 'outros');

  const handleWatchVideo = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer w-full max-w-full overflow-hidden" onClick={handleWatchVideo}>
        <CardContent className="p-0">
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center relative overflow-hidden">
            {video.thumbnail_url ? (
              <div className="relative w-full h-full">
                <img 
                  src={video.thumbnail_url} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Se falhar, usar imagem da plataforma com ícone
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center text-white font-bold text-lg" style="background: linear-gradient(135deg, ${platformColor}, ${platformColor}dd)">
                          <div class="mb-2">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              ${PlatformIcon.toString()}
                            </svg>
                          </div>
                          <span>${video.platform ? video.platform.charAt(0).toUpperCase() + video.platform.slice(1) : 'Vídeo'}</span>
                        </div>
                      `;
                    }
                  }}
                />
                
                {/* Overlay de play */}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-white bg-opacity-90 rounded-full p-3">
                    <Play className="h-8 w-8 text-gray-700 fill-current" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {/* Imagem automática da plataforma com ícone */}
                <div 
                  className="w-full h-full flex flex-col items-center justify-center text-white font-bold text-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${platformColor}, ${platformColor}dd)` 
                  }}
                >
                  <div className="mb-2">
                    <PlatformIcon className="h-12 w-12" />
                  </div>
                  <span>{video.platform ? video.platform.charAt(0).toUpperCase() + video.platform.slice(1) : 'Vídeo'}</span>
                </div>
                
                {/* Overlay de play para vídeos sem thumbnail */}
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-white bg-opacity-90 rounded-full p-3">
                    <Play className="h-8 w-8 text-gray-700 fill-current" />
                  </div>
                </div>
              </div>
            )}
            
            {/* Badge da categoria com cores customizadas */}
            {video.category && (
              <Badge 
                className={`absolute top-2 right-2 font-semibold border-0 text-xs ${categoryColors}`}
              >
                {video.category}
              </Badge>
            )}
          </div>
          
          <div className="p-3 sm:p-4">
            {/* Título */}
            <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-900 break-words hyphens-auto leading-tight">
              {video.title}
            </h3>
            
            {/* Descrição */}
            {video.description && (
              <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-3 break-words">
                {video.description}
              </p>
            )}
            
            {/* Data de publicação */}
            <div className="flex items-center text-xs text-gray-500 mb-2">
              <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">Publicado em {format(new Date(video.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
            </div>
            
            {/* Horário de publicação */}
            <div className="flex items-center text-xs text-gray-500 mb-4">
              <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
              <span>às {format(new Date(video.created_at), 'HH:mm', { locale: ptBR })}</span>
            </div>
            
            {/* Botão de assistir */}
            <div className="flex justify-end">
              <Button 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWatchVideo();
                }}
                className="bg-gray-700 hover:bg-gray-800 text-xs sm:text-sm"
              >
                <Play className="h-3 w-3 mr-1" />
                Assistir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <VideoModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        video={video}
        getCategoryColor={getCategoryColor}
      />
    </>
  );
};
