
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
      <CardContent className="space-y-2">
        {/* Opção "Todas" */}
        <Button
          variant={selectedPlatform === '' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPlatformChange('')}
          className={`w-full justify-start font-medium ${
            selectedPlatform === '' 
              ? 'bg-slate-800 hover:bg-slate-900 text-white' 
              : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-gray-100 to-gray-200">
              <Monitor className="h-3 w-3 text-gray-600" />
            </div>
            <div className="flex flex-1 items-center justify-between">
              <span>Todas</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">
                {totalVideos}
              </span>
            </div>
            {selectedPlatform === '' && (
              <Check className="h-4 w-4" />
            )}
          </div>
        </Button>

        {/* Lista de plataformas */}
        {availablePlatforms.map((platform) => {
          const videoCount = getVideoCountForPlatform(platform.id);
          const isSelected = selectedPlatform === platform.id;
          const platformColors = getPlatformColor(platform.id);
          
          return (
            <Button
              key={platform.id}
              variant="outline"
              size="sm"
              onClick={() => onPlatformChange(platform.id)}
              className={`w-full justify-start font-medium transition-all duration-200 ${
                isSelected 
                  ? `${platformColors} shadow-md border`
                  : `border text-gray-600 hover:text-white ${platformColors} opacity-70 hover:opacity-100`
              }`}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-white/20">
                  {platform.logo ? (
                    <img
                      src={platform.logo}
                      alt={platform.name}
                      className="h-3 w-3 rounded object-contain"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=16&h=16&fit=crop';
                      }}
                    />
                  ) : (
                    <Monitor className="h-3 w-3" />
                  )}
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-sm">{platform.name}</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    {videoCount}
                  </span>
                </div>
                {isSelected && (
                  <Check className="h-4 w-4" />
                )}
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};
