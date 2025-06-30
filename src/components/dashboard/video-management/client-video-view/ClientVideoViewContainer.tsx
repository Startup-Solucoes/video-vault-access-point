
import React, { useState } from 'react';
import { useClientVideoContainer } from './hooks/useClientVideoContainer';
import { useClientVideoCallbacks } from './hooks/useClientVideoCallbacks';
import { ClientVideoLoadingState } from './ClientVideoLoadingState';
import { ClientVideoReorderMode } from './ClientVideoReorderMode';
import { ClientVideoMainView } from './ClientVideoMainView';
import { ClientUserManagementView } from './ClientUserManagementView';
import { VideoForm } from '@/components/forms/VideoForm';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client';

interface ClientVideoViewContainerProps {
  clientId: string;
  clientName: string;
  clientLogoUrl?: string;
}

export const ClientVideoViewContainer = ({ 
  clientId, 
  clientName, 
  clientLogoUrl 
}: ClientVideoViewContainerProps) => {
  const { user } = useAuth();
  const [showUserManagement, setShowUserManagement] = useState(false);
  
  const containerData = useClientVideoContainer({ clientId });
  
  // Buscar dados completos do cliente específico
  const { data: clientData, isLoading: clientDataLoading } = useQuery({
    queryKey: ['client-data', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('email, full_name, logo_url')
        .eq('id', clientId)
        .single();

      if (error) {
        console.error('Erro ao buscar dados do cliente:', error);
        throw error;
      }

      return data;
    },
    enabled: !!clientId,
  });
  
  const callbacks = useClientVideoCallbacks({
    refreshVideos: containerData.refreshVideos,
    setShowReorderMode: containerData.setShowReorderMode,
    setDeletingVideoId: containerData.setDeletingVideoId,
    setShowClientSelector: containerData.setShowClientSelector,
    setSearchValue: containerData.setSearchValue,
    setSelectedClients: containerData.setSelectedClients,
    setShowVideoForm: containerData.setShowVideoForm,
    clearSelection: containerData.clearSelection,
    clearSelectionOnPageChange: containerData.clearSelectionOnPageChange,
    handleDeleteVideo: containerData.handleDeleteVideo,
    handlePageChange: containerData.handlePageChange,
    handleItemsPerPageChange: containerData.handleItemsPerPageChange,
    handleAssignToClients: containerData.handleAssignToClients,
    selectedClients: containerData.selectedClients
  });

  // Loading state
  if (containerData.isLoading || clientDataLoading) {
    return (
      <ClientVideoLoadingState 
        clientName={clientName} 
        clientLogoUrl={clientLogoUrl} 
      />
    );
  }

  // User management view
  if (showUserManagement) {
    return (
      <ClientUserManagementView
        clientId={clientId}
        clientName={clientData?.full_name || clientName}
        clientEmail={clientData?.email || ''}
        clientLogoUrl={clientData?.logo_url || clientLogoUrl}
        onBack={() => setShowUserManagement(false)}
      />
    );
  }

  // Reorder mode
  if (containerData.showReorderMode) {
    return (
      <ClientVideoReorderMode
        clientId={clientId}
        clientName={clientName}
        clientLogoUrl={clientLogoUrl}
        videos={containerData.videos}
        onExitReorderMode={() => containerData.setShowReorderMode(false)}
        onReorderComplete={callbacks.handleReorderComplete}
      />
    );
  }

  // Converter os clientes do ClientSelector para o tipo Client completo
  const convertToFullClient = (selectorClient: any): Client => ({
    id: selectorClient.id,
    email: selectorClient.email,
    full_name: selectorClient.full_name,
    role: 'client',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    logo_url: undefined,
    last_sign_in_at: undefined,
    is_deleted: false
  });

  const fullClients = containerData.clients.map(convertToFullClient);
  const fullFilteredClients = containerData.filteredClients.map(convertToFullClient);

  // Main view
  return (
    <>
      <ClientVideoMainView
        clientId={clientId}
        clientName={clientName}
        clientLogoUrl={clientLogoUrl}
        videos={containerData.videos}
        paginatedVideos={containerData.paginatedVideos}
        totalPages={containerData.totalPages}
        selectedVideos={containerData.selectedVideos}
        allVisibleVideosSelected={containerData.allVisibleVideosSelected}
        showUsersManager={false}
        showClientSelector={containerData.showClientSelector}
        editingVideoId={containerData.editingVideoId}
        isEditModalOpen={containerData.isEditModalOpen}
        deletingVideoId={containerData.deletingVideoId}
        currentPage={containerData.currentPage}
        itemsPerPage={containerData.itemsPerPage}
        clients={fullClients}
        filteredClients={fullFilteredClients}
        clientsLoading={containerData.clientsLoading}
        searchValue={containerData.searchValue}
        selectedClients={containerData.selectedClients}
        isAssigning={containerData.isAssigning}
        onSelectAllVisible={containerData.handleSelectAllVisible}
        onToggleUsersManager={() => setShowUserManagement(true)}
        onShowReorderMode={() => containerData.setShowReorderMode(true)}
        onBulkDelete={containerData.handleBulkDelete}
        onAssignToClients={() => containerData.setShowClientSelector(true)}
        onAddVideo={callbacks.handleAddVideo}
        onVideoSelect={containerData.handleVideoSelect}
        onEditVideo={containerData.handleEditVideo}
        onDeleteVideo={callbacks.handleDeleteVideoWithState}
        onPageChange={callbacks.handlePageChangeWithClear}
        onItemsPerPageChange={callbacks.handleItemsPerPageChangeWithClear}
        onModalClose={callbacks.handleModalClose}
        onConfirmSelection={callbacks.handleConfirmSelection}
        onCloseEditModal={containerData.handleCloseEditModal}
        onSearchValueChange={containerData.setSearchValue}
        onClientToggle={containerData.handleClientToggle}
        onBulkClientChange={containerData.handleBulkClientChange}
      />

      {/* Video Form Modal */}
      <VideoForm
        open={containerData.showVideoForm}
        onOpenChange={containerData.setShowVideoForm}
        onVideoCreated={callbacks.handleVideoCreated}
      />
    </>
  );
};
