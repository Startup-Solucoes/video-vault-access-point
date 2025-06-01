
import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ClientSelector, ClientSelectorRef } from './ClientSelector';
import { VideoFormFields } from './video-form/VideoFormFields';
import { CategorySelector } from './video-form/CategorySelector';
import { PlatformSelector } from './video-form/PlatformSelector';
import { PublishDateTimeSelector } from './video-form/PublishDateTimeSelector';
import { useVideoForm } from './video-form/useVideoForm';
import { VideoFormProps } from './video-form/VideoFormTypes';
import { useCacheInvalidation } from '@/hooks/useCacheInvalidation';

export const VideoForm = ({ open, onOpenChange, onVideoCreated }: VideoFormProps) => {
  const clientSelectorRef = useRef<ClientSelectorRef>(null);
  const { invalidateVideoCache } = useCacheInvalidation();
  
  const {
    formData,
    isLoading,
    handleFieldChange,
    handleCategoryChange,
    handleClientChange,
    handleDateTimeChange,
    handlePlatformChange,
    handleSubmit
  } = useVideoForm(() => {
    onOpenChange(false);
    // Invalidar cache e chamar callback quando o vídeo for criado com sucesso
    invalidateVideoCache();
    if (onVideoCreated) {
      onVideoCreated();
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Vídeo Aula</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para adicionar uma nova vídeo aula ao sistema.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <VideoFormFields 
            formData={formData}
            onFieldChange={handleFieldChange}
          />

          <CategorySelector
            selectedCategories={formData.selectedCategories}
            onCategoryChange={handleCategoryChange}
          />

          <PlatformSelector
            selectedPlatform={formData.platform}
            onPlatformChange={handlePlatformChange}
          />

          <div className="space-y-2">
            <Label>Clientes com Acesso</Label>
            <ClientSelector
              ref={clientSelectorRef}
              selectedClients={formData.selectedClients}
              onClientChange={handleClientChange}
            />
            <p className="text-xs text-gray-500">
              Selecione quais clientes terão acesso a este vídeo
            </p>
          </div>

          <PublishDateTimeSelector
            publishDateTime={formData.publishDateTime}
            onDateTimeChange={handleDateTimeChange}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Vídeo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
