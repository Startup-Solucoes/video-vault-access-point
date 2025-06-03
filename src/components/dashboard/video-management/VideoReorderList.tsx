
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Save, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Reordenar Vídeos - {clientName}</h3>
          <p className="text-sm text-gray-600">
            Arraste os vídeos para reordenar como aparecem para o cliente
          </p>
        </div>
        {hasChanges && (
          <Button 
            onClick={saveOrder} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Salvando...' : 'Salvar Ordem'}
          </Button>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="videos">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {orderedVideos.map((video, index) => (
                <Draggable key={video.id} draggableId={video.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`transition-shadow ${
                        snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div
                            {...provided.dragHandleProps}
                            className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="h-5 w-5" />
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-500 min-w-[40px]">
                            #{index + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {video.title}
                                </h4>
                                {video.description && (
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {video.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 mt-2">
                                  {video.category && (
                                    <Badge variant="secondary" className="text-xs">
                                      {video.category}
                                    </Badge>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    Criado em {formatDate(video.created_at)}
                                  </span>
                                </div>
                              </div>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(video.video_url, '_blank')}
                                className="flex items-center gap-1 shrink-0"
                              >
                                <Eye className="h-3 w-3" />
                                Ver
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
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
