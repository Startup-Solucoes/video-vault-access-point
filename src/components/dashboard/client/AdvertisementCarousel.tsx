
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AdvertisementBanner } from './AdvertisementBanner';
import { Advertisement } from '@/types/advertisement';

interface AdvertisementCarouselProps {
  advertisements: Advertisement[];
}

export const AdvertisementCarousel = ({ advertisements }: AdvertisementCarouselProps) => {
  if (advertisements.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="h-6 w-6 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900">Serviços em destaque</h2>
          <div className="h-px bg-gradient-to-r from-yellow-400 to-transparent flex-1 ml-4"></div>
        </div>
        
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {advertisements.map((ad) => (
                <CarouselItem key={ad.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <AdvertisementBanner advertisement={ad} />
                </CarouselItem>
              ))}
            </CarouselContent>
            {advertisements.length > 4 && (
              <>
                <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2" />
              </>
            )}
          </Carousel>
        </div>
      </div>
    </div>
  );
};
