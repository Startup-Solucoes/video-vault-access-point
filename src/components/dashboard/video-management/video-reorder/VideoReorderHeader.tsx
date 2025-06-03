
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface VideoReorderHeaderProps {
  clientName: string;
  hasChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
}

export const VideoReorderHeader: React.FC<VideoReorderHeaderProps> = ({
  clientName,
  hasChanges,
  isSaving,
  onSave
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">Reordenar Vídeos - {clientName}</h3>
        <p className="text-sm text-gray-600">
          Arraste os vídeos para reordenar como aparecem para o cliente
        </p>
      </div>
      {hasChanges && (
        <Button 
          onClick={onSave} 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Salvando...' : 'Salvar Ordem'}
        </Button>
      )}
    </div>
  );
};
