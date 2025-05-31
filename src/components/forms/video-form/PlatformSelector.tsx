
import React from 'react';
import { Label } from '@/components/ui/label';
import { platforms } from './VideoFormTypes';
import { Check } from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatform,
  onPlatformChange
}) => {
  console.log('🎯 PlatformSelector - Plataforma selecionada:', selectedPlatform);

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Escolha a plataforma</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {platforms.map((platform) => {
          const isSelected = selectedPlatform === platform.id;
          console.log(`🏪 Plataforma ${platform.name} - Selecionada: ${isSelected}`);
          
          return (
            <div
              key={platform.id}
              onClick={() => {
                console.log(`🔄 Mudando plataforma para: ${platform.id}`);
                onPlatformChange(platform.id);
              }}
              className={`
                relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}
              
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
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
                    <div className="h-6 w-6 bg-gray-300 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-600">?</span>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-center leading-tight">
                  {platform.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500">
        Selecione a plataforma relacionada ao conteúdo do vídeo
      </p>
    </div>
  );
};
