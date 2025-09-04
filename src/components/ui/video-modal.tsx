
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
import { forceHttps, generateShareUrl } from '@/utils/urlUtils';

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
  // Força HTTPS em todas as URLs
  const httpsUrl = forceHttps(url);
  
  const screenPalMatch = httpsUrl.match(/screenpal\.com\/watch\/([^/?&#]+)/);
  if (screenPalMatch) {
    return `https://screenpal.com/embed/${screenPalMatch[1]}`;
  }
  
  if (httpsUrl.includes('/embed/')) {
    return httpsUrl;
  }
  
  const youtubeMatch = httpsUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  
  const vimeoMatch = httpsUrl.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  return httpsUrl;
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
    const shareUrl = generateShareUrl(`?video=${video.id}`);
    
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
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] sm:h-[85vh] md:h-[80vh] p-0 max-h-[100dvh] overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-3 sm:p-4 md:p-6 pb-1 sm:pb-2 md:pb-4 flex-shrink-0">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-2 lg:space-y-0">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 break-words hyphens-auto leading-tight">
                  {video.title}
                </DialogTitle>
                
                {video.description && (
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 break-words line-clamp-2 sm:line-clamp-none">
                    {video.description}
                  </p>
                )}
                
                <div className="flex flex-wrap sm:flex-row items-center gap-1 sm:gap-2 md:gap-4 text-xs text-gray-500 mb-2 sm:mb-3">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="hidden sm:inline">Publicado em </span>
                    <span>{format(new Date(video.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="hidden sm:inline">às </span>
                    <span>{format(new Date(video.created_at), 'HH:mm', { locale: ptBR })}</span>
                  </div>
                  {watchDuration > 0 && (
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span>{formatDuration(watchDuration)}</span>
                      {isValidView && (
                        <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs bg-green-100 text-green-700 px-1 py-0">
                          ✓
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleShareVideo}
                    className="text-xs h-7 sm:h-8"
                  >
                    {isLinkCopied ? (
                      <>
                        <Check className="h-3 w-3 mr-1 text-green-600" />
                        <span className="hidden sm:inline">Link copiado!</span>
                        <span className="sm:hidden">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Compartilhar</span>
                        <span className="sm:hidden">Share</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {video.category && getCategoryColor && (
                <Badge className={`${getCategoryColor(video.category)} flex-shrink-0 mt-2 lg:mt-0 self-start`}>
                  {video.category}
                </Badge>
              )}
            </div>
          </DialogHeader>
          
          <div className="flex-1 px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 overflow-hidden min-h-0">
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
