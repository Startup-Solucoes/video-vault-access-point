import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check } from 'lucide-react';
import { generateShareUrl } from '@/utils/urlUtils';

interface VideoShareButtonProps {
  videoId: string;
}

export const VideoShareButton = ({ videoId }: VideoShareButtonProps) => {
  const [copiedVideoId, setCopiedVideoId] = useState<string | null>(null);

  const handleShareVideo = async (videoId: string) => {
    const shareUrl = generateShareUrl(`?video=${videoId}`);
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedVideoId(videoId);
      
      setTimeout(() => {
        setCopiedVideoId(null);
      }, 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={() => handleShareVideo(videoId)}
      className="text-green-600 hover:text-green-700 hover:bg-green-50"
      title="Copiar link de compartilhamento"
    >
      {copiedVideoId === videoId ? (
        <Check className="h-4 w-4" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
    </Button>
  );
};