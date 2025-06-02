
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useClientSelector } from '@/hooks/useClientSelector';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClientSelectionModal } from '@/components/forms/client-selector/ClientSelectionModal';
import { VideoListHeader } from './VideoListHeader';
import { VideosList } from './VideosList';
import { VideoListPagination } from './VideoListPagination';
import { toast } from '@/hooks/use-toast';

interface VideoData {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  platform?: string;
  category?: string;
  tags?: string[];
  created_at: string;
  created_by: string;
}

export const AllVideosView = () => {
  const {
    clients,
    filteredClients,
    isLoading: clientsLoading,
    searchValue,
    setSearchValue
  } = useClientSelector();
  
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: allVideos = [], isLoading } = useQuery({
    queryKey: ['all-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as VideoData[];
    }
  });

  // Calcular paginação
  const totalPages = Math.ceil(allVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const videos = allVideos.slice(startIndex, endIndex);

  const handleVideoSelect = (videoId: string, checked: boolean) => {
    if (checked) {
      setSelectedVideos(prev => [...prev, videoId]);
    } else {
      setSelectedVideos(prev => prev.filter(id => id !== videoId));
    }
  };

  const handleSelectAllVisible = () => {
    const currentPageVideoIds = videos.map(video => video.id);
    const allCurrentSelected = currentPageVideoIds.every(id => selectedVideos.includes(id));
    
    if (allCurrentSelected) {
      setSelectedVideos(prev => prev.filter(id => !currentPageVideoIds.includes(id)));
    } else {
      setSelectedVideos(prev => [...new Set([...prev, ...currentPageVideoIds])]);
    }
  };

  const handleClientToggle = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleBulkClientChange = (clientIds: string[]) => {
    setSelectedClients(clientIds);
  };

  const handleAssignToClients = async () => {
    if (selectedClients.length === 0) {
      toast({
        title: "Aviso",
        description: "Selecione pelo menos um cliente",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const permissions = selectedVideos.flatMap(videoId =>
        selectedClients.map(clientId => ({
          video_id: videoId,
          client_id: clientId,
          granted_by: user.id
        }))
      );

      const { error } = await supabase
        .from('video_permissions')
        .insert(permissions);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${selectedVideos.length} vídeo(s) atribuído(s) para ${selectedClients.length} cliente(s)`,
      });

      setSelectedVideos([]);
      setSelectedClients([]);
      setShowClientSelector(false);
    } catch (error) {
      console.error('Erro ao atribuir vídeos:', error);
      toast({
        title: "Erro",
        description: "Erro ao atribuir vídeos aos clientes",
        variant: "destructive"
      });
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
    setSelectedVideos([]);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedVideos([]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Carregando vídeos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <VideoListHeader
            totalVideos={allVideos.length}
            currentVideos={videos}
            selectedVideos={selectedVideos}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            onSelectAllVisible={handleSelectAllVisible}
            onAssignToClients={() => setShowClientSelector(true)}
          />
        </CardHeader>
        <CardContent>
          <VideosList
            videos={videos}
            selectedVideos={selectedVideos}
            onVideoSelect={handleVideoSelect}
          />
          
          <VideoListPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalVideos={allVideos.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>

      <ClientSelectionModal
        open={showClientSelector}
        onOpenChange={setShowClientSelector}
        clients={clients}
        selectedClients={selectedClients}
        onClientToggle={handleClientToggle}
        onBulkClientChange={handleBulkClientChange}
        isLoading={clientsLoading}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        filteredClients={filteredClients}
      />

      {selectedClients.length > 0 && showClientSelector && (
        <div className="fixed bottom-4 right-4">
          <Button onClick={handleAssignToClients} size="lg">
            Confirmar Atribuição ({selectedVideos.length} vídeos → {selectedClients.length} clientes)
          </Button>
        </div>
      )}
    </div>
  );
};
