
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Play } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VideoModal } from '@/components/ui/video-modal';
import { ClientVideo } from '@/types/clientVideo';
import { getCategoryColor } from '@/utils/categoryColors';
import { getPlatformColor, getPlatformName, getPlatformLogo } from '@/utils/platformImages';

interface VideoCardProps {
  video: ClientVideo;
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const categoryColors = video.category ? getCategoryColor(video.category) : '';
  const platformColor = getPlatformColor(video.platform || 'outros');
  const platformName = getPlatformName(video.platform || 'outros');
  const platformLogo = getPlatformLogo(video.platform || 'outros');

  // Preload da imagem
  useEffect(() => {
    if (platformLogo) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageError(true);
      img.src = platformLogo;
    } else {
      setImageLoaded(true); // Se não há logo, considera carregado
    }
  }, [platformLogo]);

  const handleWatchVideo = () => {
    setIsModalOpen(true);
  };

  const renderPlatformContent = () => {
    if (platformLogo && !imageError && imageLoaded) {
      return (
        <img
          src={platformLogo}
          alt={`${platformName} logo`}
          className="w-full h-full object-cover"
          loading="eager"
        />
      );
    }
    
    // Fallback para quando não há imagem ou erro no carregamento
    return (
      <div className="w-full h-full bg-white bg-opacity-20 rounded flex items-center justify-center text-4xl font-bold text-white">
        {platformName.charAt(0)}
      </div>
    );
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer w-full max-w-full overflow-hidden" onClick={handleWatchVideo}>
        <CardContent className="p-0">
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center relative overflow-hidden">
            {/* Container da imagem/logo da plataforma */}
            <div 
              className="w-full h-full flex items-center justify-center relative"
              style={{ 
                background: `linear-gradient(135deg, ${platformColor}, ${platformColor}dd)` 
              }}
            >
              {/* Skeleton loader enquanto carrega */}
              {!imageLoaded && !imageError && platformLogo && (
                <div className="w-full h-full bg-white bg-opacity-10 animate-pulse flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg animate-pulse"></div>
                </div>
              )}
              
              {/* Conteúdo da plataforma (imagem ou fallback) */}
              <div className={`w-full h-full ${!imageLoaded && !imageError && platformLogo ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                {renderPlatformContent()}
              </div>
              
              {/* Overlay de play */}
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="bg-white bg-opacity-90 rounded-full p-3">
                  <Play className="h-8 w-8 text-gray-700 fill-current" />
                </div>
              </div>
            </div>
            
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
