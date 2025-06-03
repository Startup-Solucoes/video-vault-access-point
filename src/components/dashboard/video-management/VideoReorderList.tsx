
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { VideoReorderHeader } from './video-reorder/VideoReorderHeader';
import { DraggableVideoItem } from './video-reorder/DraggableVideoItem';

interface VideoWithOrder {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  category?: string;
  created_at: string;
  permission_id: string;
  display_order: number;
}

interface VideoReorderListProps {
  clientId: string;
  clientName: string;
  videos: VideoWithOrder[];
  onReorderComplete: () => void;
}

export const VideoReorderList: React.FC<VideoReorderListProps> = ({
  clientId,
  clientName,
  videos,
  onReorderComplete
}) => {
  const [orderedVideos, setOrderedVideos] = useState<VideoWithOrder[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Ordenar vídeos por display_order
    const sorted = [...videos].sort((a, b) => a.display_order - b.display_order);
    setOrderedVideos(sorted);
    setHasChanges(false);
  }, [videos]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(orderedVideos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Atualizar display_order baseado na nova posição
    const updatedItems = items.map((item, index) => ({
      ...item,
      display_order: index + 1
    }));

    setOrderedVideos(updatedItems);
    setHasChanges(true);
  };

  const saveOrder = async () => {
    setIsSaving(true);
    console.log('💾 Salvando nova ordem dos vídeos...');

    try {
      // Atualizar display_order de cada permissão
      const updates = orderedVideos.map((video, index) => ({
        id: video.permission_id,
        display_order: index + 1
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('video_permissions')
          .update({ display_order: update.display_order })
          .eq('id', update.id);

        if (error) {
          console.error('Erro ao atualizar ordem:', error);
          throw error;
        }
      }

      toast({
        title: "Sucesso",
        description: "Ordem dos vídeos salva com sucesso",
      });

      setHasChanges(false);
      onReorderComplete();
    } catch (error) {
      console.error('Erro ao salvar ordem:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar a ordem dos vídeos",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <VideoReorderHeader
        clientName={clientName}
        hasChanges={hasChanges}
        isSaving={isSaving}
        onSave={saveOrder}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="videos">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {orderedVideos.map((video, index) => (
                <DraggableVideoItem
                  key={video.id}
                  video={video}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {orderedVideos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum vídeo disponível para reordenação</p>
        </div>
      )}
    </div>
  );
};
