
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  category: string | null;
  created_at: string;
  permission_created_at: string;
}

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

// Função para extrair thumbnail de URLs de vídeo
const getVideoThumbnail = (videoUrl: string): string | null => {
  if (!videoUrl) return null;

  // YouTube
  const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
  }

  // Vimeo
  const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    // Para Vimeo seria necessário fazer uma chamada à API, então retornamos null por enquanto
    return null;
  }

  // Outros provedores podem ser adicionados aqui
  return null;
};

export const VideoCard = ({ video }: VideoCardProps) => {
  const autoThumbnail = getVideoThumbnail(video.video_url);
  const thumbnailUrl = video.thumbnail_url || autoThumbnail;
  const categoryColors = video.category ? getCategoryColor(video.category) : '';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg flex items-center justify-center relative overflow-hidden">
          {thumbnailUrl ? (
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
          ) : (
            <Video className="h-12 w-12 text-blue-500" />
          )}
          
          {/* Badge da categoria com cores customizadas */}
          {video.category && (
            <Badge 
              className={`absolute top-2 right-2 font-semibold border-0 ${categoryColors}`}
            >
              {video.category}
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          {/* Título */}
          <h3 className="font-semibold mb-2 line-clamp-2 text-gray-900">
            {video.title}
          </h3>
          
          {/* Descrição */}
          {video.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
              {video.description}
            </p>
          )}
          
          {/* Data de publicação */}
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Publicado em {format(new Date(video.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
          </div>
          
          {/* Horário de publicação */}
          <div className="flex items-center text-xs text-gray-500 mb-4">
            <Clock className="h-3 w-3 mr-1" />
            <span>às {format(new Date(video.created_at), 'HH:mm', { locale: ptBR })}</span>
          </div>
          
          {/* Botão de assistir */}
          <div className="flex justify-end">
            <Button 
              size="sm"
              onClick={() => window.open(video.video_url, '_blank')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Video className="h-3 w-3 mr-1" />
              Assistir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
