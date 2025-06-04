
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Sparkles } from 'lucide-react';
import { Advertisement } from '@/types/advertisement';

interface AdvertisementBannerProps {
  advertisement: Advertisement;
}

export const AdvertisementBanner = ({
  advertisement
}: AdvertisementBannerProps) => {
  const handleClick = () => {
    window.open(advertisement.link_url, '_blank', 'noopener,noreferrer');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer border-l-2 border-l-blue-400 bg-gradient-to-r from-blue-50 to-white" onClick={handleClick}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-3">
          {/* Imagem e título */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-md flex items-center justify-center flex-shrink-0">
              {advertisement.image_url ? (
                <img 
                  src={advertisement.image_url} 
                  alt={advertisement.title} 
                  className="w-full h-full object-cover rounded-md" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                    }
                  }}
                />
              ) : (
                <ImageIcon className="h-4 w-4 text-blue-600" />
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h3 className="font-semibold text-sm text-blue-600 truncate">
                  {advertisement.title}
                </h3>
                <Sparkles className="h-3 w-3 text-blue-400 flex-shrink-0" />
              </div>
              {advertisement.description && (
                <p className="text-xs text-gray-600 truncate">
                  {advertisement.description}
                </p>
              )}
            </div>
          </div>

          {/* Preço e Botão */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {advertisement.price && (
              <div className="bg-blue-100 px-2 py-1 rounded text-xs font-semibold text-blue-700">
                {formatPrice(advertisement.price)}
              </div>
            )}
            
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }} 
              className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 h-7"
            >
              <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
              </svg>
              EU QUERO
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
