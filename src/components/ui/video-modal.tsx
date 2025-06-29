
import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye, Share2, Check } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useVideoViewing } from '@/hooks/useVideoViewing';

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

const getScreenPalEmbedUrl = (url: string): string => {
  const screenPalMatch = url.match(/screenpal\.com\/watch\/([^/?&#]+)/);
  if (screenPalMatch) {
    return `https://screenpal.com/embed/${screenPalMatch[1]}`;
  }
  
  if (url.includes('/embed/')) {
    return url;
  }
  
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  return url;
};

export const VideoModal = ({ open, onOpenChange, video, getCategoryColor }: VideoModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const embedUrl = getScreenPalEmbedUrl(video.video_url);
  
  const { watchDuration, viewRecorded, isValidView } = useVideoViewing({
    videoId: video.id,
    isPlaying
  });

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setIsPlaying(true);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setIsPlaying(false);
    }
  }, [open]);

  const handleShareVideo = async () => {
    const shareUrl = `${window.location.origin}/?video=${video.id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsLinkCopied(true);
      
      setTimeout(() => {
        setIsLinkCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[85vh] sm:h-[80vh] p-0 max-h-screen overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-4 sm:p-6 pb-2 sm:pb-4 flex-shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg sm:text-xl font-semibold mb-2 break-words hyphens-auto leading-tight">
                  {video.title}
                </DialogTitle>
                
                {video.description && (
                  <p className="text-sm text-gray-600 mb-3 break-words">
                    {video.description}
                  </p>
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>Publicado em {format(new Date(video.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>às {format(new Date(video.created_at), 'HH:mm', { locale: ptBR })}</span>
                  </div>
                  {watchDuration > 0 && (
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span>Assistido: {formatDuration(watchDuration)}</span>
                      {isValidView && (
                        <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-700">
                          Visualização contabilizada
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleShareVideo}
                    className="text-xs"
                  >
                    {isLinkCopied ? (
                      <>
                        <Check className="h-3 w-3 mr-1 text-green-600" />
                        Link copiado!
                      </>
                    ) : (
                      <>
                        <Share2 className="h-3 w-3 mr-1" />
                        Compartilhar
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {video.category && getCategoryColor && (
                <Badge className={`${getCategoryColor(video.category)} flex-shrink-0 mt-2 sm:mt-0`}>
                  {video.category}
                </Badge>
              )}
            </div>
          </DialogHeader>
          
          <div className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 overflow-hidden">
            <div className="w-full h-full bg-black rounded-lg overflow-hidden">
              <iframe
                ref={iframeRef}
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
