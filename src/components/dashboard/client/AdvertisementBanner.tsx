
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Advertisement } from '@/types/advertisement';

interface AdvertisementBannerProps {
  advertisement: Advertisement;
}

export const AdvertisementBanner = ({ advertisement }: AdvertisementBannerProps) => {
  const handleClick = () => {
    window.open(advertisement.link_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={handleClick}>
      <CardContent className="p-0">
        <div className="flex items-center h-24 sm:h-32">
          {/* Imagem */}
          <div className="w-20 sm:w-24 h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
            {advertisement.image_url ? (
              <img 
                src={advertisement.image_url} 
                alt={advertisement.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<svg class="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                  }
                }}
              />
            ) : (
              <ImageIcon className="h-8 w-8 text-blue-500" />
            )}
          </div>

          {/* Conteúdo */}
          <div className="flex-1 p-3 sm:p-4 min-w-0">
            <div className="flex justify-between items-start h-full">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 truncate">
                  {advertisement.title}
                </h3>
                {advertisement.description && (
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-tight">
                    {advertisement.description}
                  </p>
                )}
              </div>
              
              <Button
                size="sm"
                variant="outline"
                className="ml-2 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-1">Ver</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
