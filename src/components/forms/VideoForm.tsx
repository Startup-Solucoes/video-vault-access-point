
import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ClientSelector, ClientSelectorRef } from './ClientSelector';
import { VideoFormFields } from './video-form/VideoFormFields';
import { CategorySelector } from './video-form/CategorySelector';
import { useVideoForm } from './video-form/useVideoForm';
import { VideoFormProps } from './video-form/VideoFormTypes';

export const VideoForm = ({ open, onOpenChange }: VideoFormProps) => {
  const clientSelectorRef = useRef<ClientSelectorRef>(null);
  const {
    formData,
    isLoading,
    handleFieldChange,
    handleCategoryChange,
    handleClientChange,
    handleSubmit
  } = useVideoForm(() => onOpenChange(false));

  const currentDateTime = new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Vídeo Aula</DialogTitle>
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

          <div className="space-y-2">
            <Label>Data e Horário de Publicação</Label>
            <div className="p-2 bg-gray-50 rounded-md text-sm text-gray-700">
              {currentDateTime}
            </div>
          </div>

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
