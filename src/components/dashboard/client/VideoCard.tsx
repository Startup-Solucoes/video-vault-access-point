import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Calendar, Clock, Play } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VideoModal } from '@/components/ui/video-modal';
import { getVideoThumbnail } from '@/utils/videoThumbnails';
import { ClientVideo } from '@/types/clientVideo';

interface VideoCardProps {
  video: ClientVideo;
}

// Cores para cada categoria (mesmas do CategoryFilter)
const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'Gerais': 'bg-blue-600 text-white',
    'Produto': 'bg-green-600 text-white',
    'Financeiro': 'bg-yellow-600 text-white',
    'Relatórios': 'bg-purple-600 text-white',
    'Pedidos de venda': 'bg-orange-600 text-white',
    'Fiscal': 'bg-red-600 text-white',
    'Integrações': 'bg-teal-600 text-white',
    'Serviços': 'bg-indigo-600 text-white'
  };
  
  // Cor padrão se a categoria não estiver mapeada
  return colors[category] || 'bg-gray-600 text-white';
};

export const VideoCard = ({ video }: VideoCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const autoThumbnail = getVideoThumbnail(video.video_url);
  const thumbnailUrl = video.thumbnail_url || autoThumbnail;
  const categoryColors = video.category ? getCategoryColor(video.category) : '';

  const handleWatchVideo = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer w-full max-w-full overflow-hidden" onClick={handleWatchVideo}>
        <CardContent className="p-0">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg flex items-center justify-center relative overflow-hidden">
            {thumbnailUrl ? (
              <div className="relative w-full h-full">
                <img 
                  src={thumbnailUrl} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Se a imagem falhar ao carregar, mostra o ícone padrão
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="h-12 w-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></div>';
                    }
                  }}
                />
                
                {/* Overlay de play */}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-white bg-opacity-90 rounded-full p-3">
                    <Play className="h-8 w-8 text-blue-600 fill-current" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center relative">
                <Video className="h-12 w-12 text-blue-500" />
                
                {/* Overlay de play para vídeos sem thumbnail */}
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-white bg-opacity-90 rounded-full p-3">
                    <Play className="h-8 w-8 text-blue-600 fill-current" />
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
                className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
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
