
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
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-yellow-400 bg-gradient-to-br from-yellow-50 via-white to-orange-50" onClick={handleClick}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header com título e ícone */}
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-gray-900 leading-tight">
              {advertisement.title}
            </h3>
          </div>

          {/* Imagem destacada */}
          <div className="w-full h-48 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center overflow-hidden">
            {advertisement.image_url ? (
              <img 
                src={advertisement.image_url} 
                alt={advertisement.title}
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<svg class="h-16 w-16 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                  }
                }}
              />
            ) : (
              <ImageIcon className="h-16 w-16 text-yellow-600" />
            )}
          </div>

          {/* Descrição */}
          {advertisement.description && (
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
              {advertisement.description}
            </p>
          )}

          {/* Preço e botão de ação */}
          <div className="flex items-center justify-between pt-2">
            {advertisement.price && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-md">
                {formatPrice(advertisement.price)}
              </div>
            )}
            
            <Button 
              size="lg" 
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }} 
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              EU QUERO
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
