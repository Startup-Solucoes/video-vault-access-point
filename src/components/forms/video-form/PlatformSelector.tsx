
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { platforms } from './VideoFormTypes';

interface PlatformSelectorProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatform,
  onPlatformChange
}) => {
  return (
    <div className="space-y-3">
      <Label>Plataforma do Vídeo</Label>
      <RadioGroup
        value={selectedPlatform}
        onValueChange={onPlatformChange}
        className="grid grid-cols-2 gap-4"
      >
        {platforms.map((platform) => (
          <div key={platform.id} className="flex items-center space-x-3">
            <RadioGroupItem 
              value={platform.id} 
              id={platform.id}
              className="mt-0.5"
            />
            <Label
              htmlFor={platform.id}
              className="flex items-center space-x-2 cursor-pointer flex-1"
            >
              <img
                src={platform.logo}
                alt={platform.name}
                className="w-10 h-10 rounded object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=40&h=40&fit=crop';
                }}
              />
              <span className="text-sm">{platform.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
      <p className="text-xs text-gray-500">
        Selecione a plataforma relacionada ao conteúdo do vídeo
      </p>
    </div>
  );
};
