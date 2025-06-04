
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
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200" onClick={handleClick}>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Header com título e indicador */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 rounded-lg flex items-center justify-center relative overflow-hidden">
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
                      parent.innerHTML = '<svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                    }
                  }}
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-yellow-600" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xl text-yellow-600 leading-tight">
                  {advertisement.title}
                </h3>
                <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Descrição */}
          {advertisement.description && (
            <div className="bg-white/50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {advertisement.description}
              </p>
            </div>
          )}

          {/* Preço e Botão */}
          <div className="flex flex-col items-center space-y-3">
            {advertisement.price && (
              <div className="bg-yellow-100 px-6 py-2 rounded-full border-2 border-yellow-200">
                <span className="font-bold text-yellow-700 text-xl">
                  {formatPrice(advertisement.price)}
                </span>
              </div>
            )}
            
            <Button 
              size="lg" 
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }} 
              className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 font-semibold text-lg w-full max-w-xs"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              EU QUERO
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Clique para entrar em contato
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
