
import React, { useCallback } from 'react';
import { useClientVideos } from '@/hooks/useClientVideos';
import { useClientSelector } from '@/hooks/useClientSelector';
import { useClientVideoSelection } from './ClientVideoSelectionManager';
import { useClientVideoActions } from './ClientVideoActions';
import { useClientVideoAssignment } from './ClientVideoAssignment';
import { useClientVideoViewState } from './useClientVideoViewState';
import { ClientVideoLoadingState } from './ClientVideoLoadingState';
import { ClientVideoReorderMode } from './ClientVideoReorderMode';
import { ClientVideoMainView } from './ClientVideoMainView';

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
  const { videos, isLoading, refreshVideos } = useClientVideos(clientId);
  
  const {
    clients,
    filteredClients,
    isLoading: clientsLoading,
    searchValue,
    setSearchValue
  } = useClientSelector();

  const {
    editingVideoId,
    isEditModalOpen,
    showUsersManager,
    showReorderMode,
    deletingVideoId,
    currentPage,
    itemsPerPage,
    showClientSelector,
    setShowUsersManager,
    setShowReorderMode,
    setDeletingVideoId,
    setShowClientSelector,
    handleEditVideo,
    handleCloseEditModal,
    handleItemsPerPageChange,
    handlePageChange
  } = useClientVideoViewState();

  const {
    selectedVideos,
    paginatedVideos,
    totalPages,
    handleVideoSelect,
    handleSelectAllVisible,
    clearSelection,
    clearSelectionOnPageChange,
    allVisibleVideosSelected
  } = useClientVideoSelection({ videos, currentPage, itemsPerPage });

  const { handleBulkDelete, handleDeleteVideo } = useClientVideoActions({
    clientId,
    selectedVideos,
    onRefreshVideos: refreshVideos,
    onClearSelection: clearSelection
  });

  const {
    selectedClients,
    setSelectedClients,
    isAssigning,
    handleClientToggle,
    handleBulkClientChange,
    handleAssignToClients
  } = useClientVideoAssignment({
    selectedVideos,
    onSuccess: () => {
      clearSelection();
      setShowClientSelector(false);
      refreshVideos();
    }
  });

  const handleDeleteVideoWithState = useCallback(async (videoId: string, videoTitle: string) => {
    setDeletingVideoId(videoId);
    try {
      await handleDeleteVideo(videoId, videoTitle);
    } finally {
      setDeletingVideoId(null);
    }
  }, [handleDeleteVideo, setDeletingVideoId]);

  const handleReorderComplete = useCallback(() => {
    refreshVideos();
    setShowReorderMode(false);
  }, [refreshVideos, setShowReorderMode]);

  const handleModalClose = useCallback((open: boolean) => {
    setShowClientSelector(open);
    if (!open) {
      setSearchValue('');
      setSelectedClients([]);
    }
  }, [setShowClientSelector, setSearchValue, setSelectedClients]);

  const handleConfirmSelection = useCallback(() => {
    console.log('=== CONFIRMANDO SELEÇÃO ===');
    console.log('Clientes selecionados no modal:', selectedClients);
    
    setShowClientSelector(false);
    handleAssignToClients();
  }, [selectedClients, setShowClientSelector, handleAssignToClients]);

  // Loading state
  if (isLoading) {
    return (
      <ClientVideoLoadingState 
        clientName={clientName} 
        clientLogoUrl={clientLogoUrl} 
      />
    );
  }

  // Reorder mode
  if (showReorderMode) {
    return (
      <ClientVideoReorderMode
        clientId={clientId}
        clientName={clientName}
        clientLogoUrl={clientLogoUrl}
        videos={videos}
        onExitReorderMode={() => setShowReorderMode(false)}
        onReorderComplete={handleReorderComplete}
      />
    );
  }

  // Main view
  return (
    <ClientVideoMainView
      clientId={clientId}
      clientName={clientName}
      clientLogoUrl={clientLogoUrl}
      videos={videos}
      paginatedVideos={paginatedVideos}
      totalPages={totalPages}
      selectedVideos={selectedVideos}
      allVisibleVideosSelected={allVisibleVideosSelected}
      showUsersManager={showUsersManager}
      showClientSelector={showClientSelector}
      editingVideoId={editingVideoId}
      isEditModalOpen={isEditModalOpen}
      deletingVideoId={deletingVideoId}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      clients={clients}
      filteredClients={filteredClients}
      clientsLoading={clientsLoading}
      searchValue={searchValue}
      selectedClients={selectedClients}
      isAssigning={isAssigning}
      onSelectAllVisible={handleSelectAllVisible}
      onToggleUsersManager={() => setShowUsersManager(!showUsersManager)}
      onShowReorderMode={() => setShowReorderMode(true)}
      onBulkDelete={handleBulkDelete}
      onAssignToClients={() => setShowClientSelector(true)}
      onVideoSelect={handleVideoSelect}
      onEditVideo={handleEditVideo}
      onDeleteVideo={handleDeleteVideoWithState}
      onPageChange={(page) => handlePageChange(page, clearSelectionOnPageChange)}
      onItemsPerPageChange={(value) => handleItemsPerPageChange(value, clearSelectionOnPageChange)}
      onModalClose={handleModalClose}
      onConfirmSelection={handleConfirmSelection}
      onCloseEditModal={handleCloseEditModal}
      onSearchValueChange={setSearchValue}
      onClientToggle={handleClientToggle}
      onBulkClientChange={handleBulkClientChange}
    />
  );
};
