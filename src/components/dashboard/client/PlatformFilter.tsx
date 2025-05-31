
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Check } from 'lucide-react';
import { platforms } from '@/components/forms/video-form/VideoFormTypes';

interface PlatformFilterProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  videos: any[];
}

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
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Monitor className="h-5 w-5 text-blue-600" />
          Plataformas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Filtro "Todas" */}
        <Button
          variant="ghost"
          onClick={() => onPlatformChange('')}
          className={`w-full justify-start p-3 h-auto transition-all duration-200 ${
            selectedPlatform === '' 
              ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 shadow-sm' 
              : 'hover:bg-gray-50 border border-transparent'
          }`}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
              <Monitor className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">Todas</div>
              <div className="text-xs text-gray-500">{totalVideos} vídeos</div>
            </div>
            {selectedPlatform === '' && (
              <Check className="h-4 w-4 text-blue-600" />
            )}
          </div>
        </Button>

        {/* Filtros por plataforma */}
        {availablePlatforms.map((platform) => {
          const videoCount = getVideoCountForPlatform(platform.id);
          const isSelected = selectedPlatform === platform.id;
          
          return (
            <Button
              key={platform.id}
              variant="ghost"
              onClick={() => onPlatformChange(platform.id)}
              className={`w-full justify-start p-3 h-auto transition-all duration-200 ${
                isSelected 
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 shadow-sm' 
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm">
                  {platform.logo ? (
                    <img
                      src={platform.logo}
                      alt={platform.name}
                      className="h-6 w-6 rounded object-contain"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=24&h=24&fit=crop';
                      }}
                    />
                  ) : (
                    <Monitor className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900 text-sm">
                    {platform.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {videoCount} {videoCount === 1 ? 'vídeo' : 'vídeos'}
                  </div>
                </div>
                {isSelected && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};
