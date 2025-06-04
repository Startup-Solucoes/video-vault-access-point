
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, ArrowUpDown } from 'lucide-react';
import { useClientVideos } from '@/hooks/useClientVideos';
import { EditVideoForm } from '@/components/forms/EditVideoForm';
import { ClientUsersManager } from '@/components/dashboard/client-management/ClientUsersManager';
import { VideoReorderList } from './VideoReorderList';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ClientVideoHeader } from './client-video-view/ClientVideoHeader';
import { ClientVideoTable } from './client-video-view/ClientVideoTable';
import { ClientVideoCards } from './client-video-view/ClientVideoCards';
import { ClientVideoEmptyState } from './client-video-view/ClientVideoEmptyState';

interface ClientVideoViewProps {
  clientId: string;
  clientName: string;
  clientLogoUrl?: string;
}

export const ClientVideoView = ({ clientId, clientName, clientLogoUrl }: ClientVideoViewProps) => {
  const { videos, isLoading, refreshVideos } = useClientVideos(clientId);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showUsersManager, setShowUsersManager] = useState(false);
  const [showReorderMode, setShowReorderMode] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const { toast } = useToast();

  const handleVideoSelect = (videoId: string, checked: boolean) => {
    if (checked) {
      setSelectedVideos(prev => [...prev, videoId]);
    } else {
      setSelectedVideos(prev => prev.filter(id => id !== videoId));
    }
  };

  const handleSelectAllVisible = () => {
    const allSelected = videos.every(video => selectedVideos.includes(video.id));
    if (allSelected) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(videos.map(video => video.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedVideos.length === 0) return;
    
    console.log('🗑️ Iniciando exclusão em lote:', { selectedVideos, clientId });

    try {
      const { error } = await supabase
        .from('video_permissions')
        .delete()
        .eq('client_id', clientId)
        .in('video_id', selectedVideos);

      if (error) {
        console.error('❌ Erro ao deletar permissões:', error);
        toast({
          title: "Erro",
          description: "Erro ao remover vídeos do cliente",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Permissões deletadas com sucesso');
      
      toast({
        title: "Sucesso",
        description: `${selectedVideos.length} vídeo(s) removido(s) do cliente com sucesso`,
      });

      setSelectedVideos([]);
      refreshVideos();
      
    } catch (error) {
      console.error('💥 Erro inesperado ao deletar vídeos:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao remover vídeos",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVideo = async (videoId: string, videoTitle: string) => {
    console.log('🗑️ Iniciando exclusão do vídeo:', { videoId, videoTitle, clientId });
    setDeletingVideoId(videoId);

    try {
      const { data: permission, error: permissionError } = await supabase
        .from('video_permissions')
        .select('id')
        .eq('video_id', videoId)
        .eq('client_id', clientId)
        .single();

      if (permissionError) {
        console.error('❌ Erro ao buscar permissão:', permissionError);
        toast({
          title: "Erro",
          description: "Erro ao buscar permissão do vídeo",
          variant: "destructive",
        });
        return;
      }

      console.log('🔍 Permissão encontrada:', permission);

      const { error: deleteError } = await supabase
        .from('video_permissions')
        .delete()
        .eq('id', permission.id);

      if (deleteError) {
        console.error('❌ Erro ao deletar permissão:', deleteError);
        toast({
          title: "Erro",
          description: "Erro ao remover vídeo do cliente",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Permissão deletada com sucesso');
      
      toast({
        title: "Sucesso",
        description: `Vídeo "${videoTitle}" removido do cliente com sucesso`,
      });

      refreshVideos();
      
    } catch (error) {
      console.error('💥 Erro inesperado ao deletar vídeo:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao remover vídeo",
        variant: "destructive",
      });
    } finally {
      setDeletingVideoId(null);
    }
  };

  const handleEditVideo = (videoId: string) => {
    setEditingVideoId(videoId);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingVideoId(null);
  };

  const handleReorderComplete = () => {
    refreshVideos();
    setShowReorderMode(false);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            {clientLogoUrl ? (
              <img 
                src={clientLogoUrl} 
                alt={`Logo ${clientName}`}
                className="h-8 w-8 mr-3 object-contain rounded"
              />
            ) : (
              <User className="h-5 w-5 mr-2" />
            )}
            Vídeos de {clientName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-500">Carregando vídeos...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showReorderMode) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center">
              {clientLogoUrl ? (
                <img 
                  src={clientLogoUrl} 
                  alt={`Logo ${clientName}`}
                  className="h-8 w-8 mr-3 object-contain rounded"
                />
              ) : (
                <User className="h-5 w-5 mr-2" />
              )}
              Reordenar Vídeos - {clientName}
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => setShowReorderMode(false)}
              size="sm"
            >
              Voltar para Lista
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <VideoReorderList
            clientId={clientId}
            clientName={clientName}
            videos={videos}
            onReorderComplete={handleReorderComplete}
          />
        </CardContent>
      </Card>
    );
  }

  const allVideosSelected = videos.length > 0 && videos.every(video => selectedVideos.includes(video.id));

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <ClientVideoHeader
        clientName={clientName}
        clientLogoUrl={clientLogoUrl}
        videosCount={videos.length}
        selectedVideos={selectedVideos}
        showUsersManager={showUsersManager}
        onSelectAllVisible={handleSelectAllVisible}
        onToggleUsersManager={() => setShowUsersManager(!showUsersManager)}
        onShowReorderMode={() => setShowReorderMode(true)}
        onBulkDelete={handleBulkDelete}
        allVideosSelected={allVideosSelected}
      />

      {/* Users Manager */}
      {showUsersManager && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Gerenciar Usuários do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ClientUsersManager clientId={clientId} />
          </CardContent>
        </Card>
      )}

      {/* Videos List */}
      <Card className="w-full">
        <CardContent className="p-6">
          {videos.length === 0 ? (
            <ClientVideoEmptyState />
          ) : (
            <>
              <ClientVideoTable
                videos={videos}
                selectedVideos={selectedVideos}
                deletingVideoId={deletingVideoId}
                clientName={clientName}
                onVideoSelect={handleVideoSelect}
                onSelectAllVisible={handleSelectAllVisible}
                onEditVideo={handleEditVideo}
                onDeleteVideo={handleDeleteVideo}
              />
              
              <ClientVideoCards
                videos={videos}
                selectedVideos={selectedVideos}
                deletingVideoId={deletingVideoId}
                clientName={clientName}
                onVideoSelect={handleVideoSelect}
                onEditVideo={handleEditVideo}
                onDeleteVideo={handleDeleteVideo}
              />
            </>
          )}
        </CardContent>
      </Card>

      {editingVideoId && (
        <EditVideoForm
          open={isEditModalOpen}
          onOpenChange={handleCloseEditModal}
          videoId={editingVideoId}
        />
      )}
    </div>
  );
};
