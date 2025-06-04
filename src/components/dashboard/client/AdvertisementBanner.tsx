
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Advertisement } from '@/types/advertisement';

interface AdvertisementBannerProps {
  advertisement: Advertisement;
}

export const AdvertisementBanner = ({ advertisement }: AdvertisementBannerProps) => {
  const handleClick = () => {
    window.open(advertisement.link_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-gradient-to-b from-blue-500 to-purple-500 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100" onClick={handleClick}>
      <CardContent className="p-0">
        <div className="flex items-center h-28 sm:h-32">
          {/* Imagem */}
          <div className="w-24 sm:w-28 h-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
            {advertisement.image_url ? (
              <img 
                src={advertisement.image_url} 
                alt={advertisement.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg class="h-10 w-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                  }
                }}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <ImageIcon className="h-10 w-10 text-blue-500 opacity-60" />
              </div>
            )}
            {/* Efeito de brilho */}
            <div className="absolute top-2 right-2">
              <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 p-4 sm:p-5 min-w-0">
            <div className="flex justify-between items-start h-full">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {advertisement.title}
                  </h3>
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                </div>
                {advertisement.description && (
                  <p className="text-sm sm:text-base text-gray-700 line-clamp-2 leading-relaxed mb-3">
                    {advertisement.description}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full font-medium">
                    Anúncio
                  </span>
                  <span className="text-xs text-gray-500">Clique para saber mais</span>
                </div>
              </div>
              
              <Button
                size="sm"
                className="ml-3 flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-1">Ver mais</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
