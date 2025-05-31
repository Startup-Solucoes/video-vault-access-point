
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface VideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: {
    id: string;
    title: string;
    description: string | null;
    video_url: string;
    category: string | null;
    created_at: string;
  };
  getCategoryColor?: (category: string) => string;
}

// Função para extrair o embed URL do ScreenPal
const getScreenPalEmbedUrl = (url: string): string => {
  // ScreenPal URLs geralmente seguem o padrão: https://screenpal.com/watch/[VIDEO_ID]
  const screenPalMatch = url.match(/screenpal\.com\/watch\/([^/?&#]+)/);
  if (screenPalMatch) {
    return `https://screenpal.com/embed/${screenPalMatch[1]}`;
  }
  
  // Se já for uma URL de embed, retorna como está
  if (url.includes('/embed/')) {
    return url;
  }
  
  // YouTube fallback
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  
  // Vimeo fallback
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  // Se não conseguir identificar o provedor, retorna a URL original
  return url;
};

export const VideoModal = ({ open, onOpenChange, video, getCategoryColor }: VideoModalProps) => {
  const embedUrl = getScreenPalEmbedUrl(video.video_url);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-xl font-semibold mb-2">
                  {video.title}
                </DialogTitle>
                
                {video.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {video.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Publicado em {format(new Date(video.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>às {format(new Date(video.created_at), 'HH:mm', { locale: ptBR })}</span>
                  </div>
                </div>
              </div>
              
              {video.category && getCategoryColor && (
                <Badge className={getCategoryColor(video.category)}>
                  {video.category}
                </Badge>
              )}
            </div>
          </DialogHeader>
          
          <div className="flex-1 px-6 pb-6">
            <div className="w-full h-full bg-black rounded-lg overflow-hidden">
              <iframe
                src={embedUrl}
                title={video.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
