
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Image as ImageIcon, Sparkles } from 'lucide-react';
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
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-yellow-400 bg-gradient-to-br from-yellow-50 via-white to-orange-50 h-full" onClick={handleClick}>
      <CardContent className="p-4 h-full flex flex-col">
        <div className="space-y-3 flex-1">
          {/* Header com título e ícone */}
          <div className="flex items-start gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <h3 className="font-bold text-base text-gray-900 leading-tight flex-1">
              {advertisement.title}
            </h3>
          </div>

          {/* Imagem destacada */}
          <div className="w-full h-32 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center overflow-hidden">
            {advertisement.image_url ? (
              <img 
                src={advertisement.image_url} 
                alt={advertisement.title}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<svg class="h-12 w-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                  }
                }}
              />
            ) : (
              <ImageIcon className="h-12 w-12 text-yellow-600" />
            )}
          </div>

          {/* Descrição */}
          {advertisement.description && (
            <p className="text-gray-700 text-xs leading-relaxed line-clamp-2 flex-1">
              {advertisement.description}
            </p>
          )}
        </div>

        {/* Preço e botão de ação - sempre no final */}
        <div className="mt-3 space-y-2">
          {advertisement.price && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1.5 rounded-md font-bold text-sm shadow-md text-center">
              {formatPrice(advertisement.price)}
            </div>
          )}
          
          <Button 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }} 
            className="bg-green-500 hover:bg-green-600 text-white font-semibold w-full text-xs py-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            EU QUERO
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
