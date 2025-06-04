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
  return <Card className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer border-l-2 border-l-yellow-400 bg-gradient-to-r from-yellow-50 to-white" onClick={handleClick}>
      <CardContent className="p-2">
        <div className="flex items-stretch gap-2 h-16">
          {/* Imagem */}
          <div className="w-16 h-full bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
            {advertisement.image_url ? <img src={advertisement.image_url} alt={advertisement.title} className="w-full h-full object-cover rounded-md" onError={e => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = '<svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
            }
          }} /> : <ImageIcon className="h-6 w-6 text-yellow-600" />}
          </div>
          
          {/* Conteúdo */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1 mb-1">
              <h3 className="font-semibold text-sm truncate text-[#e4ae36]">
                {advertisement.title}
              </h3>
              <Sparkles className="h-3 w-3 text-yellow-400 flex-shrink-0" />
            </div>
            {advertisement.description && <p className="text-xs text-gray-600 truncate">
                {advertisement.description}
              </p>}
          </div>

          {/* Preço e Botão */}
          <div className="flex flex-col items-end justify-center gap-1 flex-shrink-0">
            {advertisement.price && <div className="bg-yellow-100 px-2 py-0.5 rounded text-xs font-semibold text-yellow-700">
                {formatPrice(advertisement.price)}
              </div>}
            
            <Button size="sm" onClick={e => {
            e.stopPropagation();
            handleClick();
          }} className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 h-6">
              <MessageCircle className="h-3 w-3 mr-1" />
              EU QUERO
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
};