
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Sparkles } from 'lucide-react';
import { Advertisement } from '@/types/advertisement';

interface ServiceCardProps {
  advertisement: Advertisement;
}

export const ServiceCard = ({ advertisement }: ServiceCardProps) => {
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
    <Card 
      className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-yellow-400 bg-gradient-to-br from-yellow-50 via-white to-orange-50 overflow-hidden"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        {/* Service Image */}
        <div className="aspect-video bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center overflow-hidden relative">
          {advertisement.image_url ? (
            <div className="relative w-full h-full">
              <img 
                src={advertisement.image_url} 
                alt={advertisement.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="h-12 w-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                  }
                }}
              />
              <div className="absolute top-3 right-3">
                <div className="bg-yellow-500 text-white p-2 rounded-full shadow-lg">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center relative">
              <Star className="h-16 w-16 text-yellow-600" />
              <div className="absolute top-3 right-3">
                <div className="bg-yellow-500 text-white p-2 rounded-full shadow-lg">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Card Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-700 transition-colors">
              {advertisement.title}
            </h3>
            
            {/* Description */}
            {advertisement.description && (
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {advertisement.description}
              </p>
            )}
            
            {/* Price */}
            {advertisement.price && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-md text-center">
                {formatPrice(advertisement.price)}
              </div>
            )}
            
            {/* Action Button */}
            <Button 
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Solicitar Serviço
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
