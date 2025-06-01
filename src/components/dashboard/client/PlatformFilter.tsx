
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Check } from 'lucide-react';
import { platforms } from '@/components/forms/video-form/VideoFormTypes';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PlatformFilterProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  videos: any[];
}

// Cores para cada plataforma
const getPlatformColor = (platformId: string) => {
  const colors: { [key: string]: string } = {
    'site': 'bg-blue-600 hover:bg-blue-700 text-white border-blue-300',
    'whatsapp': 'bg-green-600 hover:bg-green-700 text-white border-green-300',
    'youtube': 'bg-red-600 hover:bg-red-700 text-white border-red-300',
    'instagram': 'bg-purple-600 hover:bg-purple-700 text-white border-purple-300',
    'tiktok': 'bg-gray-900 hover:bg-black text-white border-gray-300',
    'facebook': 'bg-blue-800 hover:bg-blue-900 text-white border-blue-300',
    'linkedin': 'bg-blue-700 hover:bg-blue-800 text-white border-blue-300',
    'twitter': 'bg-sky-500 hover:bg-sky-600 text-white border-sky-300'
  };
  
  return colors[platformId] || 'bg-gray-600 hover:bg-gray-700 text-white border-gray-300';
};

export const PlatformFilter = ({
  selectedPlatform,
  onPlatformChange,
  videos
}: PlatformFilterProps) => {
  // Contar vídeos por plataforma
  const getVideoCountForPlatform = (platformId: string) => {
    return videos.filter(video => video.platform === platformId).length;
  };

  // Obter plataformas que têm vídeos
  const availablePlatforms = platforms.filter(platform => 
    getVideoCountForPlatform(platform.id) > 0
  );

  const totalVideos = videos.length;

  if (availablePlatforms.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Monitor className="h-5 w-5 text-blue-600" />
          Plataformas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Carousel className="w-full max-w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              <CarouselItem className="pl-2 md:pl-4 basis-auto">
                <Button
                  variant={selectedPlatform === '' ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => onPlatformChange('')}
                  className={`whitespace-nowrap font-semibold flex items-center gap-3 ${
                    selectedPlatform === '' 
                      ? 'bg-slate-800 hover:bg-slate-900 text-white' 
                      : 'border-2 border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-gray-100 to-gray-200">
                    <Monitor className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Todas</span>
                    <span className="text-xs opacity-80">{totalVideos} vídeos</span>
                  </div>
                  {selectedPlatform === '' && (
                    <Check className="h-4 w-4" />
                  )}
                </Button>
              </CarouselItem>

              {availablePlatforms.map((platform) => {
                const videoCount = getVideoCountForPlatform(platform.id);
                const isSelected = selectedPlatform === platform.id;
                const platformColors = getPlatformColor(platform.id);
                
                return (
                  <CarouselItem key={platform.id} className="pl-2 md:pl-4 basis-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => onPlatformChange(platform.id)}
                      className={`whitespace-nowrap font-semibold transition-all duration-200 flex items-center gap-3 ${
                        isSelected 
                          ? `${platformColors} shadow-lg border-2`
                          : `border-2 text-gray-600 hover:text-white ${platformColors} opacity-80 hover:opacity-100 hover:shadow-md`
                      }`}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-white/20">
                        {platform.logo ? (
                          <img
                            src={platform.logo}
                            alt={platform.name}
                            className="h-4 w-4 rounded object-contain"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=16&h=16&fit=crop';
                            }}
                          />
                        ) : (
                          <Monitor className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-sm">{platform.name}</span>
                        <span className="text-xs opacity-80">
                          {videoCount} {videoCount === 1 ? 'vídeo' : 'vídeos'}
                        </span>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </CardContent>
    </Card>
  );
};
