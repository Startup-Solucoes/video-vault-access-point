
import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ClientSelector, ClientSelectorRef } from './ClientSelector';
import { VideoFormFields } from './video-form/VideoFormFields';
import { CategorySelector } from './video-form/CategorySelector';
import { PlatformSelector } from './video-form/PlatformSelector';
import { PublishDateTimeSelector } from './video-form/PublishDateTimeSelector';
import { useEditVideoForm } from './video-form/useEditVideoForm';
import { EditVideoFormProps } from './video-form/EditVideoFormTypes';
import { useCacheInvalidation } from '@/hooks/useCacheInvalidation';

export const EditVideoForm = ({ open, onOpenChange, videoId }: EditVideoFormProps) => {
  const clientSelectorRef = useRef<ClientSelectorRef>(null);
  const { invalidateVideoCache } = useCacheInvalidation();
  
  const {
    formData,
    isLoading,
    isLoadingData,
    handleFieldChange,
    handleCategoryChange,
    handleClientChange,
    handleDateTimeChange,
    handlePlatformChange,
    handleSubmit
  } = useEditVideoForm(videoId, () => {
    // Invalidar cache após edição bem-sucedida
    invalidateVideoCache();
    onOpenChange(false);
  });

  if (isLoadingData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Vídeo Aula</DialogTitle>
            <DialogDescription>
              Carregando dados do vídeo...
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Vídeo Aula</DialogTitle>
          <DialogDescription>
            Altere os campos abaixo para editar a vídeo aula.
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
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
