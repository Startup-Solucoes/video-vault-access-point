
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useClientSelector } from '@/hooks/useClientSelector';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
  const [isAssigning, setIsAssigning] = useState(false);

  const { data: allVideos = [], isLoading } = useQuery({
    queryKey: ['all-videos'],
    queryFn: async () => {
      // Remover ordenação por data - usar ordenação padrão por ID
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('title', { ascending: true }); // Ordenar por título alfabeticamente

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
    console.log('=== INICIANDO ATRIBUIÇÃO ===');
    console.log('Vídeos selecionados:', selectedVideos);
    console.log('Clientes selecionados:', selectedClients);
    
    if (selectedVideos.length === 0) {
      toast({
        title: "Aviso",
        description: "Selecione pelo menos um vídeo",
        variant: "destructive"
      });
      return;
    }

    if (selectedClients.length === 0) {
      toast({
        title: "Aviso",
        description: "Selecione pelo menos um cliente",
        variant: "destructive"
      });
      return;
    }

    setIsAssigning(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Usuário autenticado:', user.id);

      // Verificar permissões já existentes para evitar duplicatas
      const { data: existingPermissions, error: checkError } = await supabase
        .from('video_permissions')
        .select('video_id, client_id')
        .in('video_id', selectedVideos)
        .in('client_id', selectedClients);

      if (checkError) {
        console.error('Erro ao verificar permissões existentes:', checkError);
        throw checkError;
      }

      console.log('Permissões existentes:', existingPermissions);

      // Obter próximo display_order para cada cliente
      const clientOrderPromises = selectedClients.map(async (clientId) => {
        const { data: lastOrder } = await supabase
          .from('video_permissions')
          .select('display_order')
          .eq('client_id', clientId)
          .order('display_order', { ascending: false })
          .limit(1);
        
        return {
          clientId,
          nextOrder: (lastOrder?.[0]?.display_order || 0) + 1
        };
      });

      const clientOrders = await Promise.all(clientOrderPromises);
      const orderMap = Object.fromEntries(
        clientOrders.map(co => [co.clientId, co.nextOrder])
      );

      // Criar lista de novas permissões (evitando duplicatas)
      const newPermissions = [];
      for (const videoId of selectedVideos) {
        for (const clientId of selectedClients) {
          const exists = existingPermissions?.some(
            p => p.video_id === videoId && p.client_id === clientId
          );
          if (!exists) {
            newPermissions.push({
              video_id: videoId,
              client_id: clientId,
              granted_by: user.id,
              display_order: orderMap[clientId]++
            });
          }
        }
      }

      console.log('Novas permissões a serem inseridas:', newPermissions);

      if (newPermissions.length === 0) {
        toast({
          title: "Aviso",
          description: "Todos os vídeos selecionados já estão atribuídos aos clientes escolhidos",
        });
        setIsAssigning(false);
        return;
      }

      const { error } = await supabase
        .from('video_permissions')
        .insert(newPermissions);

      if (error) {
        console.error('Erro ao inserir permissões:', error);
        throw error;
      }

      console.log('✅ Permissões inseridas com sucesso');

      toast({
        title: "Sucesso",
        description: `${selectedVideos.length} vídeo(s) atribuído(s) para ${selectedClients.length} cliente(s)`,
      });

      // Limpar seleções
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
    } finally {
      setIsAssigning(false);
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

  const handleModalClose = (open: boolean) => {
    setShowClientSelector(open);
    if (!open) {
      // Limpar busca quando fechar o modal sem confirmar
      setSearchValue('');
    }
  };

  const handleConfirmSelection = () => {
    console.log('=== CONFIRMANDO SELEÇÃO ===');
    console.log('Clientes selecionados no modal:', selectedClients);
    
    // Fechar o modal
    setShowClientSelector(false);
    
    // Executar a atribuição imediatamente
    handleAssignToClients();
  };

  // Calcular paginação
  const totalPages = Math.ceil(allVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const videos = allVideos.slice(startIndex, endIndex);

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
        onOpenChange={handleModalClose}
        clients={clients}
        selectedClients={selectedClients}
        onClientToggle={handleClientToggle}
        onBulkClientChange={handleBulkClientChange}
        isLoading={clientsLoading}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        filteredClients={filteredClients}
        onConfirmSelection={handleConfirmSelection}
        isAssigning={isAssigning}
      />
    </div>
  );
};
